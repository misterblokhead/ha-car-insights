export const NA = "–";
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

// "14:05" today, else "Wed 22 Oct 14:05".
export function when(ms, now = Date.now()) {
  if (ms == null) return NA;
  if (dayKey(ms) === dayKey(now)) return time(ms);
  return `${new Date(ms).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })} ${time(ms)}`;
}

const DAY = 86400000;
const utc = (d) => Date.parse(`${d}T00:00:00Z`);

// "Today", "Yesterday", else "Thu 22 Oct"; dates are "YYYY-MM-DD".
export function dayLabel(date, today) {
  const diff = (utc(today) - utc(date)) / DAY;
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  const d = new Date(utc(date)); // fixed names: ICU spells September "Sept"
  return `${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getUTCDay()]} ${d.getUTCDate()} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getUTCMonth()]}`;
}

// "29 km · 4.7 kWh used · +24.1 kWh"; parts that are zero or unknown are left out.
export function daySummary({ distance_m, net_wh, charged_wh }) {
  const parts = [];
  if (distance_m) parts.push(`${(distance_m / 1000).toFixed(distance_m >= 10000 ? 0 : 1)} km`);
  if (net_wh) parts.push(`${(net_wh / 1000).toFixed(1)} kWh used`);
  if (charged_wh) parts.push(`+${(charged_wh / 1000).toFixed(1)} kWh`);
  return parts.join(" · ");
}

// Consumption in kWh per 100 km; null without both inputs or without distance.
export const kwh100 = (net_wh, distance_m) => (net_wh == null || !distance_m ? null : (net_wh / 1000 / distance_m) * 100000);

// "+1.1 kWh/100", "−3 min" (true minus sign).
export const delta = (value, unit, digits = 0) =>
  num(value, (v) => `${v < 0 ? "−" : "+"}${Math.abs(v).toFixed(digits)} ${unit}`);
