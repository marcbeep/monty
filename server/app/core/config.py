import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Only the environment variables the user actually has
    supabase_url: str
    supabase_key: str

    class Config:
        env_file = ".env"


# Simple singleton pattern - no complex proxy
_settings = None


def get_settings() -> Settings:
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings


# Direct access for backwards compatibility
settings = get_settings()
