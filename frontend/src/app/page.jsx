// src/app/page.jsx
// MetroVerse — Splash / Onboarding
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const FEATURES = [
  { icon: "🗺️", label: "Smart Route Planner", desc: "Dijkstra + ML" },
  { icon: "🤖", label: "AI Crowd Prediction", desc: "Random Forest" },
  { icon: "🔔", label: "Live Push Alerts", desc: "Real-time updates" },
  { icon: "🎙️", label: "Audio Guidance", desc: "Multilingual TTS" },
  { icon: "💳", label: "UPI Ticketing", desc: "QR + Metro Card" },
  { icon: "🏛️", label: "Tourist Guide", desc: "Near your station" },
];

const CITIES = ["Delhi NCR", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Kolkata"];

export default function SplashPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="page-enter" style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "var(--mv-bg)",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Animated background glow orbs */}
      <div style={{
        position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0,
      }}>
        <div style={{
          position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", right: "-15%",
          width: 350, height: 350, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", top: "50%", left: "-10%",
          width: 280, height: 280, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)",
        }} />
      </div>

      {/* Animated metro line network SVG */}
      <svg style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        opacity: 0.06, pointerEvents: "none", zIndex: 0,
      }} viewBox="0 0 400 800" fill="none">
        <line x1="0" y1="200" x2="400" y2="200" stroke="#6366f1" strokeWidth="2" strokeDasharray="8 8">
          <animateTransform attributeName="transform" type="translate" from="-16 0" to="0 0" dur="2s" repeatCount="indefinite" />
        </line>
        <line x1="0" y1="350" x2="400" y2="380" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="6 6">
          <animateTransform attributeName="transform" type="translate" from="0 0" to="-12 0" dur="3s" repeatCount="indefinite" />
        </line>
        <line x1="0" y1="520" x2="400" y2="500" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 10" />
        <line x1="140" y1="0" x2="200" y2="800" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="4 8" />
        <line x1="280" y1="0" x2="320" y2="800" stroke="#22d3ee" strokeWidth="1" strokeDasharray="3 10" />
        <circle cx="140" cy="200" r="5" fill="#6366f1" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="280" cy="350" r="4" fill="#22d3ee" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0.1;0.7" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="200" cy="520" r="4" fill="#f59e0b" opacity="0.6">
          <animate attributeName="opacity" values="0.6;0.1;0.6" dur="1.8s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* Hero Section */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "60px 32px 32px",
        textAlign: "center",
        position: "relative", zIndex: 1,
      }}>

        {/* Brand Logo */}
        <div style={{
          width: 84, height: 84, borderRadius: 24,
          background: "linear-gradient(135deg, #4338ca, #6366f1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 0 1px rgba(99,102,241,0.3), 0 8px 32px rgba(99,102,241,0.4)",
          marginBottom: 24,
          position: "relative",
        }}>
          <div style={{
            position: "absolute", inset: -1, borderRadius: 25,
            background: "linear-gradient(135deg, rgba(99,102,241,0.5), rgba(34,211,238,0.3))",
            filter: "blur(8px)", zIndex: -1,
          }} />
          <span style={{ fontSize: 38, fontWeight: 900, color: "#fff", letterSpacing: "-2px", fontFamily: "'Inter', sans-serif" }}>M</span>
        </div>

        {/* App Name */}
        <h1 style={{
          fontSize: 36, fontWeight: 900, letterSpacing: "-1.5px",
          background: "linear-gradient(135deg, #ffffff 0%, #a5b4fc 50%, #67e8f9 100%)",
          WebkitBackgroundClip: "text", backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: 10,
          fontFamily: "'Inter', sans-serif",
        }}>MetroVerse</h1>

        <p style={{
          fontSize: 14, color: "var(--mv-text-2)", lineHeight: 1.7,
          maxWidth: 280, marginBottom: 28,
          fontFamily: "'Inter', sans-serif",
        }}>
          India's unified metro experience.<br />
          <span style={{ color: "var(--mv-text)", fontWeight: 600 }}>Every city. One app.</span>
        </p>

        {/* City pills */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, maxWidth: 320, marginBottom: 16 }}>
          {CITIES.map((city, i) => (
            <span key={city} style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.6)",
              fontSize: 11, fontWeight: 600,
              padding: "5px 12px", borderRadius: 20,
              backdropFilter: "blur(8px)",
              fontFamily: "'Inter', sans-serif",
              transition: "all 0.2s",
              cursor: "default",
            }}>
              {city}
            </span>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div style={{ padding: "0 20px", position: "relative", zIndex: 1 }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          gap: 10, marginBottom: 24,
        }}>
          {FEATURES.map(f => (
            <div key={f.label} style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14, padding: "14px 8px",
              textAlign: "center",
              backdropFilter: "blur(8px)",
              transition: "all 0.2s",
            }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{f.icon}</div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--mv-text)", lineHeight: 1.3, fontFamily: "'Inter', sans-serif" }}>{f.label}</div>
              <div style={{ fontSize: 9, color: "var(--mv-text-3)", marginTop: 2, fontFamily: "'Inter', sans-serif" }}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          id="get-started-btn"
          className="btn-primary"
          onClick={() => router.push("/login")}
          style={{ marginBottom: 14, fontSize: 16, padding: "16px 24px" }}
        >
          Get Started
          <span style={{ fontSize: 18 }}>→</span>
        </button>

        <div style={{
          textAlign: "center", marginBottom: 32,
          fontSize: 13, color: "var(--mv-text-3)",
          fontFamily: "'Inter', sans-serif",
        }}>
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            style={{
              background: "none", border: "none",
              color: "var(--mv-indigo-400)", fontWeight: 700,
              cursor: "pointer", fontSize: 13,
              fontFamily: "'Inter', sans-serif",
              textDecoration: "underline", textUnderlineOffset: 3,
            }}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}