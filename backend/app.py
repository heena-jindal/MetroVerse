# backend/app.py
# MetroVerse Flask backend
# Run: python app.py

from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import json, os, math, datetime

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "https://*.vercel.app"])

# ── Register chatbot blueprint ────────────────────────────────
from routes.chatbot import chatbot_bp
app.register_blueprint(chatbot_bp)

# ── Load metro data ───────────────────────────────────────────
DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "delhi_gtfs.json")
with open(DATA_PATH, "r", encoding="utf-8") as f:
    METRO = json.load(f)

# ── Build adjacency graph ─────────────────────────────────────
def build_graph():
    graph = {}
    for line in METRO["lines"]:
        stations = line["stations"]
        for i, st in enumerate(stations):
            if st not in graph:
                graph[st] = []
            if i > 0:
                graph[st].append({
                    "to": stations[i-1],
                    "line": line["id"],
                    "lineName": line["name"],
                    "color": line["color"]
                })
            if i < len(stations) - 1:
                graph[st].append({
                    "to": stations[i+1],
                    "line": line["id"],
                    "lineName": line["name"],
                    "color": line["color"]
                })
    return graph

GRAPH = build_graph()
INTERCHANGE_MAP = {ic["station"]: ic["lines"] for ic in METRO["interchanges"]}

# ── Dijkstra ──────────────────────────────────────────────────
def dijkstra(start, end):
    import heapq
    dist      = {st: math.inf for st in GRAPH}
    prev      = {}
    line_used = {}
    dist[start] = 0
    heap = [(0, start)]

    while heap:
        cost, node = heapq.heappop(heap)
        if node == end:
            break
        if cost > dist[node]:
            continue
        for edge in GRAPH.get(node, []):
            penalty = 0
            if node in line_used and line_used[node] != edge["line"] and node in INTERCHANGE_MAP:
                penalty = 3
            new_cost = dist[node] + 1 + penalty
            if new_cost < dist[edge["to"]]:
                dist[edge["to"]]    = new_cost
                prev[edge["to"]]    = node
                line_used[edge["to"]] = edge["line"]
                heapq.heappush(heap, (new_cost, edge["to"]))

    path = []
    cur = end
    while cur in prev:
        path.insert(0, cur)
        cur = prev[cur]
    if cur == start:
        path.insert(0, start)
    return path if path and path[0] == start else []

def calc_fare(stops):
    f = METRO["fares"]
    if stops <= 2:  return f["0-2"]
    if stops <= 5:  return f["3-5"]
    if stops <= 12: return f["6-12"]
    if stops <= 21: return f["13-21"]
    if stops <= 32: return f["22-32"]
    return f["33+"]

def get_lines_used(path):
    lines, cur_line = [], None
    for i in range(1, len(path)):
        edge = next((e for e in GRAPH.get(path[i-1], []) if e["to"] == path[i]), None)
        if edge and edge["line"] != cur_line:
            cur_line = edge["line"]
            line_obj = next((l for l in METRO["lines"] if l["id"] == cur_line), None)
            if line_obj and not any(l["id"] == cur_line for l in lines):
                lines.append({
                    "id":    cur_line,
                    "name":  line_obj["name"],
                    "color": line_obj["color"]
                })
    return lines

def count_interchanges(path):
    changes, cur = 0, None
    for i in range(1, len(path)):
        edge = next((e for e in GRAPH.get(path[i-1], []) if e["to"] == path[i]), None)
        if edge:
            if cur and edge["line"] != cur:
                changes += 1
            cur = edge["line"]
    return changes

# ── ML crowd prediction ───────────────────────────────────────
try:
    import joblib
    model    = joblib.load(os.path.join(os.path.dirname(__file__), "ml", "crowd_model.pkl"))
    ML_READY = True
except Exception:
    ML_READY = False

def predict_crowd(station, hour=None, day=None):
    if hour is None: hour = datetime.datetime.now().hour
    if day  is None: day  = datetime.datetime.now().weekday()

    if ML_READY:
        try:
            station_hash = hash(station) % 288
            pred = model.predict([[station_hash, hour, day, int(day < 5)]])[0]
            return ["Low", "Medium", "High"][int(pred)]
        except Exception:
            pass

    # Rule-based fallback
    peak    = (8 <= hour <= 10) or (17 <= hour <= 20)
    weekend = day >= 5
    if weekend:           return "Low"
    if peak:              return "High"
    if 10 < hour < 17:    return "Low"
    return "Medium"

