# Development

Tests run with `pytest-homeassistant-custom-component` (it pulls in Home Assistant), on Linux or WSL (Home Assistant does
not run on Windows), with the Python version that Home Assistant release needs (3.14 at the moment). The second line
installs what the Home Assistant components Car Insights depends on need (frontend, cloud, ...):

```sh
pip install -r tests/requirements.txt
python tests/ha_requirements.py > ha-requirements.txt && pip install -r ha-requirements.txt
python -m pytest tests
```

GitHub runs these and the panel tests on every push and pull request (`.github/workflows/tests.yml`).

The panel in `web/` is tested and built with npm:

```sh
cd web
npm ci
npm test
npm run build
```

## Releasing

1. Set `version` in `custom_components/car_insights/manifest.json` to the new version, for example `1.4.0`.
2. Add a `## [1.4.0](https://github.com/misterblokhead/ha-car-insights/releases/tag/v1.4.0)` section at the top of
   `CHANGELOG.md`.
3. Commit, wait for the checks to pass, then tag and push the tag:

   ```sh
   git tag v1.4.0
   git push origin v1.4.0
   ```

`.github/workflows/release.yml` does the rest: it checks that the tag matches the manifest version, takes that
version's section from `CHANGELOG.md` as the notes and creates the GitHub release, which HACS offers as the update. It
fails when the versions differ or the section is missing.
