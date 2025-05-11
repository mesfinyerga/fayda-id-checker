from fastapi import HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.models.user import User
from app.auth.jwt import create_access_token

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def register_user(db: Session, user_data):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(user_data.password)
    user = User(email=user_data.email, hashed_password=hashed_pw)
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(data={"sub": user.email, "role": user.role})
    return {"access_token": token}

def login_user(db: Session, credentials: dict):
    user = db.query(User).filter(User.email == credentials["username"]).first()
    if not user:
        raise HTTPException(status_code=401, detail="Email not found")

    if not verify_password(credentials["password"], user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect password")

    token = create_access_token(data={"sub": user.email, "role": user.role})
    return {"access_token": token}
