"""Brings the add-on's export (database and options) into the integration's database on its first start. Plain files and SQLite, no Home Assistant."""
import json
import logging
import math
import os
import shutil
import sqlite3
from dataclasses import dataclass, field
from pathlib import Path

from .core import db
from .core.kinds import KINDS

log = logging.getLogger(__name__)

STALE_ALGO = -1  # no derivation version has this number, so the start-up rebuild derives every vehicle again


@dataclass
class ImportResult:
    imported: bool = False
    default_capacity_kwh: float | None = None
    cloud: dict[str, dict[str, str]] = field(default_factory=dict)  # entry id -> the cloud source for its options


def _options(path: Path, entries: dict[str, str]) -> tuple[float | None, dict[str, dict[str, str]]]:
    """(default capacity, entry id -> cloud source) from export.json; no file is no options. Raises on a file that does not fit."""
    if not path.exists():
        log.warning("%s is missing: the history is imported, the default capacity and cloud sources are not", path)
        return None, {}
    data = json.loads(path.read_text(encoding="utf-8"))
    kwh = data.get("default_capacity_kwh")
    if kwh is not None:
        kwh = float(kwh)
        if not (math.isfinite(kwh) and kwh > 0):
            raise ValueError(f"default_capacity_kwh must be a positive number, got {kwh!r}")
    cloud, skipped = {}, []
    for s in data.get("sources", []):
        if s["vehicle_id"] in entries:
            cloud[entries[s["vehicle_id"]]] = {"mapping": s["mapping"], "entity_stem": s["entity_stem"]}
        else:
            skipped.append(s["vehicle_id"])
    if skipped:
        log.warning("Not importing the cloud source of vehicles without an entry: %s", ", ".join(skipped))
    return kwh, cloud


def _prune(conn: sqlite3.Connection, keep: list[str]) -> set[str]:
    """Delete every row of every vehicle not in `keep`, in every table with a vehicle_id column (what keys to a vehicle is that column:
    groups, prices and addresses are not per vehicle). Returns the ids dropped. Derived rows of the others are marked for a rebuild."""
    tables = [t for (t,) in conn.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
              if any(c[1] == "vehicle_id" for c in conn.execute(f'PRAGMA table_info("{t}")'))]
    marks = ",".join("?" * len(keep))
    with db.tx(conn):
        dropped = {r[0] for t in tables for r in conn.execute(f'SELECT DISTINCT vehicle_id FROM "{t}" WHERE vehicle_id NOT IN ({marks})', keep)}
        for t in tables:
            conn.execute(f'DELETE FROM "{t}" WHERE vehicle_id NOT IN ({marks})', keep)
        for k in KINDS:
            conn.execute(f"UPDATE {k.table} SET algo=?", (STALE_ALGO,))
    conn.execute("VACUUM")  # the dropped vehicles' data must not linger in free pages
    return dropped


def _has_samples(path: Path) -> bool:
    conn = sqlite3.connect(path)  # a normal connection: closing it last clears the WAL a crash left
    try:
        return conn.execute("SELECT 1 FROM samples LIMIT 1").fetchone() is not None
    except sqlite3.OperationalError:  # no samples table: nothing of the owner's in it
        return False
    finally:
        conn.close()


def run(config_dir: Path, share_dir: Path, entries: dict[str, str]) -> ImportResult:
    """Import share_dir/car_insights/export.db unless config_dir/car_insights/car_insights.db holds samples (a missing or sample-less one, such as
    a failed import left behind, is replaced). `entries`: vehicle id -> entry id.
    Builds the database beside its final place and moves it in only when whole; raises on any failure with nothing left behind and the export untouched."""
    final = config_dir / "car_insights" / "car_insights.db"
    export = share_dir / "car_insights" / "export.db"
    if not export.exists() or (final.exists() and _has_samples(final)):
        return ImportResult()
    final.parent.mkdir(parents=True, exist_ok=True)
    kwh, cloud = _options(export.with_name("export.json"), entries)
    tmp = final.with_name(final.name + ".importing")
    sidecars = [tmp.with_name(tmp.name + s) for s in ("-wal", "-shm", "-journal")]
    try:
        for p in (tmp, *sidecars):  # what an interrupted earlier try left
            p.unlink(missing_ok=True)
        shutil.copyfile(export, tmp)
        conn = db.connect(str(tmp))  # runs the migrations
        try:
            dropped = _prune(conn, list(entries))
        finally:
            conn.close()
        for suffix in ("-wal", "-shm", "-journal"):  # the replaced database's, never to be applied to the new one
            final.with_name(final.name + suffix).unlink(missing_ok=True)
        os.replace(tmp, final)
    except BaseException:
        for p in (tmp, *sidecars):
            p.unlink(missing_ok=True)
        raise
    if dropped:
        log.warning("Not importing vehicles without an entry: %s", ", ".join(sorted(dropped)))
    try:
        os.replace(export, export.with_name("export.imported.db"))
    except OSError:
        log.warning("Imported %s, but could not rename it; it is ignored as long as the database exists", export, exc_info=True)
    return ImportResult(True, kwh, cloud)
