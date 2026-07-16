// src/app/city/page.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CITIES = [
  { id: "delhi",  name: "Delhi NCR",   org: "DMRC · 9 lines",      km: 392, stations: 288, live: true,  color: "#6366f1", svgType: "grid" },
  { id: "mumbai", name: "Mumbai",      org: "MMRDA · 3 lines",     km: 45,  stations: 40,  live: false, color: "#22d3ee", svgType: "curve" },
  { id: "blr",    name: "Bangalore",   org: "BMRCL · Namma Metro", km: 73,  stations: 61,  live: false, color: "#8b5cf6", svgType: "cross" },
  { id: "hyd",    name: "Hyderabad",   org: "HMR Metro Rail",      km: 75,  stations: 57,  live: false, color: "#f59e0b", svgType: "y" },
  { id: "chn",    name: "Chennai",     org: "CMRL Metro",          km: 54,  stations: 50,  live: false, color: "#ef4444", svgType: "diag" },
  { id: "kol",    name: "Kolkata",     org: "Kolkata Metro Rail",  km: 45,  stations: 48,  live: false, color: "#06b6d4", svgType: "plus" },
];

function MetroThumb({ type, color }) {
  const p = { width: 90, height: 55, fill: "none", style: { opacity: 0.75 } };
  const c = color;
  const c2 = "#22d3ee";
  switch (type) {
    case "grid":
      return <svg viewBox="0 0 90 55" {...p}><line x1="5" y1="27" x2="85" y2="27" stroke={c} strokeWidth="3" strokeLinecap="round"/><line x1="45" y1="5" x2="45" y2="50" stroke={c2} strokeWidth="2.5" strokeLinecap="round"/><line x1="15" y1="12" x2="75" y2="42" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/><circle cx="45" cy="27" r="6" fill="rgba(255,255,255,0.15)" stroke={c} strokeWidth="2"/><circle cx="20" cy="27" r="3.5" fill={c}/><circle cx="70" cy="27" r="3.5" fill={c}/><circle cx="45" cy="12" r="3" fill={c2}/><circle cx="45" cy="42" r="3" fill={c2}/></svg>;
    case "curve":
      return <svg viewBox="0 0 90 55" {...p}><path d="M5 45 Q22 10 45 28 Q68 45 85 20" stroke={c} strokeWidth="3" fill="none" strokeLinecap="round"/><path d="M10 32 Q38 5 80 38" stroke={c2} strokeWidth="2" fill="none" strokeLinecap="round"/><circle cx="45" cy="28" r="5" fill="rgba(255,255,255,0.15)" stroke={c} strokeWidth="2"/></svg>;
    case "cross":
      return <svg viewBox="0 0 90 55" {...p}><line x1="5" y1="42" x2="85" y2="12" stroke={c} strokeWidth="3" strokeLinecap="round"/><line x1="5" y1="12" x2="85" y2="42" stroke={c2} strokeWidth="2.5" strokeLinecap="round"/><circle cx="45" cy="27" r="5" fill="rgba(255,255,255,0.15)" stroke={c} strokeWidth="2"/></svg>;
    case "y":
      return <svg viewBox="0 0 90 55" {...p}><line x1="5" y1="5" x2="45" y2="28" stroke={c} strokeWidth="3" strokeLinecap="round"/><line x1="85" y1="5" x2="45" y2="28" stroke={c2} strokeWidth="2.5" strokeLinecap="round"/><line x1="45" y1="28" x2="45" y2="52" stroke={c} strokeWidth="3" strokeLinecap="round"/><circle cx="45" cy="28" r="5" fill="rgba(255,255,255,0.15)" stroke={c} strokeWidth="2"/></svg>;
    case "diag":
      return <svg viewBox="0 0 90 55" {...p}><line x1="10" y1="48" x2="80" y2="5" stroke={c} strokeWidth="3" strokeLinecap="round"/><line x1="10" y1="5" x2="80" y2="48" stroke={c2} strokeWidth="2" strokeLinecap="round"/><circle cx="45" cy="27" r="5" fill="rgba(255,255,255,0.15)" stroke={c} strokeWidth="2"/></svg>;
    default:
      return <svg viewBox="0 0 90 55" {...p}><line x1="45" y1="5" x2="45" y2="50" stroke={c} strokeWidth="3" strokeLinecap="round"/><line x1="5" y1="27" x2="85" y2="27" stroke={c2} strokeWidth="2.5" strokeLinecap="round"/><circle cx="45" cy="27" r="5" fill="rgba(255,255,255,0.15)" stroke={c} strokeWidth="2"/></svg>;
  }
}

