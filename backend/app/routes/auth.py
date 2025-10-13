from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app.services.user_service import create_user, authenticate_user
from app.controllers.login_controller import login_user

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# -------- LOGIN --------
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    return login_user(data)
