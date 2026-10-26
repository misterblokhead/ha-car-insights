<script>
  // one tile of a detail page's figure grid; an empty unit leaves the value alone (the missing "–" has none); children: a line under the value;
  // size "small" for a grid of three
  let { label, value, unit = "", size = "normal", children } = $props();
</script>

<div class="fig card" class:small={size === "small"}>
  <span class="caption">{label}</span>
  <span class="value big">{value}{#if unit}{" "}<small>{unit}</small>{/if}</span>
  {@render children?.()}
</div>

<style>
  .fig { display: flex; flex-direction: column; gap: 2px; min-width: 0; padding: 12px 14px; }
  .value { font-size: 22px; line-height: 1.2; }
  .value small { font-size: 13px; }
  .small { padding-inline: 10px; }
  .small .value { font-size: 20px; }
</style>
