// lib/routeEngine.js
// Dijkstra-based metro route finder
// Works entirely client-side — no backend needed for Phase 1

import metroData from "@/data/delhi_metro.json";

// Build adjacency graph from GTFS data
function buildGraph() {
  const graph = {};

  for (const line of metroData.lines) {
    const stations = line.stations;
    for (let i = 0; i < stations.length; i++) {
      const st = stations[i];
      if (!graph[st]) graph[st] = [];

      if (i > 0) {
        const prev = stations[i - 1];
        graph[st].push({ to: prev, line: line.id, lineName: line.name, lineColor: line.color, weight: 1 });
      }
      if (i < stations.length - 1) {
        const next = stations[i + 1];
        graph[st].push({ to: next, line: line.id, lineName: line.name, lineColor: line.color, weight: 1 });
      }
    }
  }
  return graph;
}

// Dijkstra shortest path
function dijkstra(graph, start, end) {
  const dist   = {};
  const prev   = {};
  const lineUsed = {};
  const visited = new Set();
  const queue  = [];

  for (const node of Object.keys(graph)) {
    dist[node] = Infinity;
  }
  dist[start] = 0;
  queue.push({ node: start, cost: 0 });

  while (queue.length > 0) {
    queue.sort((a, b) => a.cost - b.cost);
    const { node } = queue.shift();
    if (visited.has(node)) continue;
    visited.add(node);
    if (node === end) break;

    for (const edge of (graph[node] || [])) {
      const interchange = metroData.interchanges.find(i => i.station === node);
      const changePenalty = (
        lineUsed[node] &&
        lineUsed[node] !== edge.line &&
        interchange
      ) ? 3 : 0; // 3-stop penalty for changing lines

      const newCost = dist[node] + edge.weight + changePenalty;
      if (newCost < dist[edge.to]) {
        dist[edge.to]    = newCost;
        prev[edge.to]    = node;
        lineUsed[edge.to] = edge.line;
        queue.push({ node: edge.to, cost: newCost });
      }
    }
  }

  // Reconstruct path
  const path = [];
  let cur = end;
  while (cur) {
    path.unshift(cur);
    cur = prev[cur];
  }
  return path[0] === start ? path : [];
}

// Calculate fare based on number of stations
function calcFare(stops) {
  const f = metroData.fares;
  if (stops <= 2)  return f["0-2"];
  if (stops <= 5)  return f["3-5"];
  if (stops <= 12) return f["6-12"];
  if (stops <= 21) return f["13-21"];
  if (stops <= 32) return f["22-32"];
  return f["33+"];
}

// Calculate time in minutes
function calcTime(stops) {
  return Math.round(stops * metroData.avg_stop_gap_minutes);
}

// Find line segments in a path (which line is used between which stations)
function getLineSegments(path) {
  const graph = buildGraph();
  const segments = [];
  let curLine = null;
  let segStart = path[0];

  for (let i = 1; i < path.length; i++) {
    const prev = path[i - 1];
    const curr = path[i];
    const edge = graph[prev]?.find(e => e.to === curr);
    const line = edge?.line || curLine;

    if (line !== curLine) {
      if (curLine) {
        segments.push({ line: curLine, from: segStart, to: prev });
      }
      curLine   = line;
      segStart  = prev;
    }
    if (i === path.length - 1) {
      segments.push({ line: curLine, from: segStart, to: curr });
    }
  }
  return segments;
}

// Count interchanges in a path
function countInterchanges(path) {
  const graph = buildGraph();
  let changes = 0;
  let curLine  = null;

  for (let i = 1; i < path.length; i++) {
    const prev = path[i - 1];
    const curr = path[i];
    const edge = graph[prev]?.find(e => e.to === curr);
    if (edge && curLine && edge.line !== curLine) changes++;
    if (edge) curLine = edge.line;
  }
  return changes;
}

// Main export: find route
export function findRoute(from, to) {
  if (!from || !to || from === to) return null;

  const graph = buildGraph();
  const path  = dijkstra(graph, from, to);

  if (!path.length) return null;

  const stops       = path.length - 1;
  const fare        = calcFare(stops);
  const time        = calcTime(stops);
  const segments    = getLineSegments(path);
  const interchanges = countInterchanges(path);

  // Get line info for display
  const linesUsed = [...new Set(segments.map(s => s.line))].map(lid => {
    const line = metroData.lines.find(l => l.id === lid);
    return { id: lid, name: line?.name || lid, color: line?.color || "#888" };
  });

  return {
    path,
    stops,
    fare,
    time,
    segments,
    interchanges,
    linesUsed,
    from,
    to,
  };
}

// Export autocomplete helper
export function searchStations(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  const all = [];
  for (const line of metroData.lines) {
    for (const st of line.stations) {
      if (st.toLowerCase().includes(q) && !all.includes(st)) {
        all.push(st);
      }
    }
  }
  return all.slice(0, 8);
}

// Export all stations flat
export function getAllStations() {
  const all = [];
  for (const line of metroData.lines) {
    for (const st of line.stations) {
      if (!all.includes(st)) all.push(st);
    }
  }
  return all.sort();
}

// Get tourist spots for a station
export function getTouristSpots(station) {
  return metroData.tourist_spots[station] || [];
}

// Get interchange info
export function getInterchangeInfo(station) {
  return metroData.interchanges.find(i => i.station === station) || null;
}