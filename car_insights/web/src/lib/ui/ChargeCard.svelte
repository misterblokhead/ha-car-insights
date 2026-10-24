<script>
  import { hashOf } from "../activity.js";
  import { kwh, kw, time } from "../format.js";
  import { costLabel } from "../costs.js";
  import ChargeBar from "./ChargeBar.svelte";

  // capacity: the vehicle's battery in Wh, for the charge percentages
  let { item, capacity, current = false } = $props();
  const level = (wh) => (wh == null || !capacity ? null : (wh / capacity) * 100);
  const from = $derived(level(item.start_wh)), to = $derived(level(item.end_wh));
  const [added, unit] = $derived(`${item.energy_source === "soc_estimate" && item.added_wh != null ? "~" : ""}${kwh(item.added_wh)}`.split(" "));
  const when = $derived(`${time(item.start)} – ${item.end == null ? "now" : time(item.end)} · ${kw(item.avg_w)}`);
</script>

<a href={hashOf(item)} class:current aria-current={current ? "page" : undefined}>
  <span class="glyph" aria-hidden="true">
    <svg viewBox="0 0 24 24"><path d="M13 3 5 14h6l-1 7 8-11h-6z" /></svg>
  </span>
  <span class="title">{item.place ? `Charged at ${item.place}` : "Charged"}</span>
  <span class="big">{added}{#if unit}{" "}<small>{unit}</small>{/if}</span>
  <span class="sub when">{when}</span>
  {#if item.cost?.amount != null}<span class="sub when">{costLabel(item.cost)}</span>{/if}
  {#if from != null && to != null}
    <span class="level">
      <ChargeBar {from} {to} />
      <span class="sub">{Math.round(from)} → {Math.round(to)} %</span>
    </span>
  {/if}
</a>

<style>
  a {
    display: grid; grid-template-columns: 36px minmax(0, 1fr) auto; column-gap: 12px; row-gap: 2px; align-items: center; padding: 14px;
    background: var(--card); border: var(--edge); border-radius: var(--radius-card); color: inherit; text-decoration: none; transition: transform 100ms;
  }
  a.current { box-shadow: 0 0 0 2px var(--charge-text); }
  a:active { transform: scale(var(--press-scale)); }
  a:focus-visible { outline: 2px solid var(--charge-text); outline-offset: 2px; }
  .glyph { width: 36px; height: 36px; border-radius: 50%; display: grid; place-items: center; background: var(--charge); grid-row: 1 / 3; align-self: start; }
  svg { width: 20px; height: 20px; fill: var(--on-charge); stroke: var(--on-charge); stroke-width: 1.2; stroke-linejoin: round; }
  .title { font-weight: 600; overflow-wrap: anywhere; }
  .sub { color: var(--muted); font-size: 13px; }
  .when { grid-column: 2 / 4; }
  .big { font-size: 28px; font-weight: 600; line-height: 1.1; letter-spacing: -0.01em; white-space: nowrap; text-align: right; }
  small { font-size: 15px; font-weight: 500; color: var(--muted); letter-spacing: 0; }
  .level { grid-column: 2 / 4; margin-top: 8px; display: flex; align-items: center; gap: 10px; }
  .level :global(.bar) { flex: 1; }
  .level .sub { flex: none; }
</style>
