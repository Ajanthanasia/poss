from flask import jsonify
from app.database import SessionLocal
import uuid
from app.models.shop import Shop

def storeShopByAdmin(data):
    db = SessionLocal()
    try:
        name = data.get('name')
        owner_id = data.get('owner_id')
        email = data.get('email')
        address = data.get('address')
        city = data.get('city')
        district = data.get('district')
        country = data.get('country')

        # Validate required fields
        if not all([name, owner_id, email, address]):
            return jsonify({'status': False, 'message': 'Missing required fields'}), 400

        new_shop = Shop(
            owner_id=owner_id,
            name=name,
            email=email,
            token=str(uuid.uuid4()),
            address=address,
            city=city,
            district=district,
            country=country,
            status_id=2
        )

        db.add(new_shop)
        db.commit()
        db.refresh(new_shop)  # to get the ID

        return jsonify({
            'status': True,
            'message': 'Shop added successfully!',
            'shop_id': new_shop.id
        }), 201

    except Exception as e:
        db.rollback()
        print(f"Error in storeShopByAdmin: {e}")
        return jsonify({'status': False, 'message': 'Whoops! Something went wrong'}), 500

    finally:
        db.close()
