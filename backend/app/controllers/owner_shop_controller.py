from flask import request, jsonify, g
from app import db
from app.models.shop import Shop
from app.models.user import User
import uuid

def test():
    auth = g.auth_user
    return {
        'status': True,
        'message': 'Testing!!!',
        'user': {
            'id': auth.id,
            'name': auth.name,
            'email': auth.email
        }
    }

def add_shop():
    try:
        auth = g.auth_user
        data = request.get_json()

        # Validate required fields
        if not data.get("shopName"):
            return jsonify({"status": False, "error": "Shop name is required"}), 400
        
        if not data.get("email"):
            return jsonify({"status": False, "error": "Email is required"}), 400

        # Create new shop with authenticated user's ID as owner_id
        new_shop = Shop(
            owner_id=auth.id,  # Use authenticated user's ID
            name=data.get("shopName"),
            email=data.get("email"),
            address=data.get("address"),
            city=data.get("city"),
            district=data.get("district"),
            country=data.get("country"),
            status_id=1,  # Set status_id to 1
            token=str(uuid.uuid4()),
            creator_id=auth.id # set creator id to authenticated user id
        )

        db.session.add(new_shop)
        db.session.commit()
        
        return jsonify({
            "status": True,
            "message": "Shop added successfully",
            "shop": new_shop.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": False, "error": str(e)}), 500