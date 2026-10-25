<script>
  import { hashOf } from "../activity.js";
  import { kwh, kw } from "../format.js";
  import { clock } from "../time.js";
  import { chargedAt, estimate } from "../detail.js";
  import { costLabel } from "../costs.js";
  import Card from "./Card.svelte";
  import ChargeBar from "./ChargeBar.svelte";

  let { item, current = false, onclick } = $props();
  const from = $derived(item.start_pct), to = $derived(item.end_pct);
  const [added, unit] = $derived(estimate(kwh(item.added_wh), item.energy_source === "soc_estimate" && item.added_wh != null).split(" "));
  const when = $derived(`${clock(item.start)} – ${item.end == null ? "now" : clock(item.end)} · ${kw(item.avg_w)}`);
</script>

<Card href={hashOf(item)} {current} {onclick} kind="charge" title={chargedAt(item.place)} value={added} {unit} {when}>
  {#snippet glyph()}
    <svg viewBox="0 0 24 24"><path d="M13 3 5 14h6l-1 7 8-11h-6z" /></svg>
  {/snippet}
  {#snippet below()}
    {#if item.cost?.amount != null}<span class="caption row">{costLabel(item.cost)}</span>{/if}
    {#if from != null && to != null}
      <span class="level row">
        <ChargeBar {from} {to} />
        <span class="caption">{Math.round(from)} → {Math.round(to)} %</span>
      </span>
    {/if}
  {/snippet}
</Card>

<style>
  .row { grid-column: 2 / 4; }
  .level { margin-top: 8px; display: flex; align-items: center; gap: 10px; }
  .level :global(.bar) { flex: 1; }
  .level .caption { flex: none; }
</style>
