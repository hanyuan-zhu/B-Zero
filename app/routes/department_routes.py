from flask import request, current_app
from . import department_bp
from ..utils import make_response, handle_exceptions

@department_bp.route('/', methods=['GET'])
@handle_exceptions
def get_departments():
    params = get_pagination_params()
    result = current_app.department_service.get_departments(**params)
    return make_response(
        data=result['items'],
        pagination={
            'total': result['total'],
            'current_page': result['current_page'],
            'total_pages': result['pages']
        }
    )

@department_bp.route('/', methods=['POST'])
@handle_exceptions
def create_department():
    data = request.get_json()
    department = current_app.department_service.create_department(data)
    return make_response(data=department)

@department_bp.route('/<int:id>', methods=['PUT'])
@handle_exceptions
def update_department(id):
    data = request.get_json()
    department = current_app.department_service.update_department(id, data)
    return make_response(data=department)

@department_bp.route('/<int:id>', methods=['DELETE'])
@handle_exceptions
def delete_department(id):
    current_app.department_service.delete_department(id)
    return make_response(data={"id": id})
