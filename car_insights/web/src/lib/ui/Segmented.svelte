<script>
  import { createSpring } from "../spring.js";
  import { screen } from "../media.svelte.js";

  let { options, value = $bindable(""), label } = $props();

  const name = $props.id();
  const PAD = 2;
  const spring = createSpring({ response: 0.35, damping: 1 });
  let width = $state(0);
  let x = $state(0);
  let placed = false; // the first measured position is taken, not animated to
  const cell = $derived(Math.max(0, (width - 2 * PAD) / options.length));

  $effect(() => {
    const target = Math.max(0, options.findIndex((o) => o.value === value)) * cell;
    if (!placed || screen.reducedMotion) {
      placed = width > 0;
      Object.assign(spring, { value: target, target, velocity: 0 });
      x = target;
      return;
    }
    spring.set(target);
    let raf = 0, last = 0;
    const tick = (now) => {
      const settled = spring.step(Math.min((now - (last || now - 16)) / 1000, 0.05));
      last = now;
      x = spring.value;
      if (!settled) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  });
</script>

<div class="group" role="radiogroup" aria-label={label} bind:clientWidth={width}>
  <div class="marker" style:width="{cell}px" style:transform="translateX({x}px)"></div>
  {#each options as o (o.value)}
    <label class:on={o.value === value}>
      <input type="radio" {name} value={o.value} bind:group={value} />
      <span>{o.label}</span>
    </label>
  {/each}
</div>

<style>
  .group { position: relative; display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; padding: 2px; border: var(--edge); border-radius: var(--radius-seg); background: var(--fill); }
  .marker { position: absolute; top: 2px; bottom: 2px; left: 2px; box-sizing: border-box; border: var(--edge); border-radius: var(--radius-ctl); background: var(--marker); box-shadow: var(--shadow-marker); }
  label { position: relative; min-height: 44px; min-width: 44px; display: flex; align-items: center; justify-content: center; padding: 0 10px; color: var(--muted); cursor: pointer; }
  label.on { color: var(--fg); font-weight: 600; }
  input { position: absolute; inset: 0; margin: 0; opacity: 0; cursor: pointer; }
  label:has(input:focus-visible) { outline: 2px solid var(--trip); outline-offset: -2px; border-radius: var(--radius-ctl); }
</style>
