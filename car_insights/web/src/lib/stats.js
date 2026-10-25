// Period arithmetic for the statistics page. Dates are "YYYY-MM-DD" (calendar days, no time zone); weeks start on Monday.
import { periodDay } from "./time.js";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// The request of a period page; without `at` the server answers for today in its own time zone.
const uiUrl = (path) => (view, period, at) => `api/ui/${path}?view=${encodeURIComponent(view)}&period=${period}${at ? `&at=${at}` : ""}`;
export const statsUrl = uiUrl("stats");
export const mapUrl = uiUrl("map");

// (now − before) / before; null without a baseline.
export const change = (now, before) => (now == null || !before ? null : (now - before) / before);

const short = (m) => MONTHS[m - 1].slice(0, 3);

// the day before an exclusive end bound
function lastDay(end) {
  const [y, m, d] = periodDay(end);
  const prev = new Date(Date.UTC(y, m - 1, d - 1));
  return [prev.getUTCFullYear(), prev.getUTCMonth() + 1, prev.getUTCDate()];
}

// "October 2026", "2026", "19 – 25 Oct"; `end` is exclusive.
export function periodLabel(period, start, end) {
  const [y, m, d] = periodDay(start); // the API's bounds are midnights in HA's zone
  if (period === "year") return String(y);
  if (period === "month") return `${MONTHS[m - 1]} ${y}`;
  const [ey, em, ed] = lastDay(end);
  if (ey !== y) return `${d} ${short(m)} ${y} – ${ed} ${short(em)} ${ey}`;
  return m === em ? `${d} – ${ed} ${short(m)}` : `${d} ${short(m)} – ${ed} ${short(em)}`;
}

// x label of a bar: the day number, or the month name in a year.
export function bucketLabel(period, start) {
  const [, m, d] = periodDay(start);
  return period === "year" ? short(m) : String(d);
}

// Charged-by-place segments, largest first; unnamed places and everything past `max` fold into a last "Other".
export function places(byPlace, max = 5) {
  const named = byPlace.filter((p) => p.place != null && p.wh > 0).sort((a, b) => b.wh - a.wh);
  const rest = named.slice(max).reduce((s, p) => s + p.wh, 0) + byPlace.filter((p) => p.place == null).reduce((s, p) => s + p.wh, 0);
  const out = named.slice(0, max).map((p) => ({ name: p.place, wh: p.wh, other: false }));
  if (rest > 0) out.push({ name: "Other", wh: rest, other: true });
  const total = out.reduce((s, p) => s + p.wh, 0);
  return out.map((p) => ({ ...p, share: p.wh / total }));
}

const EVENTS = [["accel", "Hard accelerations"], ["brake", "Hard brakings"], ["corner", "Sharp corners"]];

// The driving-style card of a period: score change in points, events per 10 km with their change against `previous`
// (no change without km there), and the speed bands as bars relative to the largest kWh/100 km.
export function styleRows(style, previous) {
  const prev = previous?.km > 0 ? previous : null;
  const rate = (s, k) => (s.km > 0 ? (s[k] / s.km) * 10 : null);
  const values = Object.values(style.bands).map((b) => b.kwh_per_100km);
  const max = Math.max(0, ...values.filter((v) => v != null));
  return {
    points: style.score != null && prev?.score != null ? style.score - prev.score : null,
    events: EVENTS.map(([k, name]) => {
      const now = rate(style, k);
      return { k, name, per10: now, change: prev ? change(now, rate(prev, k)) : null };
    }),
    bands: Object.entries(style.bands).map(([name, b]) => ({ name, value: b.kwh_per_100km, share: b.kwh_per_100km == null || !max ? 0 : b.kwh_per_100km / max })),
  };
}

// The change tag of the score: points, not a percentage of a 0-100 score; "same" at 0, null without a change.
export const pointsTag = (p) => (p == null ? null : { dir: Math.sign(p), text: p ? String(Math.abs(p)) : "same", hint: false });
