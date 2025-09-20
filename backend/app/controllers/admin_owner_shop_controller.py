from flask import jsonify
from app.database import SessionLocal
from app.models.user import User
from app.models.shop import Shop
from werkzeug.security import generate_password_hash
import uuid
def store_owner_and_shop(data, admin_id):
    db = SessionLocal()
    try:
        owner_name = data.get('owner_name')
        email = data.get('email')
        contact = data.get('contact')
        password = data.get('password', 'defaultpassword')

        if not all([owner_name, email, contact, data.get('shop_name'), data.get('shop_address')]):
            return jsonify({'status': False, 'message': 'All fields are required'}), 400

        # Check if owner exists
        owner = db.query(User).filter(User.id == data.get('owner_id')).first()
        if owner:
            # Update existing owner info
            owner.name = owner_name
            owner.email = email
            owner.contact = contact
        else:
            # Create new owner
            owner = User(
                name=owner_name,
                email=email,
                contact=contact,
                password=generate_password_hash(password),
                role_id=2,
                status_id=2
            )
            db.add(owner)
            db.flush()  # Get owner.id before commit

        # Check if shop exists for this owner
        shop = db.query(Shop).filter(Shop.owner_id == owner.id).first()
        if shop:
            shop.name = data.get('shop_name')
            shop.address = data.get('shop_address')
        else:
            shop = Shop(
                owner_id=owner.id,
                name=data.get('shop_name'),
                email=email,
                address=data.get('shop_address'),
                status_id=2,
                token=str(uuid.uuid4()),
                creator_id=admin_id
            )
            db.add(shop)

        db.commit()
        db.refresh(owner)
        db.refresh(shop)

        return jsonify({
            'status': True,
            'message': 'Owner and Shop updated successfully!',
            'owner_id': owner.id,
            'shop_id': shop.id
        }), 200

    except Exception as e:
        db.rollback()
        return jsonify({'status': False, 'message': str(e)}), 500
    finally:
        db.close()
