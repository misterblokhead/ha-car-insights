import test from "node:test";
import assert from "node:assert/strict";
import { createSpring } from "./spring.js";

test("critically damped never overshoots", () => {
  const s = createSpring({ value: 0 });
  s.set(100);
  let t = 0, max = 0;
  while (!s.step(1 / 60)) {
    t += 1 / 60;
    max = Math.max(max, s.value);
    assert.ok(t < 5);
  }
  assert.ok(max <= 100.01);
  assert.ok(t <= 1.2);
  assert.equal(s.value, 100);
  assert.equal(s.velocity, 0);
});

test("keeps the initial velocity", () => {
  const s = createSpring({ value: 0 });
  s.set(0, { velocity: 2000 });
  s.step(1 / 60);
  assert.ok(s.value > 0);
});

test("retarget keeps value and velocity", () => {
  const s = createSpring({ value: 0 });
  s.set(100);
  for (let i = 0; i < 5; i++) s.step(1 / 60);
  const { value, velocity } = s;
  s.set(-50);
  assert.equal(s.value, value);
  assert.equal(s.velocity, velocity);
  assert.equal(s.target, -50);
});

test("large dt is stable", () => {
  const s = createSpring({ value: 0 });
  s.set(100);
  s.step(0.5);
  assert.ok(Number.isFinite(s.value));
  assert.ok(s.value >= 0 && s.value <= 100);
});
