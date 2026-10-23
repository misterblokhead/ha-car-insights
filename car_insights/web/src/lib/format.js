const NA = "not available";
const num = (x, f) => (x == null ? NA : f(x));

export const km = (m) => num(m, (v) => `${(v / 1000).toFixed(1)} km`);
export const kwh = (wh) => num(wh, (v) => `${(v / 1000).toFixed(2)} kWh`);
export const kw = (w) => num(w, (v) => `${(v / 1000).toFixed(1)} kW`);
export const pct = (x) => num(x, (v) => `${v.toFixed(1)} %`);

export const duration = (s) =>
  num(s, (v) => {
    const min = Math.round(v / 60);
    return min >= 60 ? `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, "0")} min` : `${min} min`;
  });

export const time = (ms) =>
  ms == null ? NA : new Date(ms).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export const dayKey = (ms) => {
  const d = new Date(ms);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// Groups items (by their `start` ms) into [dayKey, items], newest day first.
export function byDay(items, start = (i) => i.start) {
  const days = new Map();
  for (const i of [...items].sort((a, b) => start(b) - start(a))) {
    const k = dayKey(start(i));
    if (!days.has(k)) days.set(k, []);
    days.get(k).push(i);
  }
  return [...days];
}

// "14:05" today, else "Wed 22 Oct 14:05".
export function when(ms, now = Date.now()) {
  if (ms == null) return NA;
  if (dayKey(ms) === dayKey(now)) return time(ms);
  return `${new Date(ms).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })} ${time(ms)}`;
}

// "52.08990, 5.00000" for a position; null → not available.
export const latlon = (lat, lon) => (lat == null || lon == null ? NA : `${lat.toFixed(5)}, ${lon.toFixed(5)}`);

// "42.1 % added (85.3 % to 100.0 %)"; the range only when both ends are known.
export const chargeLevel = ({ added, from, to }) =>
  added == null ? NA : `${pct(added)} added${from == null || to == null ? "" : ` (${pct(from)} to ${pct(to)})`}`;
