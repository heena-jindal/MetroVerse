# backend/routes/chatbot.py
# MetroVerse AI chatbot — Groq LLaMA backend
# Metro-aware system prompt with real route/fare data access

from flask import Blueprint, request, jsonify, session
from groq import Groq
import os, json, datetime

chatbot_bp = Blueprint("chatbot", __name__)

# ── Groq client ───────────────────────────────────────────────
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# ── Load metro data for context ───────────────────────────────
DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "delhi_gtfs.json")
with open(DATA_PATH, "r", encoding="utf-8") as f:
    METRO = json.load(f)

ALL_STATIONS = []
for line in METRO["lines"]:
    for st in line["stations"]:
        if st not in ALL_STATIONS:
            ALL_STATIONS.append(st)

LINE_NAMES = [l["name"] for l in METRO["lines"]]
FARE_TABLE = METRO["fares"]

# ── System prompt ─────────────────────────────────────────────
SYSTEM_PROMPT = f"""You are Verse, the AI assistant for MetroVerse — India's unified metro app.
You are helpful, friendly, and concise. You answer in 2-4 sentences maximum.

You have knowledge of the following metro networks:
- Delhi NCR (DMRC) — {len(ALL_STATIONS)} stations, lines: {', '.join(LINE_NAMES)}
- Mumbai (MMRDA), Bangalore (Namma Metro), Hyderabad (HMR), Chennai (CMRL), Kolkata Metro

Delhi Metro fare structure:
- 0-2 stations: ₹{FARE_TABLE['0-2']}
- 3-5 stations: ₹{FARE_TABLE['3-5']}
- 6-12 stations: ₹{FARE_TABLE['6-12']}
- 13-21 stations: ₹{FARE_TABLE['13-21']}
- 22-32 stations: ₹{FARE_TABLE['22-32']}
- 33+ stations: ₹{FARE_TABLE['33+']}

Key interchange stations in Delhi:
- Rajiv Chowk: Blue Line + Yellow Line
- Kashmere Gate: Red Line + Yellow Line + Violet Line
- Mandi House: Blue Line + Violet Line
- Central Secretariat: Yellow Line + Violet Line

You can help users with:
1. Finding metro routes between stations
2. Checking fares and travel time
3. Crowd level predictions (peak hours: 8-10 AM and 5-8 PM on weekdays)
4. Buying tickets and recharging metro cards
5. Finding tourist spots near metro stations
6. General metro travel tips

Current time: {datetime.datetime.now().strftime('%I:%M %p, %A')}

Always be helpful and encouraging. If asked about something outside metro travel, 
politely redirect to metro-related topics. Never make up station names.
Keep responses short and practical."""

# ── In-memory session store ───────────────────────────────────
# Format: { session_id: [{"role": "user/assistant", "content": "..."}] }
chat_sessions = {}

MAX_HISTORY = 10  # Keep last 10 messages per session

@chatbot_bp.route("/api/chat", methods=["POST"])
def chat():
    data       = request.get_json()
    user_msg   = data.get("message", "").strip()
    session_id = data.get("session_id", "default")

    if not user_msg:
        return jsonify({"error": "Message is required"}), 400

    # Get or create session history
    if session_id not in chat_sessions:
        chat_sessions[session_id] = []

    history = chat_sessions[session_id]

    # Add user message to history
    history.append({"role": "user", "content": user_msg})

    # Trim history to last MAX_HISTORY messages
    if len(history) > MAX_HISTORY:
        history = history[-MAX_HISTORY:]
        chat_sessions[session_id] = history

    # Build messages for Groq
    messages = [{"role": "system", "content": SYSTEM_PROMPT}] + history

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=200,
            temperature=0.7,
        )
        bot_reply = response.choices[0].message.content.strip()

        # Add bot reply to history
        history.append({"role": "assistant", "content": bot_reply})
        chat_sessions[session_id] = history

        return jsonify({
            "reply":      bot_reply,
            "session_id": session_id,
            "history_len": len(history),
        })

    except Exception as e:
        # Fallback reply if Groq fails
        fallback = get_fallback_reply(user_msg)
        return jsonify({
            "reply":      fallback,
            "session_id": session_id,
            "error":      str(e),
        })

@chatbot_bp.route("/api/chat/clear", methods=["POST"])
def clear_chat():
    data       = request.get_json()
    session_id = data.get("session_id", "default")
    if session_id in chat_sessions:
        del chat_sessions[session_id]
    return jsonify({"cleared": True, "session_id": session_id})

# ── Smart fallback replies ─────────────────────────────────────
def get_fallback_reply(text):
    t = text.lower()
    if any(w in t for w in ["fare", "cost", "price", "ticket"]):
        return "Delhi Metro fares range from ₹10 to ₹60 based on distance. Use the Journey Planner for exact fares between two stations."
    if any(w in t for w in ["crowd", "busy", "rush"]):
        return "Peak hours are 8–10 AM and 5–8 PM on weekdays. Blue Line is usually most crowded at Rajiv Chowk during these times."
    if any(w in t for w in ["route", "how to go", "reach", "from", "to"]):
        return "Open the Journey Planner tab, enter your source and destination, and I'll show you the fastest route with fare and timing."
    if any(w in t for w in ["rajiv chowk", "kashmere", "mandi house"]):
        return "That's a major interchange station. You can change metro lines there. Check the Journey Planner for routes through this station."
    if any(w in t for w in ["recharge", "balance", "card"]):
        return "Go to Tickets → Metro Card tab to recharge your card. You can pay via GPay, PhonePe, Paytm or any UPI app."
    return "I'm your MetroVerse assistant! Ask me about routes, fares, crowd levels, or nearby places at any station."