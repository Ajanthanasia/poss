from flask import Blueprint, request, jsonify
from app.controllers.admin_owners_controller import (
    index_owners,
    get_owner,
    store_owner_with_token,
    delete_owner
)
from app.controllers.profile_controller import update_profile
from app.controllers.login_controller import register_admin, login_user
from app.database import SessionLocal
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
# No JWT middleware
def updateProfile():
    data = request.get_json()
    user_id = data.get('user_id')  # Assuming you send user_id in request
    data['user_id'] = user_id
    return update_profile(data)

@adminRoute.route('/profile', methods=['GET'])
# No JWT middleware
def get_profile():
    user_id = request.args.get('user_id')  # Pass user_id as query param
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


# ----------------- OWNER ROUTES -----------------

# List all owners
@adminRoute.route('/index-owners', methods=['GET'])
def indexOfOwnersList():
    return index_owners()

# Get a specific owner by ID
@adminRoute.route('/index-owners/<int:owner_id>', methods=['GET'])
def indexOwnerDetails(owner_id):
    return get_owner(owner_id)

# Store a new owner (or update existing) with API token
@adminRoute.route('/store-owner', methods=['POST'])
def storeOwnerByAdmin():
    data = request.get_json()
    return store_owner_with_token(data)

# Delete an owner
@adminRoute.route('/delete-owner/<int:owner_id>', methods=['DELETE'])
def deleteOwnerRoute(owner_id):
    return delete_owner(owner_id)
