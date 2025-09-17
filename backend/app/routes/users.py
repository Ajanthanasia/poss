from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.user_service import get_user

# Create Blueprint
users_bp = Blueprint('users', __name__, url_prefix='/users')

# Route to get a user by ID (JWT-protected)
@users_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_route(user_id):
    # Get current user ID from JWT token
    current_user_id = int(get_jwt_identity())  # ensure it's an int for comparison

    # Check if the user is requesting their own data
    if current_user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    # Fetch the user from the database
    user = get_user(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Return user data
    return jsonify({
        "id": user.id,
        "name": getattr(user, "name", None),  # fallback if name attribute missing
        "email": user.email
    }), 200
