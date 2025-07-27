from supabase import create_client, Client
from .config import settings

# Initialize Supabase client
supabase: Client = create_client(settings.supabase_url, settings.supabase_key)


# Database connection function
def get_supabase() -> Client:
    return supabase
