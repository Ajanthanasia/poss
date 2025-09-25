# app/models/shop.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Shop(Base):
    __tablename__ = 'shops'

    id = Column(Integer, primary_key=True)
    owner_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    name = Column(String(127), nullable=True)
    email = Column(String(127), nullable=True)
    token = Column(String(255), unique=True, nullable=False)
    address = Column(String(255), nullable=True)
    city = Column(String(255), nullable=True)
    district = Column(String(255), nullable=True)
    country = Column(String(255), nullable=True)
    status_id = Column(Integer, nullable=True)
    creator_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="shops")
