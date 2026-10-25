"""Every read of the derived tables (trips, charges, their series and routes), and the one place a stored row becomes a dict.
`derive` decides what the rows are; this module only knows how they are laid out."""
import json
import sqlite3

from . import db
from .kinds import CHARGE, KINDS, TRIP, Kind
from .zones import Zones

_ROUTES = "trip_routes"
# wire key -> column, for the fields SQL filters, sorts or sums; the rest of a row stays in `json`, and a field is in one or the other
POINT_KEYS = ("from_lat", "from_lon", "to_lat", "to_lon")  # a trip's start and end points: columns only, on no dict that leaves the store
_FIELDS = {
    TRIP.name: {"start": "start", "end": "end", "distance_m": "distance_m", "net_wh": "net_wh", "gross_wh": "gross_wh",
                "recup_wh": "recup_wh", "duration_s": "duration_s", "from": "from_place", "to": "to_place", **{k: k for k in POINT_KEYS}},
    CHARGE.name: {k: k for k in ("start", "end", "added_wh", "energy_source", "start_wh", "lat", "lon", "zone", "place")},
}


def public(row: dict) -> dict:
    """The row as the readers return it: without a trip's points."""
    return {k: v for k, v in row.items() if k not in POINT_KEYS}


def _wire(kind: Kind) -> dict[str, str]:
    return {k: c for k, c in _FIELDS[kind.name].items() if k not in POINT_KEYS}


def _sel(kind: Kind) -> str:
    """The select list `_row` expects: the wire columns, then the json."""
    return ", ".join((*_wire(kind).values(), "json"))


def _row(kind: Kind, r: tuple, vid: str | None = None) -> dict:
    *values, js = r
    d = {**json.loads(js), **dict(zip(_wire(kind), values))}
    return d if vid is None else {**d, "vehicle_id": vid}


def _marks(vids: list[str]) -> str:
    return ",".join("?" * len(vids))


def _satellites(kind: Kind) -> list[str]:
    return [kind.series_table, *([_ROUTES] if kind.has_route else [])]


def insert(conn: sqlite3.Connection, kind: Kind, vid: str, row: dict, series: dict | None, route: list | None, algo: int) -> None:
    """Store a row with its series and, for a trip, its route (None: no such row)."""
    cols = _FIELDS[kind.name]
    rest = {k: v for k, v in row.items() if k not in cols}
    conn.execute(f"INSERT INTO {kind.table}(vehicle_id, algo, json, {', '.join(cols.values())}) VALUES(?,?,?{',?' * len(cols)})",
                 (vid, algo, db.json_dumps(rest), *(row.get(k) for k in cols)))
    if series is not None:
        conn.execute(f"INSERT INTO {kind.series_table} VALUES(?,?,?)", (vid, row["start"], db.json_dumps(series)))
    if kind.has_route and route is not None:
        conn.execute(f"INSERT INTO {_ROUTES} VALUES(?,?,?)", (vid, row["start"], db.json_dumps(route)))


def purge(conn: sqlite3.Connection, kind: Kind, vid: str) -> None:
    """Delete all of a vehicle's rows of a kind, with their series and routes."""
    for table in (*_satellites(kind), kind.table):
        conn.execute(f"DELETE FROM {table} WHERE vehicle_id=?", (vid,))


def drop_after(conn: sqlite3.Connection, kind: Kind, vid: str, w: int) -> None:
    """Delete a vehicle's rows of a kind that are open or end after `w`, with their series and routes."""
    live = f"SELECT start FROM {kind.table} WHERE vehicle_id=? AND (end IS NULL OR end>?)"
    for table in _satellites(kind):  # first: they are found through their rows
        conn.execute(f"DELETE FROM {table} WHERE vehicle_id=? AND start IN ({live})", (vid, vid, w))
    conn.execute(f"DELETE FROM {kind.table} WHERE vehicle_id=? AND (end IS NULL OR end>?)", (vid, w))


def stale_vehicles(conn: sqlite3.Connection, algo: int) -> set[str]:
    """Vehicles with a row of another derivation version in either table."""
    return {r[0] for k in KINDS for r in conn.execute(f"SELECT vehicle_id FROM {k.table} WHERE algo!=?", (algo,))}


def current_trip(conn: sqlite3.Connection, vid: str) -> dict | None:
    r = conn.execute(f"SELECT {_sel(TRIP)} FROM trips WHERE vehicle_id=? AND end IS NULL", (vid,)).fetchone()
    return None if r is None else _row(TRIP, r)


def has_open(conn: sqlite3.Connection, kind: Kind, vid: str) -> bool:
    return conn.execute(f"SELECT 1 FROM {kind.table} WHERE vehicle_id=? AND end IS NULL", (vid,)).fetchone() is not None


def open_trip_vehicles(conn: sqlite3.Connection) -> list[str]:
    return [r[0] for r in conn.execute("SELECT DISTINCT vehicle_id FROM trips WHERE end IS NULL")]


