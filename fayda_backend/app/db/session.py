from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# You can change this to SQLite or PostgreSQL URL as needed
SQLALCHEMY_DATABASE_URL = "sqlite:///./fayda.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
