# app/models/shop.py
from app import db
from datetime import datetime

class Shop(db.Model):
    __tablename__ = 'shops'

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    name = db.Column(db.String(127), nullable=True)
    email = db.Column(db.String(127), nullable=True)
    token = db.Column(db.String(255), unique=True, nullable=False)
    address = db.Column(db.String(255), nullable=True)
    city = db.Column(db.String(255), nullable=True)
    district = db.Column(db.String(255), nullable=True)
    country = db.Column(db.String(255), nullable=True)
    status_id = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = db.relationship("User", back_populates="shops")

    def to_dict(self):
        return {
            "id": self.id,
            "owner_id": self.owner_id,
            "name": self.name,
            "email": self.email,
            "token": self.token,
            "address": self.address,
            "city": self.city,
            "district": self.district,
            "country": self.country,
            "status_id": self.status_id,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "owner":{
                "id":self.owner.id,
                "name":self.owner.name,
            } if self.owner else None
        }