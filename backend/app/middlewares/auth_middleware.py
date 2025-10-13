from flask import Flask, request, jsonify, g
from functools import wraps
from app.models.user import User

def auth_middleware(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization') 
        if not token:
            return {'status': False, 'message': 'Token is missing!'}, 401
        token = token.replace("Bearer ", "")
        user = User.query.filter_by(api_token = token).first()
        if not user:
            return {'status':False, 'message': 'Invalid Token!'}, 401
        g.auth_user = user # store user in global context
        return f(*args, **kwargs)
    return decorated_function