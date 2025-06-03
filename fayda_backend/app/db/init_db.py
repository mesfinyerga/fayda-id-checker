from app.db.session import engine
from app.db.base import (
    User,
    Payment,
    Organization,
    SubscriptionPlan,
    UsageQuota,
)
from app.db.base_class import Base

def init():
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully.")

if __name__ == "__main__":
    init()
