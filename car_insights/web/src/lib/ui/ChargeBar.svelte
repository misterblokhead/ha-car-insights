<script>
  // from and to are percentages (either may be null: nothing is drawn); full also shows the level before and the room left, hatched
  let { from, to, full = false } = $props();
  const clamp = (x) => Math.min(100, Math.max(0, x));
  const known = $derived(from != null && to != null);
  const lo = $derived(known ? clamp(Math.min(from, to)) : 0), hi = $derived(known ? clamp(Math.max(from, to)) : 0);
</script>

{#if known}
  <div class="bar" role="img" aria-label="Charged from {Math.round(clamp(from))} % to {Math.round(clamp(to))} %">
    {#if full}<i class="base" style:width="{lo}%"></i>{/if}
    <i class="added" style:left="{lo}%" style:width="{hi - lo}%"></i>
    {#if full}<i class="room" style:left="{hi}%"></i>{/if}
  </div>
{/if}

<style>
  .bar { position: relative; height: 6px; border-radius: 3px; overflow: hidden; background: var(--fill); }
  i { position: absolute; top: 0; bottom: 0; }
  .base { left: 0; background: var(--line); }
  .added { background: var(--charge); }
  .room { right: 0; background: repeating-linear-gradient(135deg, var(--line) 0 1px, transparent 1px 4px); }
</style>
