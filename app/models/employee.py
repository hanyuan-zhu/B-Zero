# app/models/employee.py
from ..extensions import db

class Employee(db.Model):
    __tablename__ = 'employees'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    position = db.Column(db.String(100), nullable=False)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'))
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    join_date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    department = db.relationship('Department', backref='employees')
    project = db.relationship('Project', backref='employees')
    change_records = db.relationship('ChangeRecord', backref='employee')
    
