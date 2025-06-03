from sqlalchemy.orm import Session
from app.models.payment import Payment
from app.schemas.payment import PaymentCreate

def create_payment(db: Session, user_id: int, payment: PaymentCreate, status: str, reference: str):
    db_payment = Payment(
        user_id=user_id,
        method=payment.method,
        amount=payment.amount,
        status=status,
        reference=reference,
    )
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

def get_user_payments(db: Session, user_id: int):
    return db.query(Payment).filter(Payment.user_id == user_id).order_by(Payment.created_at.desc()).all()

def get_all_payments(db: Session):
    return db.query(Payment).order_by(Payment.created_at.desc()).all()
