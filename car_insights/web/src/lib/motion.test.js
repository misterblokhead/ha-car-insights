import test from "node:test";
import assert from "node:assert/strict";
import { createSpring } from "./spring.js";
import { animate, toMs } from "./motion.js";

// A frame clock the test advances by hand: tick(ms) runs the one pending callback at the new time.
function clock() {
  let id = 0, time = 1000, pending = null;
  return {
    frame: (cb) => ((pending = { id: ++id, cb }), id),
    cancel: (i) => { if (pending?.id === i) pending = null; },
    now: () => time,
    get scheduled() { return pending !== null; },
    tick(ms = 16) {
      time += ms;
      const { cb } = pending;
      pending = null;
      cb(time);
    },
    run(ms = 16, limit = 600) {
      let n = 0;
      while (pending && n++ < limit) this.tick(ms);
      return n;
    },
  };
}

function setup(options = {}, spring = createSpring()) {
  const c = clock(), frames = [];
  let settled = 0;
  const motion = animate(spring, { onFrame: (v) => frames.push(v), onSettle: () => settled++, frame: c.frame, cancel: c.cancel, now: c.now, ...options });
  return { c, frames, motion, spring, settled: () => settled };
}

test("settlesAndCallsOnSettleOnce", () => {
  const { c, frames, motion, settled } = setup();
  motion.to(100);
  assert.equal(motion.running, true);
  c.run();
  assert.equal(settled(), 1);
  assert.equal(frames.at(-1), 100);
  assert.equal(motion.running, false);
  assert.equal(c.scheduled, false);
});

test("retargetMidFlight", () => {
  const { c, frames, motion, settled } = setup();
  motion.to(100);
  for (let i = 0; i < 5; i++) c.tick();
  assert.ok(frames.at(-1) > 0 && frames.at(-1) < 100);
  motion.to(0, -50);
  c.run();
  assert.equal(frames.at(-1), 0);
  assert.equal(settled(), 1);
});

test("stopCancelsTheFrame", () => {
  const { c, frames, motion, settled } = setup();
  motion.to(100);
  c.tick();
  const seen = frames.length;
  motion.stop();
  assert.equal(c.scheduled, false);
  assert.equal(motion.running, false);
  assert.equal(frames.length, seen);
  assert.equal(settled(), 0);
});

test("stopInsideOnSettleIsSafe", () => {
  let motion, settled = 0;
  const c = clock();
  motion = animate(createSpring(), {
    onFrame() {}, onSettle: () => { settled++; motion.stop(); }, frame: c.frame, cancel: c.cancel, now: c.now,
  });
  motion.to(100);
  assert.doesNotThrow(() => c.run());
  assert.equal(settled, 1);
  assert.equal(c.scheduled, false);
  assert.equal(motion.running, false);
});

test("dtIsClampedTo50ms", () => {
  const gap = (ms) => {
    const { c, frames, motion } = setup();
    motion.to(100);
    c.tick(16); // the first frame always advances 16 ms
    c.tick(ms);
    return frames.at(-1);
  };
  assert.equal(gap(1000), gap(50));
  assert.notEqual(gap(1000), gap(16));
});

test("customSnap", () => {
  const count = (snap) => {
    const { c, motion } = setup(snap && { snap });
    motion.to(100);
    return c.run();
  };
  assert.ok(count({ distance: 1, speed: 30 }) < count());
});

test("toMs reads ms and s, the way the minifier writes either", () => {
  for (const css of ["150ms", " 150ms ", ".15s", "0.15s", " .15s"]) assert.equal(toMs(css), 150, css);
});
