<script>
  import { send } from "../../lib/api.js";
  import { eur } from "../../lib/costs.js";
  import { dayKey } from "../../lib/format.js";

  let { data, change } = $props();

  const PERIODS = ["month", "quarter", "year", "once"];
  const blank = () => ({ name: "", amount: "", period: "month", start: dayKey(Date.now()), end: "" });
  let adding = $state(null); // the vehicle id whose add form is open
  let f = $state(blank());
  let saving = $state(false);

  const costs = (vid) => data.prices.fixed_costs.filter((c) => c.vehicle_id === vid);
  function openAdd(vid) {
    f = blank();
    adding = vid;
  }
  async function add(e) {
    e.preventDefault();
    const body = { name: f.name, amount: Number(f.amount), period: f.period, start: f.start, end: f.end || null };
    saving = true;
    if (await change(() => send("POST", `api/ui/vehicles/${adding}/fixed_costs`, body))) adding = null;
    saving = false;
  }
  // a rejected end date (before the start) is undone by hand, as on the Settings page
  async function end(e, c) {
    const el = e.currentTarget;
    const ok = await change(() => send("PUT", `api/ui/fixed_costs/${c.id}`, { end: el.value || null }));
    if (!ok) el.value = c.end ?? "";
  }
  const remove = (c) => confirm(`Delete "${c.name}"?`) && change(() => send("DELETE", `api/ui/fixed_costs/${c.id}`));
  const focus = (el) => el.focus();
</script>

<h2>Fixed costs</h2>
<p class="note">Monthly card fees, insurance and the like. Empty the end date to run a cost on.</p>
{#each data.vehicles as v (v.id)}
  <h3>{v.name}</h3>
  <div class="list">
    {#each costs(v.id) as c (c.id)}
      <div class="row split">
        <span>{c.name}<br /><span class="muted">{eur(c.amount)} · {c.period} · from {c.start}{c.end ? ` to ${c.end}` : ""}</span></span>
        <button type="button" class="danger" aria-label={`Delete ${c.name}`} onclick={() => remove(c)}>Delete</button>
      </div>
      <label class="row split">End date
        <input type="date" aria-label={`End date of ${c.name}`} min={c.start} value={c.end ?? ""} onchange={(e) => end(e, c)} />
      </label>
    {:else}
      <p class="row empty">No fixed costs.</p>
    {/each}
    {#if adding === v.id}
      <form class="row fields" onsubmit={add}>
        <label class="wide">Name<input bind:value={f.name} required maxlength="40" {@attach focus} /></label>
        <label>Amount (€)<input type="number" min="0" step="any" inputmode="decimal" required bind:value={f.amount} /></label>
        <label>Period<select bind:value={f.period}>{#each PERIODS as p}<option value={p}>{p}</option>{/each}</select></label>
        <label>Start<input type="date" required bind:value={f.start} /></label>
        <label>End (optional)<input type="date" min={f.start} bind:value={f.end} /></label>
        <button type="submit" disabled={saving}>Add</button>
        <button type="button" onclick={() => (adding = null)}>Cancel</button>
      </form>
    {:else}
      <div class="row"><button type="button" onclick={() => openAdd(v.id)}>Add fixed cost</button></div>
    {/if}
  </div>
{/each}
