"""Prints the pinned requirements of the Home Assistant components car_insights depends on (transitively), for
`pip install -r`: pytest-homeassistant-custom-component installs Home Assistant but not those (hass_frontend, ha-ffmpeg, ...)."""
import json
from pathlib import Path

import homeassistant.components

ROOT = Path(homeassistant.components.__path__[0])
MANIFEST = Path(__file__).parents[1] / "custom_components" / "car_insights" / "manifest.json"


def deps(m: dict) -> list[str]:
    return m.get("dependencies", []) + m.get("after_dependencies", [])


todo, seen, reqs = deps(json.loads(MANIFEST.read_text())), set(), set()
while todo:
    name = todo.pop()
    path = ROOT / name / "manifest.json"
    if name in seen or not path.exists():
        continue
    seen.add(name)
    m = json.loads(path.read_text())
    reqs.update(m.get("requirements", []))
    todo += deps(m)
print("\n".join(sorted(reqs)))
