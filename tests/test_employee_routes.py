import pytest
from flask import json
from app import create_app, db
from app.models import Employee, Department, Project
from datetime import datetime

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
        
        # 创建测试项目
        proj1 = Project(name="项目A", department=dept1)
        proj2 = Project(name="项目B", department=dept2)
        db.session.add_all([proj1, proj2])
        
        # 创建测试员工
        employees = [
            Employee(
                name="张三",
                department=dept1,
                project=proj1,
                position="开发工程师",
                status="active",
                join_date=datetime(2023, 1, 1)
            ),
            Employee(
                name="李四",
                department=dept2,
                project=proj2,
                position="市场经理",
                status="active", 
                join_date=datetime(2023, 2, 1)
            )
        ]
        db.session.add_all(employees)
        db.session.commit()
        
        yield  # 提供测试数据
        
        db.session.remove()
        db.drop_all()  # 清理测试数据

# 测试员工部门调动
def test_transfer_department(client, init_database):
    """测试部门调动功能"""
    data = {
        "new_department_id": 2,  # 市场部ID
        "date": "2024-01-20",
        "reason": "业务需要"
    }
    response = client.post(
        '/api/employees/1/transfer-department',
        json=data
    )
    assert response.status_code == 200
    result = json.loads(response.data)
    assert result["success"] == True
    assert result["data"]["employee"]["department"]["id"] == 2

# 测试项目调岗
def test_transfer_project(client, init_database):
    """测试项目调岗功能"""
    data = {
        "new_project_id": 2,
        "date": "2024-01-20", 
        "reason": "项目调整"
    }
    response = client.post(
        '/api/employees/1/transfer-project',
        json=data
    )
    assert response.status_code == 200
    result = json.loads(response.data)
    assert result["success"] == True
    assert result["data"]["employee"]["project"]["id"] == 2

# 测试错误处理
def test_employee_not_found(client, init_database):
    """测试访问不存在的员工ID"""
    response = client.get('/api/employees/999')
    assert response.status_code == 404

def test_invalid_transfer(client, init_database):
    """测试无效的调动请求"""
    data = {
        "new_department_id": 999,  # 不存在的部门
        "date": "2024-01-20",
        "reason": "测试"
    }
    response = client.post(
        '/api/employees/1/transfer-department',
        json=data
    )
    assert response.status_code == 400

def test_get_employees_list(client, init_database):
    """测试获取员工列表的各种场景"""
    # 基本列表获取
    response = client.get('/api/employees/')
    assert response.status_code == 200
    result = json.loads(response.data)
    assert len(result["data"]) == 2

    # 分页测试
    response = client.get('/api/employees/?page=1&per_page=1')
    result = json.loads(response.data)
    assert len(result["data"]) == 1
    assert result["pagination"]["total"] == 2

    # 搜索过滤
    response = client.get('/api/employees/?keyword=张三')
    result = json.loads(response.data)
    assert len(result["data"]) == 1
    assert result["data"][0]["name"] == "张三"

    # 部门过滤
    response = client.get('/api/employees/?department=1')
    result = json.loads(response.data)
    assert all(emp["department"]["id"] == 1 for emp in result["data"])

    # 日期范围过滤
    response = client.get('/api/employees/?startDate=2023-01-01&endDate=2023-01-31')
    result = json.loads(response.data)
    assert len(result["data"]) == 1
