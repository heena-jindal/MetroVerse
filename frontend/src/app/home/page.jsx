// src/app/home/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

const CITY_NAMES = {
  delhi: "Delhi NCR", mumbai: "Mumbai", blr: "Bangalore",
  hyd: "Hyderabad", chn: "Chennai", kol: "Kolkata",
};

const QUICK_ACTIONS = [
  { icon: "🗺️", label: "Plan Route",  sub: "Dijkstra engine",   href: "/journey", color: "#6366f1" },
  { icon: "🎫", label: "Buy Ticket",  sub: "QR + UPI",          href: "/tickets", color: "#22d3ee" },
  { icon: "🧭", label: "Navigate",    sub: "Live guidance",      href: "/navigate", color: "#8b5cf6" },
  { icon: "📷", label: "Scan QR",     sub: "Station entry",      href: "/scanner", color: "#f59e0b" },
  { icon: "💳", label: "Metro Card",  sub: "₹240 balance",       href: "/tickets", color: "#ec4899" },
  { icon: "🏛️", label: "Explore",     sub: "Near station",       href: "/scanner", color: "#10b981" },
];

const RECENT_TRIPS = [
  { from: "Rajiv Chowk", to: "Dwarka Sector 21", when: "Today, 8:30 AM",     line: "Blue Line",   fare: 40, lineColor: "#3b82f6" },
  { from: "Noida Sec 15", to: "Mandi House",      when: "Yesterday, 6:15 PM", line: "Blue Line",   fare: 35, lineColor: "#3b82f6" },
  { from: "Kashmere Gate", to: "Nehru Place",     when: "Mon, 9:00 AM",       line: "Violet Line", fare: 50, lineColor: "#8b5cf6" },
];

const LINE_STATUS = [
  { id: "blue",   name: "Blue Line",   status: "On schedule", next: 3,  ok: true  },
  { id: "yellow", name: "Yellow Line", status: "Minor delay", next: 5,  ok: false },
  { id: "red",    name: "Red Line",    status: "On schedule", next: 4,  ok: true  },
  { id: "violet", name: "Violet Line", status: "On schedule", next: 4,  ok: true  },
];

const LINE_COLORS = { blue: "#3b82f6", yellow: "#f59e0b", red: "#ef4444", violet: "#8b5cf6", green: "#22c55e", pink: "#ec4899" };

