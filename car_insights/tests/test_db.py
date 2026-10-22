import json

import pytest

from car_insights.db import acked_seq, connect, ingest, latest_per_key, vehicle
from car_insights.protocol import Sample

S = "car_app-0000abcd"


@pytest.fixture
def conn():
    return connect(":memory:")


def seqs(*n):
    return [Sample(i, i, "speed", 1.0) for i in n]


def stored_value(conn, seq):
    return json.loads(conn.execute("SELECT value_json FROM samples WHERE seq=?", (seq,)).fetchone()[0])


def test_contiguous_ack(conn):
    assert ingest(conn, "car1", S, seqs(1, 2, 3), 0) == 3


def test_hole_stops_ack(conn):
    assert ingest(conn, "car1", S, seqs(1, 2, 4), 0) == 2
    assert ingest(conn, "car1", S, seqs(3), 0) == 4


def test_duplicates_ignored(conn):
    ingest(conn, "car1", S, seqs(1, 2, 3), 0)
    assert ingest(conn, "car1", S, [Sample(2, 9, "speed", 99.0)], 0) == 3
    assert stored_value(conn, 2) == 1.0


def test_gap_marker_covers_range(conn):
    assert ingest(conn, "car1", S, [Sample(6, 0, "gap", {"from_seq": 1, "to_seq": 5})], 0) == 6


def test_gap_does_not_ack_past_hole(conn):
    # gap covers 3..5 but 2 is missing inside the batch
    assert ingest(conn, "car1", S, seqs(1) + [Sample(6, 0, "gap", {"from_seq": 3, "to_seq": 5})], 0) == 1


def test_new_source_starts_fresh(conn):
    ingest(conn, "car1", S, seqs(1, 2, 3), 0)
    assert ingest(conn, "car1", "car_app-ffff0000", seqs(1), 0) == 1
    assert acked_seq(conn, "car1", S) == 3


def test_meta_updates_vehicle(conn):
    ingest(conn, "car1", S, [Sample(1, 0, "meta", {"vehicle_name": "Test car", "props": [{"id": 1}]})], 0)
    v = vehicle(conn, "car1")
    assert v["name"] == "Test car" and v["meta"]["props"] == [{"id": 1}]
    assert vehicle(conn, "nope") is None


def test_newest_meta_wins(conn):
    ingest(conn, "car1", S, [Sample(1, 9, "meta", {"vehicle_name": "New"}), Sample(2, 3, "meta", {"vehicle_name": "Old"})], 0)
    assert vehicle(conn, "car1")["name"] == "New"


def test_ack_persists(tmp_path):
    c = connect(str(tmp_path / "x.db"))
    ingest(c, "car1", S, seqs(1, 2), 0)
    c.close()
    assert acked_seq(connect(str(tmp_path / "x.db")), "car1", S) == 2


def test_retried_gap_batch_adds_one_gap_row(conn):
    g = [Sample(6, 0, "gap", {"from_seq": 1, "to_seq": 5})]
    ingest(conn, "car1", S, g, 0)
    ingest(conn, "car1", S, g, 0)
    assert conn.execute("SELECT COUNT(*) FROM gaps").fetchone()[0] == 1


def test_mid_batch_failure_rolls_back(conn):
    ingest(conn, "car1", S, seqs(1), 0)
    with pytest.raises(KeyError):
        ingest(conn, "car1", S, [Sample(2, 2, "speed", 1.0), Sample(3, 3, "gap", {})], 0)
    assert conn.execute("SELECT COUNT(*) FROM samples").fetchone()[0] == 1
    assert acked_seq(conn, "car1", S) == 1


def test_lost_ack_state_floors_at_batch_start(conn):
    assert ingest(conn, "car1", S, seqs(*range(500, 600)), 0) == 599
    assert conn.execute("SELECT from_seq, to_seq FROM gaps").fetchall() == [(1, 499)]


def test_floor_after_prior_ack(conn):
    ingest(conn, "car1", S, seqs(1, 2, 3), 0)
    assert ingest(conn, "car1", S, seqs(10, 11, 12), 0) == 12


def test_tail_gap_does_not_stall_ack(conn):
    # car dropped 1..100; its gap row (seq 9000) is queued behind the backlog and not sent yet
    assert ingest(conn, "car1", S, seqs(*range(101, 201)), 0) == 200


def test_floor_ignores_holes_inside_batch(conn):
    assert ingest(conn, "car1", S, seqs(10, 11, 13), 0) == 11


