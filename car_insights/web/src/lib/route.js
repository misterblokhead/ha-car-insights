// [lat, lon] points → [x, y] fitted into a width × height box (north up, centred, aspect kept).
export function outline(points, width, height, pad = 8) {
  if (!points || points.length < 2) return [];
  const cos = Math.cos((points.reduce((a, p) => a + p[0], 0) / points.length) * Math.PI / 180);
  const xy = points.map(([lat, lon]) => [lon * cos, -lat]);
  const [x0, x1] = [Math.min(...xy.map((p) => p[0])), Math.max(...xy.map((p) => p[0]))];
  const [y0, y1] = [Math.min(...xy.map((p) => p[1])), Math.max(...xy.map((p) => p[1]))];
  const w = width - 2 * pad, h = height - 2 * pad;
  let k = Math.min(w / (x1 - x0), h / (y1 - y0)); // one zero extent still fits by the other
  if (!Number.isFinite(k)) k = 0; // zero extent both ways: every point at the centre
  return xy.map(([x, y]) => [width / 2 + (x - (x0 + x1) / 2) * k, height / 2 + (y - (y0 + y1) / 2) * k]);
}
