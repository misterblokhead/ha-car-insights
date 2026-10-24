// Period arithmetic for the statistics page. Dates are "YYYY-MM-DD" (calendar days, no time zone); weeks start on Monday.
const DAY = 86400000;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const iso = (ms) => new Date(ms).toISOString().slice(0, 10);
const parts = (d) => d.split("-").map(Number);
const monday = (d) => iso(Date.parse(`${d}T00:00:00Z`) - ((new Date(`${d}T00:00:00Z`).getUTCDay() + 6) % 7) * DAY);

// n periods later (negative: earlier); a day past the end of the target month is clamped to its last day.
export function shift(period, at, n) {
  if (period === "week") return iso(Date.parse(`${at}T00:00:00Z`) + 7 * n * DAY);
  const [y, m, d] = parts(at);
  const index = period === "year" ? y * 12 + m - 1 + 12 * n : y * 12 + m - 1 + n;
  const [ny, nm] = [Math.floor(index / 12), index % 12];
  const last = new Date(Date.UTC(ny, nm + 1, 0)).getUTCDate();
  return `${ny}-${String(nm + 1).padStart(2, "0")}-${String(Math.min(d, last)).padStart(2, "0")}`;
}

export function isCurrent(period, at, today) {
  if (period === "week") return monday(at) === monday(today);
  return at.slice(0, period === "year" ? 4 : 7) === today.slice(0, period === "year" ? 4 : 7);
}

// (now − before) / before; null without a baseline.
export const change = (now, before) => (now == null || !before ? null : (now - before) / before);

// The API's bounds are midnights in HA's time zone; +12 h in UTC lands on that calendar day whatever zone the browser is in.
const dayOf = (ms) => parts(iso(ms + DAY / 2));
const short = (m) => MONTHS[m - 1].slice(0, 3);

// "October 2026", "2026", "19 – 25 Oct"; `end` is exclusive.
export function periodLabel(period, start, end) {
  const [y, m, d] = dayOf(start);
  if (period === "year") return String(y);
  if (period === "month") return `${MONTHS[m - 1]} ${y}`;
  const [ey, em, ed] = dayOf(end - DAY);
  if (ey !== y) return `${d} ${short(m)} ${y} – ${ed} ${short(em)} ${ey}`;
  return m === em ? `${d} – ${ed} ${short(m)}` : `${d} ${short(m)} – ${ed} ${short(em)}`;
}

// x label of a bar: the day number, or the month name in a year.
export function bucketLabel(period, start) {
  const [, m, d] = dayOf(start);
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