# ═══════════════════════════════════════════════
# API ROUTES
# ═══════════════════════════════════════════════

@app.route("/api/health")
def health():
    return jsonify({
        "status":   "ok",
        "ml_ready": ML_READY,
        "version":  "1.0.0"
    })

# ── Route search ──────────────────────────────────────────────
@app.route("/api/route", methods=["POST"])
def find_route():
    data = request.get_json()
    src  = data.get("from", "").strip()
    dst  = data.get("to",   "").strip()

    if not src or not dst:
        return jsonify({"error": "Both 'from' and 'to' are required"}), 400
    if src not in GRAPH:
        return jsonify({"error": f"Station not found: {src}"}), 404
    if dst not in GRAPH:
        return jsonify({"error": f"Station not found: {dst}"}), 404

    path = dijkstra(src, dst)
    if not path:
        return jsonify({"error": "No route found between these stations"}), 404

    stops        = len(path) - 1
    fare         = calc_fare(stops)
    time_min     = round(stops * METRO["avg_stop_gap_minutes"])
    lines        = get_lines_used(path)
    interchanges = count_interchanges(path)
    crowd        = predict_crowd(src)

    return jsonify({
        "path":         path,
        "stops":        stops,
        "fare":         fare,
        "time":         time_min,
        "linesUsed":    lines,
        "interchanges": interchanges,
        "crowd":        crowd,
        "from":         src,
        "to":           dst,
    })

# ── Station autocomplete ──────────────────────────────────────
@app.route("/api/stations")
def stations():
    q            = request.args.get("q", "").lower()
    all_stations = list(GRAPH.keys())
    if q:
        all_stations = [s for s in all_stations if q in s.lower()]
    return jsonify({"stations": sorted(all_stations)[:10]})

# ── Crowd prediction ──────────────────────────────────────────
@app.route("/api/crowd/<station>")
def crowd(station):
    hour  = request.args.get("hour", type=int)
    day   = request.args.get("day",  type=int)
    level = predict_crowd(station, hour, day)
    return jsonify({
        "station": station,
        "crowd":   level,
        "ml_used": ML_READY,
        "hour":    hour or datetime.datetime.now().hour,
    })

# ── Nearby places ─────────────────────────────────────────────
@app.route("/api/places/<station>")
def places(station):
    spots = METRO.get("tourist_spots", {}).get(station, [])
    return jsonify({"station": station, "places": spots})

# ── Generate ticket ───────────────────────────────────────────
@app.route("/api/ticket", methods=["POST"])
def generate_ticket():
    data = request.get_json()
    src  = data.get("from")
    dst  = data.get("to")
    fare = data.get("fare", 40)

    import hashlib, time
    raw    = f"{src}-{dst}-{fare}-{time.time()}"
    tid    = "MV" + hashlib.md5(raw.encode()).hexdigest()[:8].upper()
    issued = datetime.datetime.now().isoformat()
    expiry = (datetime.datetime.now() + datetime.timedelta(minutes=90)).isoformat()

    return jsonify({
        "ticket_id":  tid,
        "from":       src,
        "to":         dst,
        "fare":       fare,
        "issued_at":  issued,
        "expires_at": expiry,
        "valid":      True,
        "qr_data":    f"{tid}|{src}|{dst}|{fare}|{issued}",
    })

# ── Fare calculator ───────────────────────────────────────────
@app.route("/api/fare")
def fare():
    stops = request.args.get("stops", type=int, default=0)
    return jsonify({"stops": stops, "fare": calc_fare(stops)})

# ── Live status ───────────────────────────────────────────────
@app.route("/api/status")
def live_status():
    hour = datetime.datetime.now().hour
    peak = (8 <= hour <= 10) or (17 <= hour <= 20)
    return jsonify({
        "lines": [
            {"id": "blue",   "name": "Blue Line",   "status": "On schedule", "delay": 0, "next_train": 3},
            {"id": "yellow", "name": "Yellow Line", "status": "Minor delay", "delay": 2, "next_train": 5},
            {"id": "red",    "name": "Red Line",    "status": "On schedule", "delay": 0, "next_train": 4},
            {"id": "green",  "name": "Green Line",  "status": "On schedule", "delay": 0, "next_train": 6},
            {"id": "violet", "name": "Violet Line", "status": "On schedule", "delay": 0, "next_train": 4},
            {"id": "pink",   "name": "Pink Line",   "status": "On schedule", "delay": 0, "next_train": 7},
        ],
        "peak_hours": peak,
        "timestamp":  datetime.datetime.now().isoformat(),
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)