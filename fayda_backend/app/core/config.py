from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Fayda ID Checker"
    secret_key: str = "super-secret"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    class Config:
        env_file = ".env"

settings = Settings()
