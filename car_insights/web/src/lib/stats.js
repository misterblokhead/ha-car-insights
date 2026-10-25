// Period arithmetic for the statistics page. Dates are "YYYY-MM-DD" (calendar days, no time zone); weeks start on Monday.
import { periodDay } from "./time.js";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// The statistics request; without `at` the server answers for today in its own time zone.
export const statsUrl = (view, period, at) => `api/ui/stats?view=${encodeURIComponent(view)}&period=${period}${at ? `&at=${at}` : ""}`;

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