export default function CitySelectPage() {
  const router = useRouter();
  const [picked, setPicked] = useState("delhi");
  const [search, setSearch] = useState("");

  const filtered   = CITIES.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const pickedCity = CITIES.find(c => c.id === picked);

  function handleContinue() {
    if (picked !== "delhi") {
      toast && toast(`${pickedCity?.name} is coming soon! Delhi NCR is live now.`);
      alert(`${pickedCity?.name} metro data is coming soon! We currently support Delhi NCR.`);
      return;
    }
    localStorage.setItem("mv_city", picked);
    router.push("/home");
  }

  return (
    <div className="page-enter" style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      background: "var(--mv-bg)", position: "relative", overflow: "hidden",
    }}>
      {/* Status bar */}
      <div className="status-bar">
        <span>9:41</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span className="live-dot" />
          <span style={{ fontSize: 11, color: "var(--mv-cyan-400)", fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>5G</span>
        </span>
      </div>

      {/* Header */}
      <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--mv-border)" }}>
        <h1 style={{
          fontSize: 24, fontWeight: 900, color: "#fff",
          letterSpacing: "-0.8px", marginBottom: 6,
          fontFamily: "'Inter', sans-serif",
        }}>Choose your city</h1>
        <p style={{ fontSize: 13, color: "var(--mv-text-2)", fontFamily: "'Inter', sans-serif" }}>
          We'll load metro maps, fares &amp; live schedules
        </p>
      </div>

      {/* Search */}
      <div style={{ padding: "16px 20px 8px" }}>
        <div style={{ position: "relative" }}>
          <span style={{
            position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
            fontSize: 15, pointerEvents: "none", color: "var(--mv-text-3)",
          }}>🔍</span>
          <input
            id="city-search"
            className="mv-input"
            style={{ paddingLeft: 42 }}
            placeholder="Search city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* City grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 12, padding: "10px 20px 20px", flex: 1,
      }}>
        {filtered.map(city => {
          const isSelected = picked === city.id;
          return (
            <div
              id={`city-${city.id}`}
              key={city.id}
              onClick={() => setPicked(city.id)}
              style={{
                background: isSelected
                  ? `rgba(${city.color === "#6366f1" ? "99,102,241" : city.color === "#22d3ee" ? "34,211,238" : "139,92,246"},0.08)`
                  : "var(--mv-surface)",
                border: `1px solid ${isSelected ? city.color : "rgba(255,255,255,0.06)"}`,
                borderRadius: 18, overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.2s",
                transform: isSelected ? "translateY(-2px)" : "none",
                boxShadow: isSelected ? `0 8px 24px ${city.color}22` : "none",
                position: "relative",
              }}
            >
              {/* Selected check */}
              {isSelected && (
                <div style={{
                  position: "absolute", top: 10, right: 10,
                  width: 22, height: 22, borderRadius: "50%",
                  background: city.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, color: "#fff", fontWeight: 800,
                  zIndex: 2, boxShadow: `0 2px 8px ${city.color}66`,
                }}>✓</div>
              )}

              {/* SVG thumbnail */}
              <div style={{
                height: 80,
                background: `linear-gradient(135deg, rgba(${city.color === "#6366f1" ? "99,102,241" : "34,211,238"},0.15) 0%, rgba(0,0,0,0.3) 100%)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                borderBottom: `1px solid rgba(255,255,255,0.05)`,
              }}>
                <MetroThumb type={city.svgType} color={city.color} />
              </div>

              {/* City info */}
              <div style={{ padding: "12px 14px 14px" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 2, fontFamily: "'Inter', sans-serif" }}>
                  {city.name}
                </div>
                <div style={{ fontSize: 11, color: "var(--mv-text-3)", marginBottom: 8, fontFamily: "'Inter', sans-serif" }}>
                  {city.org}
                </div>
                <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 10, color: "var(--mv-text-2)", background: "rgba(255,255,255,0.05)", padding: "2px 7px", borderRadius: 6, fontFamily: "'Inter', sans-serif" }}>
                    <strong style={{ color: "#fff" }}>{city.km}</strong> km
                  </span>
                  <span style={{ fontSize: 10, color: "var(--mv-text-2)", background: "rgba(255,255,255,0.05)", padding: "2px 7px", borderRadius: 6, fontFamily: "'Inter', sans-serif" }}>
                    <strong style={{ color: "#fff" }}>{city.stations}</strong> stns
                  </span>
                </div>
                {city.live ? (
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    fontSize: 10, fontWeight: 700, fontFamily: "'Inter', sans-serif",
                    background: "rgba(34,211,238,0.1)", color: "var(--mv-cyan-400)",
                    border: "1px solid rgba(34,211,238,0.2)",
                    padding: "3px 10px", borderRadius: 20,
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--mv-cyan-400)", display: "inline-block" }} />
                    Live
                  </div>
                ) : (
                  <div style={{
                    display: "inline-flex", alignItems: "center",
                    fontSize: 10, fontWeight: 600, fontFamily: "'Inter', sans-serif",
                    background: "rgba(245,158,11,0.08)", color: "#fbbf24",
                    border: "1px solid rgba(245,158,11,0.15)",
                    padding: "3px 10px", borderRadius: 20,
                  }}>
                    Coming Soon
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div style={{
        padding: "16px 20px 32px",
        background: "linear-gradient(to top, var(--mv-bg) 70%, transparent)",
      }}>
        <button id="city-continue-btn" className="btn-primary" onClick={handleContinue}>
          Explore {pickedCity?.name || "Metro"} <span>→</span>
        </button>
        <p style={{
          textAlign: "center", marginTop: 10, fontSize: 11,
          color: "var(--mv-text-3)", fontFamily: "'Inter', sans-serif",
        }}>
          Delhi NCR live · Other cities launching soon
        </p>
      </div>
    </div>
  );
}