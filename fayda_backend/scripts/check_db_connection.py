"""
Script to check PostgreSQL connection and list databases/tables.
Run this to verify your database setup before running migrations.
"""
import os
import sys
from sqlalchemy import create_engine, text, inspect
from sqlalchemy.exc import OperationalError

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings

def check_connection():
    """Check database connection and list available databases/tables."""
    
    # Get DATABASE_URL from environment or config
    database_url = os.getenv("DATABASE_URL", settings.database_url)
    
    print("=" * 60)
    print("🔍 Database Connection Checker")
    print("=" * 60)
    print(f"\n📋 Using connection string:")
    print(f"   {database_url.replace(database_url.split('@')[1].split('/')[1] if '@' in database_url else '', '***')}")
    print()
    
    if not database_url.startswith("postgresql"):
        print("⚠️  Warning: Not using PostgreSQL connection string.")
        print("   For PostgreSQL 18, use: postgresql+psycopg://user:password@host:port/database")
        print("   Set DATABASE_URL in your .env file.")
        return False
    
    try:
        # Extract database name from URL to connect to postgres first
        # Format: postgresql+psycopg://user:pass@host:port/dbname
        url_parts = database_url.split("/")
        base_url = "/".join(url_parts[:-1])  # Everything except the database name
        
        print("🔌 Step 1: Testing connection to PostgreSQL server...")
        
        # Try connecting to 'postgres' database first to check if server is accessible
        postgres_url = f"{base_url}/postgres"
        engine = create_engine(postgres_url, pool_pre_ping=True)
        
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version();"))
            version = result.fetchone()[0]
            print(f"   ✅ Connected to PostgreSQL!")
            print(f"   📦 Version: {version.split(',')[0]}")
            print()
            
            # List all databases
            print("📊 Step 2: Listing available databases...")
            result = conn.execute(text("""
                SELECT datname 
                FROM pg_database 
                WHERE datistemplate = false 
                ORDER BY datname;
            """))
            databases = [row[0] for row in result]
            print(f"   Found {len(databases)} database(s):")
            for db in databases:
                print(f"      - {db}")
            print()
            
            # Check if target database exists
            target_db = url_parts[-1].split("?")[0]  # Remove query params if any
            if target_db in databases:
                print(f"✅ Target database '{target_db}' exists!")
                print()
                
                # Now connect to the target database
                print(f"🔌 Step 3: Connecting to '{target_db}' database...")
                target_engine = create_engine(database_url, pool_pre_ping=True)
                
                with target_engine.connect() as target_conn:
                    # List tables
                    print("📋 Step 4: Listing tables in database...")
                    inspector = inspect(target_engine)
                    tables = inspector.get_table_names()
                    
                    if tables:
                        print(f"   Found {len(tables)} table(s):")
                        for table in sorted(tables):
                            # Get row count
                            try:
                                count_result = target_conn.execute(text(f"SELECT COUNT(*) FROM {table}"))
                                count = count_result.fetchone()[0]
                                print(f"      - {table} ({count} rows)")
                            except:
                                print(f"      - {table}")
                    else:
                        print("   ⚠️  No tables found. Run migrations to create tables:")
                        print("      alembic upgrade head")
                    
                    print()
                    print("=" * 60)
                    print("✅ Connection successful! Your database is ready.")
                    print("=" * 60)
                    return True
            else:
                print(f"❌ Target database '{target_db}' does NOT exist!")
                print()
                print("💡 To create the database, run this SQL in pgAdmin 4:")
                print(f"   CREATE DATABASE {target_db};")
                print()
                print("   Or use this Python script:")
                print(f"   python scripts/create_database.py")
                return False
                
    except OperationalError as e:
        print(f"❌ Connection failed!")
        print(f"   Error: {str(e)}")
        print()
        print("💡 Troubleshooting:")
        print("   1. Make sure PostgreSQL 18 is running")
        print("   2. Check your DATABASE_URL in .env file")
        print("   3. Verify username, password, host, and port are correct")
        print("   4. Ensure the 'postgres' database is accessible")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
        return False

if __name__ == "__main__":
    success = check_connection()
    sys.exit(0 if success else 1)

