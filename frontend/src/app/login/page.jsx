// src/app/login/page.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab]           = useState("email"); // email or phone
  const [isSignUp, setIsSignUp] = useState(false);   // toggle sign in vs sign up
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]         = useState("");      // for sign up only
  const [phone, setPhone]       = useState("");
  const [otp, setOtp]           = useState("");
  const [otpSent, setOtpSent]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleEmailAuth(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name.trim() || email.split("@")[0],
            },
          },
        });
        if (error) throw error;
        toast.success("Account created successfully! Welcome to MetroVerse! 🚇");
        router.push("/city");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Welcome back to MetroVerse! 🚇");
        router.push("/city");
      }
    } catch (err) {
      toast.error(err.message || "Authentication failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePhoneAuth(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const formattedPhone = phone.startsWith("+") ? phone.trim() : "+91" + phone.replace(/\s+/g, "");
      if (!otpSent) {
        const { error } = await supabase.auth.signInWithOtp({
          phone: formattedPhone,
        });
        if (error) throw error;
        setOtpSent(true);
        toast.success("OTP verification code sent to " + formattedPhone);
      } else {
        const { error } = await supabase.auth.verifyOtp({
          phone: formattedPhone,
          token: otp.trim(),
          type: "sms",
        });
        if (error) throw error;
        toast.success("Signed in successfully! 🚇");
        router.push("/city");
      }
    } catch (err) {
      toast.error(err.message || "Failed to process phone verification.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" ? window.location.origin + "/city" : undefined,
        },
      });
      if (error) throw error;
    } catch (err) {
      toast.error(err.message || "Failed to initiate Google authentication.");
    }
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
        padding: "48px 28px 24px",
        position: "relative", zIndex: 1,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
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
          {isSignUp ? "Create account." : "Welcome back."}
        </h1>
        <p style={{ fontSize: 14, color: "var(--mv-text-2)", lineHeight: 1.6, fontFamily: "'Inter', sans-serif" }}>
          {isSignUp ? "Join MetroVerse to manage tickets & plan routes." : "Sign in to access tickets, routes & live navigation."}
        </p>
      </div>

      {/* Form card */}
      <div style={{
        flex: 1,
        margin: "0 16px 20px",
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
              onClick={() => { setTab(t.id); setOtpSent(false); }}
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

        {tab === "email" ? (
          <form onSubmit={handleEmailAuth}>
            {isSignUp && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--mv-text-2)", marginBottom: 7, display: "block", fontFamily: "'Inter', sans-serif" }}>
                  Your name
                </label>
                <input
                  id="name-input"
                  className="mv-input"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}
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
            <div style={{ marginBottom: 20 }}>
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
                  placeholder="At least 6 characters"
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
            <button id="signin-btn" className="btn-primary" type="submit" disabled={loading} style={{ marginBottom: 12 }}>
              {loading
                ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                : <><span>{isSignUp ? "Sign Up" : "Sign In"}</span><span>→</span></>}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePhoneAuth}>
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
                disabled={otpSent}
                required
              />
            </div>
            {otpSent && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--mv-text-2)", marginBottom: 7, display: "block", fontFamily: "'Inter', sans-serif" }}>
                  Enter 6-digit OTP code
                </label>
                <input
                  id="otp-input"
                  className="mv-input"
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="000000"
                  required
                />
              </div>
            )}
            <button id="phone-auth-btn" className="btn-primary" type="submit" disabled={loading} style={{ marginBottom: 12 }}>
              {loading
                ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                : <><span>{otpSent ? "Verify OTP" : "Send OTP"}</span><span>→</span></>}
            </button>
          </form>
        )}

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0 20px" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
          <span style={{ fontSize: 12, color: "var(--mv-text-3)", fontFamily: "'Inter', sans-serif" }}>or continue with</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
        </div>

        {/* Social login */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
          <button
            id="login-google"
            className="btn-sm ghost"
            style={{ justifyContent: "center", padding: "12px", fontSize: 13 }}
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            🅖 Google
          </button>
          <button
            id="login-digilocker"
            className="btn-sm ghost"
            style={{ justifyContent: "center", padding: "12px", fontSize: 13 }}
            onClick={() => { toast.success("DigiLocker Integration — coming soon"); }}
            disabled={loading}
          >
            🪪 DigiLocker
          </button>
        </div>

        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: 13, color: "var(--mv-text-3)", fontFamily: "'Inter', sans-serif" }}>
            {isSignUp ? "Already have an account? " : "New to MetroVerse? "}
          </span>
          <span
            onClick={() => setIsSignUp(s => !s)}
            style={{ fontSize: 13, color: "var(--mv-indigo-400)", fontWeight: 700, cursor: "pointer", fontFamily: "'Inter', sans-serif" }}
          >
            {isSignUp ? "Sign In" : "Create account"}
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