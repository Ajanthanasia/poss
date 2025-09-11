from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash
from app.database import SessionLocal  # your SQLAlchemy session factory
from app.models.user import User
from app.controllers.login_controller import register_admin, login_user
from app.controllers.admin_owners_controller import (
    store_new_owner_by_admin,
    index_owners,
    get_owner
)
from app.controllers.admin_shops_controller import storeShopByAdmin
from app.controllers.profile_controller import update_profile

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
@adminRoute.route('/store-owner', methods=['POST'])
def storeOwnerByAdmin():
    data = request.get_json()
    return store_new_owner_by_admin(data)

@adminRoute.route('/index-owners', methods=['GET'])
def indexOfOwnersList():
    return index_owners()  # Returns all owners

@adminRoute.route('/index-owners/<int:owner_id>', methods=['GET'])
def indexOwnerDetails(owner_id):
    return get_owner(owner_id)  # Returns a specific owner by ID

# ----------------- SHOP ROUTES -----------------
@adminRoute.route('/store-shop', methods=['POST'])
def storeShopByAdminDef():
    data = request.get_json()
    return storeShopByAdmin(data)
