from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.core.security import verify_password
from app.core.config import settings
from jose import jwt
from datetime import datetime, timedelta

router = APIRouter()

@router.post("/login")
def login(
    username: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == username).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    to_encode = {
        "sub": user.email,
        "role": user.role,  # 👈 This is critical
        "exp": datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    }

    access_token = jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
    return {"access_token": access_token, "token_type": "bearer"}
