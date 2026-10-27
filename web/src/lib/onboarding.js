// The Getting started checklist: which steps are done and what to tell a car that has sent nothing yet.
// `state` is the admin-only GET /onboarding reply; `places` is api.hasPlaces() (zones live in the browser's hass, not in the reply).
export const STEP_IDS = ["car", "data", "prices", "places", "viewers", "dashboard"];
export const DOCS = "https://github.com/misterblokhead/ha-car-insights/blob/main/docs/";

export const steps = (state, places) => {
  const done = {
    car: true, // the panel is only there once a car exists
    data: state.cars.some((c) => c.has_data),
    prices: state.price_set,
    places,
    viewers: state.opened.includes("viewers"),
    dashboard: state.opened.includes("dashboard"),
  };
  return STEP_IDS.map((id) => ({ id, done: done[id] }));
};

export const allDone = (state, places) => steps(state, places).every((s) => s.done);
export const cardVisible = (state, places) => !state.hidden && !allDone(state, places);
export const canShowAgain = (state, places) => state.hidden && !allDone(state, places);
export const showCard = (isAdmin, state, places) => isAdmin && cardVisible(state, places);

const SOURCES = { car_app: ["car_app"], integration: ["integration"], both: ["car_app", "integration"] };
export const hints = (state) =>
  state.cars.filter((c) => !c.has_data).map((c) => ({ name: c.name, kinds: [...SOURCES[c.source], ...(c.missing_entities ? ["missing"] : [])] }));
