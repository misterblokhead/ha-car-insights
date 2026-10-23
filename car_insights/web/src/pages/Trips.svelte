<script>
  import { get } from "../lib/api.js";
  import { km, kwh, byDay, time } from "../lib/format.js";

  let { view } = $props();
  let items = $state([]);
  let next = $state(null);
  let error = $state("");
  let loading = $state(true);
  const group = $derived(view.startsWith("g:"));
  const days = $derived(byDay(items));

  async function load(before, v) {
    loading = true;
    error = "";
    try {
      const q = `view=${encodeURIComponent(v)}${before == null ? "" : `&before=${before}`}`;
      const d = await get(`api/ui/trips?${q}`);
      if (v !== view) return; // stale response
      items = before == null ? d.items : [...items, ...d.items];
      next = d.next;
    } catch (e) {
      if (v === view) error = `Could not load (${e.message})`;
    } finally {
      if (v === view) loading = false;
    }
  }

  $effect(() => {
    const v = view;
    items = [];
    next = null;
    load(null, v);
  });
</script>

{#if error}<p class="msg">{error}</p>{/if}
{#each days as [day, trips]}
  <h2>{day}</h2>
  {#each trips as t}
    <a class="row" href={`#/trips/${t.vehicle_id}/${t.start}`}>
      <span class="when">{time(t.start)}{t.end == null ? " (in progress)" : ""}</span>
      {#if group}<span class="veh">{t.vehicle_name}</span>{/if}
      <span class="route">{t.from ?? "not available"} → {t.to ?? "not available"}</span>
      <span class="num">{km(t.distance_m)} · {kwh(t.net_wh)}</span>
    </a>
  {/each}
{/each}
{#if loading}<p class="msg">Loading...</p>
{:else if !items.length && !error}<p class="msg">No trips yet.</p>{/if}
{#if next != null && !loading}<button onclick={() => load(next, view)}>Load more</button>{/if}

<style>
  h2 { font-size: 0.95em; color: var(--muted); margin: 14px 0 6px; }
  .row { display: flex; flex-wrap: wrap; gap: 2px 12px; background: var(--card); border: 1px solid var(--line); border-radius: 8px; padding: 8px 12px; margin-bottom: 6px; color: var(--fg); text-decoration: none; }
  .when { font-weight: 600; }
  .veh { color: var(--accent); }
  .route { flex: 1 1 12em; overflow-wrap: anywhere; }
  .num { color: var(--muted); }
  button { font: inherit; color: var(--fg); background: var(--card); border: 1px solid var(--line); border-radius: 6px; padding: 6px 14px; margin-top: 8px; }
  .msg { color: var(--muted); }
</style>
