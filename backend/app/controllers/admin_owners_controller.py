from flask import jsonify
from app import db
from app.models import User, UserProfile
from werkzeug.security import generate_password_hash
import secrets, traceback

def store_owner_with_token(data, admin_id=1):
    try:
        owner_id = data.get('owner_id')
        name = data.get('owner_name')
        email = data.get('email')
        contact = data.get('contact')
        password = data.get('password', 'Abcd123$')
        country_code = data.get('country_code', '+94')

        if not name or not email or not contact:
            return jsonify({'status': False, 'message': 'Owner name, email, and contact are required'}), 400

        if owner_id:
            owner = User.query.filter_by(id=owner_id, role_id=2).first()
            if not owner:
                return jsonify({'status': False, 'message': 'Owner not found'}), 404
            owner.name = name
            owner.email = email
            if password:
                owner.password = generate_password_hash(password)
        else:
            existing_owner = User.query.filter_by(email=email).first()
            if existing_owner:
                return jsonify({'status': False, 'message': 'Owner with this email already exists'}), 400
            owner = User(
                name=name,
                email=email,
                password=generate_password_hash(password),
                role_id=2,
                status_id=2,
                api_token=secrets.token_urlsafe(64)
            )
            db.session.add(owner)
            db.session.flush()

        profile = UserProfile.query.filter_by(user_id=owner.id).first()
        if profile:
            profile.contact = contact
            profile.country_code = country_code
            profile.status_id = 2
        else:
            profile = UserProfile(user_id=owner.id, contact=contact, country_code=country_code, status_id=2)
            db.session.add(profile)

        db.session.commit()
        db.session.refresh(owner)

        return jsonify({'status': True, 'message': 'Owner stored successfully', 'owner_id': owner.id, 'api_token': owner.api_token}), 200

    except Exception as e:
        db.session.rollback()
        traceback.print_exc()
        return jsonify({'status': False, 'message': str(e)}), 500


def index_owners():
    try:
        owners = User.query.filter_by(role_id=2, status_id=2).all()
        data = []
        for o in owners:
            data.append({
                'id': o.id,
                'name': o.name,
                'email': o.email,
                'contact': o.profile.contact if o.profile else '',
                'country_code': o.profile.country_code if o.profile else ''
            })
        return jsonify({'status': True, 'message': 'Success', 'data': data}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({'status': False, 'message': str(e)}), 500


def get_owner(owner_id):
    try:
        owner = User.query.filter_by(id=owner_id, role_id=2).first()
        if not owner:
            return jsonify({'status': False, 'message': 'Owner not found'}), 404
        data = {
            'id': owner.id,
            'name': owner.name,
            'email': owner.email,
            'contact': owner.profile.contact if owner.profile else '',
            'country_code': owner.profile.country_code if owner.profile else ''
        }
        return jsonify({'status': True, 'message': 'Success', 'data': data}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({'status': False, 'message': str(e)}), 500


def delete_owner(owner_id):
    try:
        owner = User.query.filter_by(id=owner_id, role_id=2).first()
        if not owner:
            return jsonify({'status': False, 'message': 'Owner not found'}), 404
        db.session.delete(owner)
        db.session.commit()
        return jsonify({'status': True, 'message': 'Owner deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        traceback.print_exc()
        return jsonify({'status': False, 'message': str(e)}), 500
