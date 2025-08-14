from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app.services.user_service import create_user, authenticate_user
from werkzeug.security import check_password_hash
from app.database import SessionLocal  # your SQLAlchemy session factory
from app.models.user import User

adminRoute = Blueprint('admin', __name__, url_prefix='/api')

from app.controllers.login_controller import register_admin, login_user
from app.controllers.admin_owners_controller import store_new_owner_by_admin, index_owners

@adminRoute.route('signup',methods=['post'])
def signupFunc():
    data = request.get_json()
    return register_admin(data)

@adminRoute.route('login',methods=['post'])
def login():
    data = request.get_json()
    return login_user(data)

@adminRoute.route('store-owner',methods=['post'])
def storeOwnerByAdmin():
    data=request.get_json()
    return store_new_owner_by_admin(data)

@adminRoute.route('index-owners',methods=['get'])
def indexOfOwnersList():
    data=request.get_json()
    return index_owners(data)