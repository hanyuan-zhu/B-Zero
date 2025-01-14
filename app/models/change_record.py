from app import db
from sqlalchemy.dialects.mysql import ENUM

class ChangeRecord(db.Model):
    __tablename__ = 'change_records'
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)
    change_type = db.Column(ENUM('入职','离职','部门调动','项目调岗','待岗'), nullable=False)
    change_date = db.Column(db.Date, nullable=False)
    reason = db.Column(db.Text)
    previous_department_id = db.Column(db.Integer, db.ForeignKey('departments.id'))
    new_department_id = db.Column(db.Integer, db.ForeignKey('departments.id'))
    previous_project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    new_project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    status = db.Column(ENUM('pending','confirmed','rejected'), server_default='pending')
    reject_reason = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())