def closed(conn: sqlite3.Connection, kind: Kind, vid: str, limit: int = -1, since: int = 0) -> list[dict]:
    """Closed rows starting at or after `since`, newest first (limit -1: all)."""
    rows = conn.execute(f"SELECT {_sel(kind)} FROM {kind.table} WHERE vehicle_id=? AND end IS NOT NULL AND start>=? ORDER BY start DESC LIMIT ?",
                        (vid, since, limit))
    return [_row(kind, r) for r in rows]


def row(conn: sqlite3.Connection, kind: Kind, vid: str, start: int) -> dict | None:
    """One row, open or closed."""
    r = conn.execute(f"SELECT {_sel(kind)} FROM {kind.table} WHERE vehicle_id=? AND start=?", (vid, start)).fetchone()
    return None if r is None else _row(kind, r)


def series(conn: sqlite3.Connection, kind: Kind, vid: str, start: int) -> dict | None:
    r = conn.execute(f"SELECT json FROM {kind.series_table} WHERE vehicle_id=? AND start=?", (vid, start)).fetchone()
    return None if r is None else json.loads(r[0])


def route(conn: sqlite3.Connection, vid: str, start: int) -> list[list[float]] | None:
    r = conn.execute(f"SELECT points FROM {_ROUTES} WHERE vehicle_id=? AND start=?", (vid, start)).fetchone()
    return None if r is None else json.loads(r[0])


def newest_start(conn: sqlite3.Connection, kind: Kind, vid: str) -> int:
    """Newest start of a kind, open rows included, or -1."""
    return conn.execute(f"SELECT MAX(start) FROM {kind.table} WHERE vehicle_id=?", (vid,)).fetchone()[0] or -1


def newest_end(conn: sqlite3.Connection, vid: str, below: int | None = None, kinds: tuple[Kind, ...] = KINDS) -> int:
    """Newest closed end over the kinds (strictly below `below` when given), or -1."""
    cap, args = ("", (vid,)) if below is None else (" AND end<?", (vid, below))
    return max(conn.execute(f"SELECT MAX(end) FROM {k.table} WHERE vehicle_id=?{cap}", args).fetchone()[0] or -1 for k in kinds)


def ended(conn: sqlite3.Connection, kind: Kind, vid: str, lo: int, hi: int | None = None) -> list[dict]:
    """Closed rows whose end is in [lo, hi] (no upper bound when hi is None)."""
    rows = conn.execute(f"SELECT {_sel(kind)} FROM {kind.table} WHERE vehicle_id=? AND end>=? AND (? IS NULL OR end<=?)", (vid, lo, hi, hi))
    return [_row(kind, r) for r in rows]


def rows_after(conn: sqlite3.Connection, kind: Kind, vid: str, w: int) -> dict[int, dict]:
    """start -> row of the rows that are open or end after `w`: what a window starting at `w` derives again."""
    rows = conn.execute(f"SELECT {_sel(kind)} FROM {kind.table} WHERE vehicle_id=? AND (end IS NULL OR end>?)", (vid, w))
    return {d["start"]: d for d in (_row(kind, r) for r in rows)}


def straddling(conn: sqlite3.Connection, vid: str, w: int) -> list[int]:
    """Starts of the rows of either kind that begin at or before `w` and are open or end after it."""
    return [r[0] for k in KINDS for r in conn.execute(
        f"SELECT start FROM {k.table} WHERE vehicle_id=? AND (end IS NULL OR end>?) AND start<=?", (vid, w, w))]


def in_range(conn: sqlite3.Connection, kind: Kind, vids: list[str], lo: int, hi: int) -> list[dict]:
    """Closed rows of the vehicles with lo <= start < hi, oldest first, each with its vehicle_id."""
    rows = conn.execute(f"SELECT vehicle_id, {_sel(kind)} FROM {kind.table} WHERE vehicle_id IN ({_marks(vids)}) AND end IS NOT NULL"
                        " AND start>=? AND start<? ORDER BY start", (*vids, lo, hi))
    return [_row(kind, r[1:], r[0]) for r in rows]


def sums(conn: sqlite3.Connection, kind: Kind, vids: list[str], lo: int, hi: int, fields: tuple[str, ...]) -> tuple:
    """The sums of `fields` over the closed rows with lo <= start < hi (a null counts as 0), then the number of rows."""
    cols = "".join(f"COALESCE(SUM({_wire(kind)[f]}),0), " for f in fields)
    return conn.execute(f"SELECT {cols}COUNT(*) FROM {kind.table} WHERE vehicle_id IN ({_marks(vids)}) AND end IS NOT NULL"
                        " AND start>=? AND start<?", (*vids, lo, hi)).fetchone()


def charged_by_place(conn: sqlite3.Connection, vids: list[str], lo: int, hi: int) -> list[tuple[str | None, float]]:
    """(place, added Wh) of the closed charges with lo <= start < hi, one entry per place."""
    return [(p, float(wh)) for p, wh in conn.execute(
        f"SELECT place, COALESCE(SUM(added_wh),0) FROM charges WHERE vehicle_id IN ({_marks(vids)}) AND end IS NOT NULL"
        " AND start>=? AND start<? GROUP BY place", (*vids, lo, hi))]


