<script>
  import { onMount, tick } from "svelte";
  import { get } from "../lib/api.js";
  import { NA, km, kwh, kw } from "../lib/format.js";
  import { durationParts, kwLabel, rangeLine, split } from "../lib/detail.js";
  import { chargeCharts, chargePercents, chargeSpeed } from "../lib/series.js";
  import Chart from "../lib/Chart.svelte";
  import Figure from "../lib/ui/Figure.svelte";
  import ChargeBar from "../lib/ui/ChargeBar.svelte";
  import "../lib/detail.css";

  let { vid, start } = $props();
  let data = $state(null);
  let error = $state(null);
  let title = $state();

  const c = $derived(data?.charge);
  const estimated = $derived(c?.energy_source === "soc_estimate");
  const pc = $derived(c ? chargePercents(c, data.capacity_wh) : null);
  const charts = $derived(data ? chargeCharts(data.series) : null);
  const speed = $derived(data ? chargeSpeed(data.series, data.capacity_wh) : null);
  // the speed curve against a rising level: the points in level order
  const curve = $derived.by(() => {
    if (!speed) return null;
    const at = speed.x.map((_, i) => i).sort((a, b) => speed.x[a] - speed.x[b]);
    return { x: at.map((i) => speed.x[i]), kw: at.map((i) => speed.kw[i]) };
  });
  const added = $derived(c ? split(`${estimated && c.added_wh != null ? "~" : ""}${kwh(c.added_wh)}`) : [NA, ""]);
  const fig = (label, [value, unit]) => ({ label, value, unit });
  const figures = $derived(
    c
      ? [
          fig("Duration", durationParts(c.duration_s)),
          fig("Average power", split(kw(c.avg_w))),
          fig("Range added", c.range_added_m == null ? [NA, ""] : split(`~${km(c.range_added_m)}`)),
        ]
      : [],
  );
  const level = (wh, p) => (p == null ? kwh(wh) : `${kwh(wh)} · ${Math.round(p)} %`);
  // first and last reading of a chart's first series, for the screen reader
  const ends = (s) => {
    const v = s.values.filter((x) => x != null);
    return v.length ? `${v[0]} to ${v[v.length - 1]}` : NA;
  };

  async function load() {
    error = null;
    try {
      data = await get(`api/ui/charges/${encodeURIComponent(vid)}/${start}`);
    } catch (e) {
      error = e;
    }
  }

  onMount(() => {
    load();
    tick().then(() => title?.focus({ preventScroll: true })); // after the pane has moved to <body>
  });
</script>

<article class="d-stack" style="--accent: var(--charge)">
  <header>
    <h1 class="d-title" tabindex="-1" bind:this={title}>
      {#if c}{c.place ? `Charged at ${c.place}` : "Charged"}{:else if error?.status === 404}Not available{:else if error}Couldn't load this charge{:else}Charge{/if}
    </h1>
    {#if c}
      <p class="d-sub">{rangeLine(c.start, c.end)}</p>
      {#if c.times_source === "cloud" || estimated}
        <p class="badges">
          {#if c.times_source === "cloud"}<span>Cloud times</span>{/if}
          {#if estimated}<span>Estimated</span>{/if}
        </p>
      {/if}
    {/if}
  </header>

  {#if error?.status === 404}
    <p class="d-msg">This charge is not available. <a class="d-link" href="#/activity">Back to activity</a></p>
  {:else if error}
    <p class="d-msg" role="alert"><button class="d-btn" onclick={load}>Retry</button></p>
  {:else if !c}
    <p class="d-msg" aria-busy="true">Loading…</p>
  {:else}
    <section class="d-card hero">
      <span class="d-note">Added</span>
      <span class="big">{added[0]}{#if added[1]}{" "}<small>{added[1]}</small>{/if}</span>
      <ChargeBar from={pc.from} to={pc.to} full />
      <div class="levels">
        <span><span class="d-note">Start</span><b>{level(c.start_wh, pc.from)}</b></span>
        <span class="end"><span class="d-note">End</span><b>{level(c.end_wh, pc.to)}</b></span>
      </div>
    </section>

    <div class="d-figs three">
      {#each figures as f (f.label)}<Figure {...f} />{/each}
    </div>

    <section class="d-card">
      <div class="d-head"><h2>Charging speed</h2><span class="d-note">kW against charge level</span></div>
      {#if curve}
        <div class="stats">
          <span><span class="d-note">Min</span><b>{kwLabel(speed.min)}</b></span>
          <span><span class="d-note">Average</span><b>{kw(c.avg_w)}</b></span>
          <span><span class="d-note">Max</span><b>{kwLabel(speed.max)}</b></span>
        </div>
        <Chart
          x={curve.x} xlabel="Charge level (%)"
          label="Charging speed against charge level, minimum {kwLabel(speed.min)}, average {kw(c.avg_w)}, maximum {kwLabel(speed.max)}"
          series={[{ label: "kW", values: curve.kw, kind: "area", color: "--charge" }]}
        />
        <p class="d-note source">{speed.source === "cloud" ? "From the cloud's charge level, every 6 min, smoothed" : "From the car's battery readings"}</p>
      {:else}
        <p class="d-msg">Not enough readings for a speed curve</p>
      {/if}
    </section>

    <section class="d-card">
      <div class="d-head"><h2>Battery energy</h2><span class="d-note">from the car, kWh</span></div>
      {#if charts?.car}
        <Chart
          x={charts.car.x} time height={160}
          label="Battery energy from the car, {ends(charts.car.series[0])} kWh"
          series={charts.car.series.map((s) => ({ ...s, color: "--energy" }))}
        />
      {:else}
        <p class="d-msg">No readings from the car during this charge</p>
      {/if}
    </section>

    <section class="d-card">
      <div class="d-head"><h2>Charge level</h2><span class="d-note">from the cloud, %</span></div>
      {#if charts?.cloud}
        <Chart
          x={charts.cloud.x} time height={160}
          label="Charge level from the cloud, {ends(charts.cloud.series[0])} %"
          series={charts.cloud.series.map((s, i) => ({ ...s, color: i ? "--muted" : "--charge" }))}
        />
      {:else}
        <p class="d-msg">No readings from the cloud for this charge</p>
      {/if}
    </section>

    <section class="d-card">
      <dl class="d-rows foot">
        <div><dt>Outside temperature</dt><dd>{data.outside_temp_c == null ? NA : `${data.outside_temp_c.toFixed(0)} °C`}</dd></div>
      </dl>
    </section>
  {/if}
</article>

<style>
  .badges { display: flex; gap: 6px; margin: 8px 0 0; }
  .badges span { padding: 2px 10px; border-radius: 999px; background: var(--fill); color: var(--muted); font-size: 13px; }
  .hero { display: flex; flex-direction: column; gap: 8px; }
  .big { font-size: 40px; font-weight: 700; line-height: 1.05; letter-spacing: -0.02em; }
  .big small { font-size: 17px; font-weight: 500; color: var(--muted); letter-spacing: 0; }
  .levels, .stats { display: flex; justify-content: space-between; gap: 12px; }
  .levels > span, .stats > span { display: flex; flex-direction: column; }
  .levels .end { align-items: flex-end; }
  .stats { margin-bottom: 8px; }
  .stats > span:nth-child(2) { align-items: center; }
  .stats > span:last-child { align-items: flex-end; }
  b { font-weight: 600; }
  .foot { margin: 0; }
  .foot div:first-child { border-top: 0; }
  .source { margin-top: 8px; }
</style>
