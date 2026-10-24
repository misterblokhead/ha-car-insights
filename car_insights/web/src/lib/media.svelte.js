// One place for the two media queries the layout and motion depend on.
export const screen = $state({ wide: false, reducedMotion: false });

const wide = matchMedia("(min-width: 768px)");
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const sync = () => {
  screen.wide = wide.matches;
  screen.reducedMotion = reduced.matches;
};
wide.addEventListener("change", sync);
reduced.addEventListener("change", sync);
sync();
