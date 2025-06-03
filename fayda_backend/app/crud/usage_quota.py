from sqlalchemy.orm import Session
from datetime import date, timedelta

from app.models.usage_quota import UsageQuota
from app.models.organization import Organization


def get_current_quota(db: Session, org: Organization) -> UsageQuota:
    today = date.today()
    quota = (
        db.query(UsageQuota)
        .filter(
            UsageQuota.organization_id == org.id,
            UsageQuota.period_start <= today,
            UsageQuota.period_end >= today,
        )
        .first()
    )
    return quota


def create_period_quota(db: Session, org: Organization, quota_amount: int) -> UsageQuota:
    today = date.today()
    uq = UsageQuota(
        organization_id=org.id,
        period_start=today,
        period_end=today + timedelta(days=30),
        quota=quota_amount,
        verifications_used=0,
    )
    db.add(uq)
    db.commit()
    db.refresh(uq)
    return uq
