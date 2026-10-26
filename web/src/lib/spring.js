// Critically damped by default; unit mass, so stiffness is (2π / response)².
export function createSpring({ value = 0, response = 0.35, damping = 1 } = {}) {
  const k = (2 * Math.PI / response) ** 2;
  const c = 4 * Math.PI * damping / response;
  const s = {
    value,
    velocity: 0,
    target: value,
    set(target, { velocity } = {}) {
      s.target = target;
      if (velocity != null) s.velocity = velocity;
    },
    // Advances dtSeconds; true once settled (and snapped to the target).
    step(dt) {
      for (let left = dt; left > 0; ) {
        const h = Math.min(left, 0.004);
        s.velocity += (-k * (s.value - s.target) - c * s.velocity) * h;
        s.value += s.velocity * h;
        left -= h;
      }
      if (Math.abs(s.value - s.target) < 0.5 && Math.abs(s.velocity) < 0.5) {
        s.value = s.target;
        s.velocity = 0;
        return true;
      }
      return false;
    },
  };
  return s;
}
