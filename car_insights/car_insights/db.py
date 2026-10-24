import json
import sqlite3
from contextlib import contextmanager
from typing import Callable, Iterator, Sequence

from .protocol import Sample

# Ordered migrations: index i upgrades user_version i -> i+1. Never edit a released entry, append instead.
_MIGRATIONS = ["""
CREATE TABLE IF NOT EXISTS samples(vehicle_id TEXT, source_id TEXT, seq INTEGER, t INTEGER, key TEXT, value_json TEXT,
  PRIMARY KEY(vehicle_id, source_id, seq));
CREATE INDEX IF NOT EXISTS samples_vkt ON samples(vehicle_id, key, t);
CREATE TABLE IF NOT EXISTS sources(vehicle_id TEXT, source_id TEXT, type TEXT, mapping TEXT, enabled INTEGER DEFAULT 1,
  acked_seq INTEGER DEFAULT 0, last_received_ms INTEGER, PRIMARY KEY(vehicle_id, source_id));
CREATE TABLE IF NOT EXISTS vehicles(vehicle_id TEXT PRIMARY KEY, name TEXT, meta_json TEXT, usable_capacity_wh REAL,
  cost_group_id TEXT);
CREATE TABLE IF NOT EXISTS gaps(vehicle_id TEXT, source_id TEXT, from_seq INTEGER, to_seq INTEGER);
DELETE FROM gaps WHERE rowid NOT IN (SELECT MIN(rowid) FROM gaps GROUP BY vehicle_id, source_id, from_seq, to_seq);
CREATE UNIQUE INDEX IF NOT EXISTS gaps_uniq ON gaps(vehicle_id, source_id, from_seq, to_seq);
""", """
CREATE TABLE trips(vehicle_id TEXT, start INTEGER, end INTEGER, algo INTEGER, json TEXT, PRIMARY KEY(vehicle_id, start));
CREATE TABLE charges(vehicle_id TEXT, start INTEGER, end INTEGER, algo INTEGER, json TEXT, PRIMARY KEY(vehicle_id, start));
CREATE INDEX IF NOT EXISTS samples_vt ON samples(vehicle_id, t);
CREATE INDEX IF NOT EXISTS trips_ve ON trips(vehicle_id, end);
CREATE INDEX IF NOT EXISTS charges_ve ON charges(vehicle_id, end);
""", """
CREATE TABLE source_cursors(vehicle_id TEXT, source_id TEXT, entity_id TEXT, last_changed_ms INTEGER,
  PRIMARY KEY(vehicle_id, source_id, entity_id));
""", """
CREATE TABLE cost_groups(group_id TEXT PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE vehicle_viewers(vehicle_id TEXT, user_id TEXT, PRIMARY KEY(vehicle_id, user_id));
CREATE TABLE seen_users(user_id TEXT PRIMARY KEY, name TEXT, last_seen_ms INTEGER);
CREATE TABLE trip_series(vehicle_id TEXT, start INTEGER, json TEXT, PRIMARY KEY(vehicle_id, start));
CREATE TABLE charge_series(vehicle_id TEXT, start INTEGER, json TEXT, PRIMARY KEY(vehicle_id, start));
""", """
CREATE TABLE trip_routes(vehicle_id TEXT, start INTEGER, algo INTEGER, points TEXT, PRIMARY KEY(vehicle_id, start));
"""]


def json_dumps(v) -> str:
    return json.dumps(v, separators=(",", ":"))


@contextmanager
def tx(conn: sqlite3.Connection) -> Iterator[None]:
    """One immediate write transaction: commit on success, roll back on any exception."""
    conn.execute("BEGIN IMMEDIATE")
    try:
        yield
        conn.execute("COMMIT")
    except BaseException:
        if conn.in_transaction:
            conn.execute("ROLLBACK")
        raise


def connect(path: str) -> sqlite3.Connection:
    conn = sqlite3.connect(path, check_same_thread=False, isolation_level=None)
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA synchronous=FULL")  # FULL: the ack makes the car delete its copy, so a commit must reach the disk first
    _migrate(conn)
    return conn


