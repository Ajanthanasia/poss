# app/routes/users.py
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.user_service import get_user

users_bp = Blueprint('users', __name__, url_prefix='/users')

@users_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_route(user_id):
    current_user_id = get_jwt_identity()
    if current_user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403
    user = get_user(user_id)
    return jsonify({"id": user.id, "username": user.username, "email": user.email})