import test from "node:test";
import assert from "node:assert/strict";
import { project, backdrop, tileUrl, MAX_Z } from "./tiles.js";

const near = (a, b, eps) => assert.ok(Math.abs(a - b) < eps, `${a} vs ${b}`);
const extent = (pts, z, i) => Math.max(...pts.map((p) => project(p[0], p[1], z)[i])) - Math.min(...pts.map((p) => project(p[0], p[1], z)[i]));

// an invented 2 km route, north-east then east
const route = [[52.0, 5.0], [52.005, 5.008], [52.012, 5.012], [52.015, 5.02]];

test("project gives world pixels of 256-px tiles", () => {
  const [x, y] = project(0, 0, 0);
  near(x, 128, 0.01); near(y, 128, 0.01);
  const [x1, y1] = project(85.0511, 180, 0);
  near(x1, 256, 0.01); near(y1, 0, 0.01);
  const [x2, y2] = project(52, 5, 10);
  near(x2, 134712.89, 0.1); near(y2, 86590.12, 0.1);
});

test("backdrop fits the route inside the padded box at the largest zoom that fits", () => {
  const b = backdrop(route, 120, 84);
  for (const [x, y] of b.points) assert.ok(x >= 8 - 1e-6 && x <= 112 + 1e-6 && y >= 8 - 1e-6 && y <= 76 + 1e-6);
  assert.ok(b.tiles.length >= 1 && b.tiles.length <= 4);
  assert.ok(b.z < MAX_Z);
  const fits = (z) => extent(route, z, 0) <= 104 && extent(route, z, 1) <= 68;
  assert.ok(fits(b.z));
  assert.ok(!fits(b.z + 1));
});

test("backdrop keeps north up and the route centred", () => {
  const b = backdrop([[52, 5], [52.01, 5]], 120, 84);
  assert.ok(b.points[1][1] < b.points[0][1]);
  near((b.points[0][0] + b.points[1][0]) / 2, 60, 0.5); // the origin is rounded to a whole pixel
  near((b.points[0][1] + b.points[1][1]) / 2, 42, 0.5);
});

test("backdrop tiles cover the box with offsets in box pixels", () => {
  const b = backdrop(route, 120, 84);
  const xs = b.tiles.map((t) => t.left), ys = b.tiles.map((t) => t.top);
  assert.ok(Math.min(...xs) <= 0 && Math.max(...xs) + 256 >= 120);
  assert.ok(Math.min(...ys) <= 0 && Math.max(...ys) + 256 >= 84);
  assert.ok(b.tiles.every((t) => t.z === b.z));
  assert.ok(b.tiles.every((t) => Number.isInteger(t.left) && Number.isInteger(t.top))); // whole pixels, so no hairline seams
});

test("a route across a tile boundary needs two tiles side by side", () => {
  // x on the line between tiles 525 and 526 at z 10 (also a tile line at z 17); y mid-tile, so only x straddles
  const lon = (525 * 256 / (256 * 1024)) * 360 - 180;
  const lat = (Math.atan(Math.sinh(Math.PI * (1 - (2 * 43294.5) / 2 ** 17))) * 180) / Math.PI;
  const b = backdrop([[lat, lon - 0.0005], [lat, lon + 0.0005]], 120, 84);
  assert.equal(b.z, 17);
  assert.equal(b.tiles.length, 2);
  assert.equal(Math.abs(b.tiles[0].left - b.tiles[1].left), 256);
  assert.equal(Math.abs(b.tiles[0].x - b.tiles[1].x), 1);
});

test("a one-point route sits at the centre of the deepest zoom", () => {
  const b = backdrop([[52, 5]], 120, 84);
  assert.equal(b.z, 17);
  near(b.points[0][0], 60, 0.5); near(b.points[0][1], 42, 0.5);
  const same = backdrop([[52, 5], [52, 5]], 120, 84);
  assert.equal(same.z, 17);
  assert.deepEqual(same.points[0], same.points[1]);
  near(same.points[0][0], 60, 0.5); near(same.points[0][1], 42, 0.5);
});

test("no tiles above or below the world", () => {
  const b = backdrop([[85, 0], [85.0511, 0.001]], 120, 84);
  assert.ok(b.tiles.every((t) => t.y >= 0 && t.y < 2 ** t.z));
});

test("tileUrl is relative, so the page asks Home Assistant", () => {
  assert.equal(tileUrl({ z: 12, x: 2100, y: 1350 }), "api/ui/tiles/12/2100/1350.png");
});
