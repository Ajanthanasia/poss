# app/services/user_service.py
from werkzeug.security import generate_password_hash, check_password_hash
from app.models.user import User
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_user(username: str, email: str, password: str):
    if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
        raise ValueError("Username or email already exists")
    hashed_password = generate_password_hash(password)
    user = User(username=username, email=email, password_hash=hashed_password)
    db.session.add(user)
    db.session.commit()
    return user

def authenticate_user(username: str, password: str):
    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password_hash, password):
        return user
    return None

def get_user(user_id: int):
    user = User.query.get_or_404(user_id)
    return user