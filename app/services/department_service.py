from typing import Dict, List, Optional
from sqlalchemy.exc import SQLAlchemyError
from ..extensions import db
from ..models import Department
from app.models import Employee, Project
from . import BaseService, ServiceException

class DepartmentServiceException(ServiceException):
    pass

class DepartmentService(BaseService):
    def __init__(self):
        super().__init__(Department)

    def _validate_department_data(self, data: Dict) -> None:
        """验证部门数据"""
        if not data.get('name'):
            raise DepartmentServiceException("Department name is required")
        # 检查部门名是否重复
        existing = Department.query.filter_by(name=data['name']).first()
        if existing:
            raise DepartmentServiceException(f"Department name '{data['name']} already exists")

    def get_departments(self) -> List[Department]:
        """获取所有部门列表"""
        try:
            return self.model.query.all()
        except SQLAlchemyError as e:
            raise DepartmentServiceException(f"Database error: {str(e)}")

    def get_department(self, id: int) -> Optional[Department]:
        """
        获取单个部门详细信息
        
        Args:
            id: 部门ID
        Returns:
            Department: 部门对象
        """
        try:
            department = self.model.query.get(id)
            if not department:
                raise DepartmentServiceException(f"Department with id {id} not found")
            return department
        except SQLAlchemyError as e:
            raise DepartmentServiceException(f"Database error: {str(e)}")

    def create_department(self, data: Dict) -> Department:
        """
        创建新部门
        
        Args:
            data: 包含部门信息的字典
        Returns:
            Department: 新创建的部门对象
        """
        try:
            self._validate_department_data(data)
            
            department = Department(
                name=data['name']
            )
            
            db.session.add(department)
            db.session.commit()
            
            return department
        except SQLAlchemyError as e:
            db.session.rollback()
            raise DepartmentServiceException(f"Database error: {str(e)}")

    def update_department(self, id: int, data: Dict) -> Department:
        """
        更新部门信息
        
        Args:
            id: 部门ID
            data: 包含更新信息的字典
        Returns:
            Department: 更新后的部门对象
        """
        try:
            department = self.model.query.get(id)
            if not department:
                raise DepartmentServiceException(f"Department with id {id} not found")
            
            if 'name' in data and data['name'] != department.name:
                # 检查新名称是否重复
                existing = Department.query.filter_by(name=data['name']).first()
                if existing:
                    raise DepartmentServiceException(f"Department name '{data['name']} already exists")
                department.name = data['name']
            
            db.session.commit()
            return department
        except SQLAlchemyError as e:
            db.session.rollback()
            raise DepartmentServiceException(f"Database error: {str(e)}")

    def delete_department(self, id: int) -> bool:
        """
        删除部门
        
        Args:
            id: 部门ID
        Returns:
            bool: 删除是否成功
        """
        try:
            department = self.model.query.get(id)
            if not department:
                raise DepartmentServiceException(f"Department with id {id} not found")
            
            # 检查是否有关联的员工
            if Employee.query.filter_by(department_id=id).first():
                raise DepartmentServiceException("Cannot delete department with associated employees")
            
            # 检查是否有关联的项目
            if Project.query.filter_by(department_id=id).first():
                raise DepartmentServiceException("Cannot delete department with associated projects")
            
            db.session.delete(department)
            db.session.commit()
            return True
        except SQLAlchemyError as e:
            db.session.rollback()
            raise DepartmentServiceException(f"Database error: {str(e)}")

    def get_department_stats(self, id: int) -> Dict:
        """
        获取部门统计信息
        
        Args:
            id: 部门ID
        Returns:
            Dict: 包含部门统计信息的字典
        """
        try:
            department = self.model.query.get(id)
            if not department:
                raise DepartmentServiceException(f"Department with id {id} not found")
            
            employee_count = Employee.query.filter_by(department_id=id).count()
            project_count = Project.query.filter_by(department_id=id).count()
            
            return {
                'department': department,
                'employee_count': employee_count,
                'project_count': project_count
            }
        except SQLAlchemyError as e:
            raise DepartmentServiceException(f"Database error: {str(e)}")