from flask import Blueprint, request, jsonify
from app.middlewares.auth_middleware import auth_middleware
from app.controllers.shop_controller import get_owners
from app.controllers import products_controller
from app.controllers.owner_shop_controller import test, add_shop
from app.controllers.shop_controller import list_shops
import traceback

# Define ONE blueprint
ownerRoute = Blueprint('owner', __name__, url_prefix='/api/owns')

# Example routes
@ownerRoute.route('/test', methods=['GET'])
@auth_middleware
def test_route():
    try:
        response = test()
        return jsonify(response), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({'success': False, 'message': str(e)}), 500

@ownerRoute.route('/shops', methods=['GET'])
@auth_middleware
def get_the_list_of_shops_for_owner():
    try:
        response = list_shops()
        return jsonify(response), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({'success': False, 'message': str(e)}), 500

@ownerRoute.route('/add-shop', methods=['POST'])
@auth_middleware
def add_shop_route():
    try:
        response = add_shop()
        return response
    except Exception as e:
        traceback.print_exc()
        return jsonify({'status': False, 'message': str(e)}), 500

# ✅ Products CRUD routes
@ownerRoute.route('/products', methods=['POST'])
@auth_middleware
def create_product_route():
    return products_controller.create_product()

@ownerRoute.route('/products', methods=['GET'])
@auth_middleware
def get_products_route():
    return products_controller.get_products()

@ownerRoute.route('/products/<int:product_id>', methods=['GET'])
@auth_middleware
def get_product_route(product_id):
    return products_controller.get_product(product_id)

@ownerRoute.route('/products/<int:product_id>', methods=['PUT'])
@auth_middleware
def update_product_route(product_id):
    return products_controller.update_product(product_id)

@ownerRoute.route('/products/<int:product_id>', methods=['DELETE'])
@auth_middleware
def delete_product_route(product_id):
    return products_controller.delete_product(product_id)