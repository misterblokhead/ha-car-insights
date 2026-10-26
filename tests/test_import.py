import hashlib
import hmac
import json
import logging
import sqlite3
import time
from pathlib import Path

import pytest
from homeassistant.helpers import issue_registry as ir
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.car_insights import importer, service
from custom_components.car_insights.const import DOMAIN
from custom_components.car_insights.core import db, store
from custom_components.car_insights.core.derive import ALGO
from custom_components.car_insights.core.kinds import TRIP
from custom_components.car_insights.core.protocol import Sample
from custom_components.car_insights.service import Service

SRC = "phone-0000abcd"
BATCH = json.dumps({"v": 1, "vehicle_id": "car1", "source_id": "car_app-0000abcd",
                    "samples": [{"seq": 1, "t": 1_000, "k": "speed", "v": 1.0}]}).encode()
OPTIONS = {"default_capacity_kwh": 52.5, "sources": [
    {"vehicle_id": "car1", "mapping": "renault", "entity_stem": "invented_zoe"},
    {"vehicle_id": "ghost", "mapping": "kia", "entity_stem": "invented_ev6"}]}


@pytest.fixture(autouse=True)
def custom_integrations(enable_custom_integrations):  # the service reads the manifest's version
    pass


@pytest.fixture
def share(tmp_path, monkeypatch):
    path = tmp_path / "share"
    (path / "car_insights").mkdir(parents=True)
    monkeypatch.setattr(service, "SHARE_DIR", path)
    return path


def _trip_samples(t0):
    n = iter(range(1, 1000))
    return [Sample(next(n), t, k, v) for t, k, v in [
        (t0, "ignition", 4.0), (t0, "gear", 1.0), (t0 + 500, "gps", [52.0, 5.0]),
        *[(t0 + t, "speed", 10.0) for t in range(0, 100_001, 1000)], (t0 + 110_000, "ignition", 2.0)]]


def make_export(share: Path, options=OPTIONS, migrations: int | None = None) -> Path:
    """an add-on export of two invented vehicles; `migrations` stops the schema early (an older add-on)"""
    path = share / "car_insights" / "export.db"
    if migrations is None:
        conn = db.connect(str(path))
    else:
        conn = sqlite3.connect(path, isolation_level=None)
        for m in db._MIGRATIONS[:migrations]:
            for stmt in filter(str.strip, m.split(";")):
                conn.execute(stmt)
        conn.execute(f"PRAGMA user_version={migrations}")
    t0 = int(time.time() * 1000) - 3 * 86_400_000
    for vid in ("car1", "ghost"):
        db.ingest(conn, vid, SRC, _trip_samples(t0), t0 + 200_000)
        conn.execute("INSERT INTO vehicles(vehicle_id, usable_capacity_wh) VALUES(?,?) ON CONFLICT(vehicle_id) DO UPDATE SET usable_capacity_wh=?",
                     (vid, 40_000, 40_000))
    if migrations is None:
        for vid in ("car1", "ghost"):  # derived rows of the current version, as the add-on left them
            store.insert(conn, TRIP, vid, {"start": t0, "end": t0 + 110_000, "distance_m": 999.0}, {"x": 1}, [[52.0, 5.0]], ALGO)
            conn.execute("INSERT INTO vehicle_viewers VALUES(?,?)", (vid, "invented-user"))
            conn.execute("INSERT INTO fixed_costs VALUES(?,?,?,?,?,?,NULL)", (f"fc-{vid}", vid, "Insurance", 50.0, "month", "2025-01-01"))
        conn.execute("INSERT INTO cost_groups VALUES('g1','Fleet')")
        conn.execute("UPDATE vehicles SET cost_group_id='g1' WHERE vehicle_id='ghost'")
    conn.close()
    if options is not None:
        (share / "car_insights" / "export.json").write_text(json.dumps(options))
    return path


