<script>
  import L from "leaflet";
  import "leaflet/dist/leaflet.css";
  import { MAX_Z, TILE_TEMPLATE } from "../tiles.js";
  import { authedUrl } from "../authed.js";

  // tiles come through Home Assistant's login, so each <img> is filled from a signed fetch
  const SignedTiles = L.TileLayer.extend({
    createTile(coords, done) {
      const img = document.createElement("img");
      img.alt = "";
      L.DomEvent.on(img, "load", L.Util.bind(this._tileOnLoad, this, done, img));
      L.DomEvent.on(img, "error", L.Util.bind(this._tileOnError, this, done, img));
      authedUrl(this.getTileUrl(coords)).then((src) => (img.src = src), (e) => done(e, img));
      return img;
    },
  });

  // lines: [{ points: [[lat, lon]], kind: "trip", href? }]; dots: [{ lat, lon, kind: "trip" | "charge", role?: "start" | "end", title?, href? }]
  let { lines = [], dots = [], height, label = "Map" } = $props();
  let el = $state();

  $effect(() => {
    // Leaflet needs literal colours, so the tokens are read once, here
    const css = getComputedStyle(el);
    const colour = (kind) => css.getPropertyValue(`--${kind}`).trim();
    // on touch, a map that drags would trap the page's vertical scroll, so it pans only after a tap (like the wheel)
    const coarse = matchMedia("(pointer: coarse)").matches;
    const map = L.map(el, { scrollWheelZoom: false, dragging: !coarse });
    map.attributionControl.setPrefix(false);
    new SignedTiles(TILE_TEMPLATE, {
      maxZoom: 19,
      // a new tab: a tap must not navigate the panel's frame away
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
    }).addTo(map);

    const bounds = L.latLngBounds([]);
    const open = (layer, href) => href && layer.on("click", () => (location.hash = href));
    for (const { points, kind, href } of lines) {
      open(L.polyline(points, { color: colour(kind), weight: 4 }).addTo(map), href);
      bounds.extend(points);
    }
    for (const { lat, lon, kind, role, title, href } of dots) {
      const ring = role === "end";
      const dot = L.circleMarker([lat, lon], {
        radius: 6, fillColor: colour(kind), fillOpacity: 1, color: "#fff", weight: ring ? 2 : 0,
      }).addTo(map);
      if (title) {
        const text = document.createElement("span"); // a node, not a string: Leaflet sets a string as HTML, and a title is a place name
        text.textContent = title;
        dot.bindTooltip(text);
      }
      open(dot, href);
      bounds.extend([lat, lon]);
    }
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [16, 16], maxZoom: MAX_Z });

    // the wheel zooms only after a click or focus, so scrolling the page past the map still works
    const activate = () => (map.scrollWheelZoom.enable(), map.dragging.enable());
    const wheelOff = () => map.scrollWheelZoom.disable(); // leaving with the mouse: the map stays active for the keyboard and touch
    const deactivate = () => (wheelOff(), coarse && map.dragging.disable());
    // dragging the map must not reach the detail pane's swipe
    const stop = (e) => e.stopPropagation();
    const listeners = [
      ["click", activate], ["focus", activate], ["blur", deactivate], ["mouseleave", wheelOff],
      ["pointerdown", stop], ["touchstart", stop], ["wheel", stop],
    ];
    for (const [type, fn] of listeners) el.addEventListener(type, fn, { passive: true });

    return () => {
      for (const [type, fn] of listeners) el.removeEventListener(type, fn);
      map.remove();
    };
  });
</script>

<div class="map" bind:this={el} style:height="{height}px" role="region" aria-label={label}></div>

<style>
  .map { border-radius: var(--radius-card); background: var(--fill); }
  .map :global(.leaflet-tile-pane) { filter: var(--tile-filter); }
</style>
