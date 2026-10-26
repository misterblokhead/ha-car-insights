import { setHass } from "./lib/api.js";
import { mountApp } from "./main.js";

// Home Assistant's iframe custom panel. No shadow root: the page's panes, Leaflet and uPlot reach for the document and global CSS.
// Mounted on the first `hass` and never unmounted, so a removed and re-added element keeps working; later sets only refresh `hass`.
// HA also sets narrow, route and panel; the page needs none of them, so they stay plain properties.
const css = () =>
  new Promise((done) => {
    const href = new URL(/* @vite-ignore */ "panel.css", import.meta.url);
    href.search = new URL(import.meta.url).search; // the module's ?v=<version>: a new panel.js never pairs with a stale css
    const link = Object.assign(document.createElement("link"), { rel: "stylesheet", href: href.href });
    link.onload = link.onerror = done; // unstyled beats blank if the css is missing
    document.head.append(link);
  });

customElements.define(
  "car-insights-panel",
  class extends HTMLElement {
    #mounted = false;
    set hass(hass) {
      setHass(hass);
      if (this.#mounted) return;
      this.#mounted = true;
      this.style.display = "block";
      this.style.height = "100%";
      css().then(() => {
        const app = this.appendChild(document.createElement("div"));
        app.id = "app";
        mountApp(app);
      });
    }
  },
);
