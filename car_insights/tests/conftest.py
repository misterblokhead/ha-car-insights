import itertools
import json

from car_insights.protocol import Sample

_seq = itertools.count(1)


def s(t, k, v):
    """a sample with the next global seq"""
    return Sample(next(_seq), t, k, v)


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
