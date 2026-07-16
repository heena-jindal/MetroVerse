// src/app/tickets/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import toast from "react-hot-toast";
import BottomNav from "@/components/BottomNav";

const TRANSACTIONS = [
  { type: "ride",     name: "Metro ride",    sub: "Today, 8:30 AM · Blue Line",    amt: -40,  cr: false },
  { type: "recharge", name: "Card recharge", sub: "Yesterday · UPI / GPay",         amt: 200,  cr: true  },
  { type: "ride",     name: "Metro ride",    sub: "Yesterday, 6:15 PM · Blue Line", amt: -35,  cr: false },
  { type: "ride",     name: "Metro ride",    sub: "Monday, 9:00 AM · Violet Line",  amt: -50,  cr: false },
  { type: "recharge", name: "Card recharge", sub: "Last week · UPI / PhonePe",      amt: 500,  cr: true  },
];

const RECHARGE_AMOUNTS = [100, 200, 500];

export default function TicketsPage() {
  const router = useRouter();
  const [balance, setBalance]         = useState(240);
  const [route, setRoute]             = useState(null);
  const [showUPI, setShowUPI]         = useState(false);
  const [upiId, setUpiId]             = useState("");
  const [processing, setProcessing]   = useState(false);
  const [rechargeAmt, setRechargeAmt] = useState(null);
  const [activeTab, setActiveTab]     = useState("ticket");
  const [ticketId, setTicketId]       = useState("MV00000000");

  useEffect(() => {
    const saved = localStorage.getItem("mv_route");
    if (saved) setRoute(JSON.parse(saved));
    setTicketId("MV" + Date.now().toString().slice(-8));
  }, []);

  const qrData = JSON.stringify({
    id: ticketId, from: route?.from || "Rajiv Chowk",
    to: route?.to || "Noida Sector 15", fare: route?.fare || 40,
    ts: new Date().toISOString(),
  });

  function handleRecharge(amount) { setRechargeAmt(amount); setShowUPI(true); }

  function confirmPayment() {
    if (!upiId.includes("@")) { toast.error("Enter a valid UPI ID (e.g. name@upi)"); return; }
    setProcessing(true);
    setTimeout(() => {
      setBalance(b => b + rechargeAmt);
      setProcessing(false); setShowUPI(false); setUpiId("");
      toast.success(`₹${rechargeAmt} added to Metro Card!`);
      if (typeof window !== "undefined" && window.fireMetroNotification) {
        window.fireMetroNotification({ icon: "💳", title: "Recharge successful", body: `₹${rechargeAmt} added. New balance: ₹${balance + rechargeAmt}` });
      }
    }, 1400);
  }

  return (
    <div className="page-enter" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--mv-bg)" }}>
      <div className="status-bar"><span>9:41</span><span>5G</span></div>

      <div className="scr-hdr">
        <button className="back-btn" onClick={() => router.push("/home")}>‹</button>
        <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", fontFamily: "'Inter', sans-serif" }}>Tickets &amp; Card</div>
        <button className="btn-sm" style={{ marginLeft: "auto" }} onClick={() => router.push("/journey")}>+ New</button>
      </div>

      {/* Tab switcher */}
      <div style={{
        display: "flex", background: "rgba(255,255,255,0.04)",
        borderRadius: 12, padding: 4, margin: "14px 20px 0",
        border: "1px solid var(--mv-border)",
      }}>
        {[{ id: "ticket", label: "🎫 QR Ticket" }, { id: "card", label: "💳 Metro Card" }].map(t => (
          <button key={t.id} id={`tab-${t.id}`} onClick={() => setActiveTab(t.id)} style={{
            flex: 1, padding: "10px 0", fontSize: 13, fontWeight: 700,
            border: "none", cursor: "pointer", borderRadius: 9,
            transition: "all 0.2s", fontFamily: "'Inter', sans-serif",
            background: activeTab === t.id ? "linear-gradient(135deg, #4338ca, #6366f1)" : "none",
            color: activeTab === t.id ? "#fff" : "var(--mv-text-3)",
            boxShadow: activeTab === t.id ? "0 2px 8px rgba(99,102,241,0.4)" : "none",
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── QR TICKET TAB ── */}
      {activeTab === "ticket" && (
        <div>
          <div style={{ margin: "14px 20px 0", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(99,102,241,0.2)", boxShadow: "0 4px 24px rgba(99,102,241,0.15)" }}>
            {/* Ticket header */}
            <div style={{ background: "linear-gradient(135deg, #1e1b4b, #312e81, #4338ca)", padding: "18px 20px" }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Inter', sans-serif" }}>
                TICKET · {ticketId}
              </div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", margin: "6px 0 4px", lineHeight: 1.3, fontFamily: "'Inter', sans-serif", letterSpacing: "-0.5px" }}>
                {route?.from || "Rajiv Chowk"} → {route?.to || "Noida Sector 15"}
              </div>
              <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
                {[
                  ["Date", new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })],
                  ["Fare", `₹${route?.fare || 40}`],
                  ["Valid for", "90 min"],
                ].map(([l, v]) => (
                  <div key={l}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", fontFamily: "'Inter', sans-serif" }}>{l}</div>
                    <div style={{ fontSize: 13, color: "#fff", fontWeight: 700, marginTop: 2, fontFamily: "'Inter', sans-serif" }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Perforation */}
            <div style={{ display: "flex", alignItems: "center", background: "var(--mv-surface)" }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: "var(--mv-bg)", flexShrink: 0 }} />
              <div style={{ flex: 1, borderTop: "2px dashed rgba(255,255,255,0.1)" }} />
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: "var(--mv-bg)", flexShrink: 0 }} />
            </div>

            {/* QR */}
            <div style={{ padding: "20px 20px 24px", display: "flex", flexDirection: "column", alignItems: "center", background: "var(--mv-surface)" }}>
              <div style={{ background: "#fff", padding: 14, borderRadius: 14, boxShadow: "0 0 0 1px rgba(99,102,241,0.3), 0 8px 24px rgba(0,0,0,0.4)" }}>
                <QRCodeCanvas value={qrData} size={130} level="M" fgColor="#1e1b4b" bgColor="#ffffff" />
              </div>
              <div style={{ fontSize: 12, color: "var(--mv-indigo-400)", fontWeight: 700, marginTop: 12, fontFamily: "'Inter', sans-serif" }}>
                ✓ Valid ticket · Scan at gate
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, padding: "12px 20px 16px" }}>
            {["⬇ Save", "↗ Share", "🖨 Print"].map(label => (
              <button key={label} onClick={() => toast.success(`${label.split(" ")[1]} — coming soon`)} style={{
                flex: 1, background: "var(--mv-surface)", border: "1px solid var(--mv-border)",
                borderRadius: 10, padding: 11, fontSize: 12, fontWeight: 700,
                color: "var(--mv-text-2)", cursor: "pointer", fontFamily: "'Inter', sans-serif",
              }}>{label}</button>
            ))}
          </div>
        </div>
      )}

      {/* ── METRO CARD TAB ── */}
      {activeTab === "card" && (
        <div>
          {/* Card visual */}
          <div style={{
            margin: "16px 20px 0",
            background: "linear-gradient(145deg, #1e1b4b 0%, #312e81 40%, #4338ca 70%, #6366f1 100%)",
            borderRadius: 20, padding: "20px 22px", position: "relative", overflow: "hidden",
            boxShadow: "0 8px 40px rgba(99,102,241,0.3)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}>
            <div style={{ position: "absolute", top: -50, right: -50, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
            <div style={{ position: "absolute", bottom: -40, left: -30, width: 130, height: 130, borderRadius: "50%", background: "rgba(34,211,238,0.08)" }} />
            <div style={{ position: "absolute", top: 18, right: 20 }}>
              <span className="badge badge-cyan" style={{ fontSize: 9 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--mv-cyan-400)", display: "inline-block" }} /> Active
              </span>
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'Inter', sans-serif" }}>Metro Card Balance</div>
            <div style={{ fontSize: 40, fontWeight: 900, color: "#fff", margin: "8px 0 4px", letterSpacing: "-1.5px", fontFamily: "'Inter', sans-serif" }}>₹ {balance}.00</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: 4, fontFamily: "monospace" }}>DMRC  ••••  ••••  8842</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 18 }}>
              <div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginBottom: 2, fontFamily: "'Inter', sans-serif" }}>Card holder</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", fontFamily: "'Inter', sans-serif" }}>Heena Kumari</div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 900, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif" }}>DMRC</div>
            </div>
          </div>

          {/* Recharge amounts */}
          <div className="sec-label" style={{ marginTop: 12 }}>Quick recharge</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, padding: "0 20px 10px" }}>
            {RECHARGE_AMOUNTS.map(amt => (
              <div key={amt} onClick={() => handleRecharge(amt)} style={{
                background: amt === 200 ? "rgba(99,102,241,0.12)" : "var(--mv-surface)",
                border: `1px solid ${amt === 200 ? "rgba(99,102,241,0.4)" : "var(--mv-border)"}`,
                borderRadius: 12, padding: "13px 8px", textAlign: "center", cursor: "pointer",
                transition: "all 0.2s",
              }}>
                <div style={{ fontSize: 17, fontWeight: 900, color: amt === 200 ? "var(--mv-indigo-300)" : "var(--mv-text)", fontFamily: "'Inter', sans-serif" }}>₹{amt}</div>
                <div style={{ fontSize: 9, color: "var(--mv-text-3)", marginTop: 3, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "'Inter', sans-serif" }}>
                  {amt === 200 ? "Popular" : "Add"}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: "0 20px 4px" }}>
            <button className="btn-outline" style={{ fontSize: 13, padding: "11px" }} onClick={() => handleRecharge(null)}>
              Enter custom amount
            </button>
          </div>

          {/* Transactions */}
          <div className="sec-label" style={{ marginTop: 10 }}>Transaction history</div>
          <div style={{ background: "var(--mv-surface)", border: "1px solid var(--mv-border)", borderRadius: 16, margin: "0 20px 24px", overflow: "hidden" }}>
            {TRANSACTIONS.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderBottom: i < TRANSACTIONS.length - 1 ? "1px solid var(--mv-border)" : "none" }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: t.cr ? "rgba(34,211,238,0.1)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${t.cr ? "rgba(34,211,238,0.2)" : "var(--mv-border)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17,
                }}>{t.type === "ride" ? "🚇" : "💳"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--mv-text)", fontFamily: "'Inter', sans-serif" }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: "var(--mv-text-3)", marginTop: 2, fontFamily: "'Inter', sans-serif" }}>{t.sub}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 900, color: t.cr ? "#22d3ee" : "#f87171", fontFamily: "'Inter', sans-serif" }}>
                  {t.cr ? `+₹${t.amt}` : `₹${t.amt}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* UPI modal */}
      {showUPI && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 500, display: "flex", alignItems: "flex-end", backdropFilter: "blur(4px)" }}>
          <div className="slide-up" style={{
            background: "var(--mv-surface-2)", borderRadius: "24px 24px 0 0",
            padding: "24px 24px 40px", width: "100%", border: "1px solid var(--mv-border)",
            boxShadow: "0 -8px 40px rgba(0,0,0,0.6)",
          }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)", margin: "0 auto 20px" }} />
            <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 4, fontFamily: "'Inter', sans-serif" }}>Pay ₹{rechargeAmt}</div>
            <div style={{ fontSize: 13, color: "var(--mv-text-3)", marginBottom: 20, fontFamily: "'Inter', sans-serif" }}>Recharge your MetroVerse card</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[{ icon: "🅖", name: "GPay" }, { icon: "📱", name: "PhonePe" }, { icon: "💙", name: "Paytm" }, { icon: "🏛️", name: "BHIM" }].map(app => (
                <button key={app.name} id={`pay-${app.name.toLowerCase()}`}
                  onClick={() => setUpiId(app.name.toLowerCase() + "@upi")}
                  style={{
                    background: upiId.startsWith(app.name.toLowerCase()) ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${upiId.startsWith(app.name.toLowerCase()) ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"}`,
                    borderRadius: 12, padding: 13, fontSize: 13, fontWeight: 700,
                    color: "var(--mv-text)", cursor: "pointer", fontFamily: "'Inter', sans-serif",
                  }}>{app.icon} {app.name}</button>
              ))}
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--mv-text-2)", marginBottom: 7, display: "block", fontFamily: "'Inter', sans-serif" }}>Or enter UPI ID</label>
              <input id="upi-id-input" className="mv-input" placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} />
            </div>

            <button id="confirm-pay-btn" className="btn-primary" onClick={confirmPayment} disabled={processing}>
              {processing ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : `Pay ₹${rechargeAmt} →`}
            </button>
            <button onClick={() => { setShowUPI(false); setUpiId(""); }} style={{ width: "100%", marginTop: 12, background: "none", border: "none", fontSize: 13, color: "var(--mv-text-3)", cursor: "pointer", fontFamily: "'Inter', sans-serif" }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ flex: 1 }} />
      <BottomNav />
    </div>
  );
}