import os
from pathlib import Path

from dotenv import load_dotenv
from supabase import create_client

# Path to the project root (D:\MetroVerse)
BASE_DIR = Path(__file__).resolve().parents[2]

# Load the .env file from the project root
load_dotenv(BASE_DIR / ".env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

print("BASE_DIR:", BASE_DIR)
print("ENV EXISTS:", (BASE_DIR / ".env").exists())
print("URL:", SUPABASE_URL)
print("KEY FOUND:", SUPABASE_KEY is not None)

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)