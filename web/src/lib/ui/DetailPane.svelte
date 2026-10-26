<script module>
  // The pane is a fixed layer over the list, so it lives in <body>: the app (or its main column) can go inert beneath it
  const portal = (node) => {
    document.body.appendChild(node);
    return { destroy: () => node.remove() };
  };
</script>

<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { createSpring } from "../spring.js";
  import { animate, cssMs } from "../motion.js";
  import { shouldClose, velocity } from "../gesture.js";
  import { screen } from "../media.svelte.js";

  // `id` names the shown item: a new id cross-fades the content. prev and next are the hashes of the neighbouring items, or null.
  // Phone: a layer that slides in from the right and back out with an edge swipe. From 768 px: the same layer beside the sidebar, or
  // (from 1080 px) a column beside the list; those two only cross-fade. Reduced motion: opacity only.
  let { id, onclose, prev = null, next = null, children } = $props();

  const EDGE = 24, SLOP = 8, FADE = cssMs("--fade");
  const overlay = $derived(!screen.split);
  const slide = $derived(!screen.wide && !screen.reducedMotion);
  const spring = createSpring({ response: 0.35, damping: 1 });
  const startsOff = !screen.wide && !screen.reducedMotion; // the first frame is already off screen
  let x = $state(startsOff ? innerWidth : 0);
  let busy = $state(false); // the spring or a finger is moving the layer
  let held = $state(false);
  let leaving = $state(false);
  let el = $state();
  let closing = 0;
  let drag = null;

  // Settled off screen: close. The last pixel is not worth a second of busy layer, hence the snap.
  const motion = animate(spring, {
    snap: { distance: 1, speed: 30 },
    onFrame: (v) => (x = v),
    onSettle() {
      busy = false;
      if (spring.target > 0) onclose();
    },
  });
  function slideTo(target, velocity) {
    busy = true;
    motion.to(target, velocity);
  }

  onMount(() => {
    spring.value = x;
    if (startsOff) slideTo(0);
    return () => {
      motion.stop();
      clearTimeout(closing);
    };
  });

  function close() {
    if (leaving) return;
    if (slide) {
      slideTo(el.offsetWidth); // keeps the velocity the layer has now
    } else {
      leaving = true;
      closing = setTimeout(onclose, FADE);
    }
  }

  const go = (hash) => hash && location.replace(hash); // replaces, so back still returns to the list

  function key(e) {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if ((e.key === "ArrowUp" || e.key === "ArrowDown") && !e.target.closest?.("input, select, textarea, [role=menu], [role=listbox]")) {
      const hash = e.key === "ArrowUp" ? prev : next;
      if (hash) {
        e.preventDefault();
        go(hash);
      }
    }
  }

  // The swipe starts at the left edge, or anywhere while the layer is still moving (grabbing it mid-motion).
  const trim = (e) => {
    while (drag.samples.length > 1 && drag.samples[0].t < e.timeStamp - 100) drag.samples.shift();
  };
  // A press only becomes a swipe after SLOP px of horizontal travel, so a tap on the back button stays a tap; a moving layer is taken at once.
  function hold(e) {
    motion.stop();
    el.setPointerCapture(e.pointerId);
    drag.live = true;
    busy = held = true;
  }
  function down(e) {
    if (!slide || (e.pointerType === "mouse" && e.button) || (!busy && (e.clientX - x > EDGE || e.target.closest("button, a")))) return;
    drag = { id: e.pointerId, grab: e.clientX, top: e.clientY, from: spring.value, samples: [{ t: e.timeStamp, x: e.clientX }], live: false };
    if (busy) hold(e);
  }
  function move(e) {
    if (!drag || e.pointerId !== drag.id) return;
    if (!drag.live) {
      const dx = Math.abs(e.clientX - drag.grab), dy = Math.abs(e.clientY - drag.top);
      if (dy > SLOP && dy > dx) return void (drag = null); // a vertical scroll
      if (dx < SLOP) return;
      hold(e);
    }
    x = Math.max(0, drag.from + e.clientX - drag.grab); // 1:1 with the finger
    Object.assign(spring, { value: x, target: x, velocity: 0 });
    drag.samples.push({ t: e.timeStamp, x: e.clientX });
    trim(e);
  }
  function up(e) {
    if (!drag || e.pointerId !== drag.id) return;
    if (!drag.live) return void (drag = null); // a tap
    drag.samples.push({ t: e.timeStamp, x: e.clientX });
    trim(e); // a finger that rested before lifting leaves no velocity
    const v = velocity(drag.samples);
    drag = null;
    held = false;
    const width = el.offsetWidth;
    slideTo(shouldClose(x, v, width) ? width : 0, v);
  }

  // the list (and on a phone the tab bar and switcher) cannot be reached or read under the layer
  $effect(() => {
    if (!overlay) return;
    const under = document.querySelector(screen.wide ? "main" : "#app");
    under.inert = true;
    return () => (under.inert = false);
  });

  $effect(() => {
    id;
    el?.scrollTo(0, 0);
  });
