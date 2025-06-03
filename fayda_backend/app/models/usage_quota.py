from sqlalchemy import Column, Integer, ForeignKey, Date, Integer as Int
from sqlalchemy.orm import relationship
import datetime

from app.db.base_class import Base

class UsageQuota(Base):
    __tablename__ = "usage_quotas"
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"))
    period_start = Column(Date, default=datetime.date.today)
    period_end = Column(Date)
    verifications_used = Column(Int, default=0)
    quota = Column(Int, default=0)
    organization = relationship("Organization")
