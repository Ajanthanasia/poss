import os
import jwt
import datetime
from dotenv import load_dotenv

def generate_jwt(userId,username):
    try:
        # Your secret key (keep it safe!)
        JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

        # Create token payload
        payload = {
            "user_id": userId,
            "username": username,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)  # Expiration time
        }

        # Generate token
        token = jwt.encode(payload, JWT_SECRET_KEY, algorithm="HS256")
        return token
    except SomeException as e:
        print(f"Error: {e}")