import os
from typing import Optional
from pydantic_settings import BaseSettings
from pydantic import field_validator


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

    @field_validator("supabase_url")
    @classmethod
    def validate_supabase_url(cls, v):
        if not v:
            raise ValueError("SUPABASE_URL environment variable is required")
        return v

    @field_validator("supabase_key")
    @classmethod
    def validate_supabase_key(cls, v):
        if not v:
            raise ValueError("SUPABASE_KEY environment variable is required")
        return v

    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore"


settings = Settings()