def _vehicle_ids(path: Path) -> dict[str, set]:
    conn = sqlite3.connect(path)
    out = {}
    for (t,) in conn.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall():
        if any(c[1] == "vehicle_id" for c in conn.execute(f'PRAGMA table_info("{t}")')):
            out[t] = {r[0] for r in conn.execute(f'SELECT vehicle_id FROM "{t}"')}
    conn.close()
    return out


def test_import_happy_path(tmp_path, share, caplog):
    export = make_export(share)
    config = tmp_path / "config"
    with caplog.at_level(logging.INFO):
        result = importer.run(config, share, {"car1": "entry1"})
    assert result.imported
    assert result.default_capacity_kwh == 52.5
    assert result.cloud == {"entry1": {"mapping": "renault", "entity_stem": "invented_zoe"}}  # ghost's source has no entry
    assert "ghost" in caplog.text
    final = config / "car_insights" / "car_insights.db"
    ids = _vehicle_ids(final)
    assert ids["samples"] == ids["vehicles"] == ids["vehicle_viewers"] == ids["fixed_costs"] == {"car1"}
    assert all(v <= {"car1"} for v in ids.values())  # every table, derived ones included
    conn = db.connect(str(final))
    assert conn.execute("SELECT count(*) FROM samples WHERE vehicle_id='car1'").fetchone()[0] > 0
    assert conn.execute("SELECT count(*) FROM cost_groups").fetchone()[0] == 1  # not keyed to a vehicle: stays
    assert store.stale_vehicles(conn, ALGO) == {"car1"}  # derived rows marked for the start-up rebuild
    conn.close()
    assert not export.exists() and (export.parent / "export.imported.db").exists()
    assert sorted(p.name for p in final.parent.iterdir()) == ["car_insights.db"]  # no temp or WAL leftovers


def test_import_migrates_an_older_export(tmp_path, share):
    make_export(share, migrations=6)
    importer.run(tmp_path, share, {"car1": "e", "ghost": "e2"})
    conn = sqlite3.connect(tmp_path / "car_insights" / "car_insights.db")
    assert conn.execute("PRAGMA user_version").fetchone()[0] == len(db._MIGRATIONS)
    assert _vehicle_ids(tmp_path / "car_insights" / "car_insights.db")["samples"] == {"car1", "ghost"}


def test_import_without_entries_or_options(tmp_path, share):
    make_export(share, options=None)  # no export.json: the history alone is imported
    result = importer.run(tmp_path, share, {})
    assert result.imported and result.cloud == {} and result.default_capacity_kwh is None
    assert _vehicle_ids(tmp_path / "car_insights" / "car_insights.db")["samples"] == set()


def test_import_skips_without_export(tmp_path, share):
    result = importer.run(tmp_path, share, {"car1": "entry1"})
    assert not result.imported and result.cloud == {}
    assert not (tmp_path / "car_insights" / "car_insights.db").exists()


def _live_db(config: Path, vehicles: tuple[str, ...] = ("car1",), source: str = "car_app-0000abcd") -> Path:
    """the integration's database, as it is after the car uploaded to it: a sample is data"""
    final = config / "car_insights" / "car_insights.db"
    final.parent.mkdir(parents=True, exist_ok=True)
    conn = db.connect(str(final))
    for vid in vehicles:
        db.ingest(conn, vid, source, [Sample(1, 5_000, "meta", {"vehicle_name": f"Live {vid}"}), Sample(2, 5_000, "speed", 3.0), Sample(3, 6_000, "speed", 4.0)], 7_000)
    conn.close()
    return final