def _version(c):
    return c.execute("PRAGMA user_version").fetchone()[0]


def test_fresh_db_sets_version_and_reopen_keeps_it(tmp_path):
    path = str(tmp_path / "m.db")
    c = connect(path)
    assert _version(c) == 2
    c.close()
    c = connect(path)
    assert _version(c) == 2


def test_newer_schema_refused(tmp_path):
    path = str(tmp_path / "m.db")
    connect(path).execute("PRAGMA user_version=99")
    with pytest.raises(RuntimeError):
        connect(path)


def test_unversioned_db_with_duplicate_gaps_is_upgraded(tmp_path):
    import sqlite3
    path = str(tmp_path / "old.db")
    old = sqlite3.connect(path)
    old.execute("CREATE TABLE gaps(vehicle_id TEXT, source_id TEXT, from_seq INTEGER, to_seq INTEGER)")
    old.executemany("INSERT INTO gaps VALUES('c','s',1,5)", [()] * 2)
    old.commit()
    old.close()
    c = connect(path)
    assert c.execute("SELECT COUNT(*) FROM gaps").fetchone()[0] == 1 and _version(c) == 2


def test_failed_migration_rolls_back_and_keeps_version(tmp_path, monkeypatch):
    import car_insights.db as db
    monkeypatch.setattr(db, "_MIGRATIONS", ["CREATE TABLE t1(a);", "CREATE TABLE t2(a); SELECT * FROM missing_table;"])
    path = str(tmp_path / "f.db")
    with pytest.raises(Exception):
        connect(path)
    import sqlite3
    c = sqlite3.connect(path)
    assert c.execute("PRAGMA user_version").fetchone()[0] == 1
    assert c.execute("SELECT name FROM sqlite_master WHERE name IN ('t1','t2')").fetchall() == [("t1",)]


def test_latest_per_key_newest_across_sources_and_bounded(conn):
    ingest(conn, "car1", S, [Sample(1, 5, "speed", 1.0), Sample(2, 9, "speed", 2.0), Sample(3, 1, "meta", {}), Sample(4, 100, "gps", [1])], 0)
    ingest(conn, "car1", "car_app-1111abcd", [Sample(1, 7, "speed", 3.0)], 0)
    ingest(conn, "car2", S, [Sample(1, 8, "speed", 4.0)], 0)
    got = {s.k: (s.t, s.v) for s in latest_per_key(conn, "car1", 50)}
    assert got == {"speed": (9, 2.0)}


def _plan(conn, run):
    """EXPLAIN QUERY PLAN of every statement `run` executes (traced with its parameters expanded)"""
    seen = []
    conn.set_trace_callback(seen.append)
    run()
    conn.set_trace_callback(None)
    return [" | ".join(r[3] for r in conn.execute("EXPLAIN QUERY PLAN " + q)) for q in seen if q.lstrip().startswith("SELECT")]


def test_derive_queries_use_indexes(conn):
    from car_insights.db import latest_at_or_before, samples_after
    ingest(conn, "car1", S, [Sample(1, 5, "speed", 1.0), Sample(2, 9, "gear", 1.0)], 0)
    (plan,) = _plan(conn, lambda: samples_after(conn, "car1", 3))
    assert "samples_vt" in plan and "SCAN samples" not in plan
    plans = _plan(conn, lambda: latest_at_or_before(conn, "car1", 50))
    assert plans and all("samples_vkt" in p and "SCAN samples" not in p for p in plans)


def test_latest_at_or_before_newest_per_derivation_key(conn):
    from car_insights.db import latest_at_or_before
    ingest(conn, "car1", S, [Sample(1, 5, "speed", 1.0), Sample(2, 9, "speed", 2.0), Sample(3, 9, "gear", 1.0),
                             Sample(4, 9, "gear", 4.0), Sample(5, 3, "meta", {}), Sample(6, 7, "gps", [1, 2]),
                             Sample(7, 8, "soc", 50.0), Sample(8, 100, "range_m", 9.0)], 0)
    ingest(conn, "car1", "car_app-1111abcd", [Sample(1, 8, "speed", 3.0)], 0)
    ingest(conn, "car2", S, [Sample(1, 8, "ignition", 4.0)], 0)
    # newest t wins (across sources), a tie on t goes to the higher seq, other keys and later samples are ignored
    assert latest_at_or_before(conn, "car1", 50) == {"speed": 2.0, "gear": 4.0, "gps": [1, 2]}
    assert latest_at_or_before(conn, "car1", 6) == {"speed": 1.0}
