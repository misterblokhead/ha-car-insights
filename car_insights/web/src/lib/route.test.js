import test from "node:test";
import assert from "node:assert/strict";
import { outline } from "./route.js";

const span = (pts, i) => Math.max(...pts.map((p) => p[i])) - Math.min(...pts.map((p) => p[i]));

test("fits and keeps aspect", () => {
  // equal lat and lon-degrees scaled by cos(lat) are a square when lon step = lat step / cos
  const k = 0.01, c = Math.cos((52 * Math.PI) / 180);
  const pts = [[52, 5], [52, 5 + k / c], [52 + k, 5 + k / c], [52 + k, 5]];
  const o = outline(pts, 120, 84);
  assert.ok(Math.abs(span(o, 0) - span(o, 1)) < 0.01);
  for (const [x, y] of o) assert.ok(x >= 8 - 1e-9 && x <= 112 + 1e-9 && y >= 8 - 1e-9 && y <= 76 + 1e-9);
});

test("north is up", () => {
  const o = outline([[52, 5], [52.01, 5]], 120, 84);
  assert.ok(o[1][1] < o[0][1]);
});

test("degenerate", () => {
  assert.deepEqual(outline([[52, 5]], 120, 84), []);
  const o = outline([[52, 5], [52, 5], [52, 5]], 120, 84);
  assert.deepEqual(o, [[60, 42], [60, 42], [60, 42]]);
});
