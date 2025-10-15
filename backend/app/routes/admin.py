from flask import Blueprint, request
from app.controllers.login_controller import register_admin, login_user
from app.controllers.profile_controller import update_profile
from app.controllers.admin_owners_controller import (
    index_owners, get_owner, store_owner_with_token, delete_owner
)
from app.controllers.admin_shops_controller import (
    storeShopByAdmin, listShops, getShopsByOwner,
    getShopDetails, deleteShopByAdmin, updateShopByAdmin, searchShopsByName
)
from app.controllers.shop_controller import get_owners

adminRoute = Blueprint('admin', __name__, url_prefix='/api')

# ---------- AUTH ----------
@adminRoute.route('/signup', methods=['POST'])
def signupFunc():
    return register_admin(request.get_json())

@adminRoute.route('/login', methods=['POST'])
def login():
    return login_user(request.get_json())

# ---------- PROFILE ----------
@adminRoute.route('/profile/update', methods=['POST'])
def updateProfile():
    return update_profile(request.get_json())

# ---------- OWNER ----------
@adminRoute.route('/index-owners', methods=['GET'])
def ownersList():
    return index_owners()

@adminRoute.route('/index-owners/<int:owner_id>', methods=['GET'])
def ownerDetails(owner_id):
    return get_owner(owner_id)

@adminRoute.route('/store-owner', methods=['POST'])
def storeOwner():
    return store_owner_with_token(request.get_json())

@adminRoute.route('/delete-owner/<int:owner_id>', methods=['DELETE'])
def deleteOwner(owner_id):
    return delete_owner(owner_id)

# ---------- SHOP ----------
@adminRoute.route('/shop/owner/<int:owner_id>', methods=['GET'])
def getShops(owner_id):
    return getShopsByOwner(owner_id)

@adminRoute.route('/shop/<int:shop_id>', methods=['GET'])
def viewShop(shop_id):
    return getShopDetails(shop_id)

@adminRoute.route('/shop/delete/<int:shop_id>', methods=['DELETE'])
def deleteShop(shop_id):
    return deleteShopByAdmin(shop_id)

@adminRoute.route('/shop/update/<int:shop_id>', methods=['PUT'])
def updateShop(shop_id):
    return updateShopByAdmin(shop_id, request.get_json())

@adminRoute.route('/shop/search', methods=['GET'])
def searchShops():
    return searchShopsByName(request.args.get('name', ''))

@adminRoute.route('/shop/list', methods=['GET'])
def allShops():
    return listShops()

@adminRoute.route('/shop/owners', methods=['GET'])
def allShopOwners():
    return get_owners()

@adminRoute.route('/shop/add', methods=['POST'])
def storeShop():
    return storeShopByAdmin(request.get_json())
