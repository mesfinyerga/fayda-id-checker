#!/usr/bin/env python3
"""
SQLite to PostgreSQL Data Migration Script

This script migrates existing data from SQLite to PostgreSQL with multi-tenancy support.

Prerequisites:
1. Set DATABASE_URL for PostgreSQL in environment
2. Run Alembic upgrade to create schema
3. Ensure SQLite database (fapp.db) exists

Usage:
    python scripts/migrate_sqlite_to_pg.py

The script is idempotent and safe to re-run.
"""

import os
import sys
import sqlite3
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.models.tenant import Tenant
from app.models.user import User
from app.models.payment import Payment
import uuid

def get_sqlite_connection():
    """Connect to SQLite database"""
    sqlite_path = os.path.join(os.path.dirname(__file__), '..', 'fapp.db')
    if not os.path.exists(sqlite_path):
        print(f"SQLite database not found at {sqlite_path}")
        sys.exit(1)
    
    return sqlite3.connect(sqlite_path)

def get_postgres_session():
    """Get PostgreSQL session"""
    database_url = os.getenv("DATABASE_URL", settings.database_url)
    if not database_url.startswith("postgresql"):
        print("DATABASE_URL must point to PostgreSQL database")
        sys.exit(1)
    
    engine = create_engine(database_url)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return SessionLocal()

def migrate_data():
    """Migrate data from SQLite to PostgreSQL"""
    print("Starting SQLite to PostgreSQL migration...")
    
    # Connect to databases
    sqlite_conn = get_sqlite_connection()
    pg_session = get_postgres_session()
    
    try:
        # Get or create default tenant
        default_tenant = pg_session.query(Tenant).filter(Tenant.name == "default").first()
        if not default_tenant:
            print("Creating default tenant...")
            default_tenant = Tenant(name="default", status="active")
            pg_session.add(default_tenant)
            pg_session.commit()
            pg_session.refresh(default_tenant)
            print(f"Created default tenant with ID: {default_tenant.id}")
        else:
            print(f"Using existing default tenant: {default_tenant.id}")
        
        # Migrate users
        print("Migrating users...")
        sqlite_cursor = sqlite_conn.cursor()
        sqlite_cursor.execute("SELECT * FROM users")
        users_data = sqlite_cursor.fetchall()
        
        # Get column names
        columns = [description[0] for description in sqlite_cursor.description]
        
        migrated_users = 0
        for user_row in users_data:
            user_dict = dict(zip(columns, user_row))
            
            # Check if user already exists
            existing_user = pg_session.query(User).filter(User.email == user_dict['email']).first()
            if existing_user:
                print(f"User {user_dict['email']} already exists, skipping...")
                continue
            
            # Create new user with tenant_id
            new_user = User(
                tenant_id=default_tenant.id,
                full_name=user_dict['full_name'],
                email=user_dict['email'],
                hashed_password=user_dict['hashed_password'],
                status=user_dict['status'],
                role=user_dict['role'],
                plan_type=user_dict['plan_type'],
                phone=user_dict.get('phone'),
                company=user_dict.get('company'),
                created_at=user_dict['created_at'],
                last_login=user_dict.get('last_login'),
                notes=user_dict.get('notes'),
                avatar_url=user_dict.get('avatar_url'),
                bio=user_dict.get('bio')
            )
            
            pg_session.add(new_user)
            migrated_users += 1
        
        pg_session.commit()
        print(f"Migrated {migrated_users} users")
        
        # Migrate payments
        print("Migrating payments...")
        sqlite_cursor.execute("SELECT * FROM payments")
        payments_data = sqlite_cursor.fetchall()
        
        # Get column names for payments
        payment_columns = [description[0] for description in sqlite_cursor.description]
        
        migrated_payments = 0
        for payment_row in payments_data:
            payment_dict = dict(zip(payment_columns, payment_row))
            
            # Check if payment already exists (using reference as unique identifier)
            if payment_dict.get('reference'):
                existing_payment = pg_session.query(Payment).filter(
                    Payment.reference == payment_dict['reference']
                ).first()
                if existing_payment:
                    print(f"Payment with reference {payment_dict['reference']} already exists, skipping...")
                    continue
            
            # Create new payment with tenant_id
            new_payment = Payment(
                tenant_id=default_tenant.id,
                user_id=payment_dict['user_id'],
                method=payment_dict['method'],
                amount=payment_dict['amount'],
                status=payment_dict['status'],
                reference=payment_dict.get('reference'),
                created_at=payment_dict['created_at']
            )
            
            pg_session.add(new_payment)
            migrated_payments += 1
        
        pg_session.commit()
        print(f"Migrated {migrated_payments} payments")
        
        print("Migration completed successfully!")
        
    except Exception as e:
        print(f"Migration failed: {e}")
        pg_session.rollback()
        raise
    finally:
        sqlite_conn.close()
        pg_session.close()

if __name__ == "__main__":
    migrate_data()
