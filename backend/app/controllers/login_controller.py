from flask import Blueprint, request, jsonify
from app.database import SessionLocal  # your SQLAlchemy session factory
from app.models.user import User
from werkzeug.security import generate_password_hash, check_password_hash
from app.services.jwt import generate_jwt

def register_admin(data):
    try:
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        db = SessionLocal()

        existing_user = db.query(User).filter(User.email == email).first()
        if(existing_user):
            return jsonify({
                'status':False,
                'message':'Email already used by someone'
            })
        
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256', salt_length=16)

        new_user = User(
            name=username,
            email=email,
            password=hashed_password,
            role_id = 1,
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        apiToken = generate_jwt(new_user.id ,username)
        new_user.set_api_token(apiToken)
        db.commit()
        
        return jsonify({
            'status':True,
            'message':'Successfully account registered!',
            'data':new_user.id
        })
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            'status':False,
            'message':'Whoops!'
        }) 