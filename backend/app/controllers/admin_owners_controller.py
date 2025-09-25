from flask import jsonify
from app.database import SessionLocal
from app.models import User, UserProfile, Shop
from werkzeug.security import generate_password_hash
from collections import OrderedDict

def index_owners():
    try:
        with SessionLocal() as db:  # ✅ auto close
            owners = db.query(User).filter(User.role_id == 2).all()
            result = []

            for u in owners:
                shops_list = []
                shops = db.query(Shop).filter(Shop.owner_id == u.id).all()
                for s in shops:
                    full_address = ", ".join(filter(None, [
                        s.address,
                        getattr(s, 'city', ''),
                        getattr(s, 'district', ''),
                        getattr(s, 'country', '')
                    ]))
                    shops_list.append(OrderedDict([
                        ('id', s.id),
                        ('name', s.name),
                        ('full_address', full_address)
                    ]))

                result.append({
                    'id': u.id,
                    'name': u.name,
                    'email': u.email,
                    'contact': u.profile.contact if u.profile else '', 
                    'shops': shops_list
                })

            return jsonify({'status': True, 'message': 'Success', 'data': result}), 200

    except Exception as e:
        print(f"❌ Error in index_owners: {e}")
        return jsonify({'status': False, 'message': 'Something went wrong'}), 500


# --------------------------
# Get a specific owner by ID
# --------------------------
def get_owner(owner_id):
    try:
        with SessionLocal() as db:  # ✅ auto close
            owner = db.query(User).filter(User.id == owner_id, User.role_id == 2).first()
            if not owner:
                return jsonify({'status': False, 'message': 'Owner not found'}), 404

            shops_list = []
            shops = db.query(Shop).filter(Shop.owner_id == owner.id).all()
            for s in shops:
                full_address = ", ".join(filter(None, [
                    s.address,
                    getattr(s, 'city', ''),
                    getattr(s, 'district', ''),
                    getattr(s, 'country', '')
                ]))
                shops_list.append({
                    'id': s.id,
                    'name': s.name,
                    'full_address': full_address
                })

            owner_data = {
                'id': owner.id,
                'name': owner.name,
                'email': owner.email,
                'contact': owner.profile.contact if owner.profile else '',
                'shops': shops_list
            }

            return jsonify({'status': True, 'message': 'Success', 'data': owner_data}), 200

    except Exception as e:
        print(f"❌ Error in get_owner: {e}")
        return jsonify({'status': False, 'message': 'Something went wrong'}), 500


# --------------------------
# Store a new owner
# --------------------------
def store_new_owner_by_admin(data):
    db = None
    try:
        name = data.get('owner_name')
        email = data.get('email')
        contact = data.get('contact')
        password = data.get('password', 'defaultpassword')  # optional default

        if not all([name, email, contact]):
            return jsonify({'status': False, 'message': 'Owner name, email, and contact are required'}), 400

        db = SessionLocal()

        # Check if owner already exists
        existing_owner = db.query(User).filter(User.email == email).first()
        if existing_owner:
            return jsonify({'status': False, 'message': 'Owner already exists!'}), 400

        # Hash password
        hashed_password = generate_password_hash(password)

        # Create new owner
        new_owner = User(
            name=name,
            email=email,
            # contact=contact,
            password=hashed_password,
            role_id=2,    # Owner role
            status_id=2   # Active / Pending
        )
        db.add(new_owner)
        db.commit()
        db.refresh(new_owner)

        return jsonify({
            'status': True,
            'message': 'Owner added successfully',
            'data': {
                'owner_id': new_owner.id,
                'name': new_owner.name,
                'email': new_owner.email,
                # 'contact': new_owner.contact
            }
        }), 201

    except Exception as e:
        if db:
            db.rollback()
        print(f"❌ Error in store_new_owner_by_admin: {e}")
        return jsonify({'status': False, 'message': 'Something went wrong'}), 500

def delete_owner(owner_id):
    db = SessionLocal()
    try:
        owner = db.query(User).filter(User.id == owner_id, User.role_id == 2).first()
        if not owner:
            return jsonify({'status': False, 'message': 'Owner not found'}), 404

        db.delete(owner)
        db.commit()
        return jsonify({'status': True, 'message': 'Owner deleted successfully'}), 200

    except Exception as e:
        db.rollback()
        import traceback
        traceback.print_exc()
        return jsonify({'status': False, 'message': repr(e)}), 500

    finally:
        db.close()
