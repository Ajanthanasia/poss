from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app.services.user_service import create_user, authenticate_user
from werkzeug.security import check_password_hash
from app.database import SessionLocal  # your SQLAlchemy session factory
from app.models.user import User

adminRoute = Blueprint('admin', __name__, url_prefix='/api')

@adminRoute.route('signup',methods=['post'])
def signupFunc():
    data = request.get_json()
    username =data.get('username')
    email =data.get('email')
    password =data.get('password')

    db = SessionLocal()

    new_user = User(
        name=username,
        email=email,
    )
    new_user.set_password(password)

    db.add(new_user)
    return jsonify({'name':username,'em':email,'password':password})