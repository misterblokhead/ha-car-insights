// Dates and times as Home Assistant's zone shows them, whatever zone the browser is in. Set once from `/api/ui/me`.
import { NA } from "./format.js";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pad = (n) => String(n).padStart(2, "0");
const DAY = 86400000;

let wall; // wall-clock fields in the zone, always en-US so the part values are plain numbers
let clockFmt; // HH:MM in the browser's locale

// An unknown or missing name keeps the browser's own zone.
export function setZone(tz) {
  let timeZone = tz || undefined;
  try {
    new Intl.DateTimeFormat([], { timeZone });
  } catch {
    timeZone = undefined;
  }
  wall = new Intl.DateTimeFormat("en-US", { timeZone, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" });
  clockFmt = new Intl.DateTimeFormat([], { timeZone, hour: "2-digit", minute: "2-digit" });
}
setZone();

const fields = (ms) => Object.fromEntries(wall.formatToParts(ms).map((p) => [p.type, Number(p.value)]));

// [year, month, day] of an instant in the zone; the calendar day an API bound (a midnight) starts.
export function periodDay(ms) {
  const { year, month, day } = fields(ms);
  return [year, month, day];
}

export const dayKey = (ms) => {
  const [y, m, d] = periodDay(ms);
  return `${y}-${pad(m)}-${pad(d)}`;
};
export const today = () => dayKey(Date.now());
export const clock = (ms) => (ms == null ? NA : clockFmt.format(ms));

const utc = (date) => Date.parse(`${date}T00:00:00Z`);
const name = (date) => {
  const d = new Date(utc(date)); // the calendar day itself: no zone involved
  return `${DAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
};

// "Today", "Yesterday", else "Thu 22 Oct"; dates are "YYYY-MM-DD".
export function dayLabel(date, now) {
  const diff = (utc(now) - utc(date)) / DAY;
  return diff === 0 ? "Today" : diff === 1 ? "Yesterday" : name(date);
}

// "14:05" today, else "Wed 22 Oct 14:05".
export function dateTime(ms, now = Date.now()) {
  if (ms == null) return NA;
  const day = dayKey(ms);
  return day === dayKey(now) ? clock(ms) : `${name(day)} ${clock(ms)}`;
}

// the offset of the zone at an instant, in ms (wall clock as if UTC, minus the instant)
const offset = (ms) => {
  const f = fields(ms);
  return Date.UTC(f.year, f.month - 1, f.day, f.hour % 24, f.minute, f.second) - ms;
};

// ms of 00:00 on a "YYYY-MM-DD" in the zone; a day is 23 or 25 hours long when the clocks change
export function midnight(date) {
  const wallMs = utc(date);
  return wallMs - offset(wallMs - offset(wallMs)); // the second pass settles on the offset in force at that midnight
}
export const nextMidnight = (date) => midnight(new Date(utc(date) + DAY).toISOString().slice(0, 10));
