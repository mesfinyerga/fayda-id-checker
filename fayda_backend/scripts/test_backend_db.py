"""
Test script to verify backend database connection.
"""
import os
import sys
from sqlalchemy import create_engine, text

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import engine, DATABASE_URL
from app.core.config import settings

def test_backend_db():
    """Test backend database connection."""
    print("=" * 60)
    print("🔍 Testing Backend Database Connection")
    print("=" * 60)
    print()
    
    # Show connection details
    db_name = DATABASE_URL.split("/")[-1].split("?")[0]
    print(f"📋 Connection String: {DATABASE_URL.split('@')[0]}@***/{db_name}")
    print()
    
    try:
        # Test connection
        print("🔌 Testing connection...")
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version(), current_database()"))
            row = result.fetchone()
            version = row[0]
            database = row[1]
            
            print(f"   ✅ Connected successfully!")
            print(f"   📦 PostgreSQL Version: {version.split(',')[0]}")
            print(f"   🗄️  Database: {database}")
            print()
            
            # Test table access
            print("📋 Testing table access...")
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_type = 'BASE TABLE'
                ORDER BY table_name
            """))
            tables = [row[0] for row in result]
            
            expected_tables = [
                'tenant', 'users', 'payments', 'verification',
                'subject_pii', 'evidence_object', 'audit_event'
            ]
            
            print(f"   Found {len(tables)} table(s):")
            for table in sorted(tables):
                if table in expected_tables:
                    print(f"      ✅ {table}")
                else:
                    print(f"      ⚠️  {table} (not in expected list)")
            
            print()
            print("=" * 60)
            print("✅ Backend Database Connection: SUCCESS")
            print("=" * 60)
            return True
            
    except Exception as e:
        print(f"   ❌ Connection failed: {str(e)}")
        print()
        print("💡 Troubleshooting:")
        print("   1. Check DATABASE_URL in .env file")
        print("   2. Ensure PostgreSQL 18 is running")
        print("   3. Verify database exists")
        print()
        print("=" * 60)
        print("❌ Backend Database Connection: FAILED")
        print("=" * 60)
        return False

if __name__ == "__main__":
    success = test_backend_db()
    sys.exit(0 if success else 1)

