from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.crud.organization import create_organization, get_organizations
from app.schemas.organization import OrganizationCreate, OrganizationOut
from app.core.security import verify_admin_role

router = APIRouter()

@router.post("/", response_model=OrganizationOut)
def create_org(org: OrganizationCreate, db: Session = Depends(get_db), _: dict = Depends(verify_admin_role)):
    return create_organization(db, org)

@router.get("/", response_model=list[OrganizationOut])
def list_orgs(db: Session = Depends(get_db), _: dict = Depends(verify_admin_role)):
    return get_organizations(db)
