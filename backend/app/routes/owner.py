from flask import Blueprint, request, jsonify
from app.controllers.admin_owners_controller import (
    index_owners,
    get_owner,
    store_owner_with_token,
    delete_owner
)
from app.controllers.shop_controller import get_owners
import traceback

ownerRoute = Blueprint('owner', __name__, url_prefix='/api')  # same prefix as before

# ----------------- OWNER ROUTES -----------------
@ownerRoute.route('/index-owners', methods=['GET'])
def indexOfOwnersList():
    return index_owners()

@ownerRoute.route('/index-owners/<int:owner_id>', methods=['GET'])
def indexOwnerDetails(owner_id):
    return get_owner(owner_id)

@ownerRoute.route('/store-owner', methods=['POST'])
def storeOwnerByAdmin():
    try:
        data = request.get_json()
        return store_owner_with_token(data)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Failed to create owner"}), 500

@ownerRoute.route('/delete-owner/<int:owner_id>', methods=['DELETE'])
def deleteOwnerRoute(owner_id):
    try:
        return delete_owner(owner_id)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Failed to delete owner"}), 500

@ownerRoute.route('/shop/owners', methods=['GET'])
def getOwnersList():
    try:
        return get_owners()
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Failed to fetch shop owners"}), 500
