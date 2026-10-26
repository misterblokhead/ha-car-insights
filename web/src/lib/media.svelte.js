// One place for the media queries the layout and motion depend on.
// `split`: room for the list and a detail column side by side (sidebar 240 + list 400 + detail 360 + gutters); below it a detail covers the list.
export const screen = $state({ wide: false, split: false, reducedMotion: false });

const wide = matchMedia("(min-width: 768px)");
const split = matchMedia("(min-width: 1080px)");
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const sync = () => {
  screen.wide = wide.matches;
  screen.split = split.matches;
  screen.reducedMotion = reduced.matches;
};
wide.addEventListener("change", sync);
split.addEventListener("change", sync);
reduced.addEventListener("change", sync);
sync();
