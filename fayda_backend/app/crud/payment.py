# app/crud/payment.py

from sqlalchemy.orm import Session
from app.models.payment import Payment
from app.schemas.payment import PaymentCreate
from random import choice

def create_payment(db: Session, user_id: int, payment_in: PaymentCreate):
    # Simulate payment: random success/failure
    status = choice(["success", "failed"])
    reference = f"MOCK-{user_id}-{payment_in.method[:2].upper()}-{payment_in.amount:.2f}"
    payment = Payment(
        user_id=user_id,
        amount=payment_in.amount,
        method=payment_in.method,
        status=status,
        reference=reference
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment

def get_payments_by_user(db: Session, user_id: int):
    return db.query(Payment).filter(Payment.user_id == user_id).order_by(Payment.created_at.desc()).all()
