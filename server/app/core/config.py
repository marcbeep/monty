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
        # Try multiple approaches for Railway environment variable detection
        supabase_url = None
        supabase_key = None

        # Method 1: Standard os.getenv with multiple case variations
        for url_var in ["SUPABASE_URL", "supabase_url", "Supabase_Url"]:
            supabase_url = os.getenv(url_var)
            if supabase_url:
                break

        for key_var in ["SUPABASE_KEY", "supabase_key", "Supabase_Key"]:
            supabase_key = os.getenv(key_var)
            if supabase_key:
                break

        # Method 2: Direct environment access
        if not supabase_url:
            supabase_url = os.environ.get("SUPABASE_URL") or os.environ.get(
                "supabase_url"
            )
        if not supabase_key:
            supabase_key = os.environ.get("SUPABASE_KEY") or os.environ.get(
                "supabase_key"
            )

        # Try pydantic-settings first
        try:
            _settings = Settings()
        except Exception as pydantic_error:
            print(f"⚠️  Pydantic settings failed: {pydantic_error}")

            # Fallback: create manually if we found the variables
            if supabase_url and supabase_key:
                print("✅ Using fallback method to create settings")
                _settings = Settings.model_construct(
                    supabase_url=supabase_url, supabase_key=supabase_key
                )
            else:
                print("❌ Environment variables not found with any method")
                print(
                    f"   Available env vars: {[k for k in os.environ.keys() if 'SUPABASE' in k.upper()]}"
                )
                raise RuntimeError(
                    f"Required environment variables SUPABASE_URL and SUPABASE_KEY not found. "
                    f"Pydantic error: {pydantic_error}"
                )

    return _settings


def reset_settings():
    """Reset settings cache - useful for testing or when environment changes."""
    global _settings
    _settings = None
