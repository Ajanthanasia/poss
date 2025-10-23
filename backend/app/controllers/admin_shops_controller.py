from flask import jsonify, request
from app.database import SessionLocal
from app.models.shop import Shop
from app.models.user import User
import uuid, traceback
from sqlalchemy.orm import joinedload

# -------------------- Shops --------------------

def list_shops():
    db = SessionLocal()
    try:
        shopData = db.query(Shop).all()
        shops = []
        for shop in shopData:
            shop_dict = shop.to_dict()
            full_address = f"{shop.address}, {shop.city}, {shop.district}, {shop.country}"
            shop_dict["full_address"] = full_address
            shops.append(shop_dict)
        return jsonify({'status': True, 'data': shops}), 200
    except Exception as e:
        print(f"Error in list_shops: {e}")
        return jsonify({'status': False, 'message': 'Whoops! Something went wrong'}), 500
    finally:
        db.close()


def add_shop(data):
    db = SessionLocal()
    try:
        token = str(uuid.uuid4())
        new_shop = Shop(
            owner_id=int(data["owner_id"]),
            name=data.get("name"),
            email=data.get("email"),
            token=token,
            address=data.get("address"),
            city=data.get("city"),
            district=data.get("district"),
            country=data.get("country"),
            status_id=2  # 2 means active
        )
        db.add(new_shop)
        db.commit()
        db.refresh(new_shop)
        return jsonify({"status": True, "message": "Shop added successfully", "shop_id": new_shop.id, "token": token}), 201
    except Exception as e:
        db.rollback()
        traceback.print_exc()
        return jsonify({'status': False, 'message': str(e)}), 500
    finally:
        db.close()


def get_shop_by_id(shop_id):
    db = SessionLocal()
    try:
        shop = db.query(Shop).options(joinedload(Shop.owner)).filter(Shop.id == shop_id).first()
        if not shop:
            return jsonify({'status': False, 'message': 'Shop not found'}), 404

        data = {
            "id": shop.id,
            "name": shop.name,
            "email": shop.email,
            "location": f"{shop.address}, {shop.city}, {shop.district}, {shop.country}",
            "owner": shop.owner.name if shop.owner else "Unknown",
            "status_id": shop.status_id,
            "status": "active" if shop.status_id == 2 else "inactive"
        }

        return jsonify({'status': True, 'message': 'Success', 'data': data}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({'status': False, 'message': str(e)}), 500
    finally:
        db.close()


def update_shop(shop_id, data):
    db = SessionLocal()
    try:
        shop = db.query(Shop).filter(Shop.id == shop_id).first()
        if not shop:
            return jsonify({'status': False, 'message': 'Shop not found'}), 404

        for key in ["owner_id", "name", "email", "address", "city", "district", "country", "status_id"]:
            if key in data:
                setattr(shop, key, data[key])

        db.commit()
        return jsonify({'status': True, 'message': 'Shop updated successfully'}), 200
    except Exception as e:
        db.rollback()
        traceback.print_exc()
        return jsonify({'status': False, 'message': str(e)}), 500
    finally:
        db.close()


def delete_shop(shop_id):
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
        return jsonify({'status': False, 'message': str(e)}), 500
    finally:
        db.close()


def search_shops(name_query=''):
    db = SessionLocal()
    try:
        query = db.query(Shop).options(joinedload(Shop.owner))
        if name_query:
            query = query.filter(Shop.name.ilike(f"%{name_query}%"))
        shops = query.all()

        data = []
        for s in shops:
            data.append({
                "id": s.id,
                "name": s.name,
                "email": s.email,
                "location": f"{s.address}, {s.city}, {s.district}, {s.country}",
                "owner": s.owner.name if s.owner else "Unknown",
                "status": "active" if s.status_id == 2 else "inactive"
            })
        return jsonify(data), 200  # Return plain array like get_owners_list
    except Exception as e:
        traceback.print_exc()
        return jsonify({'status': False, 'message': str(e)}), 500
    finally:
        db.close()


def get_owners_list():
    db = SessionLocal()
    try:
        owners = db.query(User).filter(User.role_id == 2, User.status_id == 2).all()
        data = [{"id": o.id, "name": o.name} for o in owners]
        return jsonify(data), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({'status': False, 'message': str(e)}), 500
    finally:
        db.close()


def get_shops_by_owner(owner_id):
    db = SessionLocal()
    try:
        shops = db.query(Shop).filter(Shop.owner_id == owner_id).all()
        data = [
            {
                "id": shop.id,
                "name": shop.name,
                "email": shop.email,
                "address": shop.address,
                "city": shop.city,
                "district": shop.district,
                "country": shop.country,
                "status_id": shop.status_id,
                "status": "active" if shop.status_id == 2 else "inactive"
            }
            for shop in shops
        ]
        return jsonify(data), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({'status': False, 'message': str(e)}), 500
    finally:
        db.close()


# -------------------- New function --------------------
def update_shop_status(shop_id):
    db = SessionLocal()
    try:
        shop = db.query(Shop).filter(Shop.id == shop_id).first()
        if not shop:
            return jsonify({"status": False, "error": "Shop not found"}), 404

        if shop.status_id == 1:  # Pending
            shop.status_id = 2  # Active
            db.commit()
            return jsonify({
                "status": True,
                "message": "Shop status updated successfully",
                "shop": shop.to_dict()
            }), 200
        else:
            return jsonify({
                "status": False,
                "error": "Shop is not in pending status"
            }), 400
    except Exception as e:
        db.rollback()
        traceback.print_exc()
        return jsonify({"status": False, "error": str(e)}), 500
    finally:
        db.close()
