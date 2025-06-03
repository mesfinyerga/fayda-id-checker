from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PaymentBase(BaseModel):
    method: str
    amount: float

class PaymentCreate(PaymentBase):
    pass

class PaymentOut(PaymentBase):
    id: int
    status: str
    reference: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True
