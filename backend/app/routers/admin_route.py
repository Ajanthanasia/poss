from fastapi import APIRouter,Request
from app.controllers import loginController

router = APIRouter()

@router.get("/login")
def login():
    return {"message": "Hello from FastAPI router!"}

@router.post("/signup")
async def signup(req:Request):
    data = await req.json()
    return loginController.signupFunc(data)