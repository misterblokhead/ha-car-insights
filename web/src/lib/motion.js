// Drives a spring from the frame loop. to() (re)starts it from the spring's current value and velocity; onFrame(value) runs every
// frame, onSettle() once at the end. snap: inside this distance and speed the last bit is not worth more frames.
export function animate(spring, {
  onFrame, onSettle, snap = { distance: 0.5, speed: 0.5 },
  frame = requestAnimationFrame, cancel = cancelAnimationFrame, now = performance.now.bind(performance),
}) {
  let raf = null, run = 0;
  const stop = () => {
    run++;
    if (raf !== null) cancel(raf);
    raf = null;
  };
  return {
    get running() { return raf !== null; },
    stop,
    to(target, velocity) {
      stop();
      spring.set(target, { velocity });
      const mine = run;
      let last = 0;
      const tick = (time = now()) => {
        raf = null;
        let settled = spring.step(Math.min((time - (last || time - 16)) / 1000, 0.05));
        last = time;
        if (!settled && Math.abs(spring.value - spring.target) < snap.distance && Math.abs(spring.velocity) < snap.speed) {
          Object.assign(spring, { value: spring.target, velocity: 0 });
          settled = true;
        }
        onFrame(spring.value);
        if (mine !== run) return; // onFrame stopped or retargeted it
        if (settled) onSettle?.();
        else raf = frame(tick);
      };
      raf = frame(tick);
    },
  };
}

// A CSS time such as "150ms" or ".15s" (the minifier rewrites one as the other), in ms.
export const toMs = (css) => parseFloat(css) * (css.trim().endsWith("ms") ? 1 : 1000);

// A duration token such as --fade, read once from the page.
export const cssMs = (name) => toMs(getComputedStyle(document.documentElement).getPropertyValue(name));
