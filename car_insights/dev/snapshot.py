"""API answers over the demo data, to prove a refactor changes no behaviour.

    python dev/snapshot.py OUT.json                      # write the answers
    python dev/snapshot.py --compare BASE.json NEW.json  # exit 0 when equal after normalising both, else list the differing paths"""
import json
import random
import sys
import uuid
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
sys.path.insert(0, str(Path(__file__).resolve().parent))

from fastapi.testclient import TestClient  # noqa: E402

import demo  # noqa: E402
from car_insights import db, ui_api  # noqa: E402
from car_insights.api import create_app  # noqa: E402

NOW = int(datetime.fromisoformat("2026-10-20T12:00:00+02:00").timestamp() * 1000)
ADMIN = {"X-Remote-User-Id": "u-admin"}
DROPPED = {"wh_per_100km", "start_pct", "end_pct", "first", "prev_at", "next_at"}  # fields a later task adds or removes on purpose


def snapshot() -> dict:
    rng = random.Random(1)
    uuid.uuid4 = lambda: uuid.UUID(int=rng.getrandbits(128), version=4)  # group, spot and fixed-cost ids would differ on every run
    conn = db.connect(":memory:")
    deriver = demo.build(conn, NOW)

    async def is_admin(uid: str) -> bool:
        return True

    capacity = lambda vid: db.capacity_wh(conn, vid, 60_000.0)
    router = ui_api.router(conn, deriver, demo.zones, demo.TZ, capacity, is_admin, ingress_hosts=("testclient",), now_ms=lambda: NOW)
    c = TestClient(create_app(conn, "demo-token", lambda *a: None, lambda: NOW, ui=router))
    out: dict = {}

    def get(path: str) -> dict:
        r = c.get(path, headers=ADMIN)
        assert r.status_code == 200, (path, r.status_code, r.text)
        out[path.replace(view, "g:GROUP")] = r.json()
        return r.json()

    view = "g:" + c.get("/api/ui/views", headers=ADMIN).json()["groups"][0]["id"]  # the demo's cost group holds both cars; its id stays out of the keys
    items = [i for d in get(f"/api/ui/activity?view={view}")["days"] for i in d["items"] if i["end"] is not None]  # newest first
    for period in ("week", "month", "year"):
        get(f"/api/ui/stats?view={view}&period={period}&at=2026-10-20")
    for kind, path in (("trip", "trips"), ("charge", "charges")):
        i = next(i for i in items if i["kind"] == kind)
        get(f"/api/ui/{path}/{i['vehicle_id']}/{i['start']}")
    get("/api/ui/settings")
    return out


def normalise(x):
    if isinstance(x, dict):
        return {("kind" if k == "current" else k): normalise(v) for k, v in x.items() if k not in DROPPED}
    return [normalise(v) for v in x] if isinstance(x, list) else x


def diff(a, b, path="") -> list[str]:
    if isinstance(a, dict) and isinstance(b, dict):
        return [p for k in sorted(a.keys() | b.keys()) for p in (diff(a[k], b[k], f"{path}/{k}") if k in a and k in b else [f"{path}/{k}"])]
    if isinstance(a, list) and isinstance(b, list) and len(a) == len(b):
        return [p for i, (x, y) in enumerate(zip(a, b)) for p in diff(x, y, f"{path}[{i}]")]
    return [] if a == b else [path or "/"]


if __name__ == "__main__":
    if sys.argv[1] == "--compare":
        base, new = (json.loads(Path(p).read_text()) for p in sys.argv[2:4])
        bad = diff(normalise(base), normalise(new))
        print("\n".join(bad))
        sys.exit(1 if bad else 0)
    Path(sys.argv[1]).write_text(json.dumps(snapshot(), sort_keys=True, indent=1) + "\n")
