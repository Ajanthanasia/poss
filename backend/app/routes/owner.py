from flask import Blueprint, request, jsonify
from app.middlewares.auth_middleware import auth_middleware
from app.controllers.admin_owners_controller import (
    index_owners,
    get_owner,
    store_owner_with_token,
    delete_owner
)
from app.controllers.shop_controller import get_owners
from app.controllers.owner_shop_controller import test
import traceback

ownerRoute = Blueprint('owner', __name__, url_prefix='/api/owns')  # same prefix as before


@ownerRoute.route('/test', methods=['GET'])
@auth_middleware
def test_route():
    try:
        response = test()
        return jsonify(response), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({'success': False, 'message': str(e)}), 500