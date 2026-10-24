<script>
  // one tile of a detail page's figure grid; an empty unit leaves the value alone (the missing "–" has none); children: a line under the value
  let { label, value, unit = "", children } = $props();
</script>

<div class="fig">
  <span class="label">{label}</span>
  <span class="value">{value}{#if unit}{" "}<small>{unit}</small>{/if}</span>
  {@render children?.()}
</div>

<style>
  .fig { display: flex; flex-direction: column; gap: 2px; min-width: 0; padding: 12px 14px; background: var(--card); border: var(--edge); border-radius: var(--radius-card); }
  .label { color: var(--muted); font-size: 13px; }
  .value { font-size: 22px; font-weight: 600; line-height: 1.2; letter-spacing: -0.01em; white-space: nowrap; }
  small { font-size: 13px; font-weight: 500; color: var(--muted); letter-spacing: 0; }
</style>
