from flask import jsonify, request
from app import db
from app.models import User, UserProfile
from werkzeug.security import generate_password_hash
import secrets, traceback
from app.database import SessionLocal

def store_employee_with_token(data, admin_id=1):
    try:
        employee_id = data.get('employee_id')
        name = data.get('employee_name')
        email = data.get('email')
        contact = data.get('contact')
        password = data.get('password', 'Abcd123$')
        country_code = data.get('country_code', '+94')

        if not name or not email or not contact:
            return jsonify({'status': False, 'message': 'Employee name, email, and contact are required'}), 400

        if employee_id:
            employee = User.query.filter_by(id=employee_id, role_id=3).first()
            if not employee:
                return jsonify({'status': False, 'message': 'Employee not found'}), 404
            employee.name = name
            employee.email = email
            if password:
                employee.password = generate_password_hash(password, method='pbkdf2:sha256', salt_length=16)
        else:
            existing_employee = User.query.filter_by(email=email).first()
            if existing_employee:
                return jsonify({'status': False, 'message': 'Employee with this email already exists'}), 400
            hashed_password = generate_password_hash(password, method='pbkdf2:sha256', salt_length=16)

            # Generate a safe-length token (~80 chars, fits in VARCHAR(255))
            api_token = secrets.token_urlsafe(60)  # ~80 characters

            employee = User(
                name=name,
                email=email,
                password=hashed_password,
                role_id=3,
                status_id=2,
                api_token=api_token
            )
            db.session.add(employee)
            db.session.flush()

        profile = UserProfile.query.filter_by(user_id=employee.id).first()
        if profile:
            profile.contact = contact
            profile.country_code = country_code
            profile.status_id = 2
        else:
            profile = UserProfile(
                user_id=employee.id,
                contact=contact,
                country_code=country_code,
                status_id=2
            )
            db.session.add(profile)

        db.session.commit()
        db.session.refresh(employee)

        return jsonify({
            'status': True,
            'message': 'Employee stored successfully',
            'employee_id': employee.id,
            'api_token': employee.api_token
        }), 200

    except Exception as e:
        db.session.rollback()
        traceback.print_exc()
        return jsonify({'status': False, 'message': str(e)}), 500

def index_employees():
    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))

        employees_query = User.query.filter_by(role_id=3, status_id=2)
        employees = employees_query.paginate(page=page, per_page=per_page, error_out=False)

        data = [{
            'id': e.id,
            'name': e.name,
            'email': e.email,
            'contact': e.profile.contact if e.profile else '',
            'country_code': e.profile.country_code if e.profile else ''
        } for e in employees.items]

        return jsonify({
            'status': True,
            'message': 'Success',
            'data': data,
            'page': employees.page,
            'pages': employees.pages,
            'total': employees.total
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({'status': False, 'message': str(e)}), 500

def get_employee(employee_id):
    try:
        employee = User.query.filter_by(id=employee_id, role_id=3).first()
        if not employee:
            return jsonify({'status': False, 'message': 'Employee not found'}), 404

        data = {
            'id': employee.id,
            'name': employee.name,
            'email': employee.email,
            'contact': employee.profile.contact if employee.profile else '',
            'country_code': employee.profile.country_code if employee.profile else ''
        }

        return jsonify({'status': True, 'message': 'Success', 'data': data}), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({'status': False, 'message': str(e)}), 500

def delete_employee(employee_id):
    try:
        employee = User.query.filter_by(id=employee_id, role_id=3).first()
        if not employee:
            return jsonify({'status': False, 'message': 'Employee not found'}), 404

        db.session.delete(employee)
        db.session.commit()

        return jsonify({'status': True, 'message': 'Employee deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        traceback.print_exc()
        return jsonify({'status': False, 'message': str(e)}), 500
        
def update_employee(employee_id, data):
    try:
        employee = User.query.filter_by(id=employee_id, role_id=3).first()
        if not employee:
            return jsonify({'status': False, 'message': 'Employee not found'}), 404

        # Update fields safely
        employee.name = data.get('employee_name', employee.name)
        employee.email = data.get('email', employee.email)

        if 'password' in data and data['password']:
            employee.password = generate_password_hash(
                data['password'], method='pbkdf2:sha256', salt_length=16
            )

        # Update profile
        profile = UserProfile.query.filter_by(user_id=employee.id).first()
        if profile:
            profile.contact = data.get('contact', profile.contact)
            profile.country_code = data.get('country_code', profile.country_code)
        else:
            profile = UserProfile(
                user_id=employee.id,
                contact=data.get('contact', ''),
                country_code=data.get('country_code', '+94'),
                status_id=2
            )
            db.session.add(profile)

        db.session.commit()
        db.session.refresh(employee)

        return jsonify({
            'status': True,
            'message': 'Employee updated successfully',
            'employee_id': employee.id
        }), 200

    except Exception as e:
        db.session.rollback()
        traceback.print_exc()
        return jsonify({'status': False, 'message': str(e)}), 500


def search_employees():
    db = SessionLocal()
    try:
        query_param = request.args.get('query', '').strip().lower()
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))

        query = db.query(User).filter(User.role_id == 3)

        if query_param:
            query = query.filter(
                (User.name.ilike(f"%{query_param}%")) |
                (User.email.ilike(f"%{query_param}%"))
            )

        total = query.count()
        users = query.offset((page - 1) * per_page).limit(per_page).all()

        data = [{
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "contact": u.profile.contact if u.profile else '',
            "country_code": u.profile.country_code if u.profile else ''
        } for u in users]

        return jsonify({
            'status': True,
            'message': 'Success',
            'data': data,
            'page': page,
            'per_page': per_page,
            'total': total,
            'pages': (total + per_page - 1) // per_page
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({'status': False, 'message': str(e)}), 500
    finally:
        db.close()
