# models/shop_item.py
from app import db

class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    shop_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(127))
    unit_type = db.Column(db.Enum('kg', 'l', 'piece'))
    description = db.Column(db.String(255))
    price = db.Column(db.Numeric(10, 2))
    qty = db.Column(db.Integer)
    status_id = db.Column(db.Integer)
    creator_id = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    def serialize(self):
        return {
            "id": self.id,
            "shop_id": self.shop_id,
            "name": self.name,
            "unit_type": self.unit_type,
            "description": self.description,
            "price": str(self.price) if self.price is not None else None,
            "qty": self.qty,
            "status_id": self.status_id,
            "creator_id": self.creator_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }