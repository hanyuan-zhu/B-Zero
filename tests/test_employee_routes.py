import pytest
from flask import json
from app import create_app
from app.extensions import db
from app.models import Employee, Department, Project, ChangeRecord
from datetime import datetime
from datetime import date

@pytest.fixture
def app():
    app = create_app('testing')
    return app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def init_database(app):
    """初始化测试数据库"""
    with app.app_context():
        db.create_all()
        
        # 创建测试部门
        dept1 = Department(name="技术部")
        dept2 = Department(name="市场部")
        db.session.add_all([dept1, dept2])
        db.session.flush()  # 获取ID
        
        # 创建测试项目
        proj1 = Project(name="项目A", department_id=dept1.id)
        proj2 = Project(name="项目B", department_id=dept2.id)
        db.session.add_all([proj1, proj2])
        db.session.flush()  # 获取ID
        
        # 创建测试员工
        emp1 = Employee(
            name="张三",
            department_id=dept1.id,
            project_id=proj1.id,
            position="开发工程师",
            status="active",
            join_date=datetime(2023, 1, 1)
        )
        
        emp2 = Employee(
            name="李四",
            department_id=dept2.id,
            project_id=proj2.id,
            position="市场经理",
            status="active", 
            join_date=datetime(2023, 2, 1)
        )
        
        db.session.add_all([emp1, emp2])
        db.session.flush()
        
        # 添加变更记录测试数据
        change_records = [
            ChangeRecord(
                employee_id=emp1.id,
                change_type='入职',
                change_date=datetime(2023, 1, 1).date(),
                new_department_id=dept1.id,
                new_project_id=proj1.id,
                status='confirmed'
            ),
            ChangeRecord(
                employee_id=emp2.id,
                change_type='入职',
                change_date=datetime(2023, 2, 1).date(),
                new_department_id=dept2.id,
                new_project_id=proj2.id,
                status='confirmed'
            )
        ]
        
        db.session.add_all(change_records)
        db.session.commit()
        
        return {
            'departments': [dept1, dept2],
            'projects': [proj1, proj2],
            'employees': [emp1, emp2],
            'change_records': change_records
        }

def test_get_employees_list(client, init_database):
    """测试获取员工列表的各种场景"""
    with client.application.app_context():
        # 先删除关联的change_records
        db.session.query(ChangeRecord).delete()
        # 再删除employees
        db.session.query(Employee).delete()
        db.session.commit()

        # 设置今天作为入职日期
        today = date.today()
        
        # 只插入测试用例需要的数据
        test_employees = [
            Employee(
                id=33,
                name="张三",
                position="开发工程师", 
                join_date=today,
                status="active"  # 添加状态
            ),
            Employee(
                id=34, 
                name="李四",
                position="市场经理",
                join_date=today,
                status="active"  # 添加状态
            )
        ]
        db.session.add_all(test_employees)
        db.session.commit()
        
        # 执行测试
        response = client.get('/api/employees/')
        assert response.status_code == 200
        result = json.loads(response.data)
        assert len(result["data"]) == 2

