from datetime import datetime
from typing import Dict, List, Optional
from sqlalchemy import desc, asc, and_, or_
from ..extensions import db
from ..models import Employee
from app.models import Department, Project, ChangeRecord
from sqlalchemy.exc import SQLAlchemyError
from . import BaseService, ServiceException

class EmployeeServiceException(ServiceException):
    pass

class EmployeeService(BaseService):
    def __init__(self):
        super().__init__(Employee)
    
    def _validate_employee_data(self, data: Dict) -> None:
        """验证员工数据"""
        required_fields = ['name', 'position', 'department_id', 'join_date']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            raise EmployeeServiceException(f"Missing required fields: {', '.join(missing_fields)}")
    
    def _build_filters(self, filters: Dict) -> List:
        """构建过滤器列表"""
        filter_conditions = []
        
        if filters:
            if filters.get('keyword'):
                keyword = f"%{filters['keyword']}%"
                filter_conditions.append(
                    or_(
                        Employee.name.like(keyword),
                        Employee.position.like(keyword)
                    )
                )
            
            if filters.get('department_id') is not None:
                filter_conditions.append(Employee.department_id == filters['department_id'])
                
            if filters.get('project_id') is not None:
                filter_conditions.append(Employee.project_id == filters['project_id'])
                
            if filters.get('start_date'):
                filter_conditions.append(Employee.join_date >= filters['start_date'])
                
            if filters.get('end_date'):
                filter_conditions.append(Employee.join_date <= filters['end_date'])
                
        return filter_conditions

    def get_employees(
        self, 
        page: int = 1, 
        limit: int = 10, 
        sort: str = 'created_at',
        order: str = 'desc',
        filters: Dict = None
    ):
        """获取员工列表"""
        def query_operation():
            query = self.model.query
            
            # 应用过滤条件
            filter_conditions = self._build_filters(filters)
            if filter_conditions:
                query = query.filter(and_(*filter_conditions))

            # 应用排序
            sort_column = getattr(Employee, sort)
            query = query.order_by(desc(sort_column) if order == 'desc' else asc(sort_column))

            # 执行分页
            pagination = query.paginate(page=page, per_page=limit, error_out=False)
            
            return {
                'items': pagination.items,
                'total': pagination.total,
                'pages': pagination.pages,
                'current_page': page
            }
            
        return self._db_operation(query_operation)

    def create_employee(self, data: Dict):
        """创建新员工"""
        try:
            self._validate_employee_data(data)
            
            employee = Employee(
                name=data['name'],
                position=data['position'],
                department_id=data['department_id'],
                project_id=data.get('project_id'),
                join_date=datetime.strptime(data['join_date'], '%Y-%m-%d').date(),
                status='active'
            )
            
            db.session.add(employee)
            
            # 创建入职变动记录
            change_record = ChangeRecord(
                employee_id=employee.id,
                change_type='入职',
                change_date=employee.join_date,
                new_department_id=employee.department_id,
                new_project_id=employee.project_id,
                status='pending'
            )
            db.session.add(change_record)
            
            db.session.commit()
            return employee

        except SQLAlchemyError as e:
            db.session.rollback()
            raise EmployeeServiceException(f"Database error: {str(e)}")

    def update_employee(self, id: int, data: Dict):
        """更新员工信息"""
        try:
            employee = self.model.query.get(id)
            if not employee:
                raise EmployeeServiceException(f"Employee with id {id} not found")

            # 记录原始值用于变动记录
            old_department_id = employee.department_id
            old_project_id = employee.project_id

            # 更新允许修改的字段
            updateable_fields = ['position', 'department_id', 'project_id']
            for field in updateable_fields:
                if field in data:
                    setattr(employee, field, data[field])

            db.session.add(employee)
            db.session.commit()
            return employee

        except SQLAlchemyError as e:
            db.session.rollback()
            raise EmployeeServiceException(f"Database error: {str(e)}")

    def process_resignation(self, id: int, date: str, reason: str) -> Employee:
        """处理员工离职"""
        try:
            # 查找并验证员工
            employee = self.model.query.get(id)
            if not employee:
                raise EmployeeServiceException(f"Employee with id {id} not found")
            
            if employee.status != 'active':
                raise EmployeeServiceException("Only active employees can resign")

            # 验证离职日期
            resignation_date = datetime.strptime(date, '%Y-%m-%d').date()
            if resignation_date <= employee.join_date:
                raise EmployeeServiceException("Resignation date must be after join date")
            
            # 更新员工状态
            employee.status = 'inactive'
            
            # 创建离职变动记录
            change_record = ChangeRecord(
                employee_id=employee.id,
                change_type='离职',
                change_date=resignation_date,
                reason=reason,
                previous_department_id=employee.department_id,
                previous_project_id=employee.project_id,
                status='pending'
            )
            
            db.session.add(employee)
            db.session.add(change_record)
            db.session.commit()
            
            return employee

        except ValueError:
            raise EmployeeServiceException("Invalid date format. Use YYYY-MM-DD")
        except SQLAlchemyError as e:
            db.session.rollback()
            raise EmployeeServiceException(f"Database error: {str(e)}")

    def transfer_department(self, id: int, new_dept_id: int, date: str, reason: str) -> Dict:
        """
        处理员工部门调动
        
        Args:
            id: 员工ID
            new_dept_id: 新部门ID
            date: 调动生效日期 (YYYY-MM-DD)
            reason: 调动原因
            
        Returns:
            Dict: 包含更新后的员工信息和变动记录
        """
        try:
            # 查找并验证员工
            employee = self.model.query.get(id)
            if not employee:
                raise EmployeeServiceException(f"Employee with id {id} not found")
                
            # 验证员工状态
            if employee.status != 'active':
                raise EmployeeServiceException("Only active employees can be transferred")
                
            # 验证新部门是否存在
            new_department = Department.query.get(new_dept_id)
            if not new_department:
                raise EmployeeServiceException(f"Department with id {new_dept_id} not found")
                
            # 验证不是同一个部门
            if employee.department_id == new_dept_id:
                raise EmployeeServiceException("Cannot transfer to the same department")
                
            # 验证并转换调动日期
            try:
                transfer_date = datetime.strptime(date, '%Y-%m-%d').date()
                if transfer_date <= employee.join_date:
                    raise EmployeeServiceException("Transfer date must be after join date")
            except ValueError:
                raise EmployeeServiceException("Invalid date format. Use YYYY-MM-DD")
                
            # 记录原始部门ID用于变动记录
            previous_department_id = employee.department_id
            
            # 更新员工部门
            
            # 创建部门调动变动记录
            change_record = ChangeRecord(
                employee_id=employee.id,
                change_type='部门调动',
                change_date=transfer_date,
                reason=reason,
                previous_department_id=previous_department_id,
                new_department_id=new_dept_id,
                # 如果调动导致项目变化，也需要记录
                previous_project_id=employee.project_id,
                new_project_id=None,  # 调动后默认清空项目，等待新分配
                status='pending'
            )
            
            # 更新员工项目状态为待岗
            employee.project_id = None
            employee.status = 'unassigned'
            
            # 保存变更
            db.session.add(employee)
            db.session.add(change_record)
            db.session.commit()
            
            return {
                'employee': employee,
                'change_record': change_record
            }
            
        except SQLAlchemyError as e:
            db.session.rollback()
            raise EmployeeServiceException(f"Database error: {str(e)}")

    def transfer_project(self, id: int, new_project_id: Optional[int], 
                        new_dept_id: Optional[int], date: str, reason: str) -> Dict:
        """
        处理员工项目调岗
        
        Args:
            id: 员工ID
            new_project_id: 新项目ID（None表示待岗）
            new_dept_id: 新部门ID（仅用于项目选择验证）
            date: 调岗生效日期
            reason: 调岗原因
        """
        try:
            # 验证员工
            employee = self.model.query.get(id)
            if not employee:
                raise EmployeeServiceException(f"Employee with id {id} not found")
            if employee.status != 'active':
                raise EmployeeServiceException("Only active employees can be transferred")

            # 验证新项目
            if new_project_id:
                new_project = Project.query.get(new_project_id)
                if not new_project:
                    raise EmployeeServiceException(f"Project with id {new_project_id} not found")
                # 验证新项目是否属于指定部门
                if new_dept_id and new_project.department_id != new_dept_id:
                    raise EmployeeServiceException("Project does not belong to the specified department")
                if employee.project_id == new_project_id:
                    raise EmployeeServiceException("Cannot transfer to the same project")

            # 验证日期
            try:
                transfer_date = datetime.strptime(date, '%Y-%m-%d').date()
                if transfer_date <= employee.join_date:
                    raise EmployeeServiceException("Transfer date must be after join date")
            except ValueError:
                raise EmployeeServiceException("Invalid date format. Use YYYY-MM-DD")

            # 记录原始状态
            previous_project_id = employee.project_id

            # 更新员工项目信息（不更新部门）
            employee.project_id = new_project_id
            employee.status = 'active' if new_project_id else 'unassigned'

            # 创建变动记录 - 不记录部门变更
            change_record = ChangeRecord(
                employee_id=employee.id,
                change_type='项目调岗',
                change_date=transfer_date,
                reason=reason,
                previous_project_id=previous_project_id,
                new_project_id=new_project_id,
                # 不再包含部门变更信息
                previous_department_id=None,
                new_department_id=None,
                status='pending'
            )

            db.session.add(employee)
            db.session.add(change_record)
            db.session.commit()

            return {
                'employee': employee,
                'change_record': change_record
            }

        except SQLAlchemyError as e:
            db.session.rollback()
            raise EmployeeServiceException(f"Database error: {str(e)}")

    def bulk_import(self, file) -> Dict:
        """
        批量导入员工数据
        
        Args:
            file: CSV文件对象
        Returns:
            Dict: 包含导入结果统计
        """
    
    def export_employees(self, filters: Optional[Dict] = None) -> bytes:
        """
        导出员工数据
        
        Args:
            filters: 过滤条件
        Returns:
            bytes: CSV文件内容
        """