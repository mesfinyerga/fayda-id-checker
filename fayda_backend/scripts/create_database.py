"""
Script to create the database if it doesn't exist.
This connects to the 'postgres' database and creates the target database.
"""
import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError, ProgrammingError

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings

def create_database():
    """Create the database if it doesn't exist."""
    
    database_url = os.getenv("DATABASE_URL", settings.database_url)
    
    if not database_url.startswith("postgresql"):
        print("❌ This script only works with PostgreSQL.")
        print("   Set DATABASE_URL in your .env file with a PostgreSQL connection string.")
        return False
    
    # Extract database name from URL
    # Format: postgresql+psycopg://user:pass@host:port/dbname
    url_parts = database_url.split("/")
    base_url = "/".join(url_parts[:-1])
    target_db = url_parts[-1].split("?")[0]  # Remove query params
    
    print("=" * 60)
    print("🛠️  Database Creator")
    print("=" * 60)
    print(f"\n📋 Target database: {target_db}")
    print()
    
    try:
        # Connect to 'postgres' database to create the new database
        postgres_url = f"{base_url}/postgres"
        engine = create_engine(postgres_url, pool_pre_ping=True)
        
        print("🔌 Connecting to PostgreSQL server...")
        with engine.connect() as conn:
            # PostgreSQL doesn't allow CREATE DATABASE in a transaction
            conn.execution_options(autocommit=True).execute(
                text(f"CREATE DATABASE {target_db};")
            )
            print(f"✅ Database '{target_db}' created successfully!")
            print()
            print("📝 Next steps:")
            print("   1. Run migrations: alembic upgrade head")
            print("   2. (Optional) Seed data: python scripts/seed_dev.py")
            return True
            
    except ProgrammingError as e:
        if "already exists" in str(e).lower():
            print(f"ℹ️  Database '{target_db}' already exists.")
            print("   No action needed. Run migrations: alembic upgrade head")
            return True
        else:
            print(f"❌ Error creating database: {str(e)}")
            return False
    except OperationalError as e:
        print(f"❌ Connection failed: {str(e)}")
        print()
        print("💡 Make sure:")
        print("   1. PostgreSQL 18 is running")
        print("   2. DATABASE_URL in .env is correct")
        print("   3. Your user has CREATE DATABASE privileges")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
        return False

if __name__ == "__main__":
    success = create_database()
    sys.exit(0 if success else 1)

