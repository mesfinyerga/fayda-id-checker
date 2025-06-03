from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserBase, UserUpdate, UserPasswordUpdate, UserOut

rBase, UserUpdate, UserPasswordUpdate
from app.core.security import (
    get_password_hash,
    verify_password,
    get_current_user,
)
from app.db.session import get_db
from app.models.payment import Payment  # Import Payment model!
from app.schemas.payment import PaymentOut
import shutil, os

router = APIRouter()

@router.get("/me", response_model=UserOut)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/users/me", response_model=UserOut)
def update_profile(update: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    for attr, value in update.dict(exclude_unset=True).items():
        setattr(current_user, attr, value)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.put("/users/me/password")
def change_password(pw: UserPasswordUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not verify_password(pw.old_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    current_user.hashed_password = get_password_hash(pw.new_password)
    db.commit()
    return {"msg": "Password updated"}

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "gif"}
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@router.post("/users/me/avatar")
def upload_avatar(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not allowed_file(file.filename):
        raise HTTPException(status_code=400, detail="Invalid file type.")
    upload_dir = "static/avatars"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, f"{current_user.id}_{file.filename}")
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    current_user.avatar_url = "/" + file_path.replace("\\", "/")
    db.commit()
    db.refresh(current_user)
    return {"avatar_url": current_user.avatar_url}

@router.get("/me/payments", response_model=list[PaymentOut])
def get_payments(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Payment).filter(Payment.user_id == current_user.id).order_by(Payment.created_at.desc()).all()
