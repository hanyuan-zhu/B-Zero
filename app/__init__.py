from flask import Flask
import pymysql
from sqlalchemy_utils import database_exists, create_database
from .extensions import db, migrate

pymysql.install_as_MySQLdb()

def create_app(config_name=None):
    app = Flask(__name__)
    
    # 根据配置名称设置不同的配置
    if config_name == 'testing':
        app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:123321@localhost/bzero'
    else:
        app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:123321@localhost/bzero'
    
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # 检查数据库是否存在，不存在则创建
    if not database_exists(app.config['SQLALCHEMY_DATABASE_URI']):
        create_database(app.config['SQLALCHEMY_DATABASE_URI'])
        print("数据库已创建")

    db.init_app(app)
    migrate.init_app(app, db)

    # 导入并注册所有蓝图
    from app import routes
    routes.init_app(app)

    # 延迟导入和初始化服务
    with app.app_context():
        from .services import (
            EmployeeService, 
            DepartmentService, 
            ProjectService,
            ChangeRecordService
        )
        app.employee_service = EmployeeService()
        app.department_service = DepartmentService()
        app.project_service = ProjectService()
        app.change_record_service = ChangeRecordService()

    return app