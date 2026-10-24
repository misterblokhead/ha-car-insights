<script>
  import { outline } from "../route.js";

  // `label` carries the key figures for screen readers
  let { points, width, height, label = "Route" } = $props();
  const xy = $derived(outline(points, width, height, 8));
  const first = $derived(xy[0]), last = $derived(xy[xy.length - 1]);
</script>

{#if xy.length}
  <svg {width} {height} viewBox="0 0 {width} {height}" role="img" aria-label={label}>
    <polyline points={xy.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ")} />
    <circle class="open" cx={first[0]} cy={first[1]} r="3.5" />
    <circle class="end" cx={last[0]} cy={last[1]} r="3.5" />
  </svg>
{/if}

<style>
  polyline { fill: none; stroke: var(--trip); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
  .open { fill: var(--card); stroke: var(--trip); stroke-width: 2; }
  .end { fill: var(--trip); }
</style>
