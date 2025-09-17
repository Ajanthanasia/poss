from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from app.controllers.admin_owners_controller import store_new_owner_by_admin, index_owners, get_owner
from app.controllers.admin_shops_controller import storeShopByAdmin
from app.controllers.profile_controller import update_profile
from app.controllers.login_controller import register_admin, login_user
import traceback
import secrets  # to generate random token
import uuid
from app.controllers.admin_owner_shop_controller import store_owner_and_shop
from app.controllers.admin_owners_controller import store_new_owner_by_admin, index_owners, get_owner, delete_owner


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
    return update_profile(data)

# ----------------- OWNER ROUTES -----------------
@adminRoute.route('/index-owners', methods=['GET'])
def indexOfOwnersList():
    return index_owners()

@adminRoute.route('/index-owners/<int:owner_id>', methods=['GET'])
def indexOwnerDetails(owner_id):
    return get_owner(owner_id)

@adminRoute.route('/store-owner', methods=['POST'])
def storeOwnerByAdmin():
    data = request.get_json()
    return store_new_owner_by_admin(data)

@adminRoute.route('/delete-owner/<int:owner_id>', methods=['DELETE'])
@jwt_required()
def deleteOwnerRoute(owner_id):
    return delete_owner(owner_id)
  

@adminRoute.route('/store-shop', methods=['POST'])
@jwt_required()
def storeShopByAdminDef():
    admin_id = int(get_jwt_identity())
    data = request.get_json()
    return storeShopByAdmin(data, admin_id)

@adminRoute.route('/store-owner-shop', methods=['POST'])
@jwt_required()
def storeOwnerAndShop():
    from flask_jwt_extended import get_jwt_identity
    admin_id = int(get_jwt_identity())
    data = request.get_json()
    return store_owner_and_shop(data, admin_id)
