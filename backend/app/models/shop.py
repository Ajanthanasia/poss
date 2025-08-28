# app/models/user.py
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from app.models.user import User

db = SQLAlchemy()

class Shop(db.Model):
    __tablename__ = 'shops'
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, nullable=True)
    name = db.Column(db.String(100), nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    token = db.Column(db.String(255),unique=True,nullable=False)
    address=db.Column(db.String(255),nullable=True)
    city=db.Column(db.String(255),nullable=True)
    district=db.Column(db.String(255),nullable=True)
    country=db.Column(db.String(255),nullable=True)
    status_id = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # owner = db.relationship('User', backref=db.backref('shops', lazy=True))