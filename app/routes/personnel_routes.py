# app/routes/personnel_routes.py
from flask import Blueprint, request, jsonify
from app.models import Employee
from app import db

bp = Blueprint('personnel', __name__, url_prefix='/api/employees')

@bp.route('/', methods=['GET'])
def get_employees():
    employees = Employee.query.all()
    return jsonify([employee.to_dict() for employee in employees])

@bp.route('/', methods=['POST'])
def add_employee():
    data = request.get_json()
    new_employee = Employee(**data)
    db.session.add(new_employee)
    db.session.commit()
    return jsonify(new_employee.to_dict()), 201