import os
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    supabase_url: str = Field(..., env="SUPABASE_URL")
    supabase_key: str = Field(..., env="SUPABASE_KEY")
    supabase_service_key: str = Field("", env="SUPABASE_SERVICE_KEY")
    api_host: str = Field("0.0.0.0", env="API_HOST")
    api_port: int = Field(8000, env="API_PORT")
    debug: bool = Field(False, env="DEBUG")
    allowed_origins: list[str] = Field(["*"], env="ALLOWED_ORIGINS")


_settings = None


def get_settings() -> Settings:
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings


# For backwards compatibility - but this will lazy load
class SettingsProxy:
    def __getattr__(self, name):
        return getattr(get_settings(), name)


settings = SettingsProxy()
