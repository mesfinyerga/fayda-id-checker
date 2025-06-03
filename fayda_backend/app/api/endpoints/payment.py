# app/api/endpoints/payment.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.payment import PaymentCreate, PaymentOut
from app.core.security import get_current_user
from app.db.session import get_db
from app.crud import payment as crud_payment
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=PaymentOut)
def simulate_payment(
    payment_in: PaymentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    payment = crud_payment.create_payment(db, current_user.id, payment_in)
    return payment

@router.get("/", response_model=list[PaymentOut])
def get_user_payments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud_payment.get_payments_by_user(db, current_user.id)
