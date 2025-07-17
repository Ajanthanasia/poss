from fastapi import APIRouter

def signupFunc(req):
    username = req.get('username')
    password=req.get('password')
    return {
        'status':True,
        'message':'Account',
        'username':username,
        'password':password
    }