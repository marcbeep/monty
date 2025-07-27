import os
from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Supabase Configuration (from .env)
    supabase_url: str = ""
    supabase_key: str = ""
    supabase_service_key: str = ""

    # API Configuration (hardcoded defaults)
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    debug: bool = True

    # CORS Configuration (allow all for simplicity)
    allowed_origins: list[str] = ["*"]

    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore"


settings = Settings()
