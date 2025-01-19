from flask import request, send_file
from . import employee_bp
from ..services import employee_service
from ..utils import make_response, handle_exceptions, get_pagination_params

@employee_bp.route('/', methods=['GET'])
@handle_exceptions
def get_employees():
    """获取员工列表，支持搜索、筛选和分页"""
    params = get_pagination_params()
    filters = {
        'keyword': request.args.get('keyword'),
        'department_id': request.args.get('department', type=int),
        'project_id': request.args.get('project', type=int),
        'start_date': request.args.get('startDate'),
        'end_date': request.args.get('endDate')
    }
    
    result = employee_service.get_employees(**params, filters=filters)
    return make_response(
        data=result['items'],
        pagination={
            'total': result['total'],
            'current_page': result['current_page'],
            'total_pages': result['pages']
        }
    )

@employee_bp.route('/', methods=['POST'])
@handle_exceptions
def create_employee():
    """创建新员工"""
    data = request.get_json()
    employee = employee_service.create_employee(data)
    return make_response(data=employee)

@employee_bp.route('/<int:id>', methods=['PUT'])
@handle_exceptions
def update_employee(id):
    """更新员工信息"""
    data = request.get_json()
    employee = employee_service.update_employee(id, data)
    return make_response(data=employee)

@employee_bp.route('/<int:id>/resign', methods=['POST'])
@handle_exceptions
def process_resignation():
    """处理员工离职"""
    data = request.get_json()
    result = employee_service.process_resignation(
        id=id,
        date=data['date'],
        reason=data['reason']
    )
    return make_response(data=result)

@employee_bp.route('/<int:id>/transfer-department', methods=['POST'])
@handle_exceptions
def transfer_department(id):
    """处理部门调动"""
    data = request.get_json()
    result = employee_service.transfer_department(
        id=id,
        new_dept_id=data['new_department_id'],
        date=data['date'],
        reason=data['reason']
    )
    return make_response(data=result)

@employee_bp.route('/<int:id>/transfer-project', methods=['POST'])
@handle_exceptions
def transfer_project(id):
    """处理项目调岗"""
    data = request.get_json()
    result = employee_service.transfer_project(
        id=id,
        new_project_id=data.get('new_project_id'),  # 可以为None，表示待岗
        new_dept_id=data.get('new_department_id'),
        date=data['date'],
        reason=data['reason']
    )
    return make_response(data=result)

@employee_bp.route('/bulk-import', methods=['POST'])
@handle_exceptions
def bulk_import():
    """批量导入员工数据"""
    if 'file' not in request.files:
        return make_response(
            success=False,
            error={"message": "No file provided"}
        )
    
    file = request.files['file']
    if not file.filename:
        return make_response(
            success=False,
            error={"message": "No file selected"}
        )
        
    result = employee_service.bulk_import(file)
    return make_response(data=result)

@employee_bp.route('/export', methods=['GET'])
@handle_exceptions
def export_employees():
    """导出员工数据"""
    filters = {
        'keyword': request.args.get('keyword'),
        'department_id': request.args.get('department', type=int),
        'project_id': request.args.get('project', type=int),
        'start_date': request.args.get('startDate'),
        'end_date': request.args.get('endDate')
    }
    
    file_data = employee_service.export_employees(filters)
    return send_file(
        file_data,
        mimetype='text/csv',
        as_attachment=True,
        download_name='employees.csv'
    )
