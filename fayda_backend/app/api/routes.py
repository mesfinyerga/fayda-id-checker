from fastapi import APIRouter
from app.api.endpoints import register, auth, admin

api_router = APIRouter()
api_router.include_router(register.router, prefix="/register", tags=["Register"])
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin"])