def trip_distance_m(conn: sqlite3.Connection, vid: str, lo: int, hi: int) -> float:
    """Distance of the closed trips that start at or after `lo` and end at or before `hi`."""
    return conn.execute("SELECT COALESCE(SUM(distance_m),0) FROM trips WHERE vehicle_id=? AND start>=? AND end<=?", (vid, lo, hi)).fetchone()[0]


def first_trip_start(conn: sqlite3.Connection, vid: str, default: int) -> int:
    return conn.execute("SELECT COALESCE(MIN(start), ?) FROM trips WHERE vehicle_id=?", (default, vid)).fetchone()[0]


def similar(conn: sqlite3.Connection, vid: str, before: int, a: str, b: str, limit: int) -> list[dict]:
    """The newest closed trips that started before `before` from place `a` to place `b`."""
    rows = conn.execute(f"SELECT {_sel(TRIP)} FROM trips WHERE vehicle_id=? AND end IS NOT NULL AND start<? AND from_place=? AND to_place=?"
                        " ORDER BY start DESC LIMIT ?", (vid, before, a, b, limit))
    return [_row(TRIP, r) for r in rows]


def newest_starts(conn: sqlite3.Connection, kind: Kind, vids: list[str], limit: int) -> list[int]:
    """The starts of the `limit` newest rows of the vehicles, open ones included, newest first."""
    return [r[0] for r in conn.execute(f"SELECT start FROM {kind.table} WHERE vehicle_id IN ({_marks(vids)}) ORDER BY start DESC LIMIT ?",
                                       (*vids, limit))]


def open_starts(conn: sqlite3.Connection, kind: Kind, vids: list[str]) -> list[int]:
    return [r[0] for r in conn.execute(f"SELECT start FROM {kind.table} WHERE vehicle_id IN ({_marks(vids)}) AND end IS NULL", vids)]


def rows_from(conn: sqlite3.Connection, kind: Kind, vids: list[str], cut: int) -> list[dict]:
    """Rows of the vehicles starting at or after `cut`, open ones included, each with its vehicle_id."""
    rows = conn.execute(f"SELECT vehicle_id, {_sel(kind)} FROM {kind.table} WHERE vehicle_id IN ({_marks(vids)}) AND start>=?", (*vids, cut))
    return [_row(kind, r[1:], r[0]) for r in rows]


def closed_before(conn: sqlite3.Connection, kind: Kind, vids: list[str], before: int) -> list[dict]:
    """Closed rows of the vehicles starting before `before`, each with its vehicle_id."""
    rows = conn.execute(f"SELECT vehicle_id, {_sel(kind)} FROM {kind.table} WHERE vehicle_id IN ({_marks(vids)}) AND start<? AND end IS NOT NULL",
                        (*vids, before))
    return [_row(kind, r[1:], r[0]) for r in rows]


def any_before(conn: sqlite3.Connection, kind: Kind, vids: list[str], cut: int) -> bool:
    return conn.execute(f"SELECT 1 FROM {kind.table} WHERE vehicle_id IN ({_marks(vids)}) AND start<? LIMIT 1", (*vids, cut)).fetchone() is not None


def trip_points(conn: sqlite3.Connection) -> list[tuple]:
    """(vehicle_id, start, from_lat, from_lon, to_lat, to_lon) of every trip with a start or end point: the one way a trip's points leave."""
    return conn.execute("SELECT vehicle_id, start, from_lat, from_lon, to_lat, to_lon FROM trips"
                        " WHERE from_lat IS NOT NULL OR to_lat IS NOT NULL").fetchall()


def place(zone: str | None, spot: str | None) -> str | None:
    """How a charge is named: its zone, else the charge spot it lies in, else nothing."""
    return zone or spot


def relabel(conn: sqlite3.Connection, zones: Zones, spots: Zones) -> int:
    """Name every row again from its stored points: a trip's two ends by `zones`, a charge's zone by `zones` and its place by `place`.
    Rows without a point are left alone; returns the rows changed. One transaction, so call it outside one."""
    changed = 0
    with db.tx(conn):
        for vid, start, from_lat, from_lon, to_lat, to_lon in trip_points(conn):
            frm, to = (None if lat is None else zones(lat, lon) for lat, lon in ((from_lat, from_lon), (to_lat, to_lon)))
            changed += conn.execute("UPDATE trips SET from_place=?, to_place=? WHERE vehicle_id=? AND start=?"
                                    " AND (from_place IS NOT ? OR to_place IS NOT ?)", (frm, to, vid, start, frm, to)).rowcount
        for vid, start, lat, lon in conn.execute("SELECT vehicle_id, start, lat, lon FROM charges WHERE lat IS NOT NULL").fetchall():
            zone = zones(lat, lon)
            name = place(zone, None if zone else spots(lat, lon))
            changed += conn.execute("UPDATE charges SET zone=?, place=? WHERE vehicle_id=? AND start=? AND (zone IS NOT ? OR place IS NOT ?)",
                                    (zone, name, vid, start, zone, name)).rowcount
    return changed
