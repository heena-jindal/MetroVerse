// src/app/scanner/page.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { getTouristSpots, getInterchangeInfo } from "@/lib/routeEngine";
import toast from "react-hot-toast";

const TYPE_STYLES = {
  food:       { icon: "🍛", color: "#f59e0b" },
  attraction: { icon: "🏛️", color: "#6366f1" },
  market:     { icon: "🛍️", color: "#8b5cf6" },
  cafe:       { icon: "☕", color: "#22d3ee" },
};

export default function ScannerPage() {
  const router = useRouter();
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const station = "Rajiv Chowk";
  const spots = getTouristSpots(station);
  const interchange = getInterchangeInfo(station);

  function simulateScan() {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
      toast.success("Station scanned successfully!");
    }, 1800);
  }

  return (
    <div className="page-enter" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--mv-bg)" }}>
      <div className="status-bar"><span>9:41</span><span>5G</span></div>

      <div className="scr-hdr">
        <button className="back-btn" onClick={() => router.push("/home")}>‹</button>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", fontFamily: "'Inter', sans-serif" }}>Station Scanner</div>
          <div style={{ fontSize: 11, color: "var(--mv-text-3)", fontFamily: "'Inter', sans-serif" }}>Scan gate QR to check in or explore</div>
        </div>
      </div>

      {/* Scanner viewport */}
      <div style={{
        background: "#000",
        margin: "16px 20px",
        borderRadius: 20, overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
      }}>
        <div style={{ height: 240, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #050810, #0a0d1a)" }}>
          {/* Ambient glow */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, rgba(99,102,241,0.08) 0%, transparent 70%)" }} />

          {/* Corner brackets */}
          <div style={{ width: 180, height: 180, position: "relative" }}>
            {[
              { top: 0, left: 0, borderWidth: "3px 0 0 3px" },
              { top: 0, right: 0, borderWidth: "3px 3px 0 0" },
              { bottom: 0, left: 0, borderWidth: "0 0 3px 3px" },
              { bottom: 0, right: 0, borderWidth: "0 3px 3px 0" },
            ].map((style, i) => (
              <div key={i} style={{
                position: "absolute", width: 30, height: 30,
                borderColor: scanning ? "var(--mv-cyan-400)" : "var(--mv-indigo-400)",
                borderStyle: "solid",
                transition: "border-color 0.4s",
                boxShadow: scanning ? `0 0 10px var(--mv-cyan-400)66` : "none",
                ...style,
              }} />
            ))}

            {/* Scan line */}
            <div style={{
              position: "absolute", left: 0, right: 0, height: 2,
              background: scanning
                ? "linear-gradient(90deg, transparent, var(--mv-cyan-400), transparent)"
                : "linear-gradient(90deg, transparent, var(--mv-indigo-400), transparent)",
              animation: (scanning || true) ? "qrScan 2.2s ease-in-out infinite" : "none",
              boxShadow: "0 0 8px rgba(34,211,238,0.6)",
            }} />
          </div>

          {scanning && (
            <div style={{
              position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)",
              fontSize: 11, fontWeight: 700, color: "var(--mv-cyan-400)",
              fontFamily: "'Inter', sans-serif", letterSpacing: "0.05em",
            }}>SCANNING…</div>
          )}
        </div>
        <div style={{ padding: "12px 16px", textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.35)", borderTop: "1px solid rgba(255,255,255,0.05)", fontFamily: "'Inter', sans-serif" }}>
          📷 Align station QR code within the frame · Auto-detect
        </div>
      </div>

      <div style={{ padding: "0 20px 12px" }}>
        <button id="simulate-scan-btn" className="btn-primary" onClick={simulateScan} disabled={scanning}>
          {scanning ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /><span>Scanning…</span></> : `Simulate Scan — ${station}`}
        </button>
      </div>

      {scanned && (
        <div style={{ padding: "0 20px" }}>
          {/* Station card */}
          <div style={{
            background: "var(--mv-surface)", border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: 18, padding: 16, marginBottom: 14,
            boxShadow: "0 4px 20px rgba(99,102,241,0.12)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
              <div style={{
                width: 50, height: 50, borderRadius: 14,
                background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0,
              }}>🏛️</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.4px" }}>{station}</div>
                {interchange && (
                  <div style={{ fontSize: 12, color: "var(--mv-indigo-400)", fontWeight: 600, marginTop: 2, fontFamily: "'Inter', sans-serif" }}>
                    {interchange.lines.map(l => l[0].toUpperCase() + l.slice(1)).join(" + ")} Line (Interchange)
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 14 }}>
              {[["Platform", "1 & 2"], ["Next train", "3 min"], ["Crowd", "Medium 🟡"], ["Status", "Live ✓"]].map(([l, v]) => (
                <div key={l}>
                  <div style={{ fontSize: 10, color: "var(--mv-text-3)", fontFamily: "'Inter', sans-serif" }}>{l}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--mv-text)", marginTop: 2, fontFamily: "'Inter', sans-serif" }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button id="scanner-start-btn" className="btn-sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => router.push("/navigate")}>🧭 Start journey</button>
              <button id="scanner-ticket-btn" className="btn-sm cyan" style={{ flex: 1, justifyContent: "center" }} onClick={() => router.push("/tickets")}>🎫 Buy ticket</button>
            </div>
          </div>

          {/* Mini network map */}
          <div style={{ background: "var(--mv-surface)", border: "1px solid var(--mv-border)", borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--mv-text-3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10, fontFamily: "'Inter', sans-serif" }}>
              Network position
            </div>
            <svg viewBox="0 0 280 100" width="100%">
              <line x1="10" y1="50" x2="270" y2="50" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round"/>
              <line x1="140" y1="10" x2="140" y2="90" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round"/>
              {[40, 90, 190, 240].map(cx => <circle key={cx} cx={cx} cy="50" r="5" fill="#3b82f6"/>)}
              {[20, 80].map(cy => <circle key={cy} cx="140" cy={cy} r="5" fill="#f59e0b"/>)}
              <circle cx="140" cy="50" r="9" fill="none" stroke="#818cf8" strokeWidth="2.5"/>
              <circle cx="140" cy="50" r="5" fill="#6366f1"/>
              <text x="140" y="66" textAnchor="middle" fontSize="8" fill="#a5b4fc" fontWeight="700">Rajiv Chowk</text>
              <text x="44" y="65" textAnchor="middle" fontSize="7" fill="#475569">Dwarka</text>
              <text x="240" y="65" textAnchor="middle" fontSize="7" fill="#475569">Yamuna Bank</text>
            </svg>
          </div>

          {/* Nearby places */}
          <div className="sec-hdr" style={{ padding: "0 0 10px" }}>
            <span className="sec-title">Nearby places</span>
            <span className="badge badge-cyan">Within 500m</span>
          </div>
          <div style={{ background: "var(--mv-surface)", border: "1px solid var(--mv-border)", borderRadius: 16, overflow: "hidden", marginBottom: 20 }}>
            {spots.map((s, i) => {
              const style = TYPE_STYLES[s.type] || TYPE_STYLES.attraction;
              return (
                <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderBottom: i < spots.length - 1 ? "1px solid var(--mv-border)" : "none" }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: `${style.color}18`, border: `1px solid ${style.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                  }}>{style.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--mv-text)", fontFamily: "'Inter', sans-serif" }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: "var(--mv-text-3)", marginTop: 1, textTransform: "capitalize", fontFamily: "'Inter', sans-serif" }}>{s.type}</div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--mv-indigo-400)", fontFamily: "'Inter', sans-serif" }}>{s.dist_m}m</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ flex: 1 }} />
      <BottomNav />

      <style>{`
        @keyframes qrScan {
          0%   { top: 8px; opacity: 0.9; }
          50%  { top: 162px; opacity: 0.5; }
          100% { top: 8px; opacity: 0.9; }
        }
      `}</style>
    </div>
  );
}