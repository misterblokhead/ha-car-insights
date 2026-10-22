import json
import sqlite3
from typing import Sequence

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
"""]


def _json(v) -> str:
    return json.dumps(v, separators=(",", ":"))


def connect(path: str) -> sqlite3.Connection:
    conn = sqlite3.connect(path, check_same_thread=False, isolation_level=None)
    conn.execute("PRAGMA journal_mode=WAL")
    _migrate(conn)
    return conn


def _migrate(conn: sqlite3.Connection) -> None:
    version = conn.execute("PRAGMA user_version").fetchone()[0]
    if version > len(_MIGRATIONS):
        raise RuntimeError(f"database schema v{version} is newer than this add-on supports (v{len(_MIGRATIONS)})")
    for i in range(version, len(_MIGRATIONS)):
        try:  # user_version is transactional, so a step and its version bump commit together
            conn.executescript(f"BEGIN;{_MIGRATIONS[i]}PRAGMA user_version={i + 1};COMMIT;")
        except BaseException:
            if conn.in_transaction:
                conn.execute("ROLLBACK")
            raise


def acked_seq(conn, vehicle_id: str, source_id: str) -> int:
    r = conn.execute("SELECT acked_seq FROM sources WHERE vehicle_id=? AND source_id=?", (vehicle_id, source_id)).fetchone()
    return r[0] if r else 0


def vehicle(conn, vehicle_id: str) -> dict | None:
    r = conn.execute("SELECT name, meta_json FROM vehicles WHERE vehicle_id=?", (vehicle_id,)).fetchone()
    return None if r is None else {"name": r[0], "meta": json.loads(r[1]) if r[1] else None}


def latest_per_key(conn, vehicle_id: str, max_t: int) -> list[Sample]:
    """Newest stored sample per key across all sources, ignoring meta/gap and anything later than max_t (seq is 0)."""
    rows = conn.execute(
        "SELECT key, MAX(t), value_json FROM samples WHERE vehicle_id=? AND t<=? AND key NOT IN ('meta','gap') GROUP BY key",
        (vehicle_id, max_t),
    )
    return [Sample(0, t, k, json.loads(v)) for k, t, v in rows]


def samples_after(conn, vehicle_id: str, after_t: int) -> list[Sample]:
    """Samples with t > after_t across all sources, ignoring meta/gap, ordered by (t, seq)."""
    rows = conn.execute(
        "SELECT seq, t, key, value_json FROM samples WHERE vehicle_id=? AND t>? AND key NOT IN ('meta','gap') "
        "ORDER BY t, seq, source_id", (vehicle_id, after_t))
    return [Sample(seq, t, k, json.loads(v)) for seq, t, k, v in rows]


def latest_at_or_before(conn, vehicle_id: str, t: int) -> dict:
    """key -> value of the newest sample per key with sample t <= t."""
    return {s.k: s.v for s in latest_per_key(conn, vehicle_id, t)}


def has_key(conn, vehicle_id: str, key: str) -> bool:
    return conn.execute("SELECT 1 FROM samples WHERE vehicle_id=? AND key=? LIMIT 1", (vehicle_id, key)).fetchone() is not None


def ingest(conn, vehicle_id: str, source_id: str, samples: Sequence[Sample], received_ms: int) -> int:
    vid, sid = vehicle_id, source_id
    conn.execute("BEGIN IMMEDIATE")
    try:
        conn.execute("INSERT OR IGNORE INTO sources(vehicle_id, source_id, type) VALUES(?,?,?)", (vid, sid, sid.split("-")[0]))
        for s in samples:
            conn.execute("INSERT OR IGNORE INTO samples VALUES(?,?,?,?,?,?)", (vid, sid, s.seq, s.t, s.k, _json(s.v)))
            if s.k == "gap":  # the unique index makes retried batches idempotent
                conn.execute("INSERT OR IGNORE INTO gaps VALUES(?,?,?,?)", (vid, sid, s.v["from_seq"], s.v["to_seq"]))
        metas = [s for s in samples if s.k == "meta"]
        if metas:
            m = max(metas, key=lambda s: s.t)
            conn.execute(
                "INSERT INTO vehicles(vehicle_id, name, meta_json) VALUES(?,?,?) "
                "ON CONFLICT(vehicle_id) DO UPDATE SET name=excluded.name, meta_json=excluded.meta_json",
                (vid, m.v.get("vehicle_name"), _json(m.v)),
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
        conn.execute("COMMIT")
        return acked
    except BaseException:
        if conn.in_transaction:
            conn.execute("ROLLBACK")
        raise
