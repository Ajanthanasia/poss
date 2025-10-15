from flask import jsonify
from app.database import SessionLocal
from app.models.shop import Shop
from sqlalchemy.orm import joinedload
import traceback
import uuid

# -------------------- Create New Shop --------------------
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
        db.refresh(new_shop)

        return jsonify({
            'status': True,
            'message': 'Shop added successfully!',
            'shop_id': new_shop.id
        }), 201

    except Exception as e:
        db.rollback()
        print(f"Error in storeShopByAdmin: {e}")
        return jsonify({'status': False, 'message': 'Something went wrong'}), 500
    finally:
        db.close()


# -------------------- List All Shops --------------------
def listShops():
    db = SessionLocal()
    try:
        shops = db.query(Shop).all()
        return jsonify({'status': True, 'data': [shop.to_dict() for shop in shops]}), 200
    except Exception as e:
        print(f"Error in listShops: {e}")
        return jsonify({'status': False, 'message': 'Something went wrong'}), 500
    finally:
        db.close()


# -------------------- Get Shops by Owner --------------------
def getShopsByOwner(owner_id):
    db = SessionLocal()
    try:
        shops = db.query(Shop).filter(Shop.owner_id == owner_id, Shop.status_id == 2).all()
        return jsonify({'status': True, 'data': [shop.to_dict() for shop in shops]}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({'status': False, 'message': 'Failed to fetch owner shops'}), 500
    finally:
        db.close()


# -------------------- Delete Shop --------------------
def deleteShopByAdmin(shop_id):
    db = SessionLocal()
    try:
        shop = db.query(Shop).filter(Shop.id == shop_id).first()
        if not shop:
            return jsonify({'status': False, 'message': 'Shop not found'}), 404

        db.delete(shop)
        db.commit()
        return jsonify({'status': True, 'message': 'Shop deleted successfully'}), 200
    except Exception as e:
        db.rollback()
        traceback.print_exc()
        return jsonify({'status': False, 'message': 'Failed to delete shop'}), 500
    finally:
        db.close()


# -------------------- Get Shop Details --------------------
def getShopDetails(shop_id):
    db = SessionLocal()
    try:
        shop = db.query(Shop).filter(Shop.id == shop_id).first()
        if not shop:
            return jsonify({'status': False, 'message': 'Shop not found'}), 404
        return jsonify({'status': True, 'data': shop.to_dict()}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({'status': False, 'message': 'Failed to fetch shop'}), 500
    finally:
        db.close()


# -------------------- Update Shop --------------------
def updateShopByAdmin(shop_id, data):
    db = SessionLocal()
    try:
        shop = db.query(Shop).filter(Shop.id == shop_id).first()
        if not shop:
            return jsonify({'status': False, 'message': 'Shop not found'}), 404

        # Update fields dynamically
        for field in ['owner_id', 'name', 'email', 'address', 'city', 'district', 'country']:
            if field in data:
                setattr(shop, field, data[field])

        db.commit()
        db.refresh(shop)
        return jsonify({'status': True, 'message': 'Shop updated successfully'}), 200
    except Exception as e:
        db.rollback()
        traceback.print_exc()
        return jsonify({'status': False, 'message': 'Failed to update shop'}), 500
    finally:
        db.close()


# -------------------- Search Shops --------------------
def searchShopsByName(name_query):
    db = SessionLocal()
    try:
        query = db.query(Shop).options(joinedload(Shop.owner))
        if name_query:
            query = query.filter(Shop.name.ilike(f"%{name_query}%"))

        shops = query.all()
        shop_list = [
            {
                "id": shop.id,
                "name": shop.name,
                "email": shop.email,
                "location": f"{shop.address}, {shop.city}, {shop.district}, {shop.country}",
                "owner": shop.owner.name if shop.owner else "Unknown"
            }
            for shop in shops
        ]
        return jsonify({'status': True, 'data': shop_list}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({'status': False, 'message': 'Search failed'}), 500
    finally:
        db.close()
