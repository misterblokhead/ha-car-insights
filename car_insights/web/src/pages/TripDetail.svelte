<script>
  import { onMount, tick } from "svelte";
  import { get } from "../lib/api.js";
  import { NA, km, kwh, duration } from "../lib/format.js";
  import { eur, tripCostLine } from "../lib/costs.js";
  import { arrow, compare, deltaText, durationParts, markerAt, per100, rangeLine, split } from "../lib/detail.js";
  import { chargePercents, consumptionBuckets, tripCharts } from "../lib/series.js";
  import Chart from "../lib/Chart.svelte";
  import Figure from "../lib/ui/Figure.svelte";
  import RouteOutline from "../lib/ui/RouteOutline.svelte";
  import "../lib/detail.css";

  let { vid, start } = $props();
  let data = $state(null);
  let error = $state(null);
  let title = $state();
  let routeWidth = $state(0);

  const t = $derived(data?.trip);
  const from = $derived(t?.from ?? "Unknown"), to = $derived(t?.to ?? "Unknown");
  const buckets = $derived(data ? consumptionBuckets(data.series, 0.5) : null);
  const speed = $derived(data ? tripCharts(data.series)?.speed : null);
  const avg = $derived(t && t.avg_speed_mps != null ? t.avg_speed_mps * 3.6 : null);
  const max = $derived(t?.max_speed_mps == null ? null : t.max_speed_mps * 3.6);
  const used = $derived(t ? per100(t) : null);
  const pc = $derived(t ? chargePercents(t, data.capacity_wh) : null);
  const cmp = $derived(t ? compare(t, data.similar) : null);

  const fig = (label, [value, unit]) => ({ label, value, unit });
  const figures = $derived(
    t
      ? [
          fig("Distance", split(km(t.distance_m))),
          fig("Duration", durationParts(t.duration_s)),
          fig("Energy used", split(kwh(t.net_wh))),
          fig("Average", used == null ? [NA, ""] : [used.toFixed(1), "kWh/100 km"]),
          fig("Average speed", avg == null ? [NA, ""] : [avg.toFixed(0), "km/h"]),
          fig("Recuperated", split(kwh(t.recup_wh))),
        ]
      : [],
  );
  const rows = $derived(
    cmp
      ? [
          { name: "Time", m: cmp.duration, unit: "min", digits: 0, text: (v) => `${Math.round(v)} min` },
          { name: "Energy", m: cmp.consumption, unit: "kWh/100 km", digits: 1, text: (v) => `${v.toFixed(1)} kWh/100 km` },
        ].filter((r) => r.m)
      : [],
  );
  // numbers for the "a → b" lines; null when unknown
  const wh = (v) => (v == null ? null : (v / 1000).toFixed(2));
  const whole = (v) => (v == null ? null : v.toFixed(0));
  const kmh = (v) => (v == null ? NA : `${Math.round(v)} km/h`);

  async function load() {
    error = null;
    try {
      data = await get(`api/ui/trips/${encodeURIComponent(vid)}/${start}`);
    } catch (e) {
      error = e;
    }
  }

  onMount(() => {
    load();
    tick().then(() => title?.focus({ preventScroll: true })); // after the pane has moved to <body>
  });
</script>

