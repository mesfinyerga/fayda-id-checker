from app.db.session import engine, DATABASE_URL
from app.db.base import User, Payment  # import so both models are registered
from app.db.base_class import Base

def init():
    """Initialize database tables. Works with both PostgreSQL and SQLite."""
    try:
        Base.metadata.create_all(bind=engine)
        db_type = "PostgreSQL" if DATABASE_URL.startswith("postgresql") else "SQLite"
        print(f"✅ Tables created successfully using {db_type}.")
    except Exception as e:
        db_type = "PostgreSQL" if DATABASE_URL.startswith("postgresql") else "SQLite"
        if db_type == "PostgreSQL":
            print(f"❌ Failed to connect to PostgreSQL: {e}")
            print("💡 Make sure:")
            print("   1. PostgreSQL 18 is running")
            print("   2. The database exists (create it in pgAdmin 4 if needed)")
            print("   3. DATABASE_URL in .env is correct")
        else:
            print(f"❌ Failed to create tables: {e}")
        raise

if __name__ == "__main__":
    init()
