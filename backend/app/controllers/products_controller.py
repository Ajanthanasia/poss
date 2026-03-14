from flask import request, jsonify,g
from app import db
from app.models.shop_item import ShopItem

def create_product():
    data = request.get_json()
    product = ShopItem(
        shop_id=data['shop_id'],
        name=data.get('name'),
        unit_type=data.get('unit_type'),
        description=data.get('description'),
        price=data.get('price'),
        qty=data.get('qty'),
        status_id=data.get('status_id'),
        creator_id=g.auth_user.id
    )
    db.session.add(product)
    db.session.commit()
    return jsonify(product.serialize()), 201

def get_products():
    products = ShopItem.query.filter_by(creator_id=g.auth_user.id).all()
    return jsonify([p.serialize() for p in products])

def get_product(product_id):
    product = ShopItem.query.get_or_404(product_id)
    return jsonify(product.serialize())

def update_product(product_id):
    data = request.get_json()
    product = ShopItem.query.get_or_404(product_id)

    product.name = data.get('name', product.name)
    product.unit_type = data.get('unit_type', product.unit_type)
    product.description = data.get('description', product.description)
    product.price = data.get('price', product.price)
    product.qty = data.get('qty', product.qty)
    product.status_id = data.get('status_id', product.status_id)

    db.session.commit()
    return jsonify(product.serialize())

def delete_product(product_id):
    product = ShopItem.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Product deleted successfully"})