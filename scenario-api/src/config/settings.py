import os
from typing import List

ENV = os.getenv("ENV", "development")
PORT = int(os.getenv("PORT", "8002"))

# CORS settings
CORS_ORIGINS_STR = os.getenv("CORS_ORIGINS", "http://localhost:3000")
CORS_ORIGINS: List[str] = [origin.strip() for origin in CORS_ORIGINS_STR.split(",")]

# Development settings
if ENV == "development":
    CORS_ORIGINS = ["*"]  # Allow all origins in development

HOST = "0.0.0.0" if ENV == "production" else "127.0.0.1"
