# Development

Tests run with `pytest-homeassistant-custom-component` (it pulls in Home Assistant), on Linux or WSL (Home Assistant does not run on Windows):

```sh
pip install -r tests/requirements.txt
python -m pytest tests
```

The panel in `web/` is tested and built with npm:

```sh
cd web
npm ci
npm test
npm run build
```
