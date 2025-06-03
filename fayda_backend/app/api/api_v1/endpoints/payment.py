from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.payment import PaymentCreate, PaymentOut
from app.crud.crud_payment import create_payment, get_user_payments
from app.api import deps
import random

router = APIRouter()

@router.post("/pay", response_model=PaymentOut)
def simulate_payment(
    payment: PaymentCreate,
    db: Session = Depends(deps.get_db),
    current_user=Depends(deps.get_current_user),
):
    # Simulate payment result
    status_result = random.choice(["success", "failed"])
    ref = f"TXN-{random.randint(100000,999999)}"
    payment_obj = create_payment(db, current_user.id, payment, status_result, ref)
    return payment_obj

@router.get("/history", response_model=list[PaymentOut])
def get_my_payments(
    db: Session = Depends(deps.get_db),
    current_user=Depends(deps.get_current_user),
):
    return get_user_payments(db, current_user.id)
