import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Base class for declarative models
Base = declarative_base()

# Create the SQLAlchemy engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True,  # optional, good for MySQL to avoid timeout issues
)

# Create a configured "Session" class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 🔹 Import all models so they are registered with SQLAlchemy before creating tables
from app.models import User, UserProfile, Shop

# Optional: create tables automatically if they don't exist
Base.metadata.create_all(bind=engine)
