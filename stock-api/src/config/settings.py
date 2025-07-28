from typing import List

# CORS settings - Allow all origins for maximum accessibility
CORS_ORIGINS: List[str] = ["*"]

# Cache settings
CACHE_DURATION = 300  # 5 minutes

# API settings
MAX_BATCH_SIZE = 10
MIN_QUERY_LENGTH = 2
DEFAULT_SEARCH_LIMIT = 10

# Server settings
HOST = "0.0.0.0"
PORT = 8001
