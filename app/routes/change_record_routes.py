from flask import request, current_app
from . import change_record_bp
from ..utils import make_response, handle_exceptions, get_pagination_params

@change_record_bp.route('/', methods=['GET'])
@handle_exceptions
def get_change_records():
    """获取变动记录列表，支持状态、类型和日期筛选"""
    params = get_pagination_params()
    
    # 获取筛选条件
    filters = {
        'status': request.args.get('status'),
        'type': request.args.get('type'),
        'date_range': {
            'start': request.args.get('startDate'),
            'end': request.args.get('endDate')
        } if request.args.get('startDate') or request.args.get('endDate') else None
    }
    
    result = current_app.change_record_service.get_change_records(
        **params,
        **{k: v for k, v in filters.items() if v is not None}
    )
    
    return make_response(
        data=result['items'],
        pagination={
            'total': result['total'],
            'current_page': result['current_page'],
            'total_pages': result['pages']
        }
    )

@change_record_bp.route('/<int:id>', methods=['GET'])
@handle_exceptions
def get_change_record(id):
    """获取单个变动记录详情"""
    record = current_app.change_record_service.get_change_record(id)
    return make_response(data=record)

@change_record_bp.route('/<int:id>/confirm', methods=['POST'])
@handle_exceptions
def confirm_change(id):
    """确认变动记录"""
    result = current_app.change_record_service.confirm_change(id)
    return make_response(data=result)

@change_record_bp.route('/<int:id>/reject', methods=['POST'])
@handle_exceptions
def reject_change(id):
    """拒绝变动记录"""
    data = request.get_json()
    if not data or 'reason' not in data:
        return make_response(
            success=False,
            error={"message": "拒绝原因不能为空"}
        )
    
    result = current_app.change_record_service.reject_change(id, data['reason'])
    return make_response(data=result)

@change_record_bp.route('/search', methods=['GET'])
@handle_exceptions
def search_records():
    """搜索变动记录"""
    keyword = request.args.get('keyword', '')
    if not keyword:
        return make_response(
            success=False,
            error={"message": "搜索关键词不能为空"}
        )
    
    records = current_app.change_record_service.search_records(keyword)
    return make_response(data=records)
