from flask import jsonify
from app.database import SessionLocal
from app.models.user import User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from app.services.jwt import generate_jwt


# -------------------------------
# Register Admin
# -------------------------------
def register_admin(data):
    db = None
    try:
        # Extract input
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        if not name or not email or not password:
            return jsonify({'status': False, 'message': 'Name, email, and password are required'}), 400

        db = SessionLocal()

        # Check for existing email
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            return jsonify({'status': False, 'message': 'Email already used'}), 400

        # Hash password
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256', salt_length=16)

        # Create new admin
        new_user = User(
            name=name,
            email=email,
            password=hashed_password,
            role_id=1,   # Admin role
            status_id=2  # Active / Pending
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        # Create JWT token
        access_token = create_access_token(identity=str(new_user.id))

        return jsonify({
            'status': True,
            'message': 'Successfully registered!',
            'access_token': access_token,
            'user': {
                'id': new_user.id,
                'name': new_user.name,
                'email': new_user.email
            }
        }), 201

    except Exception as e:
        if db:
            db.rollback()
        print(f"❌ register_admin error: {e}")
        return jsonify({'status': False, 'message': 'Something went wrong'}), 500

    finally:
        if db:
            db.close()


# -------------------------------
# Login Admin / Owner
# -------------------------------
# -------------------------------
# Login Admin / Owner
# -------------------------------
def login_user(data):
    db = None
    try:
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'status': False, 'message': 'Email and password required'}), 400

        db = SessionLocal()

        # Find user by email
        user = db.query(User).filter(User.email == email).first()
        if not user:
            return jsonify({'status': False, 'message': 'User not found'}), 404

        password_valid = False

        # 1️⃣ Check user's own password (normal case)
        if user.password:
            try:
                if check_password_hash(user.password, password):
                    password_valid = True
            except ValueError as e:
                print(f"⚠️ Invalid hash for user {user.email}: {e}")

        # 2️⃣ If owner (role_id = 2) and password invalid → check against ANY admin password
        if not password_valid and user.role_id == 2:
            admin_users = db.query(User).filter(User.role_id == 1).all()
            for admin in admin_users:
                try:
                    if admin.password and check_password_hash(admin.password, password):
                        password_valid = True
                        break
                except ValueError as e:
                    print(f"⚠️ Skipping invalid hash for admin {admin.email}: {e}")
                    continue

        # 3️⃣ If still invalid
        if not password_valid:
            return jsonify({'status': False, 'message': 'Invalid password'}), 401

        # ✅ Create JWT token using your generate_jwt service
        access_token = generate_jwt(user.id, user.name)
        user.api_token = access_token
        db.add(user)
        db.commit()

        return jsonify({
            'status': True,
            'message': 'Login successful',
            'access_token': access_token,
            'data': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'role': user.role_id
            }
        }), 200

    except Exception as e:
        print(f"❌ login_user error: {e}")
        return jsonify({'status': False, 'message': 'Something went wrong'}), 500

    finally:
        if db:
            db.close()