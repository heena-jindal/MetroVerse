# backend/ml/train_model.py
# Train the Random Forest crowd prediction model
# Run once: python ml/train_model.py

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib, os, json

print("MetroVerse — Training crowd prediction model...")

# ── Load station list ─────────────────────────────────────────
DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "delhi_gtfs.json")
with open(DATA_PATH) as f:
    metro = json.load(f)

all_stations = []
for line in metro["lines"]:
    for st in line["stations"]:
        if st not in all_stations:
            all_stations.append(st)

station_ids = {st: i for i, st in enumerate(all_stations)}
print(f"Loaded {len(all_stations)} unique stations")

# ── Generate synthetic training data ─────────────────────────
# Features: station_id, hour (0-23), day_of_week (0-6), is_weekday
# Labels:   0=Low, 1=Medium, 2=High

np.random.seed(42)
rows = []

MAJOR_HUBS = ["Rajiv Chowk", "Kashmere Gate", "Mandi House", "Central Secretariat",
              "Indraprastha", "Yamuna Bank", "Noida City Centre", "Huda City Centre"]

# Remove noise variation, make labels deterministic
for station, sid in station_ids.items():
    is_hub = station in MAJOR_HUBS
    for day in range(7):
        is_weekday = int(day < 5)
        for hour in range(24):
            morning_peak = is_weekday and 8 <= hour <= 10
            evening_peak = is_weekday and 17 <= hour <= 20
            off_hours    = hour < 6 or hour >= 23
            lunch_mild   = is_weekday and 12 <= hour <= 14
            friday_eve   = day == 4 and 17 <= hour <= 20
            monday_morn  = day == 0 and 8 <= hour <= 10

            if off_hours:
                base = 0
            elif morning_peak or evening_peak:
                base = 2 if is_hub else 1
            elif friday_eve or monday_morn:
                base = 2 if is_hub else 1
            elif lunch_mild:
                base = 1
            elif not is_weekday and 10 <= hour <= 18:
                base = 1
            else:
                base = 0

            # Only 2 samples per slot, very small noise
            for _ in range(2):
                noise = np.random.choice([-1, 0, 1], p=[0.05, 0.90, 0.05])
                label = int(np.clip(base + noise, 0, 2))
                rows.append([sid, hour, day, is_weekday, label])

df = pd.DataFrame(rows, columns=["station_id", "hour", "day", "is_weekday", "crowd"])
print(f"Generated {len(df)} training samples")
print("Crowd distribution:\n", df["crowd"].value_counts().rename({0:"Low", 1:"Medium", 2:"High"}))

# ── Train model ───────────────────────────────────────────────
X = df[["station_id", "hour", "day", "is_weekday"]]
y = df["crowd"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(
    n_estimators=300,
    max_depth=12,
    min_samples_leaf=2,
    max_features="sqrt",
    random_state=42,
    n_jobs=-1
)
model.fit(X_train, y_train)

# ── Evaluate ──────────────────────────────────────────────────
y_pred = model.predict(X_test)
print("\nModel evaluation:")
print(classification_report(y_test, y_pred, target_names=["Low", "Medium", "High"]))

accuracy = model.score(X_test, y_test)
print(f"Accuracy: {accuracy:.2%}")

# ── Save model ────────────────────────────────────────────────
os.makedirs(os.path.dirname(__file__), exist_ok=True)
save_path = os.path.join(os.path.dirname(__file__), "crowd_model.pkl")
joblib.dump(model, save_path)
print(f"\nModel saved to: {save_path}")
print("Training complete!")