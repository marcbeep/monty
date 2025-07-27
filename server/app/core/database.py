from supabase import create_client, Client
from .config import settings

# Initialize Supabase client
supabase: Client = None

try:
    if settings.supabase_url and settings.supabase_key:
        supabase = create_client(settings.supabase_url, settings.supabase_key)
except Exception:
    # Handle missing environment variables during development
    pass


# Database connection function
def get_supabase() -> Client:
    if supabase is None:
        raise Exception(
            "Supabase client not initialized. Please check your environment variables."
        )
    return supabase
