import os
from typing import Optional
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    # Supabase Configuration (from environment variables)
    supabase_url: str = Field(
        ..., env="SUPABASE_URL", description="Supabase project URL"
    )
    supabase_key: str = Field(..., env="SUPABASE_KEY", description="Supabase anon key")
    supabase_service_key: str = Field(
        "", env="SUPABASE_SERVICE_KEY", description="Supabase service key (optional)"
    )

    # API Configuration (hardcoded defaults)
    api_host: str = Field("0.0.0.0", env="API_HOST")
    api_port: int = Field(8000, env="API_PORT")
    debug: bool = Field(True, env="DEBUG")

    # CORS Configuration (allow all for simplicity)
    allowed_origins: list[str] = Field(["*"], env="ALLOWED_ORIGINS")

    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Debug: Print environment variable status (remove in production)
        if self.debug:
            print(f"SUPABASE_URL loaded: {'Yes' if self.supabase_url else 'No'}")
            print(f"SUPABASE_KEY loaded: {'Yes' if self.supabase_key else 'No'}")


settings = Settings()
