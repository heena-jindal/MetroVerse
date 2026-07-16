// src/app/login/page.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab]           = useState("email");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Welcome to MetroVerse! 🚇");
      router.push("/city");
    }, 900);
  }

  return (
    <div className="page-enter" style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "var(--mv-bg)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background glows */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)",
          width: 600, height: 400, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", bottom: 0, right: "-20%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)",
        }} />
      </div>

      {/* Header */}
      <div style={{
        padding: "48px 28px 36px",
        position: "relative", zIndex: 1,
      }}>
        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14,
            background: "linear-gradient(135deg, #4338ca, #6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
          }}>
            <span style={{ fontSize: 20, fontWeight: 900, color: "#fff", fontFamily: "'Inter', sans-serif" }}>M</span>
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#fff", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.5px" }}>MetroVerse</span>
        </div>

        <h1 style={{
          fontSize: 28, fontWeight: 900, color: "#fff",
          letterSpacing: "-1px", lineHeight: 1.2, marginBottom: 8,
          fontFamily: "'Inter', sans-serif",
        }}>
          Welcome back.
        </h1>
        <p style={{ fontSize: 14, color: "var(--mv-text-2)", lineHeight: 1.6, fontFamily: "'Inter', sans-serif" }}>
          Sign in to access tickets, routes &amp; live navigation.
        </p>
      </div>

      {/* Form card */}
      <div style={{
        flex: 1,
        margin: "0 16px",
        background: "rgba(15,22,41,0.8)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 24,
        padding: "28px 24px 32px",
        position: "relative", zIndex: 1,
        boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
      }}>
        {/* Tab switcher */}
        <div style={{
          display: "flex",
          background: "rgba(255,255,255,0.04)",
          borderRadius: 10, padding: 4,
          border: "1px solid rgba(255,255,255,0.06)",
          marginBottom: 24,
        }}>
          {[{ id: "email", label: "Email" }, { id: "phone", label: "Phone / OTP" }].map(t => (
            <button
              id={`login-tab-${t.id}`}
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1, padding: "9px 0",
                textAlign: "center", fontSize: 13, fontWeight: 600,
                color: tab === t.id ? "#fff" : "var(--mv-text-3)",
                borderRadius: 8, border: "none",
                background: tab === t.id
                  ? "linear-gradient(135deg, #4338ca, #6366f1)"
                  : "none",
                boxShadow: tab === t.id ? "0 2px 8px rgba(99,102,241,0.4)" : "none",
                cursor: "pointer", transition: "all 0.2s",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin}>
          {tab === "email" ? (
            <>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--mv-text-2)", marginBottom: 7, display: "block", fontFamily: "'Inter', sans-serif" }}>
                  Email address
                </label>
                <input
                  id="email-input"
                  className="mv-input"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--mv-text-2)", marginBottom: 7, display: "block", fontFamily: "'Inter', sans-serif" }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="password-input"
                    className="mv-input"
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    style={{ paddingRight: 48 }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    style={{
                      position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer",
                      color: "var(--mv-text-3)", fontSize: 16,
                    }}
                  >
                    {showPass ? "🙈" : "👁"}
                  </button>
                </div>
              </div>
              <div style={{ textAlign: "right", marginBottom: 20 }}>
                <span style={{ fontSize: 12, color: "var(--mv-indigo-400)", fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', sans-serif" }}>
                  Forgot password?
                </span>
              </div>
              <button id="signin-btn" className="btn-primary" type="submit" disabled={loading}>
                {loading
                  ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                  : <><span>Sign In</span><span>→</span></>}
              </button>
            </>
          ) : (
            <>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--mv-text-2)", marginBottom: 7, display: "block", fontFamily: "'Inter', sans-serif" }}>
                  Mobile number
                </label>
                <input
                  id="phone-input"
                  className="mv-input"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
              <button id="send-otp-btn" className="btn-primary" type="submit" disabled={loading}>
                {loading
                  ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                  : <><span>Send OTP</span><span>→</span></>}
              </button>
            </>
          )}
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
          <span style={{ fontSize: 12, color: "var(--mv-text-3)", fontFamily: "'Inter', sans-serif" }}>or continue with</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
        </div>

        {/* Social login */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[
            { icon: "🅖", label: "Google" },
            { icon: "🪪", label: "DigiLocker" },
          ].map(btn => (
            <button
              id={`login-${btn.label.toLowerCase()}`}
              key={btn.label}
              className="btn-sm ghost"
              style={{ justifyContent: "center", padding: "12px", fontSize: 13 }}
              onClick={() => router.push("/city")}
            >
              {btn.icon} {btn.label}
            </button>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: 13, color: "var(--mv-text-3)", fontFamily: "'Inter', sans-serif" }}>New to MetroVerse? </span>
          <span style={{ fontSize: 13, color: "var(--mv-indigo-400)", fontWeight: 700, cursor: "pointer", fontFamily: "'Inter', sans-serif" }}>
            Create account
          </span>
        </div>
      </div>

      <p style={{
        textAlign: "center", padding: "16px 24px 32px", fontSize: 11,
        color: "var(--mv-text-3)", lineHeight: 1.6,
        fontFamily: "'Inter', sans-serif",
        position: "relative", zIndex: 1,
      }}>
        By continuing you agree to our{" "}
        <span style={{ color: "var(--mv-indigo-400)", cursor: "pointer" }}>Terms</span> and{" "}
        <span style={{ color: "var(--mv-indigo-400)", cursor: "pointer" }}>Privacy Policy</span>
      </p>
    </div>
  );
}