<script>
  import { getContext, onMount, tick } from "svelte";
  import { get, latest } from "../api.js";

  // The frame of a trip or charge detail: loads `url`, owns the heading fallbacks and the loading / not-found / retry messages, and
  // focuses the heading after the first load (unless its pane only stands in the newest item). The page gives snippets: title(data)
  // and subtitle(data) for the header (subtitle optional), body(data, reload) for the content (reload fetches again, e.g. after a
  // save); onloaded(data) runs after each fetch.
  // `accent` is the token (--trip-text or --charge-text) for the buttons and the focus ring. The page is remounted for another
  // item (the pane keys it), so `url` is read once.
  let { url, noun, accent, title, subtitle, body, onloaded } = $props();
  let data = $state(null);
  let error = $state(null);
  let h1 = $state();
  const takesFocus = getContext("detail-focus") ?? (() => true);

  const request = latest(); // the first load, Retry and a reload after a save: the newest reply wins

  async function load() {
    const ticket = request.next();
    error = null;
    try {
      const d = await get(url);
      if (!ticket.current) return;
      onloaded?.(d);
      data = d;
    } catch (e) {
      if (ticket.current) error = e;
    }
  }

  onMount(() => {
    load();
    if (takesFocus()) tick().then(() => h1?.focus({ preventScroll: true })); // after the pane has moved to <body>
    return request.reset;
  });
</script>

<article class="d-stack" style="--accent: var({accent})">
  <header>
    <h1 class="d-title" tabindex="-1" bind:this={h1}>
      {#if data}{@render title(data)}{:else if error?.status === 404}Not available{:else if error}Couldn't load this {noun}{:else}{noun === "trip" ? "Trip" : "Charge"}{/if}
    </h1>
    {#if data}{@render subtitle?.(data)}{/if}
  </header>

  {#if error?.status === 404}
    <p class="d-msg">This {noun} is not available. <a class="d-link" href="#/activity">Back to activity</a></p>
  {:else if error}
    <p class="d-msg" role="alert"><button class="d-btn" onclick={load}>Retry</button></p>
  {:else if !data}
    <p class="d-msg" aria-busy="true">Loading…</p>
  {:else}
    {@render body(data, load)}
  {/if}
</article>
