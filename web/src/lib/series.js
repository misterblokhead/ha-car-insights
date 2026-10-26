// Chart inputs: {x, series: [{label, values, scale}]}. A chart with no data is null.
const empty = (values) => values.every((v) => v == null);

export function tripCharts(s) {
  if (!s || !s.rows || !s.rows.length) return null;
  const idx = (c) => s.cols.indexOf(c);
  const rows = s.rows.filter((r) => r[idx("km")] != null);
  if (!rows.length) return null;
  const col = (c) => rows.map((r) => r[idx(c)]);
  const chart = (defs) => {
    const series = defs.map(([label, c]) => ({ label, values: col(c), scale: "y" }));
    return series.every((x) => empty(x.values)) ? null : { x: col("km"), series };
  };
  return {
    speed: chart([["Speed km/h", "speed_kmh"]]),
  };
}

// Aligns several [[t_ms, v]] lists on the union of their timestamps (x in seconds, gaps null).
function align(lists) {
  const ts = [...new Set(lists.flatMap((l) => l.points.map((p) => p[0])))].sort((a, b) => a - b);
  return {
    x: ts.map((t) => t / 1000),
    series: lists.map((l) => {
      const m = new Map(l.points);
      return { label: l.label, scale: l.scale, values: ts.map((t) => (m.has(t) ? m.get(t) : null)) };
    }),
  };
}

// Car kWh and cloud points are never combined in one chart.
export function chargeCharts(s) {
  const car = s?.car_kwh ?? [];
  const soc = s?.cloud_soc ?? [];
  const plugged = s?.cloud_plugged ?? [];
  return {
    car: car.length ? align([{ label: "Battery kWh", scale: "y", points: car }]) : null,
    cloud: soc.length || plugged.length
      ? align([
          { label: "SoC %", scale: "y", points: soc },
          { label: "Plugged", scale: "plug", points: plugged },
        ])
      : null,
  };
}

// Energy per `step` km of distance: [x = bucket end km, net/gross/recup kWh used in that bucket]. Null without distance rows.
export function consumptionBuckets(s, step = 0.5) {
  if (!s || !s.rows) return null;
  const idx = (c) => s.cols.indexOf(c);
  const rows = s.rows.filter((r) => r[idx("km")] != null);
  if (!rows.length) return null;
  const out = { x: [], net: [], gross: [], recup: [] };
  const keys = ["net", "gross", "recup"], cols = ["net_kwh", "gross_kwh", "recup_kwh"].map(idx);
  let prev = [0, 0, 0], last = null, bucket = null;
  const flush = () => {
    if (bucket == null || bucket === 0) return; // bucket 0 is only the starting point
    out.x.push(+(bucket * step).toFixed(6));
    keys.forEach((k, i) => { out[k].push(last[i] - prev[i]); });
  };
  for (const r of rows) {
    const b = Math.ceil(r[idx("km")] / step - 1e-9);
    if (b !== bucket) {
      flush();
      if (last) prev = last;
      bucket = b;
      last = prev;
    }
    last = cols.map((c, i) => r[c] ?? last[i]);
  }
  flush();
  return out.x.length ? out : null;
}

// Charging power (kW) against charge level (%): from the car's energy, else the cloud's level smoothed.
const CAR_SPAN_MS = 120000;
export function chargeSpeed(series, capacity_wh) {
  if (!capacity_wh) return null;
  const power = (pts, wh) => { // [t_ms, v] → [{ x: midpoint %, kw }]
    const out = [];
    for (let i = 1; i < pts.length; i++) {
      const dt = (pts[i][0] - pts[i - 1][0]) / 3600000;
      if (dt <= 0) continue;
      const a = wh(pts[i - 1][1]), b = wh(pts[i][1]);
      out.push({ x: ((a + b) / 2 / capacity_wh) * 100, kw: (b - a) / 1000 / dt });
    }
    return out;
  };
  const result = (p, source) => {
    const kw = p.map((q) => q.kw);
    return { x: p.map((q) => q.x), kw, source, min: Math.min(...kw), max: Math.max(...kw) };
  };
  // the car reports energy in 50 Wh steps: over a few seconds one step reads as tens of kW, over 2 min as about ±1.5 kW
  const spaced = [];
  for (const p of series?.car_kwh ?? []) if (!spaced.length || p[0] - spaced.at(-1)[0] >= CAR_SPAN_MS) spaced.push(p);
  const car = power(spaced, (v) => v * 1000);
  if (car.length >= 3) return result(car, "car");
  const cloud = power(series?.cloud_soc ?? [], (v) => (v / 100) * capacity_wh);
  if (cloud.length < 3) return null;
  const smooth = cloud.map((q, i) => {
    const w = cloud.slice(Math.max(0, i - 1), i + 2);
    return { x: q.x, kw: w.reduce((a, p) => a + p.kw, 0) / w.length };
  });
  return result(smooth, "cloud");
}
