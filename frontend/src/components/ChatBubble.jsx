// src/components/ChatBubble.jsx
// MetroVerse AI assistant — Verse
"use client";
import { useState, useRef, useEffect } from "react";

const NUDGES = [
  "Need help planning a route? 🗺️",
  "Ask me about fares or timing!",
  "I can find the best metro line.",
  "Which stations are you between?",
];

const QUICK_QUESTIONS = [
  { label: "Check fare",    text: "What is the fare from Rajiv Chowk to Noida Sector 15?" },
  { label: "Crowd status",  text: "How crowded is the Blue Line right now?" },
  { label: "Buy ticket",    text: "How do I buy a metro ticket?" },
  { label: "Best route",    text: "Fastest route from Kashmere Gate to Hauz Khas?" },
];

const LOCAL_REPLIES = {
  fare:           "Delhi Metro fares: ₹10 (0-2 stops) · ₹20 (3-5) · ₹30 (6-12) · ₹40 (13-21) · ₹50 (22-32) · ₹60 (33+). Use Journey Planner for exact fare. 🎫",
  crowd:          "Peak hours are 8–10 AM and 5–8 PM on weekdays. Blue Line is busiest at Rajiv Chowk. Travel off-peak for comfort. 🟡",
  ticket:         "Go to Tickets tab → select QR Ticket. Pay via GPay, PhonePe, Paytm or any UPI app. Ticket is valid for 90 minutes. 📱",
  route:          "Open Journey Planner, enter source and destination. I'll show the fastest route with fare, time and crowd level. 🗺️",
  recharge:       "Go to Tickets → Metro Card tab. Choose ₹100, ₹200 or ₹500 and pay via UPI. Balance updates instantly. 💳",
  "rajiv chowk":  "Rajiv Chowk is Delhi's busiest interchange — Blue Line + Yellow Line meet here. Expect medium to high crowd during peak hours. 🏛️",
  "kashmere gate":"Kashmere Gate connects Red, Yellow and Violet lines. It's the largest interchange in Delhi Metro. 🔀",
  "mandi house":  "Mandi House connects Blue Line and Violet Line. Great for central Delhi destinations. 🚇",
  "blue line":    "Blue Line runs from Dwarka Sector 21 to Vaishali, passing through Rajiv Chowk, Mandi House and Yamuna Bank. 🔵",
  "yellow line":  "Yellow Line runs from Samaypur Badli to HUDA City Centre, through New Delhi, Rajiv Chowk, AIIMS and Hauz Khas. 🟡",
  airport:        "Take Orange Airport Express from New Delhi Metro Station. Reaches IGI Airport in ~20 minutes. Fare ₹60. ✈️",
  time:           "Average speed is 34 km/h. Each station gap is ~2.5 minutes. Use Journey Planner for exact travel time. ⏱️",
  hello:          "Hi! I'm Verse, your MetroVerse AI assistant. Ask me about routes, fares, timings or anything metro! 🤖",
  hi:             "Hello! How can I help with your metro journey today? 👋",
  thanks:         "Happy to help! Have a safe journey. 🚇✨",
  bye:            "Goodbye! Have a great journey. Stay safe! 👋",
  help:           "I can help with: **Route planning** · **Fares** · **Crowd levels** · **Tickets** · **Card recharge** · **Nearby places**. What do you need?",
  default:        "I can help with metro routes, fares, timings and crowd levels. Try asking about fares from Rajiv Chowk or how crowded the Blue Line is. 💬",
};

function getLocalReply(text) {
  const t = text.toLowerCase();
  for (const key of Object.keys(LOCAL_REPLIES)) {
    if (key !== "default" && t.includes(key)) return LOCAL_REPLIES[key];
  }
  return LOCAL_REPLIES.default;
}