def _migrate(conn: sqlite3.Connection) -> None:
    version = conn.execute("PRAGMA user_version").fetchone()[0]
    if version > len(_MIGRATIONS):
        raise RuntimeError(f"database schema v{version} is newer than this add-on supports (v{len(_MIGRATIONS)})")
    for i in range(version, len(_MIGRATIONS)):
        with tx(conn):  # user_version is transactional, so a step and its version bump commit together
            for stmt in _MIGRATIONS[i].split(";"):  # executescript would commit first; no migration holds a ';' inside a literal
                if stmt.strip():
                    conn.execute(stmt)
            conn.execute(f"PRAGMA user_version={i + 1}")


def acked_seq(conn, vehicle_id: str, source_id: str) -> int:
    r = conn.execute("SELECT acked_seq FROM sources WHERE vehicle_id=? AND source_id=?", (vehicle_id, source_id)).fetchone()
    return r[0] if r else 0


def vehicle(conn, vehicle_id: str) -> dict | None:
    r = conn.execute("SELECT name, meta_json FROM vehicles WHERE vehicle_id=?", (vehicle_id,)).fetchone()
    return None if r is None else {"name": r[0], "meta": json.loads(r[1]) if r[1] else None}


def capacity_wh(conn, vehicle_id: str, default_wh: float) -> float:
    r = conn.execute("SELECT usable_capacity_wh FROM vehicles WHERE vehicle_id=?", (vehicle_id,)).fetchone()
    return r[0] if r and r[0] else default_wh


def set_capacity_wh(conn, vehicle_id: str, wh: float) -> None:
    conn.execute("INSERT INTO vehicles(vehicle_id, usable_capacity_wh) VALUES(?,?) "
                 "ON CONFLICT(vehicle_id) DO UPDATE SET usable_capacity_wh=excluded.usable_capacity_wh", (vehicle_id, wh))


def device_info(conn, vehicle_id: str) -> tuple[str, str | None, str | None]:
    """(name, make, model) of the HA device for a vehicle; the name falls back to the vehicle id."""
    meta = (vehicle(conn, vehicle_id) or {}).get("meta") or {}
    return (meta.get("vehicle_name") or vehicle_id, meta.get("make"), meta.get("model"))


def latest_per_key(conn, vehicle_id: str, max_t: int) -> list[Sample]:
    """Newest stored sample per key across all sources, ignoring meta/gap and anything later than max_t (seq is 0)."""
    rows = conn.execute(
        "SELECT key, MAX(t), value_json FROM samples WHERE vehicle_id=? AND t<=? AND key NOT IN ('meta','gap') GROUP BY key",
        (vehicle_id, max_t),
    )
    return [Sample(0, t, k, json.loads(v)) for k, t, v in rows]


def samples_after(conn, vehicle_id: str, after_t: int, max_t: int, keys: Sequence[str]) -> list[Sample]:
    """Samples of the given keys with after_t < t <= max_t across all sources, ordered by (t, seq)."""
    rows = conn.execute(
        f"SELECT seq, t, key, value_json FROM samples WHERE vehicle_id=? AND t>? AND t<=? AND key IN ({','.join('?' * len(keys))}) "
        "ORDER BY t, seq, source_id", (vehicle_id, after_t, max_t, *keys))
    return [Sample(seq, t, k, json.loads(v)) for seq, t, k, v in rows]


def latest_at_or_before(conn, vehicle_id: str, t: int, keys: Sequence[str]) -> dict:
    """key -> value of the newest sample (ties: highest seq) of each given key with sample t <= t.
    One indexed lookup per key; latest_per_key would scan the vehicle's whole history."""
    out = {}
    for k in keys:
        r = conn.execute("SELECT value_json FROM samples WHERE vehicle_id=? AND key=? AND t<=? ORDER BY t DESC, seq DESC LIMIT 1",
                         (vehicle_id, k, t)).fetchone()
        if r is not None:
            out[k] = json.loads(r[0])
    return out