def test_late_export_merges_with_live_samples(tmp_path, share):
    export = make_export(share)
    final = _live_db(tmp_path, ("car1", "car3"))
    result = importer.run(tmp_path, share, {"car1": "e1", "ghost": "e2", "car3": "e3"})
    assert result.imported and result.cloud["e1"]["mapping"] == "renault"
    conn = db.connect(str(final))
    rows = lambda vid, src: conn.execute("SELECT count(*) FROM samples WHERE vehicle_id=? AND source_id LIKE ?", (vid, src + "%")).fetchone()[0]
    assert rows("car1", SRC) > 0 and rows("ghost", SRC) > 0  # the history
    assert rows("car1", "car_app") == rows("car3", "car_app") == 3  # what the car sent meanwhile
    assert db.vehicle(conn, "car3")["meta"] == {"vehicle_name": "Live car3"} and db.vehicle(conn, "car1")["meta"]["vehicle_name"] == "Live car1"
    assert db.acked_seq(conn, "car1", "car_app-0000abcd") == 3  # the car's ack survives, or the next batch would look like a gap
    assert conn.execute("SELECT count(*) FROM settings").fetchone()[0] == 0  # nothing else of the live database is carried
    assert store.stale_vehicles(conn, ALGO) == {"car1", "ghost"}  # derived rows: marked for the rebuild (car3 has none yet)
    conn.close()
    assert not export.exists() and (export.parent / "export.imported.db").exists()
    assert sorted(p.name for p in final.parent.iterdir()) == ["car_insights.db"]


def test_late_export_merge_is_idempotent_on_the_sample_key(tmp_path, share):
    make_export(share, options=None)
    final = _live_db(tmp_path, source=SRC)  # the same source and seqs as the export's: its rows win, none are doubled
    importer.run(tmp_path, share, {"car1": "e1", "ghost": "e2"})
    conn = db.connect(str(final))
    keys = conn.execute("SELECT count(*), count(DISTINCT source_id || seq) FROM samples WHERE vehicle_id='car1'").fetchone()
    assert keys[0] == keys[1]


def test_late_export_leaves_vehicles_without_entry_out(tmp_path, share):
    make_export(share)
    final = _live_db(tmp_path, ("car1", "stranger"))
    importer.run(tmp_path, share, {"car1": "e1"})
    assert _vehicle_ids(final)["samples"] == {"car1"}


def test_a_late_export_that_breaks_leaves_the_live_database_alone(tmp_path, share):
    export = make_export(share)
    export.write_bytes(b"not a database" * 100)
    final = _live_db(tmp_path)
    before = final.read_bytes()
    with pytest.raises(Exception):
        importer.run(tmp_path, share, {"car1": "e1"})
    assert final.read_bytes() == before and sorted(p.name for p in final.parent.iterdir()) == ["car_insights.db"]


@pytest.mark.parametrize("break_it", ["garbage", "newer schema", "bad capacity", "bad json"])
def test_broken_export_leaves_nothing_behind(tmp_path, share, break_it):
    export = make_export(share)
    if break_it == "garbage":
        export.write_bytes(b"not a database" * 100)
    elif break_it == "newer schema":
        c = sqlite3.connect(export)
        c.execute(f"PRAGMA user_version={len(db._MIGRATIONS) + 5}")
        c.close()
    elif break_it == "bad capacity":
        (export.parent / "export.json").write_text(json.dumps({**OPTIONS, "default_capacity_kwh": -1}))
    else:
        (export.parent / "export.json").write_text("{nope")
    before = export.read_bytes()
    with pytest.raises(Exception):
        importer.run(tmp_path, share, {"car1": "entry1"})
    assert export.read_bytes() == before and not (export.parent / "export.imported.db").exists()
    assert list((tmp_path / "car_insights").iterdir()) == []  # no database, no temp file, no WAL