export default function ChatBubble() {
  const [open, setOpen]       = useState(false);
  const [msgs, setMsgs]       = useState([
    { role: "bot", text: "Hi! I'm **Verse**, your MetroVerse AI. Ask me about routes, fares, or crowd levels! 🚇" },
  ]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread]   = useState(0);
  const [nudgeIdx, setNudgeIdx] = useState(0);
  const [showNudge, setShowNudge] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setShowNudge(true), 5000);
    const i = setInterval(() => { setNudgeIdx(n => (n + 1) % NUDGES.length); setShowNudge(true); }, 18000);
    return () => { clearTimeout(t); clearInterval(i); };
  }, []);

  useEffect(() => {
    if (open) { setUnread(0); setShowNudge(false); bottomRef.current?.scrollIntoView({ behavior: "smooth" }); inputRef.current?.focus(); }
  }, [open, msgs]);

  async function send(text) {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    setLoading(true);
    setMsgs(m => [...m, { role: "user", text: msg }]);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, session_id: "web_" + Date.now() }),
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        setMsgs(m => [...m, { role: "bot", text: data.reply }]);
        if (!open) setUnread(u => u + 1);
        setLoading(false);
        return;
      }
    } catch {}

    // Fallback: local reply
    setTimeout(() => {
      setMsgs(m => [...m, { role: "bot", text: getLocalReply(msg) }]);
      if (!open) setUnread(u => u + 1);
      setLoading(false);
    }, 600);
  }

  function renderText(text) {
    return text.replace(/\*\*(.*?)\*\*/g, (_, b) => `<strong>${b}</strong>`);
  }

  if (!open) {
    return (
      <div style={{ position: "fixed", bottom: 88, right: 20, zIndex: 1000 }}>
        {showNudge && (
          <div style={{
            position: "absolute", right: 0, bottom: 68,
            background: "rgba(15,22,41,0.95)", backdropFilter: "blur(16px)",
            border: "1px solid rgba(99,102,241,0.3)",
            borderRadius: "14px 14px 4px 14px",
            padding: "10px 14px", width: 190,
            fontSize: 12, color: "var(--mv-text-2)", lineHeight: 1.5,
            fontFamily: "'Inter', sans-serif",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            animation: "fadeUp 0.3s ease",
          }}>{NUDGES[nudgeIdx]}</div>
        )}
        <button
          id="chat-open-btn"
          onClick={() => { setOpen(true); setShowNudge(false); }}
          style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "linear-gradient(135deg, #4338ca, #6366f1)",
            border: "2px solid rgba(99,102,241,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, cursor: "pointer",
            boxShadow: "0 0 0 6px rgba(99,102,241,0.12), 0 8px 24px rgba(99,102,241,0.4)",
            animation: "pulse 2.5s infinite",
          }}
        >🤖</button>
        {unread > 0 && (
          <div style={{
            position: "absolute", top: -4, right: -4,
            width: 20, height: 20, borderRadius: "50%",
            background: "#ef4444", color: "#fff",
            fontSize: 11, fontWeight: 800, display: "flex",
            alignItems: "center", justifyContent: "center",
            fontFamily: "'Inter', sans-serif",
            border: "2px solid var(--mv-bg)",
          }}>{unread}</div>
        )}
        <style>{`
          @keyframes pulse {
            0%,100% { box-shadow: 0 0 0 6px rgba(99,102,241,0.12), 0 8px 24px rgba(99,102,241,0.4); }
            50%      { box-shadow: 0 0 0 12px rgba(99,102,241,0.06), 0 8px 24px rgba(99,102,241,0.4); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      position: "fixed", bottom: 80, right: 12, left: 12,
      maxWidth: 400, margin: "0 auto",
      background: "rgba(10, 14, 28, 0.97)",
      backdropFilter: "blur(24px)",
      border: "1px solid rgba(99,102,241,0.25)",
      borderRadius: 24, overflow: "hidden",
      zIndex: 1000,
      boxShadow: "0 16px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(99,102,241,0.1)",
      animation: "fadeUp 0.25s ease",
      display: "flex", flexDirection: "column",
      height: 480,
    }}>
      {/* Header */}
      <div style={{
        padding: "14px 16px",
        background: "linear-gradient(135deg, rgba(67,56,202,0.5), rgba(99,102,241,0.3))",
        borderBottom: "1px solid rgba(99,102,241,0.2)",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 12,
          background: "linear-gradient(135deg, #4338ca, #6366f1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, boxShadow: "0 2px 10px rgba(99,102,241,0.4)",
        }}>🤖</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", fontFamily: "'Inter', sans-serif" }}>Verse</div>
          <div style={{ fontSize: 11, color: "var(--mv-indigo-300)", display: "flex", alignItems: "center", gap: 5, fontFamily: "'Inter', sans-serif" }}>
            <span className="live-dot" style={{ width: 5, height: 5 }} /> AI Metro Assistant
          </div>
        </div>
        <button id="chat-close-btn" onClick={() => setOpen(false)} style={{
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 8, width: 32, height: 32,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, color: "var(--mv-text-2)", cursor: "pointer",
        }}>✕</button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 8px", display: "flex", flexDirection: "column", gap: 10 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            {m.role === "bot" && (
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, marginRight: 8, flexShrink: 0, alignSelf: "flex-end" }}>🤖</div>
            )}
            <div style={{
              maxWidth: "78%", padding: "10px 14px",
              borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              background: m.role === "user"
                ? "linear-gradient(135deg, #4338ca, #6366f1)"
                : "rgba(255,255,255,0.05)",
              border: m.role === "user" ? "none" : "1px solid rgba(255,255,255,0.07)",
              fontSize: 13, lineHeight: 1.6, color: "#fff",
              fontFamily: "'Inter', sans-serif",
            }} dangerouslySetInnerHTML={{ __html: renderText(m.text) }} />
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤖</div>
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px 16px 16px 4px", padding: "12px 16px", display: "flex", gap: 5 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--mv-indigo-400)", animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick questions */}
      <div style={{ padding: "4px 10px 6px", display: "flex", gap: 6, overflowX: "auto" }}>
        {QUICK_QUESTIONS.map(q => (
          <button key={q.label} id={`quick-${q.label.toLowerCase().replace(/\s+/g, "-")}`} onClick={() => send(q.text)} style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14, padding: "5px 12px",
            fontSize: 11, color: "var(--mv-text-2)", fontWeight: 600,
            cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
            fontFamily: "'Inter', sans-serif", transition: "all 0.15s",
          }}>{q.label}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: "8px 10px 12px", display: "flex", gap: 8, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <input
          id="chat-input"
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Ask anything about metro…"
          disabled={loading}
          style={{
            flex: 1, background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
            padding: "10px 14px", fontSize: 13, color: "#fff",
            outline: "none", fontFamily: "'Inter', sans-serif",
          }}
        />
        <button id="chat-send-btn" onClick={() => send()} disabled={loading || !input.trim()} style={{
          width: 42, height: 42, borderRadius: 12,
          background: input.trim() ? "linear-gradient(135deg, #4338ca, #6366f1)" : "rgba(255,255,255,0.05)",
          border: "none", cursor: input.trim() ? "pointer" : "default",
          fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s", flexShrink: 0,
        }}>→</button>
      </div>

      <style>{`
        @keyframes bounce { 0%,80%,100% { transform: scale(0.7); opacity:0.4; } 40% { transform: scale(1); opacity:1; } }
      `}</style>
    </div>
  );
}