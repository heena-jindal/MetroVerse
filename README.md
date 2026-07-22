# 🚇 MetroVerse AI

> **India's Unified Intelligent Metro Travel Assistant**

MetroVerse AI is a full-stack AI-powered metro navigation platform built for Indian commuters. It combines **Machine Learning**, **real-time route planning**, **conversational AI**, and **live journey guidance** into one unified app covering 6 major Indian metro cities.

---

## 🌟 Live Demo


> Frontend: https://your-vercel-url.vercel.app
> Backend API: https://metrosphere-backend.onrender.com/api/health

---

## ✨ Features Built

### 🗺️ Smart Route Planner
- Dijkstra-based shortest path algorithm on Delhi Metro graph
- Real fare calculation based on DMRC fare table
- Interchange detection across 6 metro lines
- Filter by Fastest / Cheapest / Fewest changes
- Autocomplete station search across 288 stations

### 🤖 ML Crowd Prediction
- Random Forest classifier trained on 34,000+ synthetic Delhi Metro samples
- 84% accuracy across Low / Medium / High crowd levels
- Predictions based on station, hour, day of week, peak/off-peak
- Deployed via Flask REST API — runs on every route search

### 💬 AI Metro Assistant (Verse)
- Conversational chatbot powered by Groq LLaMA 3.3 70B
- Metro-aware system prompt with real fare and station data
- Session-based chat memory
- WhatsApp-style floating bubble UI with unread badge
- Smart fallback replies when offline

### 🧭 Live Journey Navigation
- Station-by-station guided navigation
- Animated progress bar with train indicator
- Auto-advances through stations every 5 seconds
- Real-time countdown — stops left and time remaining
- AI Coach Tip — best coach to board for fastest exit

### 🔔 Push Notifications
- Real browser-level push notifications (like WhatsApp / Instagram)
- Station approach alerts — fires when 1 stop from destination
- Delay alerts, crowd updates, ticket expiry warnings
- Works outside the app using Web Notifications API

### 📷 QR Station Scanner
- Animated QR scanner viewport with gold scan line
- Station info on scan — platform, crowd level, next train
- Mini SVG metro network map showing station position
- Nearby places — food, attractions, markets within 500m

### 🎫 QR Ticket System
- Real QR code generation using `qrcode.react`
- Ticket signed with unique ID, journey, fare and timestamp
- 90-minute validity window
- Save / Share / Print actions

### 💳 Metro Card
- Card balance display with premium visual design
- Quick recharge — ₹100 / ₹200 / ₹500
- UPI payment flow — GPay, PhonePe, Paytm, BHIM
- Full transaction history with credit / debit indicators

### 🎙️ Audio Announcements
- Real text-to-speech using Web Speech API
- Station announcements in English
- Plays automatically during live navigation

### 🏛️ Tourist Guide
- Nearby places loaded from station data
- Categories — food, attractions, markets, cafes, hospitals
- Distance from station in metres

### 🌙 Dark / Light Mode
- Full theme switching via CSS variables
- Toggle from Profile screen
- Persists across sessions

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | React framework, routing, SSR |
| JavaScript (JSX) | Component logic |
| CSS Variables | Theming, dark/light mode |
| qrcode.react | QR ticket generation |
| react-hot-toast | Toast notifications |
| Web Speech API | Audio announcements |
| Web Notifications API | Push notifications |

### Backend
| Technology | Purpose |
|---|---|
| Flask | REST API server |
| Python 3.12 | Core language |
| scikit-learn | Random Forest ML model |
| joblib | Model serialisation |
| Groq SDK | LLaMA 3.3 70B chatbot |
| python-dotenv | Environment config |
| flask-cors | Cross-origin requests |

### Algorithms & Data
| Component | Detail |
|---|---|
| Route search | Dijkstra shortest path on metro graph |
| Fare calculation | DMRC official fare table lookup |
| Crowd prediction | Random Forest — station + hour + day + is_weekday |
| Station data | Custom GTFS-format JSON — 288 stations, 6 lines |
| Tourist data | Curated POI data per station |

