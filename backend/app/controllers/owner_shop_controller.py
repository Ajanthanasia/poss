from flask import request, jsonify, g
from app import db
from app.models.shop import Shop
from app.models.user import User  # Assuming owner is a User
import uuid

def test():
    auth = g.auth_user
    return {
        'status': True,
        'message':'Testing!!!',
        'user': auth.id,
        'user': auth.name
    }

def add_shop():
    data = request.get_json()

    # Validate required fields
    if not data.get("name"):
        return jsonify({"error": "Shop name is required"}), 400

    # Dummy owner_id for now (replace with actual logic later)
    dummy_owner_id = 1

    new_shop = Shop(
        owner_id=dummy_owner_id,
        name=data.get("name"),
        email=data.get("email"),
        address=data.get("address"),
        city=data.get("city"),
        district=data.get("district"),
        country=data.get("country"),
        status_id=1,
        token=str(uuid.uuid4())
    )

    try:
        db.session.add(new_shop)
        db.session.commit()
        return jsonify({"message": "Shop added successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500