<script>
  import { hashOf } from "../activity.js";
  import { km, kwh, consumption, duration, time } from "../format.js";
  import RouteOutline from "./RouteOutline.svelte";

  let { item, current = false } = $props();
  const from = $derived(item.from ?? "Unknown"), to = $derived(item.to ?? "Unknown");
  const [dist, unit] = $derived(km(item.distance_m).split(" "));
  const when = $derived(`${time(item.start)} · ${item.end == null ? "now" : duration(item.duration_s)}`);
</script>

<a href={hashOf(item)} class="card press" class:current aria-current={current ? "page" : undefined}>
  <span class="glyph" aria-hidden="true">
    <svg class="icon" viewBox="0 0 24 24"><path d="M5 16v-5l2-5h10l2 5v5M5 16h14M5 16v3h3v-3M16 16v3h3v-3M7 11h10" /></svg>
  </span>
  <span class="title">{from} → {to}</span>
  <span class="big">{dist}{#if unit}{" "}<small>{unit}</small>{/if}</span>
  <span class="caption when">{when}</span>
  <!-- the box stays when there is no outline, so cards keep one height -->
  <span class="route">
    <RouteOutline points={item.route} width={120} height={84}
      label="Route from {from} to {to}, {km(item.distance_m)}, {item.end == null ? "still driving" : duration(item.duration_s)}" />
  </span>
  <span class="caption stats">{consumption(item.wh_per_100km)}<br />{kwh(item.net_wh)}</span>
</a>

<style>
  a {
    display: grid; grid-template-columns: 36px minmax(0, 1fr) auto; column-gap: 12px; row-gap: 2px; align-items: center; padding: 14px;
    color: inherit; text-decoration: none;
  }
  a.current { box-shadow: 0 0 0 2px var(--trip); }
  .glyph { grid-row: 1 / 3; align-self: start; width: 36px; height: 36px; border-radius: 50%; display: grid; place-items: center; background: var(--trip); }
  svg { width: 20px; height: 20px; stroke: #fff; }
  .title { grid-column: 2; font-weight: 600; overflow-wrap: anywhere; }
  .when { grid-column: 2; grid-row: 2; align-self: start; }
  .big { grid-column: 3; text-align: right; }
  .route { grid-column: 3; width: 120px; height: 84px; }
  .stats { grid-column: 3; text-align: right; }
  /* a wide list puts the outline beside the figures instead of between them, halving the card's height */
  @container (min-width: 520px) {
    a { grid-template-columns: 36px minmax(0, 1fr) 120px auto; }
    .route { grid-column: 3; grid-row: 1 / 3; }
    .big { grid-column: 4; grid-row: 1; }
    .stats { grid-column: 4; grid-row: 2; align-self: start; }
  }
</style>
