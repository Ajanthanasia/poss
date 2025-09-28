from app import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role_id = db.Column(db.Integer)
    api_token = db.Column(db.String(255))
    status_id = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=db.func.now())

    profile = db.relationship(
        'UserProfile',
        back_populates='user',
        uselist=False,
        cascade="all, delete-orphan",
        passive_deletes=True
    )

    shops = db.relationship('Shop', back_populates='owner', cascade="all, delete-orphan")
