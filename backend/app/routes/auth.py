from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app.services.user_service import create_user, authenticate_user

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

# -------- REGISTER --------
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"error": "Name, email, and password are required"}), 400

    try:
        user = create_user(name, email, password)
        return jsonify({
            "message": "User created",
            "user": {"id": user.id, "name": user.name, "email": user.email}
        }), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

# -------- LOGIN --------
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    name = data.get('name')   # <-- change from username
    password = data.get('password')

    if not name or not password:
        return jsonify({"error": "Name and password are required"}), 400

    user = authenticate_user(name, password)  # <-- change from username
    if user:
        access_token = create_access_token(identity=user.id)
        return jsonify({"access_token": access_token}), 200

    return jsonify({"error": "Invalid credentials"}), 401