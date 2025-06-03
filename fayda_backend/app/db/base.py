from app.models.user import User
from app.models.payment import Payment
from app.models.organization import Organization
from app.models.subscription_plan import SubscriptionPlan
from app.models.usage_quota import UsageQuota
# from sqlalchemy.ext.declarative import declarative_base
# Base = declarative_base()
from sqlalchemy.orm import declarative_base

Base = declarative_base()
