from flask import jsonify
from app.database import SessionLocal
from app.models.user import User
from werkzeug.security import generate_password_hash, check_password_hash
import traceback

def update_profile(data):
    try:
        user_id = data.get('user_id')
        name = data.get('name')
        email = data.get('email')
        current_password = data.get('currentPassword')
        new_password = data.get('newPassword')

        if not user_id or not current_password:
            return jsonify({'status': False, 'message': 'User ID and current password are required'}), 400

        db = SessionLocal()
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            db.close()
            return jsonify({'status': False, 'message': 'User not found'}), 404

        # Verify current password
        if not check_password_hash(user.password, current_password):
            db.close()
            return jsonify({'status': False, 'message': 'Current password is incorrect'}), 401

        # Update name
        if name and name != user.name:
            user.name = name

        # Update email
        if email and email != user.email:
            existing_user = db.query(User).filter(User.email == email).first()
            if existing_user:
                db.close()
                return jsonify({'status': False, 'message': 'Email already in use'}), 400
            user.email = email

        # Update password if provided
        if new_password:
            user.password = generate_password_hash(new_password, method='pbkdf2:sha256', salt_length=16)

        db.commit()
        db.close()
        return jsonify({'status': True, 'message': 'Profile updated successfully!'}), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({'status': False, 'message': 'Server error'}), 500


def get_profile(user_id):
    try:
        if not user_id:
            return jsonify({'status': False, 'message': 'user_id is required'}), 400

        db = SessionLocal()
        user = db.query(User).filter(User.id == int(user_id)).first()
        db.close()

        if not user:
            return jsonify({'status': False, 'message': 'User not found'}), 404

        return jsonify({
            'status': True,
            'id': user.id,
            'name': user.name,
            'email': user.email
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({'status': False, 'message': 'Server error'}), 500
