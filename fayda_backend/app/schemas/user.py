from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    plan_type: Optional[str] = "basic"
    status: Optional[str] = "unpaid"
    role: Optional[str] = "user"
    notes: Optional[str] = None

class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    plan_type: Optional[str]
    status: Optional[str]
    role: Optional[str]

    class Config:
        from_attributes = True  # updated from "orm_mode"