<article class="d-stack" style="--accent: var(--trip-text)">
  <header>
    <h1 class="d-title" tabindex="-1" bind:this={title}>
      {#if t}{from} → {to}{:else if error?.status === 404}Not available{:else if error}Couldn't load this trip{:else}Trip{/if}
    </h1>
    {#if t}<p class="d-sub">{rangeLine(t.start, t.end)}</p>{/if}
  </header>

  {#if error?.status === 404}
    <p class="d-msg">This trip is not available. <a class="d-link" href="#/activity">Back to activity</a></p>
  {:else if error}
    <p class="d-msg" role="alert"><button class="d-btn" onclick={load}>Retry</button></p>
  {:else if !t}
    <p class="d-msg" aria-busy="true">Loading…</p>
  {:else}
    {#if data.route?.length >= 2}
      <!-- the box is measured, then the outline is fitted to it -->
      <div class="d-card route" bind:clientWidth={routeWidth}>
        {#if routeWidth}
          <RouteOutline points={data.route} width={routeWidth - 28} height={120}
            label="Route from {from} to {to}, {km(t.distance_m)}, {t.end == null ? "still driving" : duration(t.duration_s)}" />
        {/if}
      </div>
    {/if}

    <div class="d-figs">
      {#each figures as f (f.label)}<Figure {...f} />{/each}
      <Figure label="Cost" value={eur(data.cost.total)}>
        {#if tripCostLine(data.cost)}<span class="d-note">{tripCostLine(data.cost)}</span>{/if}
      </Figure>
    </div>

    <section class="d-card">
      <div class="d-head"><h2>Consumption</h2><span class="d-note">kWh per 0.5 km</span></div>
      {#if buckets}
        <Chart
          x={buckets.x} xlabel="km"
          label="Consumption per 0.5 km: net {kwh(t.net_wh)}, gross {kwh(t.gross_wh)}, recuperated {kwh(t.recup_wh)}"
          series={[
            { label: "Gross", values: buckets.gross, color: "--muted" }, // drawn first, so the net line stays on top
            { label: "Net", values: buckets.net, color: "--trip" },
            { label: "Recuperated", values: buckets.recup, color: "--good", dash: true },
          ]}
        />
      {:else}
        <p class="d-msg">No consumption data</p>
      {/if}
      <dl class="d-rows">
        <div><dt>Battery</dt><dd>{arrow(wh(t.start_wh), wh(t.end_wh), "kWh")}</dd></div>
        <div><dt>Net</dt><dd>{kwh(t.net_wh)}</dd></div>
        <div><dt>Gross</dt><dd>{kwh(t.gross_wh)}</dd></div>
        <div><dt>Recuperated</dt><dd>{kwh(t.recup_wh)}</dd></div>
      </dl>
    </section>

    <section class="d-card">
      <div class="d-head"><h2>Speed</h2><span class="d-note">max {kmh(max)} · average {kmh(avg)}</span></div>
      {#if speed}
        <Chart
          x={speed.x} xlabel="km"
          label="Speed over distance, maximum {kmh(max)}, average {kmh(avg)}"
          series={speed.series.map((s) => ({ ...s, kind: "area", color: "--trip" }))}
        />
      {:else}
        <p class="d-msg">No speed data</p>
      {/if}
    </section>

    {#if rows.length}
      <section class="d-card">
        <h2>Compared with your usual route</h2>
        <p class="d-note">{from} → {to}, {data.similar.n} earlier {data.similar.n === 1 ? "trip" : "trips"}</p>
        {#each rows as r (r.name)}
          {@const text = deltaText(r.m.delta, r.unit, r.digits)}
          <div class="cmp">
            <div class="line">
              <span>{r.name}</span>
              <b class:good={text !== "same" && r.m.delta < 0} class:worse={text !== "same" && r.m.delta > 0}>{text}</b>
            </div>
            <div class="track" aria-hidden="true"><i class="usual"></i><i class="dot" style:left="{markerAt(r.m.mine, r.m.usual)}%"></i></div>
            <span class="d-note">{r.text(r.m.mine)} · usually {r.text(r.m.usual)}</span>
          </div>
        {/each}
      </section>
    {/if}

    <section class="d-card">
      <dl class="d-rows foot">
        <div><dt>Battery</dt><dd>{arrow(whole(pc.from), whole(pc.to), "%")}</dd></div>
        <div><dt>Outside temperature</dt><dd>{t.avg_temp_c == null ? NA : `${t.avg_temp_c.toFixed(0)} °C`}</dd></div>
        <div><dt>Odometer</dt><dd>{arrow(whole(t.odometer_start_km), whole(t.odometer_end_km), "km")}</dd></div>
      </dl>
    </section>
  {/if}
</article>

<style>
  .route { display: grid; place-items: center; min-height: 148px; }
  .foot { margin: 0; }
  .foot div:first-child { border-top: 0; }
  .cmp { margin-top: 14px; }
  .line { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 0 12px; margin-bottom: 10px; }
  .line b { font-weight: 600; color: var(--muted); white-space: nowrap; }
  .line b.good { color: var(--good-text); }
  .line b.worse { color: var(--energy-text); }
  .track { position: relative; height: 6px; margin: 0 7px 8px; border-radius: 3px; background: var(--fill); }
  .usual { position: absolute; left: 50%; top: -3px; bottom: -3px; width: 2px; margin-left: -1px; background: var(--muted); border-radius: 1px; }
  .dot { position: absolute; top: 50%; width: 14px; height: 14px; margin: -7px 0 0 -7px; border-radius: 50%; background: var(--trip); box-shadow: 0 0 0 3px var(--card); }
</style>
