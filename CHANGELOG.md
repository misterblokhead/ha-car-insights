# Changelog

All notable changes to Car Insights. Versions follow [Semantic Versioning](https://semver.org/); each version is a git
tag `vX.Y.Z`, and the GitHub release of that tag has the full notes.

## [1.4.0](https://github.com/misterblokhead/ha-car-insights/releases/tag/v1.4.0): Privacy

### Changed
- Street names are now off by default, also after updating: Car Insights sends nothing to OpenStreetMap's Nominatim
  service unless an administrator turns on **Street names** in Settings. Until then, places outside your zones and
  charge locations show "Unknown"; street names already looked up stay.

## [1.3.0](https://github.com/misterblokhead/ha-car-insights/releases/tag/v1.3.0): Setup and documentation

### New
- A Getting started checklist on Activity for administrators.
- A clearer Add a car dialog, with links to the guides and a next-step line.
- Beginner guides in `docs/` and a short README with one-click setup.
- The page fills wide screens.

### Fixes
- Plugging in while in P ends a trip.
- Settings scrolls to a section once, not after every save; focus moves to the section heading.
- The removed-car repair keeps its text in the fix flow.

## [1.2.1](https://github.com/misterblokhead/ha-car-insights/releases/tag/v1.2.1)

- Ready for Home Assistant 2027.10: the device picker no longer uses a device registry feature that is being removed.
- The device picker is labelled "Device".

## [1.2.0](https://github.com/misterblokhead/ha-car-insights/releases/tag/v1.2.0): Managing cars

- Add and remove cars from the Car Insights page; a removed car's history can be kept (archived) or deleted.
- Only administrators can add, remove or delete a car's history.
- Clicking a trip, charge or tab inside Home Assistant opens it again.

## [1.1.0](https://github.com/misterblokhead/ha-car-insights/releases/tag/v1.1.0): Any car

- Works without the car app: read your car's own Home Assistant integration, with presets for Renault and Stellantis.
- Take a Home Assistant backup before upgrading from 1.0.0; going back means restoring it.
