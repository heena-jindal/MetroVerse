import "./globals.css";
import { Toaster } from "react-hot-toast";
import ChatBubble from "@/components/ChatBubble";
import PushToast  from "@/components/PushToast";

export const metadata = {
  title: "MetroVerse — India's Unified Metro App",
  description: "Plan journeys, buy tickets, navigate live across India's metro networks. Smart crowd prediction, UPI ticketing, and real-time guidance.",
  keywords: "Delhi Metro, metro app, DMRC, route planner, QR ticket, metro navigation India",
  authors: [{ name: "MetroVerse" }],
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  themeColor: "#080C18",
  openGraph: {
    title: "MetroVerse — India's Unified Metro App",
    description: "Smart metro navigation for every Indian city.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <ChatBubble />
        <PushToast />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#0F1629",
              color: "#f1f5f9",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              fontSize: "13px",
              fontWeight: 500,
              fontFamily: "'Inter', sans-serif",
              boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
            },
            success: {
              iconTheme: { primary: "#22d3ee", secondary: "#080C18" },
            },
            error: {
              iconTheme: { primary: "#f87171", secondary: "#080C18" },
            },
          }}
        />
      </body>
    </html>
  );
}