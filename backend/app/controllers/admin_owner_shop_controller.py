from flask import jsonify
from app import db
from app.models import User, UserProfile, Shop
from werkzeug.security import generate_password_hash
import uuid
import secrets
import traceback

def store_owner_and_shop(data, admin_id=1):
    """
    Store a new owner and shop, or update existing owner/shop.
    Generates a secure API token for the owner and stores it in the DB.
    No JWT or middleware is required.
    """
    try:
        # --------------------
        # Extract owner info
        # --------------------
        owner_name = data.get('owner_name')
        email = data.get('email')
        contact = data.get('contact')
        password = data.get('password', 'defaultpassword')
        country_code = data.get('country_code', '+94')

        # --------------------
        # Extract shop info
        # --------------------
        shop_name = data.get('shop_name')
        shop_address = data.get('shop_address')
        shop_city = data.get('city', '')
        shop_district = data.get('district', '')
        shop_country = data.get('country', '')

        # --------------------
        # Validate required fields
        # --------------------
        if not all([owner_name, email, contact, shop_name, shop_address]):
            return jsonify({'status': False, 'message': 'All fields are required'}), 400

        # --------------------
        # Handle Owner
        # --------------------
        owner = User.query.filter_by(email=email).first()
        if owner:
            # Update existing owner
            owner.name = owner_name
            owner.role_id = 2  # ensure owner role
            if password:
                owner.password = generate_password_hash(password)
        else:
            # Create new owner with API token
            owner = User(
                name=owner_name,
                email=email,
                password=generate_password_hash(password),
                role_id=2,       # Owner
                status_id=2,     # Active/Pending
                api_token=secrets.token_urlsafe(64)  # generate secure API token
            )
            db.session.add(owner)
            db.session.flush()  # assign ID without committing

        # --------------------
        # Handle Profile
        # --------------------
        profile = UserProfile.query.filter_by(user_id=owner.id).first()
        if profile:
            profile.contact = contact
            profile.country_code = country_code
            profile.status_id = 2
        else:
            profile = UserProfile(
                user_id=owner.id,
                contact=contact,
                country_code=country_code,
                status_id=2
            )
            db.session.add(profile)

        # --------------------
        # Handle Shop
        # --------------------
        shop = Shop.query.filter_by(owner_id=owner.id).first()
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
                creator_id=1  # fixed creator ID
            )
            db.session.add(shop)

        # --------------------
        # Commit all changes
        # --------------------
        db.session.commit()
        db.session.refresh(owner)

        return jsonify({
            'status': True,
            'message': 'Owner and Shop stored successfully!',
            'owner_id': owner.id,
            'shop_id': shop.id,
            'api_token': owner.api_token  # return the API token
        }), 200

    except Exception as e:
        db.session.rollback()
        traceback.print_exc()
        return jsonify({'status': False, 'message': str(e)}), 500
