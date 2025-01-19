from flask import request, current_app
from . import project_bp
from ..utils import make_response, handle_exceptions, get_pagination_params

@project_bp.route('/', methods=['GET'])
@handle_exceptions
def get_projects():
    """获取项目列表
    支持通过department_id参数筛选特定部门的项目
    """
    department_id = request.args.get('department_id', type=int)
    result = current_app.project_service.get_projects(department_id)
    return make_response(data=result)

@project_bp.route('/<int:id>', methods=['GET'])
@handle_exceptions
def get_project(id):
    """获取单个项目详情"""
    project = current_app.project_service.get_project(id)
    return make_response(data=project)

@project_bp.route('/', methods=['POST'])
@handle_exceptions
def create_project():
    """创建新项目"""
    data = request.get_json()
    project = current_app.project_service.create_project(data)
    return make_response(data=project)

@project_bp.route('/<int:id>', methods=['PUT'])
@handle_exceptions
def update_project(id):
    """更新项目信息"""
    data = request.get_json()
    project = current_app.project_service.update_project(id, data)
    return make_response(data=project)

@project_bp.route('/<int:id>', methods=['DELETE'])
@handle_exceptions
def delete_project(id):
    """删除项目"""
    current_app.project_service.delete_project(id)
    return make_response(data={'id': id})

@project_bp.route('/<int:id>/stats', methods=['GET'])
@handle_exceptions
def get_project_stats(id):
    """获取项目统计信息"""
    stats = current_app.project_service.get_project_stats(id)
    return make_response(data=stats)

@project_bp.route('/<int:id>/employees', methods=['GET'])
@handle_exceptions
def get_project_employees(id):
    """获取项目成员列表"""
    params = get_pagination_params()
    result = current_app.project_service.get_project_employees(id, **params)
    return make_response(
        data=result['items'],
        pagination={
            'total': result['total'],
            'current_page': result['current_page'],
            'total_pages': result['pages']
        }
    )
