import test from "node:test";
import assert from "node:assert/strict";
import { km, kwh, kw, pct, duration, dayKey, byDay, when, time, dayLabel, daySummary, delta, kwh100 } from "./format.js";

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

test("byDay groups newest day first", () => {
  const t = (day, h) => new Date(2026, 9, day, h).getTime();
  const items = [{ start: t(1, 8) }, { start: t(2, 9) }, { start: t(1, 18) }];
  const out = byDay(items);
  assert.deepEqual(out.map(([k]) => k), ["2026-10-02", "2026-10-01"]);
  assert.equal(out[1][1].length, 2);
});

test("when shows the date only when not today", () => {
  const now = new Date(2026, 9, 22, 16).getTime();
  const today = new Date(2026, 9, 22, 14, 5).getTime();
  assert.equal(when(today, now), time(today));
  assert.match(when(new Date(2026, 9, 20, 14, 5).getTime(), now), /^Tue 20 Oct /);
  assert.equal(when(null), "–");
});

test("latlon", async () => {
  const { latlon } = await import("./format.js");
  assert.equal(latlon(52.089900000002984, 5), "52.08990, 5.00000");
  assert.equal(latlon(null, 5), "–");
});

test("chargeLevel", async () => {
  const { chargeLevel } = await import("./format.js");
  assert.equal(chargeLevel({ added: 42.1, from: 85.3, to: 100 }), "42.1 % added (85.3 % to 100.0 %)");
  assert.equal(chargeLevel({ added: 42.1, from: null, to: 100 }), "42.1 % added");
  assert.equal(chargeLevel({ added: null, from: 1, to: 2 }), "–");
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

test("kwh100", () => {
  assert.ok(Math.abs(kwh100(4050, 26000) - 15.58) < 0.01);
  assert.equal(kwh100(100, 0), null);
  assert.equal(kwh100(null, 1000), null);
});
