from flask import jsonify
from app.database import SessionLocal
from app.models import User, UserProfile, Shop
from werkzeug.security import generate_password_hash
import uuid
import traceback

def store_owner_and_shop(data, admin_id):
    db = SessionLocal()
    try:
        # Extract data
        owner_name = data.get('owner_name')
        email = data.get('email')
        contact = data.get('contact')
        password = data.get('password', 'defaultpassword')
        country_code = data.get('country_code', '+94')

        shop_name = data.get('shop_name')
        shop_address = data.get('shop_address')
        shop_city = data.get('city', '')
        shop_district = data.get('district', '')
        shop_country = data.get('country', '')

        # Validate required fields
        if not all([owner_name, email, contact, shop_name, shop_address]):
            return jsonify({'status': False, 'message': 'All fields are required'}), 400

        # --------------------
        # Check if owner exists
        # --------------------
        owner = db.query(User).filter(User.id == data.get('owner_id')).first()
        if owner:
            # Update existing owner
            owner.name = owner_name
            owner.email = email
            if password:
                owner.password = generate_password_hash(password)
            # If api_token is missing, generate new
            if not owner.api_token:
                owner.api_token = str(uuid.uuid4())
        else:
            # Create new owner
            owner = User(
                name=owner_name,
                email=email,
                password=generate_password_hash(password),
                role_id=2,  # Owner
                status_id=2,  # Active/Pending
                api_token=str(uuid.uuid4())  # Generate API token
            )
            db.add(owner)
            db.flush()  # to get owner.id

        # --------------------
        # Handle UserProfile
        # --------------------
        profile = db.query(UserProfile).filter(UserProfile.user_id == owner.id).first()
        if profile:
            profile.contact = contact
            profile.country_code = country_code
        else:
            profile = UserProfile(
                user_id=owner.id,
                contact=contact,
                country_code=country_code,
                status_id=2
            )
            db.add(profile)

        # --------------------
        # Handle Shop
        # --------------------
        shop = db.query(Shop).filter(Shop.owner_id == owner.id).first()
        if shop:
            shop.name = shop_name
            shop.address = shop_address
            shop.city = shop_city
            shop.district = shop_district
            shop.country = shop_country
        else:
            shop = Shop(
                owner_id=owner.id,
                name=shop_name,
                email=email,
                address=shop_address,
                city=shop_city,
                district=shop_district,
                country=shop_country,
                status_id=2,
                token=str(uuid.uuid4()),
                creator_id=admin_id
            )
            db.add(shop)

        # Commit everything
        db.commit()
        db.refresh(owner)
        db.refresh(shop)

        return jsonify({
            'status': True,
            'message': 'Owner and Shop stored successfully!',
            'owner_id': owner.id,
            'shop_id': shop.id,
            'api_token': owner.api_token
        }), 200

    except Exception as e:
        db.rollback()
        traceback.print_exc()
        return jsonify({'status': False, 'message': str(e)}), 500

    finally:
        db.close()
