from pydantic import BaseModel

class SubscriptionPlanBase(BaseModel):
    name: str
    monthly_quota: int
    price: float

class SubscriptionPlanCreate(SubscriptionPlanBase):
    pass

class SubscriptionPlanOut(SubscriptionPlanBase):
    id: int

    class Config:
        from_attributes = True
