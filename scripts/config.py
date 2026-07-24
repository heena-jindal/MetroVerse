import os
from pathlib import Path

from dotenv import load_dotenv
from supabase import create_client, Client

# Load .env from the project root
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"

load_dotenv(dotenv_path=ENV_PATH)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL:
    raise ValueError("SUPABASE_URL not found.")

if not SUPABASE_KEY:
    raise ValueError("SUPABASE_KEY not found.")

# Create Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)