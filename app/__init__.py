from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import pymysql
from sqlalchemy_utils import database_exists, create_database

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:123321@localhost/bzero'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # 检查数据库是否存在，不存在则创建
    if not database_exists(app.config['SQLALCHEMY_DATABASE_URI']):
        create_database(app.config['SQLALCHEMY_DATABASE_URI'])
        print("数据库已创建")

    db.init_app(app)
    migrate.init_app(app, db)

    from app.routes import personnel_routes
    app.register_blueprint(personnel_routes.bp)

    return app