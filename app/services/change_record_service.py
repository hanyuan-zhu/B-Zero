from typing import Dict, List, Optional
from datetime import datetime
from sqlalchemy import desc, asc
from sqlalchemy.exc import SQLAlchemyError
from app import db
from app.models import ChangeRecord, Employee, Department, Project

class ChangeRecordServiceException(Exception):
    """变动记录服务异常类"""
    pass

class ChangeRecordService:
    def __init__(self):
        self.model = ChangeRecord

    def _validate_change_record_data(self, data: Dict) -> None:
        """验证变动记录数据
        
        Args:
            data: 变动记录数据字典
        Raises:
            ChangeRecordServiceException: 当数据验证失败时
        """
        # 验证必填字段
        required_fields = ['employee_id', 'change_type', 'change_date']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            raise ChangeRecordServiceException(f"缺少必填字段: {', '.join(missing_fields)}")

        # 验证员工存在
        employee = Employee.query.get(data['employee_id'])
        if not employee:
            raise ChangeRecordServiceException(f"员工ID {data['employee_id']} 不存在")

        # 验证变动类型
        valid_types = ['入职', '离职', '部门调动', '项目调岗', '待岗']
        if data['change_type'] not in valid_types:
            raise ChangeRecordServiceException(f"无效的变动类型: {data['change_type']}")

        # 验证部门ID (如果提供)
        if 'new_department_id' in data and data['new_department_id']:
            if not Department.query.get(data['new_department_id']):
                raise ChangeRecordServiceException(f"新部门ID {data['new_department_id']} 不存在")
        if 'previous_department_id' in data and data['previous_department_id']:
            if not Department.query.get(data['previous_department_id']):
                raise ChangeRecordServiceException(f"原部门ID {data['previous_department_id']} 不存在")

        # 验证项目ID (如果提供)
        if 'new_project_id' in data and data['new_project_id']:
            if not Project.query.get(data['new_project_id']):
                raise ChangeRecordServiceException(f"新项目ID {data['new_project_id']} 不存在")
        if 'previous_project_id' in data and data['previous_project_id']:
            if not Project.query.get(data['previous_project_id']):
                raise ChangeRecordServiceException(f"原项目ID {data['previous_project_id']} 不存在")

    def get_change_records(
        self,
        page: int = 1,
        limit: int = 10,
        status: Optional[str] = None,
        type: Optional[str] = None,
        date_range: Optional[Dict] = None,
        sort: str = 'created_at',
        order: str = 'desc'
    ) -> Dict:
        """获取变动记录列表
        
        Args:
            page: 页码
            limit: 每页记录数
            status: 状态筛选
            type: 变动类型筛选
            date_range: 日期范围筛选
            sort: 排序字段
            order: 排序方式
            
        Returns:
            Dict: 包含记录列表和分页信息
        """
        try:
            query = self.model.query

            # 应用过滤条件
            if status:
                query = query.filter_by(status=status)
            if type:
                query = query.filter_by(change_type=type)
            if date_range:
                if 'start' in date_range:
                    query = query.filter(ChangeRecord.change_date >= date_range['start'])
                if 'end' in date_range:
                    query = query.filter(ChangeRecord.change_date <= date_range['end'])

            # 应用排序
            if order == 'desc':
                query = query.order_by(desc(getattr(ChangeRecord, sort)))
            else:
                query = query.order_by(asc(getattr(ChangeRecord, sort)))

            # 执行分页
            pagination = query.paginate(
                page=page,
                per_page=limit,
                error_out=False
            )

            return {
                'items': pagination.items,
                'total': pagination.total,
                'pages': pagination.pages,
                'current_page': page
            }

        except SQLAlchemyError as e:
            raise ChangeRecordServiceException(f"数据库错误: {str(e)}")

    def get_change_record(self, id: int) -> Optional[ChangeRecord]:
        """获取变动记录详情
        
        Args:
            id: 变动记录ID
        Returns:
            ChangeRecord: 变动记录对象
        """
        try:
            record = self.model.query.get(id)
            if not record:
                raise ChangeRecordServiceException(f"变动记录ID {id} 不存在")
            return record
        except SQLAlchemyError as e:
            raise ChangeRecordServiceException(f"数据库错误: {str(e)}")

    def create_change_record(self, data: Dict) -> ChangeRecord:
        """创建变动记录
        
        Args:
            data: 包含变动记录信息的字典
        Returns:
            ChangeRecord: 新创建的变动记录
        """
        try:
            self._validate_change_record_data(data)
            
            record = ChangeRecord(**data)
            record.status = 'pending'  # 新建记录默认为待确认状态
            
            db.session.add(record)
            db.session.commit()
            
            return record
        except SQLAlchemyError as e:
            db.session.rollback()
            raise ChangeRecordServiceException(f"数据库错误: {str(e)}")

    def _apply_change(self, record: ChangeRecord) -> None:
        """执行变动实际影响的操作"""
        employee = Employee.query.get(record.employee_id)
        if not employee:
            raise ChangeRecordServiceException("员工不存在")

        if record.change_type == '入职':
            employee.status = 'active'
            employee.department_id = record.new_department_id
            employee.project_id = record.new_project_id
        
        elif record.change_type == '离职':
            employee.status = 'inactive'
            employee.project_id = None
        
        elif record.change_type == '部门调动':
            employee.department_id = record.new_department_id
            employee.project_id = None  # 清空项目
            employee.status = 'unassigned'
        
        elif record.change_type == '项目调岗':
            employee.project_id = record.new_project_id
            employee.status = 'active' if record.new_project_id else 'unassigned'

        elif record.change_type == '待岗':
            employee.project_id = None
            employee.status = 'unassigned'

    def _rollback_change(self, record: ChangeRecord) -> None:
        """回滚变动造成的影响"""
        employee = Employee.query.get(record.employee_id)
        if not employee:
            raise ChangeRecordServiceException("员工不存在")

        if record.change_type == '入职':
            db.session.delete(employee)
        
        elif record.change_type == '离职':
            employee.status = 'active'
            employee.project_id = record.previous_project_id
        
        elif record.change_type == '部门调动':
            employee.department_id = record.previous_department_id
            employee.project_id = record.previous_project_id
            employee.status = 'active' if record.previous_project_id else 'unassigned'
        
        elif record.change_type == '项目调岗':
            employee.project_id = record.previous_project_id
            employee.status = 'active' if record.previous_project_id else 'unassigned'

        elif record.change_type == '待岗':
            employee.project_id = record.previous_project_id
            employee.status = 'active'

    def confirm_change(self, id: int) -> Dict:
        """确认变动记录"""
        try:
            record = self.get_change_record(id)
            if record.status != 'pending':
                raise ChangeRecordServiceException("只能确认待确认状态的变动记录")

            # 开启事务
            db.session.begin_nested()
            try:
                # 执行实际变动
                self._apply_change(record)
                # 更新记录状态
                record.status = 'confirmed'
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                raise ChangeRecordServiceException(f"确认变动失败: {str(e)}")

            return {
                'record': record,
                'employee': Employee.query.get(record.employee_id)
            }

        except SQLAlchemyError as e:
            db.session.rollback()
            raise ChangeRecordServiceException(f"数据库错误: {str(e)}")

    def reject_change(self, id: int, reason: str) -> Dict:
        """拒绝变动记录"""
        try:
            record = self.get_change_record(id)
            if record.status != 'pending':
                raise ChangeRecordServiceException("只能拒绝待确认状态的变动记录")
            if not reason:
                raise ChangeRecordServiceException("拒绝时必须提供原因")

            # 开启事务
            db.session.begin_nested()
            try:
                # 回滚变动影响
                self._rollback_change(record)
                # 更新记录状态
                record.status = 'rejected'
                record.reject_reason = reason
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                raise ChangeRecordServiceException(f"拒绝变动失败: {str(e)}")

            return {
                'record': record,
                'employee': Employee.query.get(record.employee_id)
            }

        except SQLAlchemyError as e:
            db.session.rollback()
            raise ChangeRecordServiceException(f"数据库错误: {str(e)}")

    def search_records(self, keyword: str) -> List[ChangeRecord]:
        """搜索变动记录
        
        Args:
            keyword: 搜索关键词
        Returns:
            List[ChangeRecord]: 匹配的变动记录列表
        """
        try:
            keyword = f"%{keyword}%"
            # 联合查询员工表以支持按员工名搜索
            return self.model.query.join(Employee).filter(
                db.or_(
                    Employee.name.like(keyword),
                    ChangeRecord.change_type.like(keyword),
                    ChangeRecord.reason.like(keyword)
                )
            ).all()
            
        except SQLAlchemyError as e:
            raise ChangeRecordServiceException(f"数据库错误: {str(e)}")