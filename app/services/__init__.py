from typing import Any, Type
from sqlalchemy.exc import SQLAlchemyError
from ..extensions import db

class ServiceException(Exception):
    """所有服务异常的基类"""
    pass

class BaseService:
    """服务基类"""
    model: Any = None

    def __init__(self, model: Type[Any]):
        self.model = model

    def _db_operation(self, operation: callable) -> Any:
        """包装数据库操作,统一处理事务和异常"""
        try:
            result = operation()
            db.session.commit()
            return result
        except SQLAlchemyError as e:
            db.session.rollback()
            raise ServiceException(f"数据库错误: {str(e)}")

    def get_by_id(self, id: int) -> Any:
        """通用的根据ID获取记录方法"""
        instance = self.model.query.get(id)
        if not instance:
            raise ServiceException(f"{self.model.__name__} with id {id} not found")
        return instance

# 导入所有服务类
from .employee_service import EmployeeService
from .department_service import DepartmentService
from .project_service import ProjectService
from .change_record_service import ChangeRecordService  # 新增这行

# 重新导出服务类，使其可以直接从 services 包中导入
__all__ = [
    'ServiceException',
    'BaseService',
    'EmployeeService',
    'DepartmentService',
    'ProjectService',
    'ChangeRecordService'  # 新增这行

]
