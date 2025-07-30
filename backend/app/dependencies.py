from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from fastapi import Depends

#DATABASE_URL = "sqlite+aiosqlite:///users.db"  # Use postgresql+asyncpg for production
DATABASE_URL = "http:localhost:3306///possdb"  # Use postgresql+asyncpg for production
engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def get_db():
    async with AsyncSessionLocal() as db:
        yield db