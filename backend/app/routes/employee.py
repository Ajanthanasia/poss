from flask import Blueprint, request, jsonify
from app.middlewares.auth_middleware import auth_middleware
from app.controllers.employee_controller import (
    index_employees,
    get_employee,
    store_employee_with_token,
    delete_employee,
    search_employees,
    update_employee   # <-- new import
)
import traceback

# don't use this we need to delete it in future

employeeRoute = Blueprint('employee', __name__, url_prefix='/api/employees')


@employeeRoute.route('/', methods=['POST'])
@auth_middleware
def create_employee_route():
    try:
        data = request.json
        response = store_employee_with_token(data)
        return response
    except Exception as e:
        traceback.print_exc()
        return jsonify({'status': False, 'message': str(e)}), 500


@employeeRoute.route('/', methods=['GET'])
@auth_middleware
def list_employees_route():
    try:
        response = index_employees()
        return response
    except Exception as e:
        traceback.print_exc()
        return jsonify({'status': False, 'message': str(e)}), 500


@employeeRoute.route('/<int:employee_id>', methods=['GET'])
@auth_middleware
def get_employee_route(employee_id):
    try:
        response = get_employee(employee_id)
        return response
    except Exception as e:
        traceback.print_exc()
        return jsonify({'status': False, 'message': str(e)}), 500


@employeeRoute.route('/<int:employee_id>', methods=['PUT'])
@auth_middleware
def update_employee_route(employee_id):
    try:
        data = request.json
        response = update_employee(employee_id, data)
        return response
    except Exception as e:
        traceback.print_exc()
        return jsonify({'status': False, 'message': str(e)}), 500


@employeeRoute.route('/<int:employee_id>', methods=['DELETE'])
@auth_middleware
def delete_employee_route(employee_id):
    try:
        response = delete_employee(employee_id)
        return response
    except Exception as e:
        traceback.print_exc()
        return jsonify({'status': False, 'message': str(e)}), 500


@employeeRoute.route('/search', methods=['GET'])
@auth_middleware
def search_employees_route():
    try:
        response = search_employees()
        return response
    except Exception as e:
        traceback.print_exc()
        return jsonify({'status': False, 'message': str(e)}), 500
