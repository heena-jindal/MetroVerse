// src/app/profile/page.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import toast from "react-hot-toast";

const SETTINGS = [
  { icon: "🔔", label: "Push notifications",   type: "toggle", key: "notif" },
  { icon: "🔊", label: "Audio announcements",   type: "toggle", key: "audio" },
  { icon: "🌙", label: "Dark mode",             type: "toggle", key: "dark"  },
  { icon: "🗺️", label: "Default city",          type: "arrow",  sub: "Delhi NCR" },
  { icon: "💬", label: "Language",              type: "arrow",  sub: "English" },
  { icon: "❓", label: "Help & support",         type: "arrow"  },
  { icon: "⭐", label: "Rate MetroVerse",        type: "arrow"  },
  { icon: "📋", label: "Privacy Policy",         type: "arrow"  },
];

const STATS = [
  { val: "18",   label: "Total trips",     color: "#818cf8" },
  { val: "₹645", label: "Total spent",     color: "#22d3ee" },
  { val: "3",    label: "Active tickets",  color: "#fbbf24" },
  { val: "92km", label: "Distance",        color: "#4ade80" },
];

export default function ProfilePage() {
  const router = useRouter();
  const [toggles, setToggles] = useState({ notif: true, audio: true, dark: true });

  function toggle(key) {
    setToggles(t => ({ ...t, [key]: !t[key] }));
    toast.success(`${key === "notif" ? "Notifications" : key === "audio" ? "Audio" : "Dark mode"} ${!toggles[key] ? "enabled" : "disabled"}`);
  }

  return (
    <div className="page-enter" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--mv-bg)" }}>
      <div className="status-bar"><span>9:41</span><span>5G</span></div>

      {/* Profile hero */}
      <div style={{
        background: "linear-gradient(145deg, #0f1629, #141b35)",
        padding: "24px 20px 28px",
        borderBottom: "1px solid var(--mv-border)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 24 }}>
          {/* Avatar */}
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "linear-gradient(135deg, #4338ca, #6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, fontWeight: 900, color: "#fff",
            fontFamily: "'Inter', sans-serif",
            border: "3px solid rgba(99,102,241,0.4)",
            boxShadow: "0 0 0 4px rgba(99,102,241,0.12), 0 8px 24px rgba(99,102,241,0.3)",
            flexShrink: 0,
          }}>H</div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: "-0.5px", fontFamily: "'Inter', sans-serif" }}>Heena Kumari</div>
            <div style={{ fontSize: 13, color: "var(--mv-text-3)", marginTop: 2, fontFamily: "'Inter', sans-serif" }}>heena@dtc.ac.in</div>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <span className="badge badge-indigo">DMRC Member</span>
              <span className="badge badge-cyan">Verified ✓</span>
            </div>
          </div>

          <button
            id="edit-profile-btn"
            onClick={() => toast.success("Edit profile — coming soon")}
            style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10, padding: "8px 12px", fontSize: 12, fontWeight: 600,
              color: "var(--mv-text-2)", cursor: "pointer", fontFamily: "'Inter', sans-serif",
            }}
          >Edit</button>
        </div>

        {/* Metro card balance row */}
        <div style={{
          background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: 14, padding: "14px 16px",
          display: "flex", alignItems: "center", gap: 12,
          cursor: "pointer",
        }} onClick={() => router.push("/tickets")}>
          <span style={{ fontSize: 24 }}>💳</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: "var(--mv-text-3)", fontFamily: "'Inter', sans-serif" }}>Metro Card Balance</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.5px" }}>₹240.00</div>
          </div>
          <button className="btn-sm" style={{ padding: "7px 14px", fontSize: 12 }}>Recharge</button>
        </div>
      </div>

      <div style={{ overflowY: "auto", flex: 1 }}>
        {/* Stats */}
        <div style={{ padding: "18px 20px 4px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--mv-text-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12, fontFamily: "'Inter', sans-serif" }}>
            Your stats
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
            {STATS.map(s => (
              <div key={s.label} style={{
                background: "var(--mv-surface)", border: "1px solid var(--mv-border)",
                borderRadius: 14, padding: "12px 8px", textAlign: "center",
              }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: s.color, fontFamily: "'Inter', sans-serif" }}>{s.val}</div>
                <div style={{ fontSize: 9, color: "var(--mv-text-3)", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "'Inter', sans-serif" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="sec-label">Settings</div>
        <div style={{ background: "var(--mv-surface)", border: "1px solid var(--mv-border)", borderRadius: 16, margin: "0 20px 16px", overflow: "hidden" }}>
          {SETTINGS.map((s, i) => (
            <div key={s.key || s.label} id={`setting-${(s.key || s.label).toLowerCase().replace(/\s+/g, "-")}`} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "15px 16px",
              borderBottom: i < SETTINGS.length - 1 ? "1px solid var(--mv-border)" : "none",
              cursor: s.type === "arrow" ? "pointer" : "default",
            }} onClick={() => s.type === "arrow" && toast.success(`${s.label} — coming soon`)}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{s.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--mv-text)", fontFamily: "'Inter', sans-serif" }}>{s.label}</div>
                {s.sub && <div style={{ fontSize: 11, color: "var(--mv-text-3)", marginTop: 1, fontFamily: "'Inter', sans-serif" }}>{s.sub}</div>}
              </div>
              {s.type === "toggle" ? (
                <div
                  onClick={(e) => { e.stopPropagation(); toggle(s.key); }}
                  style={{
                    width: 44, height: 24, borderRadius: 12,
                    background: toggles[s.key] ? "linear-gradient(135deg, #4338ca, #6366f1)" : "rgba(255,255,255,0.1)",
                    position: "relative", cursor: "pointer", transition: "all 0.3s",
                    boxShadow: toggles[s.key] ? "0 0 8px rgba(99,102,241,0.4)" : "none",
                    flexShrink: 0,
                  }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%", background: "#fff",
                    position: "absolute", top: 3,
                    left: toggles[s.key] ? 23 : 3,
                    transition: "left 0.3s",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                  }} />
                </div>
              ) : (
                <span style={{ color: "var(--mv-text-3)", fontSize: 16 }}>›</span>
              )}
            </div>
          ))}
        </div>

        {/* Logout */}
        <div style={{ padding: "0 20px 32px" }}>
          <button
            id="logout-btn"
            onClick={() => { toast.success("Signed out"); router.push("/"); }}
            style={{
              width: "100%", background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 12, padding: "14px",
              fontSize: 14, fontWeight: 700, color: "#f87171",
              cursor: "pointer", fontFamily: "'Inter', sans-serif",
            }}
          >
            Sign Out
          </button>
          <p style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: "var(--mv-text-3)", fontFamily: "'Inter', sans-serif" }}>
            MetroVerse v1.0 · Built with ❤️ for India
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}