from flask import Blueprint, request, jsonify
from app.controllers.shop_controller import get_owners, add_shop
from app.controllers.admin_owners_controller import (
    index_owners,
    get_owner,
    store_owner_with_token,
    delete_owner
)
from app.controllers.profile_controller import update_profile
from app.controllers.login_controller import register_admin, login_user
from app.controllers.admin_shops_controller import storeShopByAdmin, listShops
from app.database import SessionLocal
from sqlalchemy.orm import joinedload
from app.models.user import User
import traceback

adminRoute = Blueprint('admin', __name__, url_prefix='/api')

# ----------------- AUTH ROUTES -----------------
@adminRoute.route('/signup', methods=['POST'])
def signupFunc():
    data = request.get_json()
    return register_admin(data)


@adminRoute.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    return login_user(data)


@adminRoute.route('/profile/update', methods=['POST'])
def updateProfile():
    data = request.get_json()
    user_id = data.get('user_id')
    data['user_id'] = user_id
    return update_profile(data)


@adminRoute.route('/profile', methods=['GET'])
def get_profile():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'success': False, 'message': 'user_id is required'}), 400

    db = SessionLocal()
    user = db.query(User).filter(User.id == int(user_id)).first()
    db.close()

    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404

    return jsonify({
        'success': True,
        'id': user.id,
        'name': user.name,
        'email': user.email
    })


# ----------------- SHOP ROUTES -----------------
@adminRoute.route('/shop/owner/<int:owner_id>', methods=['GET'])
def get_shops_by_owner(owner_id):
    """Fetch active shops (status_id = 2) for a given owner"""
    try:
        from app.models.shop import Shop
        db = SessionLocal()
        shops = db.query(Shop).filter(Shop.owner_id == owner_id, Shop.status_id == 2).all()

        shop_list = [
            {
                "id": shop.id,
                "name": shop.name,
                "email": shop.email,
                "address": shop.address,
                "city": shop.city,
                "district": shop.district,
                "country": shop.country,
            }
            for shop in shops
        ]

        db.close()
        return jsonify(shop_list), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Failed to fetch owner shops"}), 500


@adminRoute.route('/shop/delete/<int:shop_id>', methods=['DELETE'])
def delete_shop(shop_id):
    try:
        from app.models.shop import Shop
        db = SessionLocal()
        shop = db.query(Shop).filter(Shop.id == shop_id).first()

        if not shop:
            db.close()
            return jsonify({"error": "Shop not found"}), 404

        db.delete(shop)
        db.commit()
        db.close()
        return jsonify({"success": True}), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Failed to delete shop"}), 500


@adminRoute.route('/shop/<int:shop_id>', methods=['GET'])
def get_shop(shop_id):
    try:
        from app.models.shop import Shop
        db = SessionLocal()
        shop = db.query(Shop).filter(Shop.id == shop_id).first()

        if not shop:
            db.close()
            return jsonify({"error": "Shop not found"}), 404

        shop_data = shop.to_dict()
        db.close()
        return jsonify(shop_data), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Failed to fetch shop"}), 500


@adminRoute.route('/shop/update/<int:shop_id>', methods=['PUT'])
def update_shop(shop_id):
    try:
        from app.models.shop import Shop
        db = SessionLocal()
        data = request.get_json()
        shop = db.query(Shop).filter(Shop.id == shop_id).first()

        if not shop:
            db.close()
            return jsonify({"error": "Shop not found"}), 404

        shop.owner_id = data.get("owner_id", shop.owner_id)
        shop.name = data.get("name", shop.name)
        shop.email = data.get("email", shop.email)
        shop.address = data.get("address", shop.address)
        shop.city = data.get("city", shop.city)
        shop.district = data.get("district", shop.district)
        shop.country = data.get("country", shop.country)

        db.commit()
        db.close()
        return jsonify({"success": True}), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Failed to update shop"}), 500


@adminRoute.route('/shop/search', methods=['GET'])
def search_shops():
    try:
        from app.models.shop import Shop
        db = SessionLocal()
        name_query = request.args.get('name', '').strip()
        query = db.query(Shop).options(joinedload(Shop.owner))

        if name_query:
            query = query.filter(Shop.name.ilike(f"%{name_query}%"))

        shops = query.all()
        db.close()

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

        return jsonify(shop_list), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Search failed"}), 500

# ----------------- OWNER ROUTES -----------------
@adminRoute.route('/index-owners', methods=['GET'])
def indexOfOwnersList():
    return index_owners()

@adminRoute.route('/index-owners/<int:owner_id>', methods=['GET'])
def indexOwnerDetails(owner_id):
    return get_owner(owner_id)

@adminRoute.route('/store-owner', methods=['POST'])
def storeOwnerByAdmin():
    try:
        data = request.get_json()
        return store_owner_with_token(data)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Failed to create owner"}), 500

@adminRoute.route('/delete-owner/<int:owner_id>', methods=['DELETE'])
def deleteOwnerRoute(owner_id):
    try:
        return delete_owner(owner_id)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Failed to delete owner"}), 500

@adminRoute.route('/shop/owners', methods=['GET'])
def getOwnersList():
    try:
        return get_owners()
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Failed to fetch shop owners"}), 500

@adminRoute.route('/shop/list', methods=['GET'])
def getlistOfShops():
    try:
        return listShops()
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Failed to fetch shops"}), 500