import os
from typing import List

# Environment detection
ENV = os.getenv("ENV", "development")
IS_PRODUCTION = ENV == "production"

# CORS settings - Allow all origins for maximum accessibility
CORS_ORIGINS: List[str] = ["*"]

# Cache settings
CACHE_DURATION = 300  # 5 minutes

# API settings
MAX_BATCH_SIZE = 10
MIN_QUERY_LENGTH = 2
DEFAULT_SEARCH_LIMIT = 10

# Server settings
HOST = "0.0.0.0" if IS_PRODUCTION else "127.0.0.1"
PORT = int(os.getenv("PORT", "8002"))

# Hub (server) URL
HUB_URL = os.getenv("MONTY_SERVER_URL", "http://127.0.0.1:3001")
API_PREFIX = "/api/v1"