def latest_t(conn, vehicle_id: str, key: str, t: int) -> int | None:
    """t of the newest sample of key with sample t <= t, or None."""
    r = conn.execute("SELECT MAX(t) FROM samples WHERE vehicle_id=? AND key=? AND t<=?", (vehicle_id, key, t)).fetchone()
    return r[0]


def has_key(conn, vehicle_id: str, key: str) -> bool:
    return conn.execute("SELECT 1 FROM samples WHERE vehicle_id=? AND key=? LIMIT 1", (vehicle_id, key)).fetchone() is not None


def car_last_received(conn, vehicle_id: str) -> int | None:
    """When the vehicle's own senders (not a polled cloud source) last delivered a batch, or None."""
    return conn.execute("SELECT MAX(last_received_ms) FROM sources WHERE vehicle_id=? AND type!='ha_entities'", (vehicle_id,)).fetchone()[0]


def cursors(conn, vehicle_id: str, source_id: str) -> dict[str, int]:
    """entity id -> last_changed (epoch ms) of the newest history row a polled source has consumed"""
    return dict(conn.execute("SELECT entity_id, last_changed_ms FROM source_cursors WHERE vehicle_id=? AND source_id=?",
                             (vehicle_id, source_id)))


def save_cursors(conn, vehicle_id: str, source_id: str, cur: dict[str, int]) -> None:
    conn.executemany("INSERT OR REPLACE INTO source_cursors VALUES(?,?,?,?)", [(vehicle_id, source_id, e, t) for e, t in cur.items()])


def ingest(conn, vehicle_id: str, source_id: str, samples: Sequence[Sample], received_ms: int,
           after: Callable[[sqlite3.Connection], None] | None = None) -> int:
    """Store a batch and advance the ack. `after` runs in the same transaction just before the commit (a poller saves its cursor there)."""
    vid, sid = vehicle_id, source_id
    with tx(conn):
        conn.execute("INSERT OR IGNORE INTO sources(vehicle_id, source_id, type) VALUES(?,?,?)", (vid, sid, sid.split("-")[0]))
        for s in samples:
            conn.execute("INSERT OR IGNORE INTO samples VALUES(?,?,?,?,?,?)", (vid, sid, s.seq, s.t, s.k, json_dumps(s.v)))
            if s.k == "gap":  # the unique index makes retried batches idempotent
                conn.execute("INSERT OR IGNORE INTO gaps VALUES(?,?,?,?)", (vid, sid, s.v["from_seq"], s.v["to_seq"]))
        metas = [s for s in samples if s.k == "meta"]
        if metas:
            m = max(metas, key=lambda s: s.t)
            conn.execute(
                "INSERT INTO vehicles(vehicle_id, name, meta_json) VALUES(?,?,?) "
                "ON CONFLICT(vehicle_id) DO UPDATE SET name=excluded.name, meta_json=excluded.meta_json",
                (vid, m.v.get("vehicle_name"), json_dumps(m.v)),
            )
        acked = acked_seq(conn, vid, sid)
        # the sender never sends a seq while holding a lower unacked one, so everything below the batch is resolved
        floor = min((s.seq for s in samples), default=0) - 1
        if floor > acked:
            conn.execute("INSERT OR IGNORE INTO gaps VALUES(?,?,?,?)", (vid, sid, acked + 1, floor))
            acked = floor
        seqs = {r[0] for r in conn.execute("SELECT seq FROM samples WHERE vehicle_id=? AND source_id=? AND seq>?", (vid, sid, acked))}
        gaps = sorted(conn.execute("SELECT from_seq, to_seq FROM gaps WHERE vehicle_id=? AND source_id=? AND to_seq>?", (vid, sid, acked)))
        while True:
            nxt = acked + 1
            if nxt in seqs:
                acked = nxt
                continue
            covering = [g for g in gaps if g[0] <= nxt <= g[1]]
            if covering:
                acked = max(g[1] for g in covering)
                continue
            break
        conn.execute("UPDATE sources SET acked_seq=?, last_received_ms=? WHERE vehicle_id=? AND source_id=?", (acked, received_ms, vid, sid))
        if after:
            after(conn)
    return acked
