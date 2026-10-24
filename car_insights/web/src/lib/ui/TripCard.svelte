<script>
  import { hashOf } from "../activity.js";
  import { km, kwh, kwh100, duration, time, NA } from "../format.js";
  import RouteOutline from "./RouteOutline.svelte";

  let { item, current = false } = $props();
  const from = $derived(item.from ?? "Unknown"), to = $derived(item.to ?? "Unknown");
  const [dist, unit] = $derived(km(item.distance_m).split(" "));
  const per100 = $derived(kwh100(item.net_wh, item.distance_m));
  const when = $derived(`${time(item.start)} · ${item.end == null ? "now" : duration(item.duration_s)}`);
</script>

<a href={hashOf(item)} class:current aria-current={current ? "page" : undefined}>
  <span class="glyph" aria-hidden="true">
    <svg viewBox="0 0 24 24"><path d="M5 16v-5l2-5h10l2 5v5M5 16h14M5 16v3h3v-3M16 16v3h3v-3M7 11h10" /></svg>
  </span>
  <span class="title">{from} → {to}</span>
  <span class="big">{dist}{#if unit}{" "}<small>{unit}</small>{/if}</span>
  <span class="sub when">{when}</span>
  <!-- the box stays when there is no outline, so cards keep one height -->
  <span class="route">
    <RouteOutline points={item.route} width={120} height={84}
      label="Route from {from} to {to}, {km(item.distance_m)}, {item.end == null ? "still driving" : duration(item.duration_s)}" />
  </span>
  <span class="sub stats">{per100 == null ? NA : `${per100.toFixed(1)} kWh/100 km`}<br />{kwh(item.net_wh)}</span>
</a>

<style>
  a {
    display: grid; grid-template-columns: 36px minmax(0, 1fr) auto; column-gap: 12px; row-gap: 2px; align-items: center; padding: 14px;
    background: var(--card); border-radius: var(--radius-card); color: inherit; text-decoration: none; transition: transform 100ms;
  }
  a.current { box-shadow: 0 0 0 2px var(--trip); }
  a:active { transform: scale(var(--press-scale)); }
  a:focus-visible { outline: 2px solid var(--trip); outline-offset: 2px; }
  .glyph { grid-row: 1 / 3; align-self: start; width: 36px; height: 36px; border-radius: 50%; display: grid; place-items: center; background: var(--trip); }
  svg { width: 20px; height: 20px; fill: none; stroke: #fff; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
  .title { grid-column: 2; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .sub { color: var(--muted); font-size: 13px; }
  .when { grid-column: 2; grid-row: 2; align-self: start; }
  .big { grid-column: 3; font-size: 28px; font-weight: 600; line-height: 1.1; letter-spacing: -0.01em; white-space: nowrap; text-align: right; }
  small { font-size: 15px; font-weight: 500; color: var(--muted); letter-spacing: 0; }
  .route { grid-column: 3; width: 120px; height: 84px; }
  .stats { grid-column: 3; text-align: right; }
</style>