async def test_service_imports_and_rederives(hass, share):
    entry = MockConfigEntry(domain=DOMAIN, data={"vehicle_id": "car1"}, options={"keep": 1})
    entry.add_to_hass(hass)
    other = MockConfigEntry(domain=DOMAIN, data={"vehicle_id": "car2"}, options={})  # no source in the export
    other.add_to_hass(hass)
    export = make_export(share)
    svc = await Service.acquire(hass)
    try:
        assert entry.options == {"keep": 1, "cloud": {"mapping": "renault", "entity_stem": "invented_zoe"}}
        assert other.options == {}
        assert svc.confs[0].mapping == "renault"  # the poller is built from the imported options
        assert ir.async_get(hass).async_get_issue(DOMAIN, "import_failed") is None

        def look(conn):
            return (db.default_capacity_kwh(conn), {r[0] for r in conn.execute("SELECT vehicle_id FROM samples")},
                    store.closed(conn, TRIP, "car1"), conn.execute("SELECT count(*) FROM trips WHERE algo!=?", (ALGO,)).fetchone()[0])
        capacity, vehicles, trips, stale = await hass.async_add_executor_job(lambda: svc.worker.call(look, svc.conn).result(10))
        assert capacity == 52.5 and vehicles == {"car1"}
        assert len(trips) == 1 and trips[0]["distance_m"] == 1000 and stale == 0  # derived again from the samples, not carried over
        assert (export.parent / "export.imported.db").exists()
    finally:
        await Service.release(hass)


async def test_broken_export_raises_repair_and_starts_empty(hass, share):
    export = share / "car_insights" / "export.db"
    export.write_bytes(b"not a database" * 100)
    svc = await Service.acquire(hass)
    try:
        issue = ir.async_get(hass).async_get_issue(DOMAIN, "import_failed")
        assert issue is not None and issue.translation_key == "import_failed" and not issue.is_fixable
        assert issue.severity == ir.IssueSeverity.ERROR and issue.translation_placeholders["error"]
        count = await hass.async_add_executor_job(lambda: svc.worker.call(lambda c: c.execute("SELECT count(*) FROM samples").fetchone()[0], svc.conn).result(10))
        assert count == 0
        assert export.read_bytes() == b"not a database" * 100  # untouched, for a retry
    finally:
        await Service.release(hass)


async def test_failed_then_fixed_export_imports_on_restart(hass, share):
    MockConfigEntry(domain=DOMAIN, data={"vehicle_id": "car1"}).add_to_hass(hass)
    export = share / "car_insights" / "export.db"
    export.write_bytes(b"not a database")
    await Service.acquire(hass)
    assert ir.async_get(hass).async_get_issue(DOMAIN, "import_failed") is not None
    await Service.release(hass)
    assert Path(hass.config.path("car_insights", "car_insights.db")).exists()  # the empty start
    export.unlink()
    make_export(share)  # the owner fixed the export
    svc = await Service.acquire(hass)
    try:
        assert ir.async_get(hass).async_get_issue(DOMAIN, "import_failed") is None
        count = await hass.async_add_executor_job(lambda: svc.worker.call(lambda c: c.execute("SELECT count(*) FROM samples").fetchone()[0], svc.conn).result(10))
        assert count > 0 and (export.parent / "export.imported.db").exists()
    finally:
        await Service.release(hass)


async def test_failed_import_then_uploads_then_retry_merges(hass, share):
    MockConfigEntry(domain=DOMAIN, data={"vehicle_id": "car1"}).add_to_hass(hass)
    export = share / "car_insights" / "export.db"
    export.write_bytes(b"not a database")
    svc = await Service.acquire(hass)
    assert ir.async_get(hass).async_get_issue(DOMAIN, "import_failed") is not None
    assert (await svc.ingest(BATCH, 2_000))[0] == 200  # the car already uploads to the new URL
    await Service.release(hass)
    export.unlink()
    make_export(share)  # the owner fixed the export
    svc = await Service.acquire(hass)
    try:
        assert ir.async_get(hass).async_get_issue(DOMAIN, "import_failed") is None
        count = lambda src: hass.async_add_executor_job(lambda: svc.worker.call(
            lambda c: c.execute("SELECT count(*) FROM samples WHERE source_id LIKE ?", (src + "%",)).fetchone()[0], svc.conn).result(10))
        assert await count("car_app") == 1 and await count(SRC) > 0  # the upload and the history
        assert (await svc.ingest(BATCH, 3_000))[1]["acked_seq"] == 1  # the car's ack is still known
    finally:
        await Service.release(hass)


