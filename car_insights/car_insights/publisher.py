import logging
import sqlite3
from typing import Callable, Protocol

from . import live
from . import db
from .protocol import Sample

log = logging.getLogger(__name__)


class Sink(Protocol):
    def publish(self, messages: list[tuple[str, str]], retain: bool = True) -> None: ...


class Publisher:
    """Turns ingested batches into live MQTT state and (re)announces discovery."""

    def __init__(self, conn: sqlite3.Connection, mqtt: Sink, capacity: Callable[[str], float]):
        self._conn, self._mqtt, self._capacity = conn, mqtt, capacity
        self._states: dict[str, live.LiveState] = {}
        self._announced: dict[str, set[str]] = {}
        self._device: dict[str, tuple] = {}  # (name, make, model) the announced fields were published with

    def on_ingested(self, vid: str, samples: list[Sample], received_ms: int) -> None:
        first = vid not in self._states
        state = self._states.setdefault(vid, live.LiveState())
        if first:
            # After a restart, on-change keys (gear, plugged, range...) are only re-sent when they change, so seed from storage.
            # The current batch is already stored; seeding includes it and apply below is a no-op for those rows, hence `first` forces a publish.
            live.apply(state, db.latest_per_key(self._conn, vid, received_ms + live.FUTURE_SLACK_MS), received_ms)
        changed, future = live.apply(state, samples, received_ms)
        changed = changed or (first and bool(state.values))
        if future:
            log.warning("batch for %s has %d samples timestamped more than 1 day ahead of arrival", vid, future)
        meta_seen = any(s.k == "meta" for s in samples)
        if not changed and not meta_seen:
            return
        snap = live.snapshot(state, self._capacity(vid))
        loc = live.location(state)
        fields = set(snap) | ({"location"} if loc is not None else set())
        announced = self._announced.setdefault(vid, set())
        msgs: list[tuple[str, str]] = []
        device = self._device.get(vid)
        if fields - announced or (meta_seen and announced):
            device = db.device_info(self._conn, vid)
            # a changed name/make/model re-announces everything already announced, so HA updates the device
            redo = fields | announced if device != self._device.get(vid) else fields - announced
            msgs += live.discovery_messages(vid, *device, redo)
        if changed:
            msgs.append(live.state_message(vid, snap))
            if loc is not None:
                msgs.append(live.location_message(vid, loc))
        if not msgs:
            return
        self._mqtt.publish(msgs)
        # shortcut: paho queues and never raises when disconnected, so a lost discovery is not retried
        announced |= fields
        if device is not None:
            self._device[vid] = device
