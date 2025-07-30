# app/routes/auth.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app.services.user_service import create_user, authenticate_user
from werkzeug.security import check_password_hash

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    return jsonify('sdf')
    data = request.get_json()
    try:
        user = create_user(data['username'], data['email'], data['password'])
        return jsonify({"message": "User created", "user": {"id": user.id, "username": user.username}}), 201
    except ValueError as e:
        printf('error')
        return jsonify({"error": str(e)}), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = authenticate_user(data['username'], data['password'])
    if user:
        access_token = create_access_token(identity=user.id)
        return jsonify({"access_token": access_token})
    return jsonify({"error": "Invalid credentials"}), 401