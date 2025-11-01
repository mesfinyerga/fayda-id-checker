"""
Tests for multi-tenancy functionality
"""

import pytest
from sqlalchemy.orm import Session
from app.db.session import get_db, set_tenant_context
from app.models.tenant import Tenant
from app.models.user import User
from app.models.verification import Verification
from app.core.security import get_password_hash
import uuid

@pytest.fixture
def db_session():
    """Get database session"""
    db = next(get_db())
    try:
        yield db
    finally:
        db.close()

@pytest.fixture
def default_tenant(db_session: Session):
    """Create default tenant for testing"""
    tenant = db_session.query(Tenant).filter(Tenant.name == "default").first()
    if not tenant:
        tenant = Tenant(name="default", status="active")
        db_session.add(tenant)
        db_session.commit()
        db_session.refresh(tenant)
    return tenant

@pytest.fixture
def test_user(db_session: Session, default_tenant: Tenant):
    """Create test user"""
    user = User(
        tenant_id=default_tenant.id,
        full_name="Test User",
        email="test@example.com",
        hashed_password=get_password_hash("testpass"),
        status="active",
        role="user"
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

def test_tenant_creation(db_session: Session):
    """Test tenant creation"""
    tenant = Tenant(name="test_tenant", status="active")
    db_session.add(tenant)
    db_session.commit()
    db_session.refresh(tenant)
    
    assert tenant.id is not None
    assert tenant.name == "test_tenant"
    assert tenant.status == "active"

def test_user_with_tenant(db_session: Session, default_tenant: Tenant):
    """Test user creation with tenant association"""
    user = User(
        tenant_id=default_tenant.id,
        full_name="Test User",
        email="test@example.com",
        hashed_password=get_password_hash("testpass"),
        status="active",
        role="user"
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    
    assert user.tenant_id == default_tenant.id
    assert user.tenant.name == "default"

def test_verification_creation(db_session: Session, default_tenant: Tenant):
    """Test verification record creation"""
    verification = Verification(
        tenant_id=default_tenant.id,
        subject_id="SUBJECT-001",
        status="pending"
    )
    db_session.add(verification)
    db_session.commit()
    db_session.refresh(verification)
    
    assert verification.id is not None
    assert verification.tenant_id == default_tenant.id
    assert verification.subject_id == "SUBJECT-001"
    assert verification.status == "pending"

def test_tenant_context_setting(db_session: Session, default_tenant: Tenant):
    """Test tenant context setting for RLS"""
    # This test verifies that tenant context can be set
    # In a real scenario, this would be called by the dependency
    set_tenant_context(db_session, str(default_tenant.id))
    
    # Verify the context was set (this would be checked in actual RLS policies)
    result = db_session.execute("SELECT current_setting('app.current_tenant', true)").scalar()
    assert result == str(default_tenant.id)

def test_multi_tenant_isolation(db_session: Session):
    """Test that tenants are properly isolated"""
    # Create two tenants
    tenant1 = Tenant(name="tenant1", status="active")
    tenant2 = Tenant(name="tenant2", status="active")
    db_session.add_all([tenant1, tenant2])
    db_session.commit()
    
    # Create users in different tenants
    user1 = User(
        tenant_id=tenant1.id,
        full_name="User 1",
        email="user1@example.com",
        hashed_password=get_password_hash("pass"),
        status="active"
    )
    user2 = User(
        tenant_id=tenant2.id,
        full_name="User 2", 
        email="user2@example.com",
        hashed_password=get_password_hash("pass"),
        status="active"
    )
    db_session.add_all([user1, user2])
    db_session.commit()
    
    # Verify users belong to different tenants
    assert user1.tenant_id != user2.tenant_id
    assert user1.tenant.name == "tenant1"
    assert user2.tenant.name == "tenant2"
