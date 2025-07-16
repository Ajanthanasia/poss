from fastapi import FastAPI
from app.routers import admin_route

app = FastAPI()

app.include_router(admin_route.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to FastAPI!"}