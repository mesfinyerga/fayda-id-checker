from sqlalchemy.orm import Session
from app.models.organization import Organization
from app.schemas.organization import OrganizationCreate


def create_organization(db: Session, org_in: OrganizationCreate) -> Organization:
    org = Organization(name=org_in.name)
    db.add(org)
    db.commit()
    db.refresh(org)
    return org


def get_organizations(db: Session):
    return db.query(Organization).all()
