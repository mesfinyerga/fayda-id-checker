from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    """
    Base fields shared by all user schemas.
    """
    email: EmailStr = Field(..., example="user@example.com")
    full_name: str = Field(..., example="John Doe")
    role: Optional[str] = Field(default="user", example="user")
    status: Optional[str] = Field(default="unpaid", example="unpaid")
    plan_type: Optional[str] = Field(default="basic", example="basic")
    avatar_url: Optional[str] = Field(default=None, example="https://example.com/avatar.png")
    bio: Optional[str] = Field(default=None, example="This is my bio.")
    phone: Optional[str] = Field(default=None, example="+251912345678")
    company: Optional[str] = Field(default=None, example="Acme Inc")
    notes: Optional[str] = Field(default=None, example="Internal note or comment")

class UserCreate(UserBase):
    """
    Fields required when registering a new user.
    """
    password: str = Field(..., min_length=6, example="strongpassword123")

class UserOut(UserBase):
    """
    Publicly returned user data.
    """
    id: int
    created_at: Optional[datetime] = None
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True  # For Pydantic v2+, replaces orm_mode

class UserUpdate(BaseModel):
    """
    Fields a user can update.
    """
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    bio: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    avatar_url: Optional[str] = None
    notes: Optional[str] = None

class UserPasswordUpdate(BaseModel):
    """
    For password change endpoint.
    """
    old_password: str = Field(..., min_length=6)
    new_password: str = Field(..., min_length=6)
