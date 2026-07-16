// src/components/PushToast.jsx
"use client";
import { useState, useEffect, useCallback } from "react";

const NOTIFICATIONS = [
  { icon: "🚇", title: "Approaching destination",    body: "Noida Sector 15 is 2 stations away. Prepare to exit." },
  { icon: "⚠️", title: "Yellow Line delay",          body: "Minor delay near Hauz Khas. Your journey may be affected." },
  { icon: "💡", title: "Smart Coach Tip",            body: "Board Coach 4 — nearest exit at your destination." },
  { icon: "✅", title: "Journey complete!",          body: "You've arrived at Noida Sector 15. Rate your trip?" },
  { icon: "🎫", title: "Ticket expiring soon",       body: "Your QR ticket expires in 15 mins. Scan at the gate now." },
  { icon: "🟢", title: "Blue Line crowd update",     body: "Low crowd predicted on Blue Line for the next 30 minutes." },
];

export default function PushToast() {
  const [toast,   setToast]   = useState(null);
  const [visible, setVisible] = useState(false);
  const [idx,     setIdx]     = useState(0);

  const fire = useCallback((notif) => {
    setToast(notif);
    setVisible(true);

    if (typeof window !== "undefined" && "Notification" in window && window.Notification && window.Notification.permission === "granted") {
      new window.Notification("MetroVerse", { body: notif.body, icon: "/favicon.ico" });
    }

    setTimeout(() => setVisible(false), 5500);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && window.Notification && window.Notification.permission === "default") {
      window.Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const first    = setTimeout(() => { fire(NOTIFICATIONS[0]); setIdx(1); }, 6000);
    const interval = setInterval(() => {
      setIdx(prev => {
        const next = prev % NOTIFICATIONS.length;
        fire(NOTIFICATIONS[next]);
        return next + 1;
      });
    }, 28000);

    return () => { clearTimeout(first); clearInterval(interval); };
  }, [fire]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.fireMetroNotification = (notif) => fire(notif || NOTIFICATIONS[idx % NOTIFICATIONS.length]);
    }
  }, [fire, idx]);

  if (!visible || !toast) return null;

  return (
    <div style={{
      position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
      width: 360, maxWidth: "calc(100vw - 32px)",
      background: "rgba(15,22,41,0.95)", backdropFilter: "blur(16px)",
      borderRadius: 16, border: "1px solid rgba(99,102,241,0.3)",
      boxShadow: "0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1)",
      zIndex: 2000, overflow: "hidden",
      animation: "fadeDown 0.3s cubic-bezier(0.4,0,0.2,1)",
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Progress bar */}
      <div style={{
        height: 3, background: "linear-gradient(90deg, #4338ca, #22d3ee)",
        animation: "toastProgress 5.5s linear forwards", transformOrigin: "left",
      }} />

      {/* App label row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px 6px" }}>
        <div style={{
          width: 20, height: 20, borderRadius: 6,
          background: "linear-gradient(135deg, #4338ca, #6366f1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 900, color: "#fff",
        }}>M</div>
        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--mv-text-2)", letterSpacing: "0.02em" }}>MetroVerse</span>
        <span style={{ fontSize: 10, color: "var(--mv-text-3)", marginLeft: "auto", fontWeight: 500 }}>now</span>
      </div>

      {/* Body */}
      <div style={{ padding: "4px 16px 14px", display: "flex", alignItems: "flex-start", gap: 12 }}>
        <span style={{ fontSize: 24, flexShrink: 0, marginTop: 2, filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))" }}>{toast.icon}</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: "-0.2px" }}>{toast.title}</div>
          <div style={{ fontSize: 12, color: "var(--mv-text-2)", marginTop: 3, lineHeight: 1.5 }}>{toast.body}</div>
        </div>
      </div>

      {/* Action row */}
      <div style={{ display: "flex", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
        <button onClick={() => setVisible(false)} style={{
          flex: 1, padding: "12px", fontSize: 12, fontWeight: 700,
          background: "none", border: "none", cursor: "pointer",
          color: "var(--mv-indigo-400)", fontFamily: "'Inter', sans-serif",
          transition: "background 0.2s",
        }}>View details</button>
        <button onClick={() => setVisible(false)} style={{
          flex: 1, padding: "12px", fontSize: 12, fontWeight: 600,
          background: "none", border: "none", cursor: "pointer",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
          color: "var(--mv-text-3)", fontFamily: "'Inter', sans-serif",
          transition: "background 0.2s",
        }}>Dismiss</button>
      </div>

      <style>{`
        @keyframes toastProgress { from { transform: scaleX(1); } to { transform: scaleX(0); } }
        @keyframes fadeDown { from { opacity: 0; transform: translate(-50%, -10px); } to { opacity: 1; transform: translate(-50%, 0); } }
      `}</style>
    </div>
  );
}