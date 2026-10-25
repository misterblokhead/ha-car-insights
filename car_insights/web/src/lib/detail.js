// Pure helpers of the trip and charge detail pages (no runes, so node --test can import them).
import { NA, kwhPer100, delta, dayKey, dayLabel, time } from "./format.js";

// "12.3 km" -> ["12.3", "km"]; a value without a unit (the missing "–") keeps an empty unit
export function split(text) {
  const i = text.indexOf(" ");
  return i < 0 ? [text, ""] : [text.slice(0, i), text.slice(i + 1)];
}

// seconds -> ["1 h 05", "min"] so the unit can be set small beside the number
export function durationParts(s) {
  if (s == null) return [NA, ""];
  const min = Math.round(s / 60);
  return [min >= 60 ? `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, "0")}` : String(min), "min"];
}

const pair = (mine, usual) => (mine == null || usual == null ? null : { mine, usual, delta: mine - usual });

// This trip against the average of its earlier trips on the same route (the `similar` of the API); each measure is null when either side is unknown.
export function compare(trip, similar) {
  if (!similar) return null;
  return {
    duration: pair(trip.duration_s == null ? null : trip.duration_s / 60, similar.avg_duration_s == null ? null : similar.avg_duration_s / 60),
    consumption: pair(kwhPer100(trip.wh_per_100km), similar.avg_wh_per_100km == null ? null : similar.avg_wh_per_100km / 1000),
  };
}

// Where a value sits on a bar whose middle is the usual value and whose ends are 44 % under and over it; percent, null without a usual value.
export const markerAt = (mine, usual) => (!(usual > 0) ? null : Math.min(94, Math.max(6, 50 + (mine / usual - 1) * 100)));

// "−3 min", "+1.1 kWh/100 km"; "same" when it rounds to zero
export const deltaText = (d, unit, digits = 0) => (d.toFixed(digits).replace(/^-/, "").replace(/[0.]/g, "") === "" ? "same" : delta(d, unit, digits));

// "7.0 kW" with a true minus sign; the power of a charging curve can dip below zero
export const kwLabel = (kw) => (kw == null ? NA : `${kw < 0 ? "−" : ""}${Math.abs(kw).toFixed(1)} kW`);

// "74 → 69 %"; a missing end is a dash, and nothing known at all is a single dash
export const arrow = (a, b, unit) => (a == null && b == null ? NA : `${a ?? NA} → ${b ?? NA} ${unit}`);

// "Today · 14:05 – 14:35", "Thu 22 Oct · 14:05 – now"
export const rangeLine = (start, end, now = Date.now()) => `${dayLabel(dayKey(start), dayKey(now))} · ${time(start)} – ${end == null ? "now" : time(end)}`;
