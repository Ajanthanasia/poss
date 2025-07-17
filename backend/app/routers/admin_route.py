from fastapi import APIRouter
from app.controllers import loginController
from fastapi import Request

router = APIRouter()

@router.get("/login")
def login():
    return {"message": "Hello from FastAPI router!"}

@router.post("/signup")
async def signup(req:Request):
    data=await req.json()
    return loginController.signupFunc(data)