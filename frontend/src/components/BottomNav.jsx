// src/components/BottomNav.jsx
"use client";
import { useRouter, usePathname } from "next/navigation";

const tabs = [
  {
    label: "Home", href: "/home",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "#818cf8" : "none"} stroke={active ? "#818cf8" : "#475569"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    label: "Journey", href: "/journey",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#818cf8" : "#475569"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polygon points="10 8 16 12 10 16 10 8" fill={active ? "#818cf8" : "#475569"}/>
      </svg>
    ),
  },
  {
    label: "Tickets", href: "/tickets",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#818cf8" : "#475569"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
        <path d="M13 5v2M13 17v2M13 11v2"/>
      </svg>
    ),
  },
  {
    label: "Scan", href: "/scanner",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#818cf8" : "#475569"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>
        <rect width="7" height="5" x="7" y="7" rx="1"/><rect width="7" height="5" x="10" y="12" rx="1"/>
      </svg>
    ),
  },
  {
    label: "Profile", href: "/profile",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#818cf8" : "#475569"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    ),
  },
];

export default function BottomNav() {
  const router   = useRouter();
  const pathname = usePathname();

  return (
    <nav className="bnav">
      {tabs.map(tab => {
        const active = pathname === tab.href;
        return (
          <button
            key={tab.href}
            id={`nav-${tab.label.toLowerCase()}`}
            className={`bnav-btn ${active ? "active" : ""}`}
            onClick={() => router.push(tab.href)}
            aria-label={tab.label}
            aria-current={active ? "page" : undefined}
          >
            <span className="ico" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              {tab.icon(active)}
            </span>
            <span style={{
              fontSize: 10,
              fontWeight: active ? 700 : 600,
              color: active ? "var(--mv-indigo-400)" : "var(--mv-text-3)",
              transition: "all 0.15s",
              fontFamily: "'Inter', sans-serif",
            }}>
              {tab.label}
            </span>
            {active && (
              <div style={{
                position: "absolute",
                bottom: -10,
                width: 4, height: 4, borderRadius: "50%",
                background: "var(--mv-indigo-400)",
                boxShadow: "0 0 8px var(--mv-indigo-500)",
              }} />
            )}
          </button>
        );
      })}
    </nav>
  );
}