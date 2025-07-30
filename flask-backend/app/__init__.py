# app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    # app.config.from_object('config.Config')

    # Initialize extensions
    # db.init_app(app)
    # migrate.init_app(app, db)
    # jwt.init_app(app)
    # CORS(app)  # Enable CORS for API

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.users import users_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(users_bp)

    return app