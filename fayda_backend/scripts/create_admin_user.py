#!/usr/bin/env python3
"""
Create Admin User Script

This script creates an admin user in the database.

Usage:
    python scripts/create_admin_user.py
    python scripts/create_admin_user.py --email admin@example.com --password SecurePass123 --name "Admin Name"
"""

import os
import sys
import argparse
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from sqlalchemy.orm import Session
from app.db.session import SessionLocal
# Import all models to ensure relationships are registered
from app.db.base import *  # This imports all models to register relationships
from app.models.tenant import Tenant
from app.models.user import User
from app.core.security import get_password_hash
import getpass


def create_admin_user(
    email: str,
    password: str,
    full_name: str = "Admin User",
    phone: str = None,
    company: str = None
):
    """Create an admin user in the database"""
    
    print("=" * 60)
    print("🔐 Creating Admin User")
    print("=" * 60)
    print()
    
    db = SessionLocal()
    
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            print(f"❌ User with email '{email}' already exists!")
            print(f"   Current role: {existing_user.role}")
            
            response = input("\n💡 Do you want to change this user to admin? (yes/no): ")
            if response.lower() == "yes":
                existing_user.role = "admin"
                existing_user.status = "active"
                db.commit()
                print(f"✅ User '{email}' has been updated to admin role!")
                return existing_user
            else:
                print("❌ Operation cancelled.")
                return None
        
        # Get or create default tenant
        default_tenant = db.query(Tenant).filter(Tenant.name == "default").first()
        if not default_tenant:
            default_tenant = Tenant(name="default", status="active")
            db.add(default_tenant)
            db.commit()
            db.refresh(default_tenant)
            print(f"✅ Created default tenant: {default_tenant.id}")
        
        # Create admin user
        admin_user = User(
            tenant_id=default_tenant.id,
            full_name=full_name,
            email=email,
            hashed_password=get_password_hash(password),
            status="active",
            role="admin",
            plan_type="premium",
            phone=phone,
            company=company
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print()
        print("✅ Admin user created successfully!")
        print()
        print("📋 User Details:")
        print(f"   Email: {admin_user.email}")
        print(f"   Name: {admin_user.full_name}")
        print(f"   Role: {admin_user.role}")
        print(f"   Status: {admin_user.status}")
        print(f"   Tenant: {default_tenant.name} ({default_tenant.id})")
        print()
        print("=" * 60)
        
        return admin_user
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error creating admin user: {str(e)}")
        return None
    finally:
        db.close()


def interactive_mode():
    """Interactive mode for creating admin user"""
    
    print("=" * 60)
    print("🔐 Create Admin User (Interactive Mode)")
    print("=" * 60)
    print()
    
    # Get email
    email = input("Enter admin email: ").strip()
    if not email:
        print("❌ Email is required!")
        return
    
    # Get password (with confirmation)
    password = getpass.getpass("Enter admin password: ")
    if not password:
        print("❌ Password is required!")
        return
    
    password_confirm = getpass.getpass("Confirm password: ")
    if password != password_confirm:
        print("❌ Passwords do not match!")
        return
    
    # Get optional fields
    full_name = input("Enter full name (optional, default: 'Admin User'): ").strip()
    if not full_name:
        full_name = "Admin User"
    
    phone = input("Enter phone number (optional): ").strip() or None
    company = input("Enter company name (optional): ").strip() or None
    
    # Create user
    create_admin_user(
        email=email,
        password=password,
        full_name=full_name,
        phone=phone,
        company=company
    )


def main():
    """Main function"""
    parser = argparse.ArgumentParser(description="Create an admin user")
    parser.add_argument("--email", "-e", help="Admin email address")
    parser.add_argument("--password", "-p", help="Admin password")
    parser.add_argument("--name", "-n", help="Full name", default="Admin User")
    parser.add_argument("--phone", help="Phone number")
    parser.add_argument("--company", help="Company name")
    parser.add_argument("--interactive", "-i", action="store_true", help="Interactive mode")
    
    args = parser.parse_args()
    
    # Interactive mode
    if args.interactive or (not args.email and not args.password):
        interactive_mode()
        return
    
    # Command line mode
    if not args.email or not args.password:
        print("❌ Error: --email and --password are required (or use --interactive)")
        parser.print_help()
        return
    
    create_admin_user(
        email=args.email,
        password=args.password,
        full_name=args.name,
        phone=args.phone,
        company=args.company
    )


if __name__ == "__main__":
    main()

