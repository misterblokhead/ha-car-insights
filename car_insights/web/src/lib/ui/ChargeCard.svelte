<script>
  import { hashOf } from "../activity.js";
  import { kwh, kw, time } from "../format.js";
  import { costLabel } from "../costs.js";
  import ChargeBar from "./ChargeBar.svelte";

  let { item, current = false } = $props();
  const from = $derived(item.start_pct), to = $derived(item.end_pct);
  const [added, unit] = $derived(`${item.energy_source === "soc_estimate" && item.added_wh != null ? "~" : ""}${kwh(item.added_wh)}`.split(" "));
  const when = $derived(`${time(item.start)} – ${item.end == null ? "now" : time(item.end)} · ${kw(item.avg_w)}`);
</script>

<a href={hashOf(item)} class="card press" class:current aria-current={current ? "page" : undefined}>
  <span class="glyph" aria-hidden="true">
    <svg viewBox="0 0 24 24"><path d="M13 3 5 14h6l-1 7 8-11h-6z" /></svg>
  </span>
  <span class="title">{item.place ? `Charged at ${item.place}` : "Charged"}</span>
  <span class="big">{added}{#if unit}{" "}<small>{unit}</small>{/if}</span>
  <span class="caption when">{when}</span>
  {#if item.cost?.amount != null}<span class="caption when">{costLabel(item.cost)}</span>{/if}
  {#if from != null && to != null}
    <span class="level">
      <ChargeBar {from} {to} />
      <span class="caption">{Math.round(from)} → {Math.round(to)} %</span>
    </span>
  {/if}
</a>

<style>
  a {
    --accent: var(--charge-text); /* the focus ring */
    display: grid; grid-template-columns: 36px minmax(0, 1fr) auto; column-gap: 12px; row-gap: 2px; align-items: center; padding: 14px;
    color: inherit; text-decoration: none;
  }
  a.current { box-shadow: 0 0 0 2px var(--charge-text); }
  .glyph { width: 36px; height: 36px; border-radius: 50%; display: grid; place-items: center; background: var(--charge); grid-row: 1 / 3; align-self: start; }
  svg { width: 20px; height: 20px; fill: var(--on-charge); stroke: var(--on-charge); stroke-width: 1.2; stroke-linejoin: round; }
  .title { font-weight: 600; overflow-wrap: anywhere; }
  .when { grid-column: 2 / 4; }
  .big { text-align: right; }
  .level { grid-column: 2 / 4; margin-top: 8px; display: flex; align-items: center; gap: 10px; }
  .level :global(.bar) { flex: 1; }
  .level .caption { flex: none; }
</style>
