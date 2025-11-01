from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from app.core.config import settings
from app.db.session import get_db, set_tenant_context
from app.models.user import User
from app.models.tenant import Tenant
from typing import Optional
import uuid

async def get_current_tenant_id(
    db: Session = Depends(get_db),
    token: str = Depends(lambda: None)  # This will be overridden by auth dependency
) -> Optional[uuid.UUID]:
    """
    Extract tenant_id from JWT token or user record.
    For now, we'll use a default tenant for existing users.
    """
    # TODO: Extract tenant_id from JWT token when implemented
    # For now, return default tenant ID
    default_tenant = db.query(Tenant).filter(Tenant.name == "default").first()
    if not default_tenant:
        # Create default tenant if it doesn't exist
        default_tenant = Tenant(name="default", status="active")
        db.add(default_tenant)
        db.commit()
        db.refresh(default_tenant)
    
    return default_tenant.id

async def get_current_tenant(
    tenant_id: uuid.UUID = Depends(get_current_tenant_id),
    db: Session = Depends(get_db)
) -> Tenant:
    """Get the current tenant object"""
    tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found"
        )
    return tenant

def set_tenant_context_for_request(
    db: Session = Depends(get_db),
    tenant_id: uuid.UUID = Depends(get_current_tenant_id)
):
    """Set tenant context for RLS policies"""
    set_tenant_context(db, str(tenant_id))
    return tenant_id