---

## 🏗️ Project Structure

```
MetroVerse/
├── frontend/                    # Next.js application
│   └── src/
│       ├── app/
│       │   ├── page.jsx         # Splash screen
│       │   ├── login/           # Login — email + phone OTP
│       │   ├── city/            # City selection (6 cities)
│       │   ├── home/            # Main dashboard
│       │   ├── journey/         # Route planner
│       │   ├── navigate/        # Live navigation
│       │   ├── scanner/         # QR scanner + tourist guide
│       │   ├── tickets/         # QR ticket + metro card
│       │   └── profile/         # Settings + saved routes
│       ├── components/
│       │   ├── ChatBubble.jsx   # AI assistant (Verse)
│       │   ├── PushToast.jsx    # Push notifications
│       │   └── BottomNav.jsx    # Navigation bar
│       ├── lib/
│       │   ├── routeEngine.js   # Dijkstra + fare + autocomplete
│       │   └── api.js           # Backend API calls
│       └── data/
│           └── delhi_metro.json # Station graph + fares + POIs
│
└── backend/                     # Flask REST API
    ├── app.py                   # Main server + all API routes
    ├── routes/
    │   └── chatbot.py           # Groq LLaMA chatbot endpoint
    ├── ml/
    │   └── train_model.py       # Random Forest training script
    └── data/
        └── delhi_gtfs.json      # Metro data (same as frontend)
```

---

## 🚀 Local Setup

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
python ml/train_model.py       # Train ML model — run once
python app.py
```

Backend runs on `http://localhost:5000`

### Environment Variables

Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Create `backend/.env`:
```
GROQ_API_KEY=your_groq_api_key_here
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check + ML status |
| POST | `/api/route` | Find route between two stations |
| GET | `/api/stations?q=` | Station autocomplete search |
| GET | `/api/crowd/<station>` | ML crowd prediction |
| GET | `/api/places/<station>` | Nearby tourist spots |
| POST | `/api/ticket` | Generate signed QR ticket |
| GET | `/api/status` | Live line status |
| POST | `/api/chat` | AI chatbot (Verse) |
| POST | `/api/chat/clear` | Clear chat session |

---

## 🗺️ Cities Supported

| City | Operator | Lines | Stations | Status |
|---|---|---|---|---|
| Delhi NCR | DMRC | 6 | 288 | ✅ Live |
| Mumbai | MMRDA | 3 | 40 | 🔜 Coming soon |
| Bangalore | BMRCL | 2 | 61 | 🔜 Coming soon |
| Hyderabad | HMR | 3 | 57 | 🔜 Coming soon |
| Chennai | CMRL | 2 | 50 | 🔜 Coming soon |
| Kolkata | Metro Rail | 3 | 48 | 🔜 Coming soon |

---

## 📈 ML Model Details

- **Algorithm:** Random Forest Classifier
- **Training samples:** 34,000+
- **Features:** station_id, hour, day_of_week, is_weekday
- **Labels:** Low (0) / Medium (1) / High (2) crowd
- **Accuracy:** 84%
- **Inference:** Real-time, on-device via Flask API

---

## 🔜 Roadmap

- [ ] Firebase Authentication — real login with Google
- [ ] Vercel + Render deployment — live URLs
- [ ] Mumbai metro data layer
- [ ] Razorpay UPI integration
- [ ] Offline mode with Hive cache
- [ ] PWA — installable on phone home screen
- [ ] Travel analytics dashboard
- [ ] RAG-based metro knowledge base

---

## 👩‍💻 Author

**Heena Jindal**  
B.Tech AI/ML Student | Delhi  
Building AI-powered products with Python, Flask, Next.js and ML

[![GitHub](https://img.shields.io/badge/GitHub-heena--jindal-black?logo=github)](https://github.com/heena-jindal)
