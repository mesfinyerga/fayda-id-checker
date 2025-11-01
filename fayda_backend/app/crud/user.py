from sqlalchemy.orm import Session
from app.models.user import User
from app.models.tenant import Tenant
from app.schemas.user import UserCreate
from app.core.security import get_password_hash

def create_user(db: Session, user_in: UserCreate):
    # Get or create default tenant
    default_tenant = db.query(Tenant).filter(Tenant.name == "default").first()
    if not default_tenant:
        default_tenant = Tenant(name="default", status="active")
        db.add(default_tenant)
        db.commit()
        db.refresh(default_tenant)
    
    user = User(
        tenant_id=default_tenant.id,  # Add tenant_id
        full_name=user_in.full_name,
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        plan_type=user_in.plan_type,
        status=user_in.status,
        role=user_in.role or "user",
        phone=user_in.phone,
        company=user_in.company,
        notes=user_in.notes,
        avatar_url=user_in.avatar_url,
        bio=user_in.bio,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_users(db: Session):
    return db.query(User).all()

def update_user_status(db: Session, user_id: int, new_status: str):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.status = new_status
        db.commit()
        db.refresh(user)
    return user

def update_user_role(db: Session, user_id: int, new_role: str):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.role = new_role
        db.commit()
        db.refresh(user)
    return user
