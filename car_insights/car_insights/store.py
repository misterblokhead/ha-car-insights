"""Every read of the derived tables (trips, charges, their series and routes), and the one place a stored row becomes a dict.
`derive` decides what the rows are; this module only knows how they are laid out."""
import json
import sqlite3

from . import db
from .kinds import KINDS, Kind

_ROUTES = "trip_routes"


def _row(js: str, vid: str | None = None) -> dict:
    d = json.loads(js)
    return d if vid is None else {**d, "vehicle_id": vid}


def _marks(vids: list[str]) -> str:
    return ",".join("?" * len(vids))


def _satellites(kind: Kind) -> list[str]:
    return [kind.series_table, *([_ROUTES] if kind.has_route else [])]


def insert(conn: sqlite3.Connection, kind: Kind, vid: str, row: dict, series: dict | None, route: list | None, algo: int) -> None:
    """Store a row with its series and, for a trip, its route (None: no such row)."""
    conn.execute(f"INSERT INTO {kind.table} VALUES(?,?,?,?,?)", (vid, row["start"], row["end"], algo, db.json_dumps(row)))
    if series is not None:
        conn.execute(f"INSERT INTO {kind.series_table} VALUES(?,?,?)", (vid, row["start"], db.json_dumps(series)))
    if kind.has_route and route is not None:
        conn.execute(f"INSERT INTO {_ROUTES} VALUES(?,?,?,?)", (vid, row["start"], algo, db.json_dumps(route)))


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


def stale_vehicles(conn: sqlite3.Connection, algo: int, everything: bool = False) -> set[str]:
    """Vehicles with a row of another derivation version in either table (every vehicle with a row when `everything`)."""
    return {r[0] for k in KINDS for r in conn.execute(f"SELECT vehicle_id FROM {k.table} WHERE algo!=? OR ?", (algo, everything))}


def current_trip(conn: sqlite3.Connection, vid: str) -> dict | None:
    r = conn.execute("SELECT json FROM trips WHERE vehicle_id=? AND end IS NULL", (vid,)).fetchone()
    return None if r is None else _row(r[0])


def has_open(conn: sqlite3.Connection, kind: Kind, vid: str) -> bool:
    return conn.execute(f"SELECT 1 FROM {kind.table} WHERE vehicle_id=? AND end IS NULL", (vid,)).fetchone() is not None


def open_trip_vehicles(conn: sqlite3.Connection) -> list[str]:
    return [r[0] for r in conn.execute("SELECT DISTINCT vehicle_id FROM trips WHERE end IS NULL")]


def closed(conn: sqlite3.Connection, kind: Kind, vid: str, limit: int = -1, since: int = 0) -> list[dict]:
    """Closed rows starting at or after `since`, newest first (limit -1: all)."""
    rows = conn.execute(f"SELECT json FROM {kind.table} WHERE vehicle_id=? AND end IS NOT NULL AND start>=? ORDER BY start DESC LIMIT ?",
                        (vid, since, limit))
    return [_row(r[0]) for r in rows]


def row(conn: sqlite3.Connection, kind: Kind, vid: str, start: int) -> dict | None:
    """One row, open or closed."""
    r = conn.execute(f"SELECT json FROM {kind.table} WHERE vehicle_id=? AND start=?", (vid, start)).fetchone()
    return None if r is None else _row(r[0])


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
    rows = conn.execute(f"SELECT json FROM {kind.table} WHERE vehicle_id=? AND end>=? AND (? IS NULL OR end<=?)", (vid, lo, hi, hi))
    return [_row(r[0]) for r in rows]


def rows_after(conn: sqlite3.Connection, kind: Kind, vid: str, w: int) -> dict[int, dict]:
    """start -> row of the rows that are open or end after `w`: what a window starting at `w` derives again."""
    rows = conn.execute(f"SELECT start, json FROM {kind.table} WHERE vehicle_id=? AND (end IS NULL OR end>?)", (vid, w))
    return {start: _row(js) for start, js in rows}


def straddling(conn: sqlite3.Connection, vid: str, w: int) -> list[int]:
    """Starts of the rows of either kind that begin at or before `w` and are open or end after it."""
    return [r[0] for k in KINDS for r in conn.execute(
        f"SELECT start FROM {k.table} WHERE vehicle_id=? AND (end IS NULL OR end>?) AND start<=?", (vid, w, w))]


def in_range(conn: sqlite3.Connection, kind: Kind, vids: list[str], lo: int, hi: int) -> list[dict]:
    """Closed rows of the vehicles with lo <= start < hi, oldest first, each with its vehicle_id."""
    rows = conn.execute(f"SELECT vehicle_id, json FROM {kind.table} WHERE vehicle_id IN ({_marks(vids)}) AND end IS NOT NULL"
                        " AND start>=? AND start<? ORDER BY start", (*vids, lo, hi))
    return [_row(js, vid) for vid, js in rows]


