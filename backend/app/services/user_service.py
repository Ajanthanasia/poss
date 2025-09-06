# app/services/user_service.py
from app import db
from app.models.user import User
from werkzeug.security import generate_password_hash, check_password_hash

def create_user(name: str, email: str, password: str):
    if User.query.filter_by(name=name).first() or User.query.filter_by(email=email).first():
        raise ValueError("Name or email already exists")
    hashed_password = generate_password_hash(password)
    # Use the correct column name 'password' instead of 'password_hash'
    user = User(name=name, email=email, password=hashed_password)
    db.session.add(user)
    db.session.commit()
    return user

def authenticate_user(name: str, password: str):
    user = User.query.filter_by(name=name).first()
    if user and check_password_hash(user.password, password):  # <--- use 'password'
        return user
    return None


def get_user(user_id: int):
    return User.query.get_or_404(user_id)