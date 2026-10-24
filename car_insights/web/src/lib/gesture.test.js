import test from "node:test";
import assert from "node:assert/strict";
import { project, shouldClose } from "./gesture.js";

test("project is the distance the velocity carries", () => {
  assert.ok(Math.abs(project(1000) - 499) <= 1);
});

test("shouldClose", () => {
  assert.equal(shouldClose(100, 1500, 390), true);
  assert.equal(shouldClose(250, -1500, 390), false);
});
