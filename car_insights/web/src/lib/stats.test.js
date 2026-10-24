import test from "node:test";
import assert from "node:assert/strict";
import { shift, isCurrent, change, periodLabel, bucketLabel, places } from "./stats.js";

test("shift: weeks move by 7 days, either way", () => {
  assert.equal(shift("week", "2026-10-24", -1), "2026-10-17");
  assert.equal(shift("week", "2026-10-24", 2), "2026-11-07");
  assert.equal(shift("week", "2026-03-02", -1), "2026-02-23");
});

test("shift: months clamp to the length of the target month", () => {
  assert.equal(shift("month", "2026-03-31", -1), "2026-02-28");
  assert.equal(shift("month", "2024-03-31", -1), "2024-02-29");
  assert.equal(shift("month", "2026-01-31", 1), "2026-02-28");
  assert.equal(shift("month", "2026-01-15", -1), "2025-12-15");
  assert.equal(shift("month", "2026-12-15", 1), "2027-01-15");
  assert.equal(shift("month", "2026-10-24", 0), "2026-10-24");
});

test("shift: years, a leap day clamps", () => {
  assert.equal(shift("year", "2026-10-24", -1), "2025-10-24");
  assert.equal(shift("year", "2024-02-29", 1), "2025-02-28");
  assert.equal(shift("year", "2024-02-29", 4), "2028-02-29");
});

test("isCurrent: same Monday-first week, month or year as today", () => {
  assert.equal(isCurrent("week", "2026-10-19", "2026-10-25"), true); // Monday and Sunday of one week
  assert.equal(isCurrent("week", "2026-10-25", "2026-10-26"), false); // Sunday, then the next Monday
  assert.equal(isCurrent("week", "2026-10-17", "2026-10-24"), false);
  assert.equal(isCurrent("week", "2026-12-31", "2027-01-03"), true); // across the new year
  assert.equal(isCurrent("month", "2026-10-01", "2026-10-31"), true);
  assert.equal(isCurrent("month", "2026-09-30", "2026-10-01"), false);
  assert.equal(isCurrent("year", "2026-01-01", "2026-12-31"), true);
  assert.equal(isCurrent("year", "2025-12-31", "2026-01-01"), false);
});

test("change: a fraction against before; no baseline is null", () => {
  assert.equal(change(110, 100), 0.1);
  assert.equal(change(50, 100), -0.5);
  assert.equal(change(0, 100), -1);
  assert.equal(change(5, 0), null);
  assert.equal(change(5, null), null);
  assert.equal(change(5, undefined), null);
  assert.equal(change(null, 5), null);
});

// Amsterdam midnights (UTC+1 / UTC+2): the label must not depend on the browser's time zone
const ams = (iso) => Date.parse(iso);
test("periodLabel: month, year, week", () => {
  assert.equal(periodLabel("month", ams("2026-10-01T00:00+02:00"), ams("2026-11-01T00:00+01:00")), "October 2026");
  assert.equal(periodLabel("month", ams("2026-01-01T00:00+01:00"), ams("2026-02-01T00:00+01:00")), "January 2026");
  assert.equal(periodLabel("year", ams("2026-01-01T00:00+01:00"), ams("2027-01-01T00:00+01:00")), "2026");
  assert.equal(periodLabel("week", ams("2026-10-19T00:00+02:00"), ams("2026-10-26T00:00+01:00")), "19 – 25 Oct"); // the clocks go back inside it
  assert.equal(periodLabel("week", ams("2026-10-26T00:00+01:00"), ams("2026-11-02T00:00+01:00")), "26 Oct – 1 Nov");
  assert.equal(periodLabel("week", ams("2026-12-28T00:00+01:00"), ams("2027-01-04T00:00+01:00")), "28 Dec 2026 – 3 Jan 2027");
});

test("bucketLabel: the day number, or the short month name for a year", () => {
  assert.equal(bucketLabel("month", ams("2026-10-05T00:00+02:00")), "5");
  assert.equal(bucketLabel("week", ams("2026-10-25T00:00+02:00")), "25");
  assert.equal(bucketLabel("year", ams("2026-09-01T00:00+02:00")), "Sep");
});

test("places: by size, zero and unnamed handled, the tail folds into Other", () => {
  assert.deepEqual(places([]), []);
  assert.deepEqual(places([{ place: "Home", wh: 0 }]), []);
  const p = places([{ place: "Home", wh: 30000 }, { place: null, wh: 10000 }]);
  assert.deepEqual(p.map((x) => [x.name, x.wh, x.share]), [["Home", 30000, 0.75], ["Other", 10000, 0.25]]);
  const many = places([...[50, 40, 30, 20, 10, 5, 5].map((k, i) => ({ place: `P${i}`, wh: k * 1000 })), { place: null, wh: 1000 }], 3);
  assert.deepEqual(many.map((x) => [x.name, x.wh]), [["P0", 50000], ["P1", 40000], ["P2", 30000], ["Other", 41000]]);
  assert.equal(many.at(-1).other, true);
});
