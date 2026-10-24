import test from "node:test";
import assert from "node:assert/strict";
import { project, shouldClose, velocity } from "./gesture.js";

test("project is the distance the velocity carries", () => {
  assert.ok(Math.abs(project(1000) - 499) <= 1);
});

test("shouldClose", () => {
  assert.equal(shouldClose(100, 1500, 390), true);
  assert.equal(shouldClose(250, -1500, 390), false);
});

test("velocity is px/s between the oldest and newest sample", () => {
  assert.equal(velocity([{ t: 0, x: 0 }, { t: 50, x: 20 }, { t: 100, x: 50 }]), 500);
  assert.equal(velocity([{ t: 0, x: 80 }, { t: 100, x: 40 }]), -400);
});

test("velocity is 0 without a span", () => {
  assert.equal(velocity([]), 0);
  assert.equal(velocity([{ t: 5, x: 1 }]), 0);
  assert.equal(velocity([{ t: 5, x: 1 }, { t: 5, x: 9 }]), 0);
});
