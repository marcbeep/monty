from supabase import create_client, Client
from typing import Optional
from .config import get_settings

# Global Supabase client instance
_supabase_client: Optional[Client] = None


def get_supabase() -> Client:
    """Get the Supabase client."""
    global _supabase_client

    if _supabase_client is None:
        settings = get_settings()
        _supabase_client = create_client(settings.supabase_url, settings.supabase_key)

    return _supabase_client
