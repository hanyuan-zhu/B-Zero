from flask import Blueprint

# 创建蓝图
employee_bp = Blueprint('employee', __name__, url_prefix='/api/employees')
department_bp = Blueprint('department', __name__, url_prefix='/api/departments')
project_bp = Blueprint('project', __name__, url_prefix='/api/projects')
change_record_bp = Blueprint('change_record', __name__, url_prefix='/api/change-records')

# 导入路由模块
from . import employee_routes, department_routes, project_routes, change_record_routes
