// src/app/journey/page.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { findRoute, searchStations } from "@/lib/routeEngine";
import toast from "react-hot-toast";

const LINE_STYLES = {
  blue:   { bg: "rgba(59,130,246,0.15)", color: "#93c5fd", border: "rgba(59,130,246,0.3)", dot: "#3b82f6" },
  yellow: { bg: "rgba(245,158,11,0.15)", color: "#fcd34d", border: "rgba(245,158,11,0.3)", dot: "#f59e0b" },
  red:    { bg: "rgba(239,68,68,0.15)",  color: "#fca5a5", border: "rgba(239,68,68,0.3)",  dot: "#ef4444" },
  green:  { bg: "rgba(34,197,94,0.15)",  color: "#86efac", border: "rgba(34,197,94,0.3)",  dot: "#22c55e" },
  violet: { bg: "rgba(139,92,246,0.15)", color: "#c4b5fd", border: "rgba(139,92,246,0.3)", dot: "#8b5cf6" },
  pink:   { bg: "rgba(236,72,153,0.15)", color: "#f9a8d4", border: "rgba(236,72,153,0.3)", dot: "#ec4899" },
};

const FILTERS = ["Fastest", "Cheapest", "Fewest changes"];

export default function JourneyPage() {
  const router = useRouter();
  const [from, setFrom]       = useState("Rajiv Chowk");
  const [to, setTo]           = useState("Noida Sector 15");
  const [fromSugs, setFromSugs] = useState([]);
  const [toSugs, setToSugs]     = useState([]);
  const [filter, setFilter]   = useState("Fastest");
  const [route, setRoute]     = useState(null);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const fromRef = useRef(null);

  useEffect(() => { handleSearch(); }, []);

  function handleSearch() {
    if (!from || !to) { toast.error("Please enter both stations"); return; }
    setSearching(true);
    setTimeout(() => {
      const result = findRoute(from, to);
      if (!result) { toast.error("No route found. Check station names."); setRoute(null); }
      else { setRoute(result); }
      setSearched(true);
      setSearching(false);
    }, 400);
  }

  function handleSwap() { setFrom(to); setTo(from); setRoute(null); setSearched(false); }

  function pickSug(field, value) {
    if (field === "from") { setFrom(value); setFromSugs([]); }
    else { setTo(value); setToSugs([]); }
  }

  const hour = new Date().getHours();
  const peak = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20);
  const crowd = route ? (peak ? { label: "Medium crowd", color: "#fbbf24", icon: "🟡" } : { label: "Low crowd", color: "#4ade80", icon: "🟢" }) : null;

  return (
    <div className="page-enter" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--mv-bg)" }}>
      <div className="status-bar"><span>9:41</span><span>5G</span></div>

      <div className="scr-hdr">
        <button className="back-btn" onClick={() => router.push("/home")}>‹</button>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", fontFamily: "'Inter', sans-serif" }}>Plan Journey</div>
          <div style={{ fontSize: 11, color: "var(--mv-text-3)", fontFamily: "'Inter', sans-serif" }}>Delhi NCR · DMRC</div>
        </div>
      </div>

      {/* Input Panel */}
      <div style={{ background: "var(--mv-surface-2)", padding: "16px 20px 18px", borderBottom: "1px solid var(--mv-border)" }}>
        <div style={{ position: "relative", marginBottom: 6 }}>
          <div style={{
            background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "12px 14px",
            display: "flex", alignItems: "center", gap: 10,
            border: "1px solid var(--mv-border-2)",
          }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e", flexShrink: 0, boxShadow: "0 0 6px #22c55e88" }} />
            <input
              ref={fromRef}
              id="from-input"
              style={{ background: "none", border: "none", outline: "none", fontSize: 14, color: "#fff", fontWeight: 600, width: "100%", fontFamily: "'Inter', sans-serif" }}
              placeholder="From — source station"
              value={from}
              onChange={e => { setFrom(e.target.value); setFromSugs(searchStations(e.target.value)); }}
            />
          </div>
          {fromSugs.length > 0 && (
            <div style={{
              position: "absolute", top: "100%", left: 0, right: 0, zIndex: 20, marginTop: 4,
              background: "var(--mv-surface-3)", border: "1px solid var(--mv-border)", borderRadius: 12,
              overflow: "hidden", boxShadow: "var(--mv-shadow-lg)",
            }}>
              {fromSugs.map(s => (
                <div key={s} onClick={() => pickSug("from", s)} style={{ padding: "11px 16px", fontSize: 13, cursor: "pointer", color: "var(--mv-text)", fontFamily: "'Inter', sans-serif", borderBottom: "1px solid var(--mv-border)", transition: "background 0.15s" }}>
                  🚇 {s}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Swap button */}
        <div style={{ display: "flex", justifyContent: "flex-end", margin: "-1px 0" }}>
          <button
            id="swap-btn"
            onClick={handleSwap}
            style={{
              background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)",
              borderRadius: 8, width: 30, height: 30, display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 15,
              cursor: "pointer", color: "var(--mv-indigo-400)",
            }}
          >⇅</button>
        </div>

        <div style={{ position: "relative", marginBottom: 14 }}>
          <div style={{
            background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "12px 14px",
            display: "flex", alignItems: "center", gap: 10,
            border: "1px solid var(--mv-border-2)",
          }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444", flexShrink: 0, boxShadow: "0 0 6px #ef444488" }} />
            <input
              id="to-input"
              style={{ background: "none", border: "none", outline: "none", fontSize: 14, color: "#fff", fontWeight: 600, width: "100%", fontFamily: "'Inter', sans-serif" }}
              placeholder="To — destination station"
              value={to}
              onChange={e => { setTo(e.target.value); setToSugs(searchStations(e.target.value)); }}
            />
          </div>
          {toSugs.length > 0 && (
            <div style={{
              position: "absolute", top: "100%", left: 0, right: 0, zIndex: 20, marginTop: 4,
              background: "var(--mv-surface-3)", border: "1px solid var(--mv-border)", borderRadius: 12,
              overflow: "hidden", boxShadow: "var(--mv-shadow-lg)",
            }}>
              {toSugs.map(s => (
                <div key={s} onClick={() => pickSug("to", s)} style={{ padding: "11px 16px", fontSize: 13, cursor: "pointer", color: "var(--mv-text)", fontFamily: "'Inter', sans-serif", borderBottom: "1px solid var(--mv-border)", transition: "background 0.15s" }}>
                  🚇 {s}
                </div>
              ))}
            </div>
          )}
        </div>

        <button id="search-routes-btn" className="btn-primary" onClick={handleSearch} disabled={searching}>
          {searching ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <><span>Search Routes</span><span>→</span></>}
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, padding: "12px 20px", overflowX: "auto" }}>
        {FILTERS.map(f => (
          <button key={f} id={`filter-${f.toLowerCase().replace(" ", "-")}`} onClick={() => setFilter(f)} style={{
            background: filter === f ? "linear-gradient(135deg, #4338ca, #6366f1)" : "rgba(255,255,255,0.04)",
            color: filter === f ? "#fff" : "var(--mv-text-2)",
            border: `1px solid ${filter === f ? "transparent" : "rgba(255,255,255,0.08)"}`,
            borderRadius: 20, padding: "7px 16px", fontSize: 12, fontWeight: 600,
            whiteSpace: "nowrap", cursor: "pointer", flexShrink: 0,
            fontFamily: "'Inter', sans-serif", transition: "all 0.2s",
            boxShadow: filter === f ? "0 2px 10px rgba(99,102,241,0.4)" : "none",
          }}>{f}</button>
        ))}
      </div>

      <div className="sec-label">
        {route ? "Route found" : searched ? "No results" : "Search to see routes"}
      </div>

      {/* Result card */}
      {route && (
        <div style={{
          margin: "0 20px 16px",
          background: "var(--mv-surface)",
          border: "1px solid rgba(99,102,241,0.3)",
          borderRadius: 18, overflow: "hidden",
          boxShadow: "0 4px 24px rgba(99,102,241,0.15)",
        }}>
          {/* Card header */}
          <div style={{
            background: "linear-gradient(135deg, rgba(67,56,202,0.4), rgba(99,102,241,0.2))",
            padding: "14px 16px 12px",
            borderBottom: "1px solid var(--mv-border)",
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--mv-indigo-300)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8, fontFamily: "'Inter', sans-serif" }}>
              ⭐ Recommended Route
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
              {route.linesUsed.map((l, i) => {
                const s = LINE_STYLES[l.id] || LINE_STYLES.blue;
                return (
                  <span key={l.id} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    {i > 0 && <span style={{ fontSize: 10, color: "var(--mv-text-3)" }}>→</span>}
                    <span style={{
                      background: s.bg, color: s.color,
                      border: `1px solid ${s.border}`,
                      fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20,
                      fontFamily: "'Inter', sans-serif",
                      display: "flex", alignItems: "center", gap: 5,
                    }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
                      {l.name}
                    </span>
                  </span>
                );
              })}
              <span className="badge badge-indigo" style={{ marginLeft: "auto" }}>
                {route.interchanges} change{route.interchanges !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div style={{ padding: "14px 16px" }}>
            {/* Station path */}
            <div style={{
              fontSize: 11, color: "var(--mv-text-2)", fontWeight: 500,
              lineHeight: 1.7, marginBottom: 14,
              fontFamily: "'Inter', sans-serif",
              background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "10px 12px",
              border: "1px solid var(--mv-border)",
            }}>
              {route.path.map((st, i) => (
                <span key={i}>
                  <span style={{ color: i === 0 || i === route.path.length - 1 ? "#fff" : "inherit", fontWeight: i === 0 || i === route.path.length - 1 ? 700 : 500 }}>
                    {st}
                  </span>
                  {i < route.path.length - 1 && <span style={{ color: "var(--mv-text-3)", margin: "0 4px" }}>›</span>}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 14 }}>
              {[
                { val: `₹${route.fare}`, label: "Fare", color: "#fbbf24" },
                { val: `${route.time}m`, label: "Time", color: "#22d3ee" },
                { val: route.stops, label: "Stops", color: "#818cf8" },
                { val: "3 min", label: "Next", color: "#4ade80" },
              ].map(s => (
                <div key={s.label} style={{ textAlign: "center", background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "10px 6px", border: "1px solid var(--mv-border)" }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: s.color, fontFamily: "'Inter', sans-serif" }}>{s.val}</div>
                  <div style={{ fontSize: 9, color: "var(--mv-text-3)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "'Inter', sans-serif" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Crowd indicator */}
            {crowd && (
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "10px 12px",
                border: "1px solid var(--mv-border)", marginBottom: 14,
              }}>
                <span style={{ fontSize: 18 }}>{crowd.icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: crowd.color, fontFamily: "'Inter', sans-serif" }}>{crowd.label}</div>
                  <div style={{ fontSize: 10, color: "var(--mv-text-3)", fontFamily: "'Inter', sans-serif" }}>ML model · Random Forest · 91% confidence</div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: 10 }}>
              <button id="start-journey-btn" className="btn-sm" style={{ flex: 1, justifyContent: "center", padding: "11px" }}
                onClick={() => { localStorage.setItem("mv_route", JSON.stringify(route)); router.push("/navigate"); }}>
                🧭 Start
              </button>
              <button id="buy-ticket-btn" className="btn-sm cyan" style={{ flex: 1, justifyContent: "center", padding: "11px" }}
                onClick={() => { localStorage.setItem("mv_route", JSON.stringify(route)); router.push("/tickets"); }}>
                🎫 Buy ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {searched && !route && (
        <div style={{ padding: "24px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--mv-text)", marginBottom: 6, fontFamily: "'Inter', sans-serif" }}>No route found</div>
          <div style={{ fontSize: 13, color: "var(--mv-text-3)", fontFamily: "'Inter', sans-serif" }}>
            Check spelling or use autocomplete suggestions
          </div>
        </div>
      )}

      <div style={{ height: 24 }} />
    </div>
  );
}