export const ADD_CAR_PATH = "/_my_redirect/config_flow_start?domain=car_insights";
export const CONFIGURE_PATH = "/config/integrations/integration/car_insights";

export const splitCars = (vehicles) => ({ active: vehicles.filter((v) => !v.archived), archived: vehicles.filter((v) => v.archived) });

export const removalMessage = (reply) => (reply.history_deleted === false ? "Its history could not be deleted; try Delete history again." : null);

// The panel runs in an iframe; HA's frontend (window.top) navigates on pushState plus a location-changed event.
export function navigateHa(path) {
  window.top.history.pushState(null, "", path);
  window.top.dispatchEvent(new CustomEvent("location-changed"));
}
