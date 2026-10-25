import itertools
import json
from datetime import datetime, timedelta

from car_insights import store
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


def seed_trip(conn, vid, start, end, *, series=None, route=None, algo=ALGO, **fields):
    """a stored trip row (end None: open) through the store, with the series and route rows when given; returns the row"""
    row = {"start": start, "end": end, **fields}
    store.insert(conn, TRIP, vid, row, series, route, algo)
    return row


def seed_charge(conn, vid, start, end, *, series=None, algo=ALGO, **fields):
    """a stored charge row (end None: open) through the store; returns the row"""
    row = {"start": start, "end": end, **fields}
    store.insert(conn, CHARGE, vid, row, series, None, algo)
    return row


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
