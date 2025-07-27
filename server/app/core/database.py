from supabase import create_client, Client
from typing import Optional
from .config import settings
import logging

logger = logging.getLogger(__name__)

# Global Supabase client instance
_supabase_client: Optional[Client] = None


def initialize_supabase() -> Client:
    """Initialize the Supabase client with environment variables."""
    global _supabase_client

    if _supabase_client is not None:
        return _supabase_client

    try:
        # Follow the official Supabase Python docs pattern
        url: str = settings.supabase_url
        key: str = settings.supabase_key

        if not url or not key:
            raise ValueError("Supabase URL and key must be provided")

        _supabase_client = create_client(url, key)
        logger.info("Supabase client initialized successfully")
        return _supabase_client

    except Exception as e:
        logger.error(f"Failed to initialize Supabase client: {e}")
        raise Exception(f"Supabase initialization failed: {e}")


def get_supabase() -> Client:
    """Get the initialized Supabase client."""
    if _supabase_client is None:
        return initialize_supabase()
    return _supabase_client


# Initialize the client when the module is imported
try:
    initialize_supabase()
except Exception as e:
    logger.warning(f"Supabase client initialization delayed due to: {e}")
    # Don't fail module import, allow lazy initialization via get_supabase()
