from typing import Dict, List, Optional
from sqlalchemy.exc import SQLAlchemyError
from app import db
from app.models import Project, Department, Employee

class ProjectServiceException(Exception):
    """项目服务异常类"""
    pass

class ProjectService:
    def __init__(self):
        self.model = Project
        
    def _validate_project_data(self, data: Dict) -> None:
        """验证项目数据
        
        Args:
            data: 项目数据字典
        Raises:
            ProjectServiceException: 当数据验证失败时
        """
        if not data.get('name'):
            raise ProjectServiceException("项目名称不能为空")
            
        if not data.get('department_id'):
            raise ProjectServiceException("必须指定项目所属部门")
            
        # 检查部门是否存在
        department = Department.query.get(data['department_id'])
        if not department:
            raise ProjectServiceException(f"部门ID {data['department_id']} 不存在")
            
        # 检查项目名称在该部门下是否重复
        existing = Project.query.filter_by(
            name=data['name'],
            department_id=data['department_id']
        ).first()
        if existing:
            raise ProjectServiceException(
                f"项目名称 '{data['name']}' 在该部门下已存在"
            )

    def get_projects(self, department_id: Optional[int] = None) -> List[Project]:
        """获取项目列表
        
        Args:
            department_id: 可选的部门ID过滤
        Returns:
            List[Project]: 项目列表
        """
        try:
            query = self.model.query
            if department_id:
                query = query.filter_by(department_id=department_id)
            return query.all()
        except SQLAlchemyError as e:
            raise ProjectServiceException(f"数据库错误: {str(e)}")

    def get_project(self, id: int) -> Optional[Project]:
        """获取单个项目详情
        
        Args:
            id: 项目ID
        Returns:
            Project: 项目对象
        """
        try:
            project = self.model.query.get(id)
            if not project:
                raise ProjectServiceException(f"项目ID {id} 不存在")
            return project
        except SQLAlchemyError as e:
            raise ProjectServiceException(f"数据库错误: {str(e)}")

    def create_project(self, data: Dict) -> Project:
        """创建新项目
        
        Args:
            data: 包含项目信息的字典
        Returns:
            Project: 新创建的项目对象
        """
        try:
            self._validate_project_data(data)
            
            project = Project(
                name=data['name'],
                department_id=data['department_id']
            )
            
            db.session.add(project)
            db.session.commit()
            
            return project
        except SQLAlchemyError as e:
            db.session.rollback()
            raise ProjectServiceException(f"数据库错误: {str(e)}")

    def update_project(self, id: int, data: Dict) -> Project:
        """更新项目信息
        
        Args:
            id: 项目ID
            data: 包含更新信息的字典
        Returns:
            Project: 更新后的项目对象
        """
        try:
            project = self.model.query.get(id)
            if not project:
                raise ProjectServiceException(f"项目ID {id} 不存在")

            # 如果要更改部门,需要特殊处理
            if 'department_id' in data and data['department_id'] != project.department_id:
                # 检查新部门是否存在
                new_department = Department.query.get(data['department_id'])
                if not new_department:
                    raise ProjectServiceException(f"部门ID {data['department_id']} 不存在")
                    
                # 检查新部门下是否有重名项目
                if Project.query.filter_by(
                    name=data.get('name', project.name),
                    department_id=data['department_id']
                ).first():
                    raise ProjectServiceException("新部门下已存在同名项目")

            # 更新项目信息
            if 'name' in data:
                project.name = data['name']
            if 'department_id' in data:
                project.department_id = data['department_id']
            
            db.session.commit()
            return project
            
        except SQLAlchemyError as e:
            db.session.rollback()
            raise ProjectServiceException(f"数据库错误: {str(e)}")

    def delete_project(self, id: int) -> bool:
        """删除项目
        
        Args:
            id: 项目ID
        Returns:
            bool: 删除是否成功
        """
        try:
            project = self.model.query.get(id)
            if not project:
                raise ProjectServiceException(f"项目ID {id} 不存在")

            # 检查是否有关联的员工
            if Employee.query.filter_by(project_id=id).first():
                raise ProjectServiceException("无法删除有关联员工的项目")

            db.session.delete(project)
            db.session.commit()
            return True
            
        except SQLAlchemyError as e:
            db.session.rollback()
            raise ProjectServiceException(f"数据库错误: {str(e)}")

    def get_project_stats(self, id: int) -> Dict:
        """获取项目统计信息
        
        Args:
            id: 项目ID
        Returns:
            Dict: 包含项目统计信息的字典
        """
        try:
            project = self.model.query.get(id)
            if not project:
                raise ProjectServiceException(f"项目ID {id} 不存在")

            employee_count = Employee.query.filter_by(project_id=id).count()
            
            department = Department.query.get(project.department_id)
            
            return {
                'project': project,
                'department': department,
                'employee_count': employee_count
            }
        except SQLAlchemyError as e:
            raise ProjectServiceException(f"数据库错误: {str(e)}")

    def get_project_employees(self, id: int, page: int = 1, limit: int = 10) -> Dict:
        """获取项目成员列表
        
        Args:
            id: 项目ID
            page: 页码
            limit: 每页记录数
        Returns:
            Dict: 包含成员列表和分页信息
        """
        try:
            project = self.model.query.get(id)
            if not project:
                raise ProjectServiceException(f"项目ID {id} 不存在")
            
            # 查询项目下的员工
            pagination = Employee.query.filter_by(project_id=id).paginate(
                page=page,
                per_page=limit,
                error_out=False
            )
            
            return {
                'items': [{
                    'id': emp.id,
                    'name': emp.name,
                    'position': emp.position,
                    'join_date': emp.join_date.strftime('%Y-%m-%d')
                } for emp in pagination.items],
                'total': pagination.total,
                'pages': pagination.pages,
                'current_page': page
            }
            
        except SQLAlchemyError as e:
            raise ProjectServiceException(f"数据库错误: {str(e)}")