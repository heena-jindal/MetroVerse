// src/lib/api.js
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function call(path, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `API error ${res.status}`);
    }
    return await res.json();
  } catch (e) {
    console.error(`[MetroVerse API] ${path}:`, e.message);
    throw e;
  }
}

export async function findRouteAPI(from, to) {
  return call("/api/route", {
    method: "POST",
    body: JSON.stringify({ from, to }),
  });
}

export async function searchStationsAPI(query) {
  return call(`/api/stations?q=${encodeURIComponent(query)}`);
}

export async function getCrowdAPI(station) {
  return call(`/api/crowd/${encodeURIComponent(station)}`);
}

export async function getPlacesAPI(station) {
  return call(`/api/places/${encodeURIComponent(station)}`);
}

export async function generateTicketAPI(from, to, fare) {
  return call("/api/ticket", {
    method: "POST",
    body: JSON.stringify({ from, to, fare }),
  });
}

export async function getLiveStatusAPI() {
  return call("/api/status");
}

export async function healthCheck() {
  return call("/api/health");
}