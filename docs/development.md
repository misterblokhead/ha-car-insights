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
