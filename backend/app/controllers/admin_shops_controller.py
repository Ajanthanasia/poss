from flask import Blueprint, request, jsonify
from app.database import SessionLocal  # your SQLAlchemy session factory
import uuid
from app.models.user import User
from app.models.shop import Shop

def storeShopByAdmin(res):
    try:
        name = res.get('name')
        ownerId = res.get('owner_id')
        email = res.get('email')
        address = res.get('address')

        db=SessionLocal()

        newShop = Shop(
            owner_id = ownerId,
            name = name,
            email =  email,
            token = str(uuid.uuid4()),
            address = address,
            status_id = 2
        )
        db.add(newShop)
        db.commit()
        return jsonify({
            'status':True,
            'message':'Successfully Added!',
        })
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            'status':False,
            'message':'Whoops!'
        }) 
