from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    app_name: str = "Fayda ID Checker"
    
    # Database
    # Set DATABASE_URL environment variable to use PostgreSQL 18 (recommended)
    # Format: postgresql+psycopg://user:password@localhost:5432/database_name
    # Falls back to SQLite if DATABASE_URL is not set
    database_url: str = "sqlite:///./fapp.db"
    
    # JWT Settings
    jwt_secret_key: str = "super-secret"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    
    # App Environment
    app_env: str = "dev"
    
    # PII Encryption
    # Set PII_ENCRYPTION_KEY in environment for PII encryption
    # Generate with: python -c "from app.core.pii_encryption import generate_encryption_key; print(generate_encryption_key())"
    pii_encryption_key: Optional[str] = None
    
    # Legacy compatibility
    @property
    def secret_key(self) -> str:
        return self.jwt_secret_key
    
    @property
    def algorithm(self) -> str:
        return self.jwt_algorithm

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        # Allow extra fields for backward compatibility
        extra = "allow"

settings = Settings()
