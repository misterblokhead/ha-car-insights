<script>
  import { backdrop, tileUrl } from "../tiles.js";
  import { authedUrl } from "../authed.js";

  // `label` carries the key figures for screen readers
  let { points, width, height, label = "Route" } = $props();
  const map = $derived(points?.length >= 2 ? backdrop(points, width, height, 8) : null);
  const xy = $derived(map?.points ?? []);
  const first = $derived(xy[0]), last = $derived(xy[xy.length - 1]);
</script>

{#if map}
  <span class="box" style:width="{width}px" style:height="{height}px">
    <span class="tiles" aria-hidden="true">
      {#each map.tiles as t (`${t.x}/${t.y}`)}
        {#await authedUrl(tileUrl(t)) then src}
          <img {src} alt="" width="256" height="256" style:left="{t.left}px" style:top="{t.top}px" />
        {/await}
      {/each}
    </span>
    <svg {width} {height} viewBox="0 0 {width} {height}" role="img" aria-label={label}>
      <polyline points={xy.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ")} />
      <circle class="open" cx={first[0]} cy={first[1]} r="3.5" />
      <circle class="end" cx={last[0]} cy={last[1]} r="3.5" />
    </svg>
  </span>
{/if}

<style>
  .box { position: relative; display: block; overflow: hidden; border-radius: var(--radius-ctl); }
  .tiles { position: absolute; inset: 0; opacity: 0.55; }
  img { position: absolute; max-width: none; filter: var(--tile-filter); }
  svg { position: relative; display: block; }
  polyline { fill: none; stroke: var(--trip); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
  .open { fill: var(--card); stroke: var(--trip); stroke-width: 2; }
  .end { fill: var(--trip); }
</style>
