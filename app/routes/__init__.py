from flask import Blueprint, Flask

# 创建蓝图
employee_bp = Blueprint('employee', __name__, url_prefix='/api/employees')
department_bp = Blueprint('department', __name__, url_prefix='/api/departments')
project_bp = Blueprint('project', __name__, url_prefix='/api/projects')
change_record_bp = Blueprint('change_record', __name__, url_prefix='/api/change-records')

# 导入路由模块 (这会执行各个模块中的路由定义)
from . import employee_routes, department_routes, project_routes, change_record_routes

def init_app(app: Flask):
    """注册所有蓝图到应用"""
    app.register_blueprint(employee_bp)
    app.register_blueprint(department_bp)
    app.register_blueprint(project_bp)
    app.register_blueprint(change_record_bp)
