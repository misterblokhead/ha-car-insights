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

// "29 km · 4.7 kWh used · +24.1 kWh"; parts that are zero or unknown are left out.
export function daySummary({ distance_m, net_wh, charged_wh }) {
  const parts = [];
  if (distance_m) parts.push(`${(distance_m / 1000).toFixed(distance_m >= 10000 ? 0 : 1)} km`);
  if (net_wh) parts.push(`${(net_wh / 1000).toFixed(1)} kWh used`);
  if (charged_wh) parts.push(`+${(charged_wh / 1000).toFixed(1)} kWh`);
  return parts.join(" · ");
}

// The server's consumption (Wh per 100 km, null when it means nothing) in kWh per 100 km, and as text.
export const kwhPer100 = (wh) => (wh == null ? null : wh / 1000);
export const consumption = (wh) => num(kwhPer100(wh), (v) => `${v.toFixed(1)} kWh/100 km`);

// "+1.1 kWh/100", "−3 min" (true minus sign).
export const delta = (value, unit, digits = 0) =>
  num(value, (v) => `${v < 0 ? "−" : "+"}${Math.abs(v).toFixed(digits)} ${unit}`);
