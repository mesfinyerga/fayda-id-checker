from sqlalchemy import Column, Integer, String, Float
from app.db.base_class import Base

class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    monthly_quota = Column(Integer, default=0)
    price = Column(Float, default=0.0)