def sums(conn: sqlite3.Connection, kind: Kind, vids: list[str], lo: int, hi: int, fields: tuple[str, ...]) -> tuple:
    """The sums of `fields` over the closed rows with lo <= start < hi (a null counts as 0), then the number of rows."""
    cols = "".join(f"COALESCE(SUM(json_extract(json,'$.{f}')),0), " for f in fields)
    return conn.execute(f"SELECT {cols}COUNT(*) FROM {kind.table} WHERE vehicle_id IN ({_marks(vids)}) AND end IS NOT NULL"
                        " AND start>=? AND start<?", (*vids, lo, hi)).fetchone()


def charged_by_place(conn: sqlite3.Connection, vids: list[str], lo: int, hi: int) -> list[tuple[str | None, float]]:
    """(place, added Wh) of the closed charges with lo <= start < hi, one entry per place."""
    return [(p, float(wh)) for p, wh in conn.execute(
        f"SELECT json_extract(json,'$.place'), COALESCE(SUM(json_extract(json,'$.added_wh')),0) FROM charges"
        f" WHERE vehicle_id IN ({_marks(vids)}) AND end IS NOT NULL AND start>=? AND start<? GROUP BY 1", (*vids, lo, hi))]


def trip_distance_m(conn: sqlite3.Connection, vid: str, lo: int, hi: int) -> float:
    """Distance of the closed trips that start at or after `lo` and end at or before `hi`."""
    return conn.execute("SELECT COALESCE(SUM(json_extract(json,'$.distance_m')),0) FROM trips WHERE vehicle_id=? AND start>=? AND end<=?",
                        (vid, lo, hi)).fetchone()[0]


def first_trip_start(conn: sqlite3.Connection, vid: str, default: int) -> int:
    return conn.execute("SELECT COALESCE(MIN(start), ?) FROM trips WHERE vehicle_id=?", (default, vid)).fetchone()[0]


def similar(conn: sqlite3.Connection, vid: str, before: int, a: str, b: str, limit: int) -> list[dict]:
    """The newest closed trips that started before `before` from place `a` to place `b`."""
    rows = conn.execute("SELECT json FROM trips WHERE vehicle_id=? AND end IS NOT NULL AND start<? AND json_extract(json,'$.from')=?"
                        " AND json_extract(json,'$.to')=? ORDER BY start DESC LIMIT ?", (vid, before, a, b, limit))
    return [_row(r[0]) for r in rows]


def newest_starts(conn: sqlite3.Connection, kind: Kind, vids: list[str], limit: int) -> list[int]:
    """The starts of the `limit` newest rows of the vehicles, open ones included, newest first."""
    return [r[0] for r in conn.execute(f"SELECT start FROM {kind.table} WHERE vehicle_id IN ({_marks(vids)}) ORDER BY start DESC LIMIT ?",
                                       (*vids, limit))]


def open_starts(conn: sqlite3.Connection, kind: Kind, vids: list[str]) -> list[int]:
    return [r[0] for r in conn.execute(f"SELECT start FROM {kind.table} WHERE vehicle_id IN ({_marks(vids)}) AND end IS NULL", vids)]


def rows_from(conn: sqlite3.Connection, kind: Kind, vids: list[str], cut: int) -> list[dict]:
    """Rows of the vehicles starting at or after `cut`, open ones included, each with its vehicle_id."""
    rows = conn.execute(f"SELECT vehicle_id, json FROM {kind.table} WHERE vehicle_id IN ({_marks(vids)}) AND start>=?", (*vids, cut))
    return [_row(js, vid) for vid, js in rows]


def closed_before(conn: sqlite3.Connection, kind: Kind, vids: list[str], before: int) -> list[dict]:
    """Closed rows of the vehicles starting before `before`, each with its vehicle_id."""
    rows = conn.execute(f"SELECT vehicle_id, json FROM {kind.table} WHERE vehicle_id IN ({_marks(vids)}) AND start<? AND end IS NOT NULL",
                        (*vids, before))
    return [_row(js, vid) for vid, js in rows]


def any_before(conn: sqlite3.Connection, kind: Kind, vids: list[str], cut: int) -> bool:
    return conn.execute(f"SELECT 1 FROM {kind.table} WHERE vehicle_id IN ({_marks(vids)}) AND start<? LIMIT 1", (*vids, cut)).fetchone() is not None


def charge_points(conn: sqlite3.Connection) -> list[dict]:
    """Every charge that has a GPS point, each with its vehicle_id."""
    rows = conn.execute("SELECT vehicle_id, json FROM charges WHERE json_extract(json,'$.lat') IS NOT NULL")
    return [_row(js, vid) for vid, js in rows]


def set_place(conn: sqlite3.Connection, vid: str, start: int, place: str | None) -> None:
    conn.execute("UPDATE charges SET json=json_set(json,'$.place',?) WHERE vehicle_id=? AND start=?", (place, vid, start))
