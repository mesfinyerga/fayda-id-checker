from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import get_current_user, verify_admin_role
from app.crud import user as crud_user
from app.schemas.user import UserOut

router = APIRouter()

@router.get("/users", response_model=list[UserOut])
def get_all_users(
    db: Session = Depends(get_db),
    _: dict = Depends(verify_admin_role)
):
    return crud_user.get_users(db)

@router.put("/users/{user_id}/status", response_model=UserOut)
def change_user_status(
    user_id: int,
    new_status: str,
    db: Session = Depends(get_db),
    _: dict = Depends(verify_admin_role)
):
    user = crud_user.update_user_status(db, user_id, new_status)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/users/{user_id}/role", response_model=UserOut)
def change_user_role(
    user_id: int,
    new_role: str,
    db: Session = Depends(get_db),
    _: dict = Depends(verify_admin_role)
):
    user = crud_user.update_user_role(db, user_id, new_role)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