export default function HomePage() {
  const router = useRouter();
  const [city, setCity] = useState("delhi");
  const [time, setTime] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("mv_city");
    if (saved) setCity(saved);
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
    };
    updateTime();
    const t = setInterval(updateTime, 30000);
    return () => clearInterval(t);
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="page-enter" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--mv-bg)" }}>

      {/* Hero Header */}
      <div style={{
        background: "linear-gradient(145deg, #0f1629 0%, #141b35 60%, #0d1225 100%)",
        padding: "20px 20px 24px",
        position: "relative", overflow: "hidden",
        borderBottom: "1px solid var(--mv-border)",
      }}>
        {/* Ambient glow */}
        <div style={{
          position: "absolute", top: -60, right: -60, width: 200, height: 200,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: "var(--mv-text-3)", fontFamily: "'Inter', sans-serif", fontWeight: 500, marginBottom: 2 }}>
              {greeting},
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.5px" }}>
              Heena 👋
            </div>
          </div>
          <div
            onClick={() => router.push("/profile")}
            style={{
              width: 46, height: 46, borderRadius: "50%",
              background: "linear-gradient(135deg, #4338ca, #6366f1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 900, color: "#fff",
              fontFamily: "'Inter', sans-serif",
              border: "2px solid rgba(99,102,241,0.4)",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
            }}>H</div>
        </div>

        {/* City selector */}
        <div
          id="city-selector"
          onClick={() => router.push("/city")}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20, padding: "5px 12px",
            fontSize: 12, fontWeight: 600, color: "var(--mv-text-2)",
            fontFamily: "'Inter', sans-serif", cursor: "pointer",
            marginBottom: 14, transition: "all 0.2s",
          }}
        >
          📍 {CITY_NAMES[city] || "Delhi NCR"} <span style={{ opacity: 0.5, fontSize: 10 }}>▾</span>
        </div>

        {/* Search bar */}
        <div
          id="home-search"
          onClick={() => router.push("/journey")}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 14, padding: "13px 16px",
            display: "flex", alignItems: "center", gap: 12,
            cursor: "pointer", transition: "all 0.2s",
            backdropFilter: "blur(8px)",
          }}
        >
          <span style={{ fontSize: 18 }}>🔍</span>
          <span style={{ fontSize: 14, color: "var(--mv-text-3)", fontFamily: "'Inter', sans-serif" }}>Where are you going today?</span>
          <span style={{ marginLeft: "auto", color: "var(--mv-indigo-400)", fontSize: 16, fontWeight: 700 }}>→</span>
        </div>
      </div>

      <div style={{ padding: "0 20px", flex: 1, overflowY: "auto" }}>

        {/* Stats cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, margin: "18px 0 16px" }}>
          {[
            { val: "₹240", label: "Card balance", color: "#22d3ee" },
            { val: "18",   label: "Trips this month", color: "#818cf8" },
            { val: "3",    label: "Active tickets", color: "#f59e0b" },
          ].map(({ val, label, color }) => (
            <div key={label} style={{
              background: "var(--mv-surface)",
              border: "1px solid var(--mv-border)",
              borderRadius: 14, padding: "13px 10px",
              textAlign: "center",
              boxShadow: "var(--mv-shadow-sm)",
            }}>
              <div style={{ fontSize: 20, fontWeight: 900, color, fontFamily: "'Inter', sans-serif", letterSpacing: "-0.5px" }}>{val}</div>
              <div style={{ fontSize: 9, fontWeight: 600, color: "var(--mv-text-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 4, fontFamily: "'Inter', sans-serif" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Live status */}
        <div className="sec-hdr" style={{ padding: "0 0 10px" }}>
          <span className="sec-title">Live status</span>
          <span style={{ fontSize: 12, color: "var(--mv-cyan-400)", display: "flex", alignItems: "center", gap: 5, fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
            <span className="live-dot" /> Live
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
          {LINE_STATUS.map(l => (
            <div key={l.id} style={{
              background: "var(--mv-surface)",
              border: `1px solid ${l.ok ? "rgba(34,211,238,0.12)" : "rgba(245,158,11,0.15)"}`,
              borderRadius: 10, padding: "11px 14px",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
                background: LINE_COLORS[l.id] || "#6366f1",
                boxShadow: `0 0 6px ${LINE_COLORS[l.id] || "#6366f1"}88`,
              }} />
              <span style={{ fontSize: 12, color: "var(--mv-text)", flex: 1, fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                <strong style={{ fontWeight: 700 }}>{l.name}</strong> — {l.status}
              </span>
              <span style={{ fontSize: 11, color: l.ok ? "var(--mv-cyan-400)" : "#fbbf24", fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>
                {l.next} min
              </span>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="sec-hdr" style={{ padding: "0 0 10px" }}>
          <span className="sec-title">Quick actions</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 18 }}>
          {QUICK_ACTIONS.map(qa => (
            <div
              id={`action-${qa.label.toLowerCase().replace(" ", "-")}`}
              key={qa.label}
              onClick={() => router.push(qa.href)}
              style={{
                background: "var(--mv-surface)",
                border: "1px solid var(--mv-border)",
                borderRadius: 14, padding: "16px 10px",
                textAlign: "center", cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <div style={{ fontSize: 26, marginBottom: 7 }}>{qa.icon}</div>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--mv-text)", fontFamily: "'Inter', sans-serif" }}>{qa.label}</div>
              <div style={{ fontSize: 9.5, color: "var(--mv-text-3)", marginTop: 2, fontFamily: "'Inter', sans-serif" }}>{qa.sub}</div>
            </div>
          ))}
        </div>

        {/* Recent trips */}
        <div className="sec-hdr" style={{ padding: "0 0 10px" }}>
          <span className="sec-title">Recent trips</span>
          <span className="sec-link">See all</span>
        </div>
        <div style={{ background: "var(--mv-surface)", border: "1px solid var(--mv-border)", borderRadius: 16, overflow: "hidden", marginBottom: 20 }}>
          {RECENT_TRIPS.map((trip, i) => (
            <div
              key={i}
              onClick={() => router.push("/journey")}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "13px 16px",
                borderBottom: i < RECENT_TRIPS.length - 1 ? "1px solid var(--mv-border)" : "none",
                cursor: "pointer", transition: "background 0.15s",
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: `${trip.lineColor}18`,
                border: `1px solid ${trip.lineColor}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16,
              }}>🚇</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--mv-text)", fontFamily: "'Inter', sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {trip.from} → {trip.to}
                </div>
                <div style={{ fontSize: 11, color: "var(--mv-text-3)", marginTop: 2, fontFamily: "'Inter', sans-serif" }}>
                  {trip.when} · {trip.line}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "var(--mv-text)", fontFamily: "'Inter', sans-serif" }}>₹{trip.fare}</div>
                <span className="badge badge-cyan" style={{ marginTop: 4 }}>Done</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}