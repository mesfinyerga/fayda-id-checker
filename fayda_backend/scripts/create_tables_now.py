"""
Direct script to create all tables in the database.
This works even if migrations haven't run yet.
"""
import os
import sys
from sqlalchemy import create_engine, text, inspect

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import engine, DATABASE_URL
from app.db.base_class import Base
# Import all models to register them
from app.models.user import User
from app.models.payment import Payment
from app.models.tenant import Tenant
from app.models.verification import Verification
from app.models.subject_pii import SubjectPII
from app.models.evidence_object import EvidenceObject
from app.models.audit_event import AuditEvent

def create_all_tables():
    """Create all tables if they don't exist."""
    print("=" * 60)
    print("🛠️  Creating Database Tables")
    print("=" * 60)
    print()
    
    try:
        # Check current tables
        inspector = inspect(engine)
        existing_tables = inspector.get_table_names(schema='public')
        
        print(f"📋 Current tables in database: {len(existing_tables)}")
        if existing_tables:
            for table in sorted(existing_tables):
                print(f"   - {table}")
        print()
        
        # Expected tables
        expected_tables = [
            'tenant', 'users', 'payments', 'verification',
            'subject_pii', 'evidence_object', 'audit_event'
        ]
        
        missing_tables = [t for t in expected_tables if t not in existing_tables]
        
        if missing_tables:
            print(f"⚠️  Missing tables: {', '.join(missing_tables)}")
            print()
            print("🔨 Creating missing tables...")
            
            # Create all tables
            Base.metadata.create_all(bind=engine)
            
            # Verify creation
            inspector = inspect(engine)
            new_tables = inspector.get_table_names(schema='public')
            newly_created = [t for t in new_tables if t not in existing_tables]
            
            if newly_created:
                print(f"✅ Successfully created {len(newly_created)} table(s):")
                for table in sorted(newly_created):
                    print(f"   ✓ {table}")
                print()
            
            # Final check
            final_inspector = inspect(engine)
            final_tables = final_inspector.get_table_names(schema='public')
            all_present = all(t in final_tables for t in expected_tables)
            
            if all_present:
                print("=" * 60)
                print("✅ All required tables are now present!")
                print("=" * 60)
                print()
                print("📊 Final table list:")
                for table in sorted(expected_tables):
                    print(f"   ✓ {table}")
                return True
            else:
                still_missing = [t for t in expected_tables if t not in final_tables]
                print(f"⚠️  Some tables still missing: {still_missing}")
                return False
        else:
            print("✅ All required tables already exist!")
            print()
            print("📊 Tables in database:")
            for table in sorted(expected_tables):
                print(f"   ✓ {table}")
            return True
            
    except Exception as e:
        print(f"❌ Error creating tables: {str(e)}")
        print()
        print("💡 Troubleshooting:")
        print("   1. Make sure PostgreSQL 18 is running")
        print("   2. Check DATABASE_URL in .env file has correct password")
        print("   3. Verify database 'faydaidcheck' exists")
        print(f"   4. Current connection: {DATABASE_URL.split('@')[0]}@***")
        return False

if __name__ == "__main__":
    success = create_all_tables()
    sys.exit(0 if success else 1)

