from flask import Blueprint, request, jsonify
from app.database import SessionLocal  # your SQLAlchemy session factory
from app.models.user import User
from werkzeug.security import generate_password_hash, check_password_hash
from app.services.jwt import generate_jwt
from werkzeug.security import check_password_hash

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

def login_user(data):
    try:
        email = data.get('email')
        password = data.get('password')
        db = SessionLocal()
        login_user = db.query(User).filter(User.email == email).first()
        if not login_user:
            return jsonify({"status": False, "message": "User not found"}), 404

        if check_password_hash(login_user.password, password):
            apiToken = generate_jwt(login_user.id ,login_user.name)
            login_user.set_api_token(apiToken)
            db.commit()
            userData ={
                'id': login_user.id,
                'name': login_user.name
            }
            return jsonify({
                "status": True, 
                "message": "Login successful",
                "api_token":apiToken,
                "data":userData
            })
        else:
            return jsonify({
                "status": False,
                "message": "Invalid password"
            }), 401
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            'status':False,
            'message':'Whoops!'
        })