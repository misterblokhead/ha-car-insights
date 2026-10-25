import test from "node:test";
import assert from "node:assert/strict";
import { km, kwh, kw, pct, duration, dayKey, when, time, dayLabel, daySummary, delta, kwhPer100, consumption } from "./format.js";

test("units", () => {
  assert.equal(km(26000), "26.0 km");
  assert.equal(kwh(24050), "24.05 kWh");
  assert.equal(kw(11300), "11.3 kW");
  assert.equal(pct(81.72), "81.7 %");
});

test("null is not available", () => {
  for (const f of [km, kwh, kw, pct, duration]) assert.equal(f(null), "–");
});

test("duration", () => {
  assert.equal(duration(7677), "2 h 08 min");
  assert.equal(duration(2700), "45 min");
});

test("dayKey is local YYYY-MM-DD", () => {
  const d = new Date(2026, 9, 3, 23, 30);
  assert.equal(dayKey(d.getTime()), "2026-10-03");
});

test("when shows the date only when not today", () => {
  const now = new Date(2026, 9, 22, 16).getTime();
  const today = new Date(2026, 9, 22, 14, 5).getTime();
  assert.equal(when(today, now), time(today));
  assert.match(when(new Date(2026, 9, 20, 14, 5).getTime(), now), /^Tue 20 Oct /);
  assert.equal(when(null), "–");
});

test("dayLabel", () => {
  assert.equal(dayLabel("2026-10-24", "2026-10-24"), "Today");
  assert.equal(dayLabel("2026-10-23", "2026-10-24"), "Yesterday");
  assert.equal(dayLabel("2026-10-22", "2026-10-24"), "Thu 22 Oct");
  assert.equal(dayLabel("2026-09-30", "2026-10-01"), "Yesterday");
  assert.equal(dayLabel("2026-09-29", "2026-10-01"), "Tue 29 Sep");
});

test("daySummary", () => {
  assert.equal(daySummary({ distance_m: 29000, net_wh: 4700, charged_wh: 24100 }), "29 km · 4.7 kWh used · +24.1 kWh");
  assert.equal(daySummary({ distance_m: 5400, net_wh: 0, charged_wh: 0 }), "5.4 km");
  assert.equal(daySummary({ distance_m: 0, net_wh: null, charged_wh: 24100 }), "+24.1 kWh");
  assert.equal(daySummary({ distance_m: 0, net_wh: 0, charged_wh: 0 }), "");
});

test("delta", () => {
  assert.equal(delta(-3, "min"), "−3 min");
  assert.equal(delta(1.14, "kWh/100", 1), "+1.1 kWh/100");
});

test("consumption shows the server's Wh per 100 km as kWh, or a dash", () => {
  assert.equal(consumption(27_300), "27.3 kWh/100 km");
  assert.equal(consumption(null), "–");
  assert.equal(kwhPer100(15_580), 15.58);
  assert.equal(kwhPer100(null), null);
});
