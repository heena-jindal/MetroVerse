from geopy.distance import geodesic
from pathlib import Path
import pandas as pd
from config import supabase

BASE_DIR = Path(__file__).resolve().parent.parent
DATASET = BASE_DIR / "datasets" / "dmrc_gtfs"

print("=" * 60)
print("MetroVerse Connection Importer")
print("=" * 60)

# -----------------------------
# Load GTFS
# -----------------------------


trips = pd.read_csv(DATASET / "trips.txt")
stop_times = pd.read_csv(DATASET / "stop_times.txt")

print(f"Trips Loaded      : {len(trips)}")
print(f"Stop Times Loaded : {len(stop_times)}")

# Sort stops inside every trip
stop_times = stop_times.sort_values(
    ["trip_id", "stop_sequence"]
)

print(stop_times.head())

# Create station lookup
stations = supabase.table("stations").select(
    "id,station_code,latitude,longitude"
).execute()

station_lookup = {}
station_coordinates = {}

for station in stations.data:

    station_lookup[str(station["station_code"])] = station["id"]

    station_coordinates[station["id"]] = (
        station["latitude"],
        station["longitude"]
    )


print(f"Loaded {len(station_lookup)} stations from Supabase.")

connections = []

for trip_id, group in stop_times.groupby("trip_id"):

    group = group.sort_values("stop_sequence")

    rows = group.to_dict("records")

    for i in range(len(rows)-1):

        current = rows[i]
        nxt = rows[i+1]

        from_code = str(current["stop_id"])
        to_code = str(nxt["stop_id"])

        if from_code not in station_lookup:
            continue

        if to_code not in station_lookup:
            continue

        connections.append({
            "from_station": station_lookup[from_code],
            "to_station": station_lookup[to_code]
        })

print(f"Generated {len(connections)} raw connections.")

# ---------------------------------------------------
# Remove Duplicate Connections
# ---------------------------------------------------

unique_connections = {}

for conn in connections:

    key = (
        conn["from_station"],
        conn["to_station"]
    )

    if key not in unique_connections:
        unique_connections[key] = conn

connections = list(unique_connections.values())

print(f"Unique Connections : {len(connections)}")

# ---------------------------------------------------
# Calculate Distance
# ---------------------------------------------------

for conn in connections:

    start = station_coordinates[conn["from_station"]]
    end = station_coordinates[conn["to_station"]]

    distance = geodesic(start, end).km

    conn["distance_km"] = round(distance, 2)

# ---------------------------------------------------
# Calculate Travel Time
# ---------------------------------------------------

AVERAGE_SPEED = 35  # km/h

for conn in connections:

    time = (conn["distance_km"] / AVERAGE_SPEED) * 60

    conn["travel_time_minutes"] = max(
        2,
        round(time)
    )

# ---------------------------------------------------
# Calculate Fare
# ---------------------------------------------------

for conn in connections:

    d = conn["distance_km"]

    if d <= 2:
        fare = 10
    elif d <= 5:
        fare = 20
    elif d <= 12:
        fare = 30
    elif d <= 21:
        fare = 40
    else:
        fare = 50

    conn["fare"] = fare

# ---------------------------------------------------
# Insert into Supabase
# ---------------------------------------------------

print("\nUploading connections to Supabase...\n")

inserted = 0
failed = 0

for conn in connections:

    try:

        supabase.table("station_connections").insert({
            "from_station": conn["from_station"],
            "to_station": conn["to_station"],
            "distance_km": conn["distance_km"],
            "travel_time_minutes": conn["travel_time_minutes"],
            "fare": conn["fare"]
        }).execute()

        inserted += 1

    except Exception as e:
        failed += 1
        print(f"Error: {e}")

print("\n" + "=" * 60)
print("Import Finished")
print("=" * 60)
print(f"Inserted : {inserted}")
print(f"Failed    : {failed}")