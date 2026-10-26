<script>
  import { send } from "../../lib/api.js";
  import { currentTariff, eur, validFromFor } from "../../lib/costs.js";
  import { today } from "../../lib/time.js";

  let { data, change } = $props();

  let saving = $state(false);
  let open = $state(null); // the target ("ac", "dc" or a spot id) whose price is being changed
  let list = []; // its tariffs, newest first
  let f = $state({ per_kwh: "", start_fee: "", per_min: "", from: "" });
  let names = $state({});
  $effect(() => { names = Object.fromEntries(data.prices.spots.map((s) => [s.id, s.name])); });

  const now = () => Date.now();
  const line = (t) => (t ? [`${eur(t.per_kwh)}/kWh`, t.start_fee && `start fee ${eur(t.start_fee)}`, t.per_min && `${eur(t.per_min)}/min`].filter(Boolean).join(" · ") : "Not set");
  const defaults = $derived([["ac", "Default AC price"], ["dc", "Default DC price"]].map(([id, label]) => ({ id, label, list: data.prices[id] })));

  function edit(target, tariffs) {
    list = tariffs;
    const t = currentTariff(list, now());
    f = { per_kwh: t?.per_kwh ?? "", start_fee: t?.start_fee ?? "", per_min: t?.per_min ?? "", from: today() };
    open = target;
  }
  async function save(e) {
    e.preventDefault();
    const body = { valid_from: validFromFor(list, f.from), per_kwh: Number(f.per_kwh), start_fee: Number(f.start_fee), per_min: Number(f.per_min) };
    saving = true;
    if (await change(() => send("PUT", `api/ui/prices/${open}`, body))) open = null;
    saving = false;
  }
  const rename = (s) => change(() => send("PUT", `api/ui/spots/${s.id}`, { name: names[s.id] }));
  const remove = (s) => confirm(`Delete "${s.name}"? Its charges go back to the default price.`) && change(() => send("DELETE", `api/ui/spots/${s.id}`));
  const focus = (el) => el.focus();
</script>

{#snippet editor(target)}
  {#if open === target}
    <form class="row fields" onsubmit={save}>
      <label class="field">€/kWh<input type="number" min="0" step="any" inputmode="decimal" required bind:value={f.per_kwh} {@attach focus} /></label>
      <label class="field">Start fee<input type="number" min="0" step="any" inputmode="decimal" placeholder="0" bind:value={f.start_fee} /></label>
      <label class="field">€/min<input type="number" min="0" step="any" inputmode="decimal" placeholder="0" bind:value={f.per_min} /></label>
      <label class="field">Valid from<input type="date" required bind:value={f.from} /></label>
      <button class="press" type="submit" disabled={saving}>Save</button>
      <button class="press" type="button" onclick={() => (open = null)}>Cancel</button>
    </form>
  {/if}
{/snippet}

<h2>Prices</h2>
<p class="note caption">A new price counts from its date.</p>
<div class="list card">
  {#each defaults as d (d.id)}
    <div class="row split">
      <span>{d.label}<br /><span class="muted">{line(currentTariff(d.list, now()))}</span></span>
      <button class="press" type="button" aria-label={`Change ${d.label}`} onclick={() => edit(d.id, d.list)}>Change</button>
    </div>
    {@render editor(d.id)}
  {/each}
</div>

{#if data.prices.spots.length}
  <h3>Charge locations</h3>
  <div class="list card">
    {#each data.prices.spots as s (s.id)}
      <form class="row" onsubmit={(e) => { e.preventDefault(); rename(s); }}>
        <label class="grow"><span class="sr">Location name</span><input bind:value={names[s.id]} required maxlength="40" /></label>
        <button class="press" type="submit" aria-label={`Rename ${s.name}`}>Rename</button>
        <button type="button" class="danger press" aria-label={`Delete ${s.name}`} onclick={() => remove(s)}>Delete</button>
      </form>
      <div class="row split">
        <span class="muted">{line(currentTariff(s.tariffs, now()))}</span>
        <button class="press" type="button" aria-label={`Change price of ${s.name}`} onclick={() => edit(s.id, s.tariffs)}>Change</button>
      </div>
      {@render editor(s.id)}
    {/each}
  </div>
{/if}
