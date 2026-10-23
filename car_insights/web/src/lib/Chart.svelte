<script>
  import uPlot from "uplot";
  import "uplot/dist/uPlot.min.css";

  // x: numbers (seconds when `time`, else km); series: [{label, values, scale}]
  let { x, series, time = false, xlabel = "" } = $props();
  let el;

  const COLORS = ["#2f7ed8", "#d97706", "#2a9d4a"];

  $effect(() => {
    const css = getComputedStyle(el);
    const muted = css.getPropertyValue("--muted").trim() || "#6b6b70";
    const line = css.getPropertyValue("--line").trim() || "#dcdce0";
    const axis = (scale, side) => ({ scale, side, stroke: muted, grid: { stroke: line, show: scale === "y" }, ticks: { stroke: line } });
    const scales = { x: { time } };
    if (series.some((s) => s.scale === "plug")) scales.plug = { range: [0, 1] };
    const plot = new uPlot(
      {
        width: el.clientWidth || 300,
        height: 220,
        cursor: { drag: { x: false, y: false } },
        scales,
        axes: [
          { stroke: muted, grid: { stroke: line }, ticks: { stroke: line }, label: xlabel, labelSize: xlabel ? 24 : 0 },
          axis("y", 3),
          ...(scales.plug ? [axis("plug", 1)] : []),
        ],
        series: [
          {},
          ...series.map((s, i) => ({ label: s.label, scale: s.scale, stroke: COLORS[i % COLORS.length], width: 2, spanGaps: true, points: { show: false }, ...(s.scale === "plug" ? { paths: uPlot.paths.stepped({ align: 1 }) } : {}) })),
        ],
      },
      [x, ...series.map((s) => s.values)],
      el,
    );
    const ro = new ResizeObserver(() => plot.setSize({ width: el.clientWidth, height: 220 }));
    ro.observe(el);
    return () => { ro.disconnect(); plot.destroy(); };
  });
</script>

<div bind:this={el} class="chart" role="img" aria-label={`Chart: ${series.map((s) => s.label).join(", ")}`}></div>

<style>
  .chart { width: 100%; min-width: 0; color: var(--fg); }
  .chart :global(.u-legend) { color: var(--fg); font-size: 0.85em; }
</style>
