"""The "Getting started" checklist: what is done is read from the data (a car's first sample, a default price); what only the admin can say
(a step opened, the card hidden) is one JSON row in `settings`."""
import json

from . import db

KEY = "onboarding"
STEPS_OPENED = ("viewers", "dashboard")  # steps with nothing to measure: done once their link was opened


def _has_data(conn, vid: str) -> bool:
    return conn.execute("SELECT 1 FROM samples WHERE vehicle_id=? AND key NOT IN ('meta','gap') LIMIT 1", (vid,)).fetchone() is not None


def _price_set(conn) -> bool:
    return conn.execute("SELECT 1 FROM tariffs WHERE target IN ('ac','dc') LIMIT 1").fetchone() is not None


def _save(conn, row: dict) -> None:
    conn.execute("INSERT INTO settings VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value", (KEY, json.dumps(row)))


def _row(conn) -> dict | None:
    got = conn.execute("SELECT value FROM settings WHERE key=?", (KEY,)).fetchone()
    return None if got is None else json.loads(got[0])


def state(conn, cars: dict[str, dict]) -> dict:
    """`cars`: vehicle id -> {"source", "missing_entities"} of the cars that have a config entry (an archived car is none of them).
    The first read of an install decides `hidden` for good: one that already has data and a price needs no checklist."""
    listed = sorted(({"id": vid, "name": db.device_info(conn, vid)[0], "source": c["source"], "has_data": _has_data(conn, vid),
                      "missing_entities": c["missing_entities"]} for vid, c in cars.items()), key=lambda c: (c["name"].casefold(), c["id"]))
    price_set = _price_set(conn)
    row = _row(conn)
    if row is None:
        row = {"opened": [], "hidden": price_set and any(c["has_data"] for c in listed)}
        _save(conn, row)
    return {"cars": listed, "price_set": price_set, **row}


def update(conn, opened: str | None = None, hidden: bool | None = None) -> None:
    """Record that a step's link was opened, or hide or show the card; the caller has validated the values."""
    row = _row(conn) or {"opened": [], "hidden": False}
    if opened is not None:
        row["opened"] = [s for s in STEPS_OPENED if s == opened or s in row["opened"]]
    if hidden is not None:
        row["hidden"] = hidden
    _save(conn, row)
