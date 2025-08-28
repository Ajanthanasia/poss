from flask import Blueprint, request, jsonify
from app.database import SessionLocal  # your SQLAlchemy session factory
from app.models.user import User
from werkzeug.security import generate_password_hash, check_password_hash
from app.services.jwt import generate_jwt

def index_owners(data):
    try:
        db = SessionLocal()
        data = db.query(User).filter(User.role_id == 2).all()
        result = [{
            'id':u.id,
            'name':u.name,
            'email':u.email
        } for u in data]
        return jsonify({
            'status':True,
            'message':'success',
            'data':result
        })
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            'status':False,
            'message':'Whoops!'
        }) 

def store_new_owner_by_admin(data):
    try:
        name = data.get('name')
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
            name=name,
            email=email,
            password=hashed_password,
            role_id = 2,
            status_id =2,
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        apiToken = generate_jwt(new_user.id ,name)
        new_user.set_api_token(apiToken)
        db.commit()

        return ({
            'status':True,
            'message':'Successfully owner added!',
        })
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            'status':False,
            'message':'Whoops!'
        }) 