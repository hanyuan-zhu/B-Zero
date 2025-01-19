from flask import jsonify
from functools import wraps

def make_response(data=None, success=True, pagination=None, error=None):
    return jsonify({
        "success": success,
        "data": data,
        "pagination": pagination,
        "error": error
    })

def handle_exceptions(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            return make_response(
                success=False, 
                error={"message": str(e)}
            )
    return wrapper

def get_pagination_params():
    return {
        'page': request.args.get('page', 1, type=int),
        'limit': request.args.get('limit', 10, type=int),
        'sort': request.args.get('sort', 'created_at'),
        'order': request.args.get('order', 'desc')
    }
