# app/models/user.py
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role_id = Column(Integer, nullable=True)
    api_token = Column(String(255), nullable=True)
    status_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship('UserProfile', back_populates='user', uselist=False)
    shops = relationship('Shop', back_populates='owner')
