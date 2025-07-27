import os
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Only the environment variables the user actually has
    supabase_url: str
    supabase_key: str

    class Config:
        env_file = ".env"
        # Try multiple environment variable naming patterns
        case_sensitive = False


# Global settings instance
_settings: Optional[Settings] = None


def get_settings() -> Settings:
    """Get settings, loading them lazily only when needed."""
    global _settings
    if _settings is None:
        try:
            _settings = Settings()
        except Exception as e:
            # Fallback: try to get directly from os.environ if pydantic fails
            supabase_url = os.getenv("SUPABASE_URL") or os.getenv("supabase_url")
            supabase_key = os.getenv("SUPABASE_KEY") or os.getenv("supabase_key")

            if not supabase_url or not supabase_key:
                raise RuntimeError(
                    f"Required environment variables not found. Error: {e}"
                )

            # Create settings manually if pydantic fails
            _settings = Settings.model_construct(
                supabase_url=supabase_url, supabase_key=supabase_key
            )

    return _settings


# DO NOT instantiate settings at module import time
# This was causing the Railway deployment issue
