<script>
  // The frame of an activity card. kind picks the colours (glyph, ring of the open card, focus ring); `aside` is a column beside the
  // figures (a trip's route and stats), `below` extra rows under the title (a charge's cost and level). onclick is the page's click logic.
  let { href, current = false, kind, title, value, unit, when, onclick, glyph, aside, below } = $props();
</script>

<a {href} {onclick} class="card press {kind}" class:current class:aside={aside} aria-current={current ? "page" : undefined}>
  <span class="glyph" aria-hidden="true">{@render glyph()}</span>
  <span class="title">{title}</span>
  <span class="big">{value}{#if unit}{" "}<small>{unit}</small>{/if}</span>
  <span class="caption when">{when}</span>
  {@render aside?.()}
  {@render below?.()}
</a>

<style>
  a {
    --accent: var(--trip); /* the focus ring and the open card's ring */
    display: grid; grid-template-columns: 36px minmax(0, 1fr) auto; column-gap: 12px; row-gap: 2px; align-items: center; padding: 14px;
    color: inherit; text-decoration: none;
  }
  a.charge { --accent: var(--charge-text); }
  a.current { box-shadow: 0 0 0 2px var(--accent); }
  .glyph { grid-row: 1 / 3; align-self: start; width: 36px; height: 36px; border-radius: 50%; display: grid; place-items: center; background: var(--trip); }
  .charge .glyph { background: var(--charge); }
  .glyph :global(svg) { width: 20px; height: 20px; stroke: #fff; }
  .charge .glyph :global(svg) { fill: var(--on-charge); stroke: var(--on-charge); stroke-width: 1.2; stroke-linejoin: round; }
  .title { grid-column: 2; font-weight: 600; overflow-wrap: anywhere; }
  .big { grid-column: 3; text-align: right; }
  .when { grid-column: 2 / 4; }
  .trip .when { grid-column: 2; grid-row: 2; align-self: start; }
  /* a wide list puts the aside beside the figures instead of between them, halving the card's height */
  @container (min-width: 520px) {
    a.aside { grid-template-columns: 36px minmax(0, 1fr) 120px auto; }
    a.aside .big { grid-column: 4; grid-row: 1; }
  }
</style>
