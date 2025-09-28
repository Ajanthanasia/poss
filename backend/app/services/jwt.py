import os
import jwt
import datetime
from dotenv import load_dotenv

def generate_jwt(userId, username):
    try:
        # Load secret key
        JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

        # Create token payload
        payload = {
            "sub": str(userId),  # convert to string
            "username": username,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }

        # Generate token
        token = jwt.encode(payload, JWT_SECRET_KEY, algorithm="HS256")
        return token
    except Exception as e:
        print(f"Error generating JWT: {e}")
        return None
