from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app.services.user_service import create_user, authenticate_user
from werkzeug.security import check_password_hash
from app.database import SessionLocal  # your SQLAlchemy session factory
from app.models.user import User

adminRoute = Blueprint('admin', __name__, url_prefix='/api')

from app.controllers.login_controller import register_admin

@adminRoute.route('signup',methods=['post'])
def signupFunc():
    data = request.get_json()
    return register_admin(data)