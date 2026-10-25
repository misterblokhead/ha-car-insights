process.env.TZ = "America/New_York"; // the browser is far from HA: only HA's zone may show
import test from "node:test";
import assert from "node:assert/strict";
import { setZone, dayKey, clock, dayLabel, dateTime, today, midnight, nextMidnight, periodDay } from "./time.js";

setZone("Europe/Amsterdam");

test("dayKey is the YYYY-MM-DD in HA's zone", () => {
  assert.equal(dayKey(Date.UTC(2026, 9, 24, 21, 30)), "2026-10-24"); // 23:30 in Amsterdam, 17:30 in New York
  assert.equal(dayKey(Date.UTC(2026, 9, 24, 22, 30)), "2026-10-25"); // 00:30 Amsterdam
  assert.equal(dayKey(Date.UTC(2026, 9, 3, 21, 30)), "2026-10-03");
});

test("today is HA's today", () => {
  assert.equal(today(), dayKey(Date.now()));
});

test("clock is HH:MM in HA's zone, a dash without a time", () => {
  const c = clock(Date.UTC(2026, 9, 24, 21, 30));
  assert.match(c, /23/);
  assert.match(c, /30/);
  assert.equal(clock(null), "–");
});

test("dayLabel", () => {
  assert.equal(dayLabel("2026-10-24", "2026-10-24"), "Today");
  assert.equal(dayLabel("2026-10-24", "2026-10-25"), "Yesterday"); // a 23:30 trip, from the day of the clock change
  assert.equal(dayLabel("2026-10-22", "2026-10-24"), "Thu 22 Oct");
  assert.equal(dayLabel("2026-09-30", "2026-10-01"), "Yesterday");
  assert.equal(dayLabel("2026-09-29", "2026-10-01"), "Tue 29 Sep");
});

test("dateTime shows the date only when not today, with fixed month names", () => {
  const now = Date.UTC(2026, 9, 22, 14);
  const at = Date.UTC(2026, 9, 22, 12, 5);
  assert.equal(dateTime(at, now), clock(at));
  assert.equal(dateTime(Date.UTC(2026, 9, 20, 12, 5), now), `Tue 20 Oct ${clock(Date.UTC(2026, 9, 20, 12, 5))}`);
  const sep = dateTime(Date.UTC(2026, 8, 10, 12, 5), now);
  assert.match(sep, /^Thu 10 Sep /);
  assert.doesNotMatch(sep, /Sept/);
  assert.equal(dateTime(null), "–");
});

test("midnight and nextMidnight are HA's, across the 25-hour day", () => {
  assert.equal(midnight("2026-10-25"), Date.UTC(2026, 9, 24, 22));
  assert.equal(nextMidnight("2026-10-25"), Date.UTC(2026, 9, 25, 23));
  assert.equal(midnight("2026-10-26"), Date.UTC(2026, 9, 25, 23));
  assert.equal(midnight("2026-03-29"), Date.UTC(2026, 2, 28, 23)); // the 23-hour day starts at +01:00
  assert.equal(nextMidnight("2026-03-29"), Date.UTC(2026, 2, 29, 22));
  assert.equal(nextMidnight("2026-10-31"), midnight("2026-11-01"));
});

test("periodDay reads an API bound as the calendar day it starts", () => {
  assert.deepEqual(periodDay(Date.parse("2026-10-19T00:00+02:00")), [2026, 10, 19]);
  assert.deepEqual(periodDay(Date.parse("2026-01-01T00:00+01:00")), [2026, 1, 1]);
});

test("setZone without a name, or with a bad one, falls back to the browser's zone", () => {
  for (const tz of [undefined, "Not/AZone"]) {
    assert.doesNotThrow(() => setZone(tz));
    assert.equal(dayKey(Date.UTC(2026, 9, 24, 21, 30)), "2026-10-24"); // 17:30 in New York, same day
    assert.equal(dayKey(Date.UTC(2026, 9, 24, 2, 0)), "2026-10-23"); // 22:00 on the 23rd in New York
  }
  setZone("Europe/Amsterdam");
});
