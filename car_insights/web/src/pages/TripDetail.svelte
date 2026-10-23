<script>
  import { get } from "../lib/api.js";
  import { km, kwh, duration, when } from "../lib/format.js";
  import { tripCharts } from "../lib/series.js";
  import Chart from "../lib/Chart.svelte";

  let { vid, start } = $props();
  let data = $state(null);
  let error = $state("");

  const NA = "not available";
  const t = $derived(data?.trip);
  const charts = $derived(data ? tripCharts(data.series) : null);
  const per100 = $derived(
    t && t.distance_m != null && t.distance_m >= 100 && t.net_wh != null
      ? `${((t.net_wh / t.distance_m) * 100).toFixed(1)} kWh/100 km`
      : NA,
  );
  const speed = (v) => (v == null ? NA : `${(v * 3.6).toFixed(0)} km/h`);
  const odo = (v) => (v == null ? NA : `${v.toFixed(0)} km`);

  $effect(() => {
    const key = `${vid}/${start}`;
    data = null;
    error = "";
    get(`api/ui/trips/${key}`).then(
      (d) => { if (key === `${vid}/${start}`) data = d; },
      (e) => { if (key === `${vid}/${start}`) error = `Could not load (${e.message})`; },
    );
  });
</script>

<a href="#/trips">← Trips</a>
{#if error}
  <p class="msg">{error}</p>
{:else if !data}
  <p class="msg">Loading...</p>
{:else}
  <section>
    <h2>{t.from ?? NA} → {t.to ?? NA}</h2>
    <dl>
      <dt>Start</dt><dd>{when(t.start)}</dd>
      <dt>End</dt><dd>{t.end == null ? "in progress" : when(t.end)}</dd>
      <dt>Distance</dt><dd>{km(t.distance_m)}</dd>
      <dt>Duration</dt><dd>{duration(t.duration_s)}</dd>
      <dt>Average speed</dt><dd>{speed(t.avg_speed_mps)}</dd>
      <dt>Max speed</dt><dd>{speed(t.max_speed_mps)}</dd>
      <dt>Battery start</dt><dd>{kwh(t.start_wh)}</dd>
      <dt>Battery end</dt><dd>{kwh(t.end_wh)}</dd>
      <dt>Net energy</dt><dd>{kwh(t.net_wh)}</dd>
      <dt>Gross energy</dt><dd>{kwh(t.gross_wh)}</dd>
      <dt>Recuperation</dt><dd>{kwh(t.recup_wh)}</dd>
      <dt>Consumption</dt><dd>{per100}</dd>
      <dt>Odometer start</dt><dd>{odo(t.odometer_start_km)}</dd>
      <dt>Odometer end</dt><dd>{odo(t.odometer_end_km)}</dd>
      <dt>Avg temperature</dt><dd>{t.avg_temp_c == null ? NA : `${t.avg_temp_c.toFixed(0)} °C`}</dd>
    </dl>
  </section>
  <section>
    <h2>Consumption</h2>
    {#if charts?.consumption}<Chart x={charts.consumption.x} series={charts.consumption.series} xlabel="km" />{:else}<p class="msg">{NA}</p>{/if}
  </section>
  <section>
    <h2>Speed</h2>
    {#if charts?.speed}<Chart x={charts.speed.x} series={charts.speed.series} xlabel="km" />{:else}<p class="msg">{NA}</p>{/if}
  </section>
{/if}

<style>
  a { color: var(--accent); }
  section { background: var(--card); border: 1px solid var(--line); border-radius: 10px; padding: 10px 14px; margin: 12px 0; }
  h2 { font-size: 1.05em; margin: 0 0 6px; overflow-wrap: anywhere; }
  dl { display: grid; grid-template-columns: max-content 1fr; gap: 2px 14px; margin: 0; }
  dt { color: var(--muted); }
  dd { margin: 0; overflow-wrap: anywhere; }
  .msg { color: var(--muted); }
</style>
