from flask import jsonify
from app.database import SessionLocal
from app.models.user import User
from app.models.shop import Shop
from werkzeug.security import generate_password_hash
from app.services.jwt import generate_jwt
from collections import OrderedDict

def index_owners():
    try:
        db = SessionLocal()
        owners = db.query(User).filter(User.role_id == 2).all()

        result = []
        for u in owners:
            shops_list = []
            shops = db.query(Shop).filter(Shop.owner_id == u.id).all()
            for s in shops:
                full_address = ", ".join(filter(None, [s.address, s.city, s.district, s.country]))
                shops_list.append(OrderedDict([
                    ('id', s.id),
                    ('name', s.name),
                    ('full_address', full_address)
                ]))

            result.append({
                'id': u.id,
                'name': u.name,
                'email': u.email,
                'shops': shops_list
            })

        return jsonify({
            'message': 'success',
            'data': result
        })

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'message': 'Whoops!'})

def store_new_owner_by_admin(data):
    try:
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        db = SessionLocal()

        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            return jsonify({
                'status': False,
                'message': 'Email already used by someone'
            })

        hashed_password = generate_password_hash(password, method='pbkdf2:sha256', salt_length=16)
        new_user = User(
            name=name,
            email=email,
            password=hashed_password,
            role_id=2,
            status_id=2,
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        apiToken = generate_jwt(new_user.id, name)
        new_user.set_api_token(apiToken)
        db.commit()

        return jsonify({
            'status': True,
            'message': 'Successfully owner added!',
        })

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            'status': False,
            'message': 'Whoops!'
        })

# THIS FUNCTION MUST BE TOP-LEVEL (NOT NESTED)
def get_owner(owner_id):
    try:
        db = SessionLocal()
        owner = db.query(User).filter(User.id == owner_id, User.role_id == 2).first()
        if not owner:
            return jsonify({'message': 'Owner not found'}), 404

        shops_list = []
        shops = db.query(Shop).filter(Shop.owner_id == owner.id).all()
        for s in shops:
            full_address = ", ".join(filter(None, [s.address, s.city, s.district, s.country]))
            shops_list.append({
                'id': s.id,
                'name': s.name,
                'full_address': full_address
            })

        owner_data = {
            'id': owner.id,
            'name': owner.name,
            'email': owner.email,
            'shops': shops_list
        }

        return jsonify({
            'message': 'success',
            'data': owner_data
        })

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'message': 'Whoops!'}), 500
