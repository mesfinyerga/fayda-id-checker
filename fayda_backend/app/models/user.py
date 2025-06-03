from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    status = Column(String, default="unpaid")
    role = Column(String, default="user")
    plan_type = Column(String, default="basic")
    phone = Column(String, nullable=True)       # NEW
    company = Column(String, nullable=True)     # NEW
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    last_login = Column(DateTime, nullable=True)

    notes = Column(String, nullable=True)  
    avatar_url = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)
    payments = relationship("Payment", back_populates="user")
