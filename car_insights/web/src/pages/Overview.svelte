<script>
  import { get } from "../lib/api.js";
  import { km, kwh, pct, when } from "../lib/format.js";

  let { view } = $props();
  let data = $state(null);
  let error = $state("");

  const STATUS = { driving: "Driving", charging: "Charging", parked: "Parked" };
  const where = (p) => (p ? p.place || `${p.lat}, ${p.lon}` : "not available");

  $effect(() => {
    get(`api/ui/overview?view=${encodeURIComponent(view)}`).then(
      (d) => (data = d),
      (e) => (error = `Could not load (${e.message})`),
    );
  });
</script>

{#if error}
  <p class="msg">{error}</p>
{:else if !data}
  <p class="msg">Loading...</p>
{:else}
  {#each data.vehicles as v}
    <section>
      <h2>{v.name} <span class="status">{STATUS[v.status] ?? v.status}</span></h2>
      <dl>
        <dt>Charge</dt><dd>{pct(v.soc_percent)} ({kwh(v.battery_wh)})</dd>
        <dt>Range</dt><dd>{km(v.range_m)}</dd>
        <dt>Position</dt><dd>{where(v.position)}</dd>
        <dt>Updated</dt><dd>{when(v.updated)}</dd>
      </dl>
    </section>
  {/each}
  {#each [["This month", data.totals.month], ["This year", data.totals.year]] as [label, t]}
    <section>
      <h2>{label}</h2>
      <dl>
        <dt>Distance</dt><dd>{km(t.distance_m)}</dd>
        <dt>Energy used</dt><dd>{kwh(t.net_wh)}</dd>
        <dt>Charged</dt><dd>{kwh(t.charged_wh)}</dd>
        <dt>Trips</dt><dd>{t.trips}</dd>
        <dt>Charges</dt><dd>{t.charges}</dd>
      </dl>
    </section>
  {/each}
{/if}

<style>
  section { background: var(--card); border: 1px solid var(--line); border-radius: 10px; padding: 10px 14px; margin-bottom: 12px; }
  h2 { font-size: 1.05em; margin: 0 0 6px; }
  .status { font-weight: normal; color: var(--accent); margin-left: 6px; }
  dl { display: grid; grid-template-columns: max-content 1fr; gap: 2px 14px; margin: 0; }
  dt { color: var(--muted); }
  dd { margin: 0; overflow-wrap: anywhere; }
  .msg { color: var(--muted); }
</style>
