from pathlib import Path
import pandas as pd
from config import supabase

# -----------------------------
# Configuration
# -----------------------------

BASE_DIR = Path(__file__).resolve().parent.parent
DATASET = BASE_DIR / "datasets" / "dmrc_gtfs"

DELHI_CITY_ID = "9bb2d11f-6469-4a63-8ab1-f54cfcf83090"

print("=" * 60)
print("MetroVerse Station Importer")
print("=" * 60)

# -----------------------------
# Load GTFS Stops
# -----------------------------

stops = pd.read_csv(DATASET / "stops.txt")

print(f"\nLoaded {len(stops)} stations.")

# Keep only required columns
stops = stops[
    [
        "stop_id",
        "stop_name",
        "stop_lat",
        "stop_lon",
    ]
]

# Rename columns
stops.columns = [
    "station_code",
    "station_name",
    "latitude",
    "longitude",
]

# Remove duplicate stations
stops = stops.drop_duplicates(subset=["station_code"])

# -----------------------------
# Existing Stations
# -----------------------------

existing = supabase.table("stations").select("station_code").execute()

existing_codes = {row["station_code"] for row in existing.data}

print(f"Existing stations : {len(existing_codes)}")

inserted = 0
skipped = 0

# -----------------------------
# Insert Stations
# -----------------------------

for _, row in stops.iterrows():

    code = str(row["station_code"]).strip()

    if code in existing_codes:
        skipped += 1
        continue

    station = {
        "city_id": DELHI_CITY_ID,
        "station_code": code,
        "station_name": str(row["station_name"]).strip(),
        "latitude": float(row["latitude"]),
        "longitude": float(row["longitude"]),
        "is_interchange": False,
    }

    try:
        supabase.table("stations").insert(station).execute()
        inserted += 1
        print(f"✅ {station['station_name']}")

    except Exception as e:
        print(f"❌ Error inserting {station['station_name']}")
        print(e)

print("\n" + "=" * 60)
print("Import Completed")
print("=" * 60)

print(f"Inserted : {inserted}")
print(f"Skipped  : {skipped}")