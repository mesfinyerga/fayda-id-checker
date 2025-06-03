from pydantic import BaseModel
from datetime import date

class UsageQuotaOut(BaseModel):
    id: int
    period_start: date
    period_end: date
    verifications_used: int
    quota: int

    class Config:
        from_attributes = True
