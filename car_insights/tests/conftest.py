import itertools
import json
import sqlite3
from datetime import datetime, timedelta

from car_insights import db, store
from car_insights.derive import ALGO
from car_insights.kinds import CHARGE, TRIP
from car_insights.protocol import Sample

_seq = itertools.count(1)


def s(t, k, v):
    """a sample with the next global seq"""
    return Sample(next(_seq), t, k, v)


def ms(iso: str) -> int:
    """epoch ms (floored) of an ISO time with offset"""
    return (datetime.fromisoformat(iso) - datetime.fromisoformat("1970-01-01T00:00:00+00:00")) // timedelta(milliseconds=1)


def paused(p):
    """one plug at p, a cloud charge paused for 3 min, the car reading in between: two cloud spans, both within snap reach of the plug"""
    m = 60_000
    return [s(p, "plugged", True), s(p, "battery_wh", 20_000),
            s(p + m, "charging_state", True), s(p + 3 * m, "charging_state", False),
            s(p + 4 * m, "battery_wh", 25_000), s(p + 6 * m, "charging_state", True),
            s(p + 60 * m, "charging_state", False), s(p + 61 * m, "battery_wh", 40_000)]


def plugged_then_cloud(p):
    """a short car-only plug that ended before a cloud charge began: a kept car span just before the cloud span"""
    m = 60_000
    return [s(p, "plugged", True), s(p + m, "plugged", False),
            s(p + 2 * m, "charging_state", True), s(p + 30 * m, "charging_state", False)]


def v6_database(path: str) -> sqlite3.Connection:
    """a database as the released 0.7.0 add-on left it: the first six migrations applied, user_version 6"""
    conn = sqlite3.connect(path, isolation_level=None)
    for migration in db._MIGRATIONS[:6]:
        for stmt in migration.split(";"):
            if stmt.strip():
                conn.execute(stmt)
    conn.execute("PRAGMA user_version=6")
    return conn


def seed_trip(conn, vid, start, end, *, series=None, route=None, algo=ALGO, **fields):
    """a stored trip row (end None: open) through the store, with the series and route rows when given; returns the row as read back"""
    store.insert(conn, TRIP, vid, {"start": start, "end": end, **fields}, series, route, algo)
    return store.row(conn, TRIP, vid, start)


def seed_charge(conn, vid, start, end, *, series=None, algo=ALGO, **fields):
    """a stored charge row (end None: open) through the store; returns the row as read back"""
    store.insert(conn, CHARGE, vid, {"start": start, "end": end, **fields}, series, None, algo)
    return store.row(conn, CHARGE, vid, start)


class FakeMqtt:
    """records published messages; usable as a Publisher/TripSensors sink"""

    def __init__(self):
        self.batches = []  # one list of (topic, payload) per publish call
        self.msgs = []  # (topic, payload, retain)

    def publish(self, messages, retain=True):
        self.batches.append(messages)
        self.msgs += [(t, p, retain) for t, p in messages]

    @property
    def topics(self):
        return [t for b in self.batches for t, _ in b]

    def on(self, topic):
        return [(json.loads(p), r) for t, p, r in self.msgs if t == topic]
