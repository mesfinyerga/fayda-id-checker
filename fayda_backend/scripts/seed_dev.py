#!/usr/bin/env python3
"""
Development Seed Script

This script creates sample data for development and testing.

Usage:
    python scripts/seed_dev.py
"""

import os
import sys
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from sqlalchemy.orm import Session
from app.core.config import settings
from app.db.session import SessionLocal
# Import all models to ensure relationships are registered
from app.db.base import *  # This imports all models (User, Payment, Tenant, Verification, etc.)
from app.models.tenant import Tenant
from app.models.user import User
from app.models.payment import Payment
from app.core.security import get_password_hash
import uuid

def seed_database():
    """Seed the database with development data"""
    print("Seeding development database...")
    
    db = SessionLocal()
    
    try:
        # Create default tenant
        default_tenant = db.query(Tenant).filter(Tenant.name == "default").first()
        if not default_tenant:
            default_tenant = Tenant(name="default", status="active")
            db.add(default_tenant)
            db.commit()
            db.refresh(default_tenant)
            print(f"Created default tenant: {default_tenant.id}")
        else:
            print(f"Using existing default tenant: {default_tenant.id}")
        
        # Create admin user
        admin_user = db.query(User).filter(User.email == "admin@fayda.com").first()
        if not admin_user:
            admin_user = User(
                tenant_id=default_tenant.id,
                full_name="Admin User",
                email="admin@fayda.com",
                hashed_password=get_password_hash("admin123"),
                status="active",
                role="admin",
                plan_type="premium",
                phone="+251911234567",
                company="Fayda Inc"
            )
            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)
            print(f"Created admin user: {admin_user.email}")
        else:
            print(f"Admin user already exists: {admin_user.email}")
        
        # Create regular user
        regular_user = db.query(User).filter(User.email == "user@fayda.com").first()
        if not regular_user:
            regular_user = User(
                tenant_id=default_tenant.id,
                full_name="Regular User",
                email="user@fayda.com",
                hashed_password=get_password_hash("user123"),
                status="active",
                role="user",
                plan_type="basic",
                phone="+251922345678",
                company="Test Company"
            )
            db.add(regular_user)
            db.commit()
            db.refresh(regular_user)
            print(f"Created regular user: {regular_user.email}")
        else:
            print(f"Regular user already exists: {regular_user.email}")
        
        # Create sample payments
        sample_payments = [
            {
                "user_id": admin_user.id,
                "method": "card",
                "amount": 100.0,
                "status": "completed",
                "reference": "PAY-ADMIN-001"
            },
            {
                "user_id": admin_user.id,
                "method": "bank_transfer",
                "amount": 250.0,
                "status": "completed",
                "reference": "PAY-ADMIN-002"
            },
            {
                "user_id": regular_user.id,
                "method": "card",
                "amount": 50.0,
                "status": "pending",
                "reference": "PAY-USER-001"
            }
        ]
        
        for payment_data in sample_payments:
            existing_payment = db.query(Payment).filter(
                Payment.reference == payment_data["reference"]
            ).first()
            
            if not existing_payment:
                payment = Payment(
                    tenant_id=default_tenant.id,
                    **payment_data
                )
                db.add(payment)
                print(f"Created payment: {payment_data['reference']}")
            else:
                print(f"Payment already exists: {payment_data['reference']}")
        
        db.commit()
        print("Database seeding completed successfully!")
        
    except Exception as e:
        print(f"Seeding failed: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
