from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Register Blueprints
    from app.routes.admin import adminRoute
    from app.routes.auth import auth_bp
    from app.routes.owner import ownerRoute   # <-- register owner blueprint
    from app.routes.employee import employeeRoute

    app.register_blueprint(adminRoute)
    app.register_blueprint(auth_bp)
    app.register_blueprint(ownerRoute)
    app.register_blueprint(employeeRoute)

    # Simple test route
    @app.route("/ping")
    def ping():
        return "Main app works!"

    return app
