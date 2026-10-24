<script>
  // A bare trend line; it stretches to the width and height its parent gives it
  let { values, color = "var(--trip)" } = $props();
  const W = 100, H = 24;
  const pts = $derived.by(() => {
    if (values.length < 2) return "";
    const lo = Math.min(...values), span = Math.max(...values) - lo;
    return values.map((v, i) => `${((i / (values.length - 1)) * W).toFixed(1)},${(span ? H - 2 - ((v - lo) / span) * (H - 4) : H / 2).toFixed(1)}`).join(" ");
  });
</script>

{#if pts}
  <svg viewBox="0 0 {W} {H}" preserveAspectRatio="none" aria-hidden="true">
    <polyline points={pts} style:stroke={color} />
  </svg>
{/if}

<style>
  svg { display: block; width: 100%; height: 100%; }
  polyline { fill: none; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
</style>
