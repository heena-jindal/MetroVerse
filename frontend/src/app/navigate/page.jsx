// src/app/navigate/page.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getInterchangeInfo } from "@/lib/routeEngine";

const LINE_COLORS = {
  blue: "#3b82f6", yellow: "#f59e0b", red: "#ef4444",
  green: "#22c55e", violet: "#8b5cf6", pink: "#ec4899",
};

const ANNOUNCEMENTS = [
  "Next station is {next}. Doors will open on the left side. Please mind the gap.",
  "Prepare to change trains at {next} if continuing onward.",
  "{next} is the next station. Low crowd expected at the platform.",
  "Approaching {next}. Please collect your belongings and exit carefully.",
];

export default function NavigatePage() {
  const router = useRouter();
  const [route, setRoute]         = useState(null);
  const [stepIdx, setStepIdx]     = useState(0);
  const [audioText, setAudioText] = useState("Tap below to hear the next station announcement");
  const [audioPlaying, setAudioPlaying] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("mv_route");
    if (saved) { setRoute(JSON.parse(saved)); }
    else {
      setRoute({
        path: ["Rajiv Chowk", "Mandi House", "Yamuna Bank", "Noida Sector 15"],
        fare: 40, time: 22, stops: 8, interchanges: 1,
        linesUsed: [{ id: "blue", name: "Blue Line" }, { id: "yellow", name: "Yellow Line" }],
      });
    }
  }, []);

  useEffect(() => {
    if (!route) return;
    intervalRef.current = setInterval(() => {
      setStepIdx(i => {
        const next = i + 1;
        if (next >= route.path.length - 1) { clearInterval(intervalRef.current); return route.path.length - 1; }
        if (next === route.path.length - 2 && typeof window !== "undefined" && window.fireMetroNotification) {
          window.fireMetroNotification({ icon: "🚇", title: "Approaching your destination", body: `${route.path[route.path.length - 1]} is 1 station away. Get ready to exit.` });
        }
        return next;
      });
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [route]);

  if (!route) return null;

  const totalStops  = route.path.length - 1;
  const stopsLeft   = totalStops - stepIdx;
  const progress    = Math.round((stepIdx / totalStops) * 100);
  const curStation  = route.path[stepIdx];
  const nextStation = route.path[stepIdx + 1] || "Arrived 🎉";
  const arrived     = stepIdx >= route.path.length - 1;
  const interchange = getInterchangeInfo(curStation);

  function playAudio() {
    const msg = ANNOUNCEMENTS[stepIdx % ANNOUNCEMENTS.length].replace("{next}", nextStation);
    setAudioText("🔊 " + msg);
    setAudioPlaying(true);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(msg);
      u.rate = 0.88; u.pitch = 1.05;
      window.speechSynthesis.speak(u);
    }
    setTimeout(() => setAudioPlaying(false), 3500);
  }

  return (
    <div className="page-enter" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--mv-bg)" }}>
      <div className="status-bar" style={{ background: "var(--mv-bg-2)" }}>
        <span>9:41</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span className="live-dot" />
          <span style={{ color: "var(--mv-cyan-400)", fontWeight: 700, fontFamily: "'Inter', sans-serif", fontSize: 11 }}>LIVE</span>
        </span>
      </div>

      <div className="scr-hdr">
        <button className="back-btn" onClick={() => router.push("/journey")}>‹</button>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", fontFamily: "'Inter', sans-serif" }}>Live Navigation</div>
          <div style={{ fontSize: 11, color: "var(--mv-text-3)", fontFamily: "'Inter', sans-serif" }}>{route.path[0]} → {route.path[route.path.length - 1]}</div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <span className="badge badge-cyan">
            <span className="live-dot" style={{ width: 5, height: 5 }} /> Active
          </span>
        </div>
      </div>

      {/* Main journey card */}
      <div style={{
        margin: "16px 20px 14px",
        background: "linear-gradient(145deg, #0f1629, #141b35)",
        border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: 20, padding: 18, position: "relative", overflow: "hidden",
        boxShadow: "0 4px 24px rgba(99,102,241,0.15)",
      }}>
        {/* Glow */}
        <div style={{
          position: "absolute", top: -40, right: -40, width: 150, height: 150, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 10, color: "var(--mv-text-3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4, fontFamily: "'Inter', sans-serif" }}>Current station</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.5px" }}>{curStation}</div>
            {interchange && (
              <div style={{ display: "flex", gap: 5, marginTop: 6, flexWrap: "wrap" }}>
                {interchange.lines.map(l => (
                  <span key={l} style={{
                    background: `${LINE_COLORS[l] || "#6366f1"}22`,
                    color: LINE_COLORS[l] || "#818cf8",
                    border: `1px solid ${LINE_COLORS[l] || "#6366f1"}44`,
                    fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 10,
                    fontFamily: "'Inter', sans-serif",
                    textTransform: "capitalize",
                  }}>{l} line</span>
                ))}
              </div>
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "var(--mv-text-3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4, fontFamily: "'Inter', sans-serif" }}>
              {arrived ? "Status" : "Next station"}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.85)", fontFamily: "'Inter', sans-serif" }}>{nextStation}</div>
            {!arrived && <div style={{ fontSize: 11, color: "var(--mv-indigo-400)", marginTop: 3, fontFamily: "'Inter', sans-serif" }}>~{stopsLeft * 3} min away</div>}
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, position: "relative", marginBottom: 8 }}>
            <div style={{
              height: "100%", borderRadius: 3, width: `${progress}%`,
              background: "linear-gradient(90deg, #4338ca, #22d3ee)",
              transition: "width 0.8s ease",
              boxShadow: "0 0 8px rgba(34,211,238,0.5)",
            }} />
            <div style={{
              position: "absolute", top: -10, left: `${Math.max(2, progress - 4)}%`,
              transform: "translateX(-50%)",
              width: 28, height: 28, borderRadius: 8,
              background: "linear-gradient(135deg, #4338ca, #22d3ee)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, boxShadow: "0 2px 10px rgba(34,211,238,0.4)",
              transition: "left 0.8s ease",
            }}>🚇</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "rgba(255,255,255,0.35)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", fontFamily: "'Inter', sans-serif" }}>
            <span>{route.path[0]}</span>
            <span>{route.path[route.path.length - 1]}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, padding: "0 20px", marginBottom: 16 }}>
        {[
          { val: stopsLeft, label: "Stops left", color: "#818cf8" },
          { val: arrived ? "Arrived" : `${stopsLeft * 3}m`, label: "Time left", color: "#22d3ee" },
          { val: `₹${route.fare}`, label: "Fare", color: "#fbbf24" },
        ].map(s => (
          <div key={s.label} style={{ background: "var(--mv-surface)", border: "1px solid var(--mv-border)", borderRadius: 14, padding: "12px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.color, fontFamily: "'Inter', sans-serif" }}>{s.val}</div>
            <div style={{ fontSize: 9, color: "var(--mv-text-3)", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "'Inter', sans-serif" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Station stops list */}
      <div className="sec-label" style={{ paddingBottom: 6 }}>Station stops</div>
      <div style={{ background: "var(--mv-surface)", border: "1px solid var(--mv-border)", borderRadius: 16, margin: "0 20px 14px", overflow: "hidden" }}>
        {route.path.map((st, i) => {
          const done = i < stepIdx, current = i === stepIdx, isLast = i === route.path.length - 1;
          return (
            <div key={st} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
              borderBottom: i < route.path.length - 1 ? "1px solid var(--mv-border)" : "none",
            }}>
              <div style={{
                width: 11, height: 11, borderRadius: "50%", flexShrink: 0,
                background: done ? "#22c55e" : current ? "#22d3ee" : "rgba(255,255,255,0.12)",
                boxShadow: current ? "0 0 0 4px rgba(34,211,238,0.2)" : done ? "0 0 6px #22c55e66" : "none",
              }} />
              <span style={{
                fontSize: 13, fontFamily: "'Inter', sans-serif",
                color: done ? "#4ade80" : current ? "#fff" : "var(--mv-text-2)",
                fontWeight: current ? 800 : done ? 600 : 400,
              }}>{st}</span>
              <span style={{ marginLeft: "auto" }}>
                {done    && <span className="badge badge-green">Passed</span>}
                {current && <span className="badge badge-cyan">● Here</span>}
                {isLast && !current && !done && <span className="badge badge-gold">Exit 🚪</span>}
              </span>
            </div>
          );
        })}
      </div>

      {/* AI tip */}
      <div style={{
        margin: "0 20px 14px",
        background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: 12, padding: "12px 16px", display: "flex", gap: 10,
      }}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
        <div style={{ fontSize: 12, color: "var(--mv-indigo-300)", lineHeight: 1.6, fontFamily: "'Inter', sans-serif" }}>
          <strong>AI Coach Tip:</strong> Board Coach 4 — nearest to the exit gate at {route.path[route.path.length - 1]}. Saves ~90 sec during peak hours.
        </div>
      </div>

      {/* Audio */}
      <button
        id="play-announcement-btn"
        onClick={playAudio}
        className="btn-outline"
        style={{ margin: "0 20px 8px", width: "calc(100% - 40px)", fontSize: 13 }}
        disabled={arrived}
      >
        🔊 {audioPlaying ? "Playing…" : "Play Station Announcement"}
      </button>
      {audioText && (
        <div style={{
          margin: "0 20px 16px",
          background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "10px 14px",
          fontSize: 12, color: "var(--mv-text-2)", textAlign: "center", fontStyle: "italic",
          border: "1px solid var(--mv-border)", fontFamily: "'Inter', sans-serif",
        }}>{audioText}</div>
      )}

      {arrived && (
        <div style={{ padding: "0 20px 16px" }}>
          <button id="journey-complete-btn" className="btn-primary" onClick={() => router.push("/home")}>
            ✅ Journey Complete — Back to Home
          </button>
        </div>
      )}

      <div style={{ height: 16 }} />
    </div>
  );
}