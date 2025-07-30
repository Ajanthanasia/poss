from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from passlib.context import CryptContext
from fastapi import HTTPException

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_user(db: AsyncSession, username: str, email: str, password: str):
    existing_user = await db.execute(
        select(User).filter((User.username == username) | (User.email == email))
    )
    if existing_user.scalars().first():
        raise HTTPException(status_code=400, detail="Username or email already exists")
    
    hashed_password = pwd_context.hash(password)
    db_user = User(username=username, email=email, password_hash=hashed_password)
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

async def get_user(db: AsyncSession, user_id: int):
    result = await db.execute(select(User).filter_by(id=user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

async def authenticate_user(db: AsyncSession, username: str, password: str):
    result = await db.execute(select(User).filter_by(username=username))
    user = result.scalars().first()
    if not user or not pwd_context.verify(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return user