@pytest.mark.parametrize("how", ["not sqlite", "locked"])
def test_unreadable_database_is_never_replaced(tmp_path, share, monkeypatch, how):
    export = make_export(share)
    final = tmp_path / "car_insights" / "car_insights.db"
    final.parent.mkdir()
    if how == "not sqlite":
        final.write_bytes(b"the owner's data, unreadable" * 50)
    else:
        db.connect(str(final)).close()

        def locked(*a, **k):
            raise sqlite3.OperationalError("database is locked")

        monkeypatch.setattr(importer.sqlite3, "connect", locked)
    before = final.read_bytes()
    with pytest.raises(sqlite3.Error):
        importer.run(tmp_path, share, {"car1": "e"})
    assert final.read_bytes() == before and export.exists() and not (export.parent / "export.imported.db").exists()
    assert sorted(p.name for p in final.parent.iterdir()) == ["car_insights.db"]


def test_empty_database_is_replaced(tmp_path, share):
    make_export(share)
    final = tmp_path / "car_insights" / "car_insights.db"
    final.parent.mkdir()
    db.connect(str(final)).close()  # migrated, no samples
    final.with_name(final.name + "-wal").write_bytes(b"stale")  # a crash's leftover must not meet the new file
    assert importer.run(tmp_path, share, {"car1": "e"}).imported
    assert sorted(p.name for p in final.parent.iterdir()) == ["car_insights.db"]
    assert _vehicle_ids(final)["samples"] == {"car1"}


async def test_removed_entry_is_skipped(hass, share, monkeypatch, caplog):
    make_export(share)
    entry = MockConfigEntry(domain=DOMAIN, data={"vehicle_id": "car1"})
    entry.add_to_hass(hass)
    monkeypatch.setattr(hass.config_entries, "async_get_entry", lambda entry_id: None)
    await Service.acquire(hass)
    await Service.release(hass)
    assert "removed meanwhile" in caplog.text and "cloud" not in entry.options


SECRET = "invented-secret-0123"


async def test_fresh_install_starts_empty(enable_custom_integrations, hass, share, hass_client, hass_client_no_auth):
    hass.config.external_url = "https://ci.example.test"
    entry = MockConfigEntry(domain=DOMAIN, title="Invented car", data={
        "vehicle_id": "car1", "vehicle_name": "Invented car", "secret": SECRET, "webhook_id": "invented_webhook_id"})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    assert ir.async_get(hass).async_get_issue(DOMAIN, "import_failed") is None
    admin = await hass_client()
    activity = "/api/car_insights/ui/activity?view=v:car1"
    assert (await admin.get(activity)).status == 404  # nothing stored: the vehicle is not known yet
    t0 = int(time.time() * 1000) - 200_000
    body = json.dumps({"v": 1, "vehicle_id": "car1", "source_id": SRC, "samples": [
        {"seq": s.seq, "t": s.t, "k": s.k, "v": s.v} for s in [*_trip_samples(t0), Sample(500, t0, "meta", {"vehicle_name": "Invented car"})]]}).encode()
    sig = "sha256=" + hmac.new(SECRET.encode(), body, hashlib.sha256).hexdigest()
    resp = await (await hass_client_no_auth()).post("/api/webhook/invented_webhook_id", data=body, headers={"X-CI-Vehicle": "car1", "X-CI-Signature": sig})
    assert resp.status == 200
    days = (await (await admin.get(activity)).json())["days"]
    assert len(days) == 1 and len(days[0]["items"]) == 1
    await hass.config_entries.async_unload(entry.entry_id)
