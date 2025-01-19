from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import pymysql
from sqlalchemy_utils import database_exists, create_database

# 注册PyMySQL作为MySQL驱动
pymysql.install_as_MySQLdb()

db = SQLAlchemy()
migrate = Migrate()

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

    from app.routes import employee_routes  # 修改导入路径
    app.register_blueprint(employee_routes.bp)

    return app