import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

# Manually load .env file into os.environ before anything else to ensure Prisma and other tools can read it
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env")
if os.path.exists(env_path):
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, val = line.split("=", 1)
                # Remove quotes if present
                val = val.strip("'\"")
                os.environ[key.strip()] = val

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/trd_lex?schema=public"
    JWT_SECRET: str = "super_secret_jwt_key_trd_lex_2026_change_me"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    API_VERSION: str = "v1"
    
    # Allow reading from .env file from the parent/current directory
    model_config = SettingsConfigDict(
        env_file=env_path,
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