</script>

<svelte:window onkeydown={key} />

{#snippet body()}
  <header class="bar chrome">
    <button class="back press" onclick={close}>
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
      {screen.wide ? "Close" : "Activity"}
    </button>
    <span class="steps">
      <button class="press" aria-label="Previous activity" disabled={!prev} onclick={() => go(prev)}>
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 15 7-7 7 7" /></svg>
      </button>
      <button class="press" aria-label="Next activity" disabled={!next} onclick={() => go(next)}>
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 9 7 7 7-7" /></svg>
      </button>
    </span>
  </header>
  <div class="content">
    {#key id}
      <div class="item" in:fade={{ duration: FADE }} out:fade={{ duration: FADE }}>{@render children()}</div>
    {/key}
  </div>
{/snippet}

{#if overlay}
  <div
    class="layer" class:phone={!screen.wide} class:busy class:held class:leaving class:fade-in={!startsOff}
    role="dialog" tabindex="-1" aria-modal={!screen.wide} aria-label="Details"
    bind:this={el} use:portal style:transform={x ? `translateX(${x}px)` : null}
    onpointerdown={down} onpointermove={move} onpointerup={up} onpointercancel={up}
  >
    {@render body()}
  </div>
{:else}
  <aside class="column" class:leaving class:fade-in={!startsOff} aria-label="Details" bind:this={el}>
    {@render body()}
  </aside>
{/if}

<style>
  .layer {
    position: fixed; inset: 0 0 0 var(--sidebar); z-index: 30; overflow-y: auto; overscroll-behavior: contain;
    background: var(--bg); touch-action: pan-y; /* horizontal drags reach the swipe, vertical ones scroll */
  }
  .layer.phone { left: 0; box-shadow: var(--shadow-sheet); }
  .layer.busy { touch-action: none; will-change: transform; }
  .layer.held { user-select: none; }
  .column { position: sticky; top: 24px; max-height: calc(100dvh - 48px); overflow-y: auto; overscroll-behavior: contain; }
  .fade-in { animation: appear var(--fade); }
  .leaving { opacity: 0; transition: opacity var(--fade); }
  @keyframes appear { from { opacity: 0; } }

  .bar {
    position: sticky; top: 0; z-index: 2; display: flex; justify-content: space-between; align-items: center;
    padding: calc(env(safe-area-inset-top) + 4px) 8px 4px;
    border-bottom: var(--edge);
  }
  .steps { display: flex; }
  button {
    min-width: 44px; min-height: 44px; display: inline-flex; align-items: center; justify-content: center; gap: 2px; padding: 0 8px;
    border: 0; border-radius: var(--radius-ctl); background: none; color: var(--trip-text); font: inherit; font-size: 17px;
  }
  button:focus-visible { outline-offset: -2px; }
  svg { width: 22px; height: 22px; stroke-width: 2.2; }

  .content { display: grid; padding: 8px 16px calc(32px + env(safe-area-inset-bottom)); }
  .column .content { padding: 8px 4px 32px; }
  .item { grid-area: 1 / 1; min-width: 0; }
</style>
