from flask import request, jsonify
from app.database import SessionLocal
from app.models.shop import Shop
from app.models.user import User
import uuid
import traceback

def listShops():
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
        print(f"Error in listShops: {e}")
        return jsonify({'status': False, 'message': 'Whoops! Something went wrong'}), 500
    finally:
        db.close()

def add_shop():
    data = request.get_json()
    print("📦 Incoming shop data:", data)
    print("📦 Types:", {k: type(v) for k, v in data.items()})

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
            status_id=2  # ✅ Force status_id to 2
        )
        db.add(new_shop)
        db.commit()
        return jsonify({"message": "Shop added successfully", "token": token}), 201
    except Exception as e:
        db.rollback()
        print("❌ Error while adding shop:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

def get_owners():
    db = SessionLocal()
    try:
        owners = db.query(User.id, User.name).filter(User.role_id == 2).all()
        print("👥 Owners with role_id=2:", owners)
        return jsonify([{"id": o.id, "name": o.name} for o in owners]), 200
    except Exception as e:
        print("❌ Error fetching owners:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()