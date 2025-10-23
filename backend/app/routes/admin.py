from flask import Blueprint, request
from app.controllers.admin_shops_controller import (
    list_shops, add_shop, get_shop_by_id, update_shop, delete_shop, search_shops, get_owners_list, update_shop_status
)
from app.controllers.admin_owners_controller import (
    index_owners, get_owner, store_owner_with_token, delete_owner
)
from app.controllers.login_controller import register_admin, login_user
from app.controllers.profile_controller import update_profile, get_profile

adminRoute = Blueprint('admin', __name__, url_prefix='/api')

# ----------------- AUTH -----------------
@adminRoute.route('/signup', methods=['POST'])
def signup():
    return register_admin(request.get_json())

@adminRoute.route('/login', methods=['POST'])
def login():
    return login_user(request.get_json())

# ----------------- PROFILE -----------------
@adminRoute.route('/profile/update', methods=['POST'])
def profile_update():
    return update_profile(request.get_json())

@adminRoute.route('/profile', methods=['GET'])
def profile_get():
    user_id = request.args.get('user_id')
    return get_profile(user_id)

# ----------------- SHOPS -----------------
@adminRoute.route('/shop/list', methods=['GET'])
def route_list_shops(): return list_shops()

@adminRoute.route('/shop/add', methods=['POST'])
def route_add_shop(): return add_shop(request.get_json())

@adminRoute.route('/shop/<int:shop_id>', methods=['GET'])
def route_get_shop(shop_id): return get_shop_by_id(shop_id)

@adminRoute.route('/shop/update/<int:shop_id>', methods=['PUT'])
def route_update_shop(shop_id): return update_shop(shop_id, request.get_json())

@adminRoute.route('/shop/delete/<int:shop_id>', methods=['DELETE'])
def route_delete_shop(shop_id): return delete_shop(shop_id)

@adminRoute.route('/shop/search', methods=['GET'])
def route_search_shops():
    name_query = request.args.get('name', '')
    return search_shops(name_query)

@adminRoute.route('/shop/owners', methods=['GET'])
def route_get_owners_list(): return get_owners_list()

@adminRoute.route('/shop/owner/<int:owner_id>', methods=['GET'])
def route_get_shops_by_owner(owner_id):
    from app.controllers.admin_shops_controller import get_shops_by_owner
    return get_shops_by_owner(owner_id)

@adminRoute.route('/shop/update-status/<int:shop_id>', methods=['PUT'])
def update_status_route(shop_id):
    try:
        response = update_shop_status(shop_id)
        return response
    except Exception as e:
        traceback.print_exc()
        return jsonify({'status': False, 'message': str(e)}), 500

# ----------------- OWNERS -----------------
@adminRoute.route('/owners', methods=['GET'])
def route_index_owners(): 
    return index_owners()

@adminRoute.route('/index-owners', methods=['GET'])
def route_index_owners_alias(): 
    return index_owners()

@adminRoute.route('/owners/<int:owner_id>', methods=['GET'])
def route_get_owner(owner_id): 
    return get_owner(owner_id)

@adminRoute.route('/owners/add', methods=['POST'])
def route_store_owner(): 
    return store_owner_with_token(request.get_json())

@adminRoute.route('/store-owner', methods=['POST'])
def route_store_owner_frontend(): 
    return store_owner_with_token(request.get_json())

@adminRoute.route('/delete-owner/<int:owner_id>', methods=['DELETE'])
def route_delete_owner_frontend(owner_id):
    return delete_owner(owner_id)
