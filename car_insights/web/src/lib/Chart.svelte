<script>
  import uPlot from "uplot";
  import "uplot/dist/uPlot.min.css";
  import { zone } from "./time.js";

  // x: numbers (seconds when `time`, else km, ...); series: [{label, values, scale = "y" | "y2" | "plug", kind = "line" | "area" | "bars",
  // color: a token name such as "--trip", dash}]. `label` is what screen readers get (the key figures); it defaults to the series names.
  // xaxis: extra uPlot options for the x axis (`splits`, `values`: category names on index x).
  let { x, series, time = false, xlabel = "", height = 180, label = "", xaxis = {} } = $props();
  let el;
  let scheme = $state(0); // bumped when the light or dark scheme flips: the colours are read from the tokens again

  // "#RRGGBB" with an opacity; any other colour form is left as it is
  const tint = (c, a) => (/^#[0-9a-f]{6}$/i.test(c) ? c + Math.round(a * 255).toString(16).padStart(2, "0") : c);

  $effect(() => {
    const dark = matchMedia("(prefers-color-scheme: dark)");
    const flip = () => scheme++;
    dark.addEventListener("change", flip);
    return () => dark.removeEventListener("change", flip);
  });

  $effect(() => {
    scheme;
    const css = getComputedStyle(el);
    const token = (name) => css.getPropertyValue(name).trim();
    const muted = token("--muted");
    const line = token("--line");
    const font = `11px ${token("--font")}`;
    const axis = (scale, side, extra = {}) => ({ scale, side, stroke: muted, font, grid: { stroke: line, width: 1, show: scale === "y" }, ticks: { stroke: line, width: 1 }, ...extra });
    const scales = { x: { time } };
    // area and bars read from zero
    if (series.some((s) => (s.scale ?? "y") === "y" && s.kind && s.kind !== "line")) scales.y = { range: [0, null] };
    // bars on a category index (x = 0, 1, 2, ...) get half a slot each side so the outer bars are not cut
    if (!time && series.some((s) => s.kind === "bars")) scales.x.range = (u, min, max) => [min - 0.5, max + 0.5];
    if (series.some((s) => s.scale === "y2")) scales.y2 = {};
    if (series.some((s) => s.scale === "plug")) scales.plug = { range: [0, 1] };
    const side = (scale) => axis(scale, 1, scale === "plug" ? { size: 76, splits: () => [0, 1], values: (u, v) => v.map((n) => (n ? "plugged" : "unplugged")) } : {});

    const make = (s) => {
      const color = token(s.color ?? "--trip");
      // a lone value would draw no line at all, so it gets a dot
      const lone = s.kind !== "bars" && s.values.filter((v) => v != null).length === 1;
      const base = { label: s.label, scale: s.scale ?? "y", stroke: color, width: 2, spanGaps: true, points: { show: lone, size: 7, fill: color } };
      if (s.dash) base.dash = [6, 4];
      if (s.scale === "plug") base.paths = uPlot.paths.stepped({ align: 1 });
      if (s.kind === "area") base.fill = (u) => {
        const g = u.ctx.createLinearGradient(0, u.bbox.top, 0, u.bbox.top + u.bbox.height);
        g.addColorStop(0, tint(color, 0.35));
        g.addColorStop(1, tint(color, 0.04));
        return g;
      };
      if (s.kind === "bars") Object.assign(base, { paths: uPlot.paths.bars({ size: [0.6, 48], radius: 0.25 }), fill: color, width: 0 });
      return base;
    };

    const tz = zone(); // time axes follow HA's zone; without one uPlot keeps the browser's
    const plot = new uPlot(
      {
        ...(tz && { tzDate: (ts) => uPlot.tzDate(new Date(ts * 1e3), tz) }),
        width: el.clientWidth || 300,
        height,
        legend: { show: series.length > 1, live: false }, // names and swatches only: the live "--" would read as missing data
        cursor: { drag: { x: false, y: false } },
        scales,
        axes: [
          { stroke: muted, font, grid: { stroke: line, width: 1 }, ticks: { stroke: line, width: 1 }, label: xlabel, labelFont: font, labelSize: xlabel ? 22 : 0, ...xaxis },
          axis("y", 3),
          ...(scales.y2 ? [side("y2")] : []),
          ...(scales.plug ? [side("plug")] : []),
        ],
        series: [{}, ...series.map(make)],
      },
      [x, ...series.map((s) => s.values)],
      el,
    );
    const ro = new ResizeObserver(() => plot.setSize({ width: el.clientWidth, height }));
    ro.observe(el);
    return () => { ro.disconnect(); plot.destroy(); };
  });
</script>

<div bind:this={el} class="chart" role="img" aria-label={label || `Chart: ${series.map((s) => s.label).join(", ")}`}></div>

<style>
  .chart { width: 100%; min-width: 0; color: var(--fg); }
  .chart :global(.u-legend) { color: var(--fg); font-size: 12px; text-align: left; }
</style>
