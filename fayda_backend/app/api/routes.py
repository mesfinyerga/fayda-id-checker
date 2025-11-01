from fastapi import APIRouter
from app.api.endpoints import register, auth, admin
from app.api.endpoints import payment, evidence

api_router = APIRouter()
api_router.include_router(register.router, prefix="/register", tags=["Register"])
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin"])
api_router.include_router(payment.router, prefix="/payments", tags=["payments"])
api_router.include_router(evidence.router, prefix="/evidence", tags=["Evidence"])
