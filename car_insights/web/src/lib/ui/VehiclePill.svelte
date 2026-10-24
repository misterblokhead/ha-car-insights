<script>
  import { tick } from "svelte";
  import { fade } from "svelte/transition";

  let { options, value = $bindable("") } = $props();

  let open = $state(false);
  let root = $state(), button = $state(), menu = $state();
  const current = $derived(options.find((o) => o.value === value));

  const items = () => [...menu.querySelectorAll("button")];

  async function show() {
    open = true;
    await tick();
    (menu.querySelector('[aria-checked="true"]') ?? items()[0])?.focus();
  }

  function hide(refocus = true) {
    open = false;
    if (refocus) button?.focus();
  }

  function pick(v) {
    value = v;
    hide();
  }

  function keydown(e) {
    const all = items(), i = all.indexOf(document.activeElement);
    const to = { ArrowDown: (i + 1) % all.length, ArrowUp: (i - 1 + all.length) % all.length, Home: 0, End: all.length - 1 }[e.key];
    if (to !== undefined) all[to].focus();
    else if (e.key === "Escape") hide();
    else if (e.key === "Tab") return hide(false);
    else return;
    e.preventDefault();
  }
</script>

<svelte:window onpointerdown={(e) => open && !root.contains(e.target) && hide(false)} />

<div class="root" bind:this={root}>
  {#if options.length < 2}
    <span class="pill">{current?.label ?? "–"}</span>
  {:else}
    <button
      class="pill" bind:this={button} aria-haspopup="menu" aria-expanded={open}
      onclick={() => (open ? hide() : show())}
      onkeydown={(e) => { if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) { e.preventDefault(); show(); } }}
    >
      <span class="label">{current?.label ?? "–"}</span>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
    </button>
    {#if open}
      <div class="menu" role="menu" aria-label="Vehicle" tabindex="-1" bind:this={menu} onkeydown={keydown} transition:fade={{ duration: 150 }}>
        {#each options as o (o.value)}
          <button role="menuitemradio" aria-checked={o.value === value} tabindex="-1" onclick={() => pick(o.value)}>
            <span>{o.label}</span>
            {#if o.value === value}<span aria-hidden="true">✓</span>{/if}
          </button>
        {/each}
      </div>
    {/if}
  {/if}
</div>

<style>
  .root { position: relative; display: inline-block; max-width: 100%; }
  .pill {
    box-sizing: border-box; max-width: 100%; min-height: 44px; display: inline-flex; align-items: center; gap: 6px; padding: 0 14px;
    border: 0; border-radius: 22px; background: var(--fill); color: var(--fg); font: inherit; font-weight: 600;
    transition: transform 100ms;
  }
  button.pill { cursor: pointer; }
  button.pill:active { transform: scale(var(--press-scale)); }
  .label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  svg { flex: none; width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
  .menu {
    position: absolute; z-index: 20; top: calc(100% + 6px); left: 0; min-width: 100%; width: max-content; max-width: min(320px, calc(100vw - 32px));
    max-height: 60dvh; overflow: auto; padding: 4px; box-sizing: border-box;
    background: var(--chrome); -webkit-backdrop-filter: var(--chrome-filter); backdrop-filter: var(--chrome-filter);
    border: 0.5px solid var(--line); border-radius: var(--radius-card); box-shadow: 0 8px 28px rgba(0, 0, 0, 0.18);
  }
  .menu button {
    width: 100%; min-height: 44px; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 0 12px;
    border: 0; border-radius: var(--radius-ctl); background: none; color: var(--fg); font: inherit; text-align: left; cursor: pointer;
  }
  .menu button:hover { background: var(--fill); }
  .menu [aria-checked="true"] { color: var(--trip); font-weight: 600; }
  :is(.pill, .menu button):focus-visible { outline: 2px solid var(--trip); outline-offset: 2px; }
</style>
