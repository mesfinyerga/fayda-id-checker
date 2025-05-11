from sqlalchemy import Column, Integer, String
from app.db.base_class import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    plan_type = Column(String, default="basic")       # <- Already handled
    status = Column(String, default="unpaid")         # <- ADD THIS LINE
    role = Column(String, default="user")             # <- Optional if you use admin/user roles
    notes = Column(String, nullable=True)             # <- Optional
