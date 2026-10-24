<script>
  import { hashOf } from "../activity.js";
  import { km, kwh, kwh100, duration, time, NA } from "../format.js";
  import RouteOutline from "./RouteOutline.svelte";

  let { item } = $props();
  const from = $derived(item.from ?? "Unknown"), to = $derived(item.to ?? "Unknown");
  const [dist, unit] = $derived(km(item.distance_m).split(" "));
  const per100 = $derived(kwh100(item.net_wh, item.distance_m));
  const when = $derived(`${time(item.start)} · ${item.end == null ? "now" : duration(item.duration_s)}`);
</script>

<a href={hashOf(item)}>
  <span class="glyph" aria-hidden="true">
    <svg viewBox="0 0 24 24"><path d="M5 16v-5l2-5h10l2 5v5M5 16h14M5 16v3h3v-3M16 16v3h3v-3M7 11h10" /></svg>
  </span>
  <span class="text">
    <span class="title">{from} → {to}</span>
    <span class="sub">{when}</span>
    <span class="big">{dist}{#if unit}{" "}<small>{unit}</small>{/if}</span>
  </span>
  <span class="side">
    {#if item.route}
      <RouteOutline points={item.route} width={120} height={84}
        label="Route from {from} to {to}, {km(item.distance_m)}, {item.end == null ? "still driving" : duration(item.duration_s)}" />
    {/if}
    <span class="sub">{per100 == null ? NA : `${per100.toFixed(1)} kWh/100 km`}<br />{kwh(item.net_wh)}</span>
  </span>
</a>

<style>
  a {
    display: grid; grid-template-columns: 36px minmax(0, 1fr) auto; column-gap: 12px; padding: 14px;
    background: var(--card); border-radius: var(--radius-card); color: inherit; text-decoration: none; transition: transform 100ms;
  }
  a:active { transform: scale(var(--press-scale)); }
  a:focus-visible { outline: 2px solid var(--trip); outline-offset: 2px; }
  .glyph { width: 36px; height: 36px; border-radius: 50%; display: grid; place-items: center; background: var(--trip); }
  svg { width: 20px; height: 20px; fill: none; stroke: #fff; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
  .text { display: flex; flex-direction: column; min-width: 0; }
  .title { font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .sub { color: var(--muted); font-size: 13px; }
  .big { margin-top: auto; padding-top: 6px; font-size: 28px; font-weight: 600; line-height: 1.1; letter-spacing: -0.01em; }
  small { font-size: 15px; font-weight: 500; color: var(--muted); letter-spacing: 0; }
  .side { display: flex; flex-direction: column; align-items: flex-end; justify-content: flex-end; gap: 2px; text-align: right; }
</style>
