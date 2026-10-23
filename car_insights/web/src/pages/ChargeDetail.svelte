<script>
  import { get } from "../lib/api.js";
  import { km, kwh, kw, duration, when, chargeLevel } from "../lib/format.js";
  import { chargeCharts, chargePercents } from "../lib/series.js";
  import Chart from "../lib/Chart.svelte";

  let { vid, start } = $props();
  let data = $state(null);
  let error = $state("");

  const NA = "not available";
  const c = $derived(data?.charge);
  const charts = $derived(data ? chargeCharts(data.series) : null);
  const cap = $derived(data?.capacity_wh);
  const clamp = (v) => Math.max(0, Math.min(100, v));
  const pc = $derived(c ? chargePercents(c, cap) : { added: null, from: null, to: null });
  const added = $derived(
    c?.added_wh == null ? NA : `${c.energy_source === "soc_estimate" ? "~" : ""}${kwh(c.added_wh)}`,
  );

  $effect(() => {
    const key = `${vid}/${start}`;
    data = null;
    error = "";
    get(`api/ui/charges/${key}`).then(
      (d) => { if (key === `${vid}/${start}`) data = d; },
      (e) => { if (key === `${vid}/${start}`) error = `Could not load (${e.message})`; },
    );
  });
</script>

<a href="#/charges">← Charges</a>
{#if error}
  <p class="msg">{error}</p>
{:else if !data}
  <p class="msg">Loading...</p>
{:else}
  <section>
    <h2>{c.place || "unknown location"}</h2>
    <dl>
      <dt>From</dt><dd>{when(c.start)}</dd>
      <dt>To</dt><dd>{c.end == null ? "in progress" : when(c.end)}</dd>
      <dt>Added</dt><dd>{added}</dd>
      <dt>Charge level</dt>
      <dd>
        {chargeLevel(pc)}
        {#if pc.from != null && pc.to != null}
          <div class="bar" role="img" aria-label={`Charge from ${pc.from.toFixed(0)} to ${pc.to.toFixed(0)} percent`}>
            <span style={`left:${clamp(pc.from)}%;width:${Math.max(0, clamp(pc.to) - clamp(pc.from))}%`}></span>
          </div>
        {/if}
      </dd>
      <dt>Battery start</dt><dd>{kwh(c.start_wh)}</dd>
      <dt>Battery end</dt><dd>{kwh(c.end_wh)}</dd>
      <dt>Range added</dt><dd>{c.range_added_m == null ? NA : `~${km(c.range_added_m)}`}</dd>
      <dt>Duration</dt><dd>{duration(c.duration_s)}</dd>
      <dt>Average power</dt><dd>{kw(c.avg_w)}</dd>
    </dl>
    {#if c.times_source === "cloud"}<p class="note">Times from the cloud</p>{/if}
    {#if c.energy_source === "soc_estimate"}<p class="note">Energy estimated from cloud SoC</p>{/if}
  </section>
  <section>
    <h2>Battery energy (car)</h2>
    {#if charts?.car}<Chart x={charts.car.x} series={charts.car.series} time />{:else}<p class="msg">{NA}</p>{/if}
  </section>
  <section>
    <h2>Charge level and plug (cloud)</h2>
    {#if charts?.cloud}<Chart x={charts.cloud.x} series={charts.cloud.series} time />{:else}<p class="msg">{NA}</p>{/if}
  </section>
{/if}

<style>
  a { color: var(--accent); }
  section { background: var(--card); border: 1px solid var(--line); border-radius: 10px; padding: 10px 14px; margin: 12px 0; }
  h2 { font-size: 1.05em; margin: 0 0 6px; overflow-wrap: anywhere; }
  dl { display: grid; grid-template-columns: max-content 1fr; gap: 2px 14px; margin: 0; }
  dt { color: var(--muted); }
  dd { margin: 0; overflow-wrap: anywhere; }
  .bar { position: relative; height: 8px; margin-top: 4px; background: var(--line); border-radius: 4px; overflow: hidden; }
  .bar span { position: absolute; top: 0; bottom: 0; background: var(--accent); }
  .note { color: var(--muted); margin: 8px 0 0; }
  .msg { color: var(--muted); }
</style>
