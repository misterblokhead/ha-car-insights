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
    consumption: chart([["Net kWh", "net_kwh"], ["Gross kWh", "gross_kwh"], ["Recuperated kWh", "recup_kwh"]]),
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
