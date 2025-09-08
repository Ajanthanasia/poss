from flask import jsonify
from app.database import SessionLocal  # your SQLAlchemy session factory
from app.models.user import User
from werkzeug.security import generate_password_hash, check_password_hash
from app.services.jwt import generate_jwt

def register_admin(data):
    try:
        # Correctly read 'name' from JSON
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        if not name or not email or not password:
            return jsonify({'status': False, 'message': 'Name, email, and password are required'}), 400

        db = SessionLocal()

        # Check if email already exists
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            return jsonify({'status': False, 'message': 'Email already used by someone'}), 400

        # Hash the password
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256', salt_length=16)

        # Create new user
        new_user = User(
            name=name,
            email=email,
            password=hashed_password,
            role_id=1,    # admin role
            status_id=2   # pending/active depending on your setup
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        # Generate JWT token
        apiToken = generate_jwt(new_user.id, name)
        new_user.set_api_token(apiToken)
        db.commit()

        return jsonify({
            'status': True,
            'message': 'Successfully account registered!',
            'api_token': apiToken,
            'user': {
                'id': new_user.id,
                'name': new_user.name,
                'email': new_user.email
            }
        }), 201

    except Exception as e:
        print(f"Error in register_admin: {e}")
        return jsonify({'status': False, 'message': 'Whoops!'}), 500


def login_user(data):
    try:
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'status': False, 'message': 'Email and password are required'}), 400

        db = SessionLocal()
        login_user = db.query(User).filter(User.email == email).first()
        if not login_user:
            return jsonify({"status": False, "message": "User not found"}), 404

        if check_password_hash(login_user.password, password):
            apiToken = generate_jwt(login_user.id, login_user.name)
            login_user.set_api_token(apiToken)
            db.commit()

            userData = {
                'id': login_user.id,
                'name': login_user.name,
                'email': login_user.email
            }

            return jsonify({
                "status": True,
                "message": "Login successful",
                "api_token": apiToken,
                "data": userData
            }), 200
        else:
            return jsonify({
                "status": False,
                "message": "Invalid password"
            }), 401

    except Exception as e:
        print(f"Error in login_user: {e}")
        return jsonify({'status': False, 'message': 'Whoops!'}), 500
