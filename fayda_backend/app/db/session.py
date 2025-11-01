from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
import os

# Use DATABASE_URL from environment or fallback to SQLite
# For PostgreSQL 18: postgresql+psycopg://user:password@host:port/database
DATABASE_URL = os.getenv("DATABASE_URL", settings.database_url)

# Configure engine based on database type
if DATABASE_URL.startswith("postgresql"):
    # PostgreSQL connection with connection pooling optimized for PostgreSQL 18
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,  # Verify connections before using
        pool_recycle=300,    # Recycle connections after 5 minutes
    )
else:
    # SQLite fallback
    engine = create_engine(
        DATABASE_URL, connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def set_tenant_context(db, tenant_id: str):
    """Set the current tenant context for RLS policies"""
    if DATABASE_URL.startswith("postgresql"):
        db.execute(text("SET LOCAL app.current_tenant = :tid"), {"tid": tenant_id})
        db.commit()

# Run as a Module from the Project Root
# From your project root (C:\Users\lijma\Documents\GitHub\fayda-id-checker\fayda_backend), run:
#python -m app.db.init_db
