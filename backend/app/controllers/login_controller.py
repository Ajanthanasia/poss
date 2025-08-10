from flask import Blueprint, request, jsonify
from app.database import SessionLocal  # your SQLAlchemy session factory
from app.models.user import User
from werkzeug.security import generate_password_hash, check_password_hash

def register_admin(data):
    username =data.get('username')
    email =data.get('email')
    password =data.get('password')

    db = SessionLocal()
    
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256', salt_length=16)

    new_user = User(
        name=username,
        email=email,
        password=hashed_password,
        role_id = 1,
        api_token = None,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return jsonify({
        'status':True,
        'message':'Successfully account registered!',
        'data':new_user.id
    })