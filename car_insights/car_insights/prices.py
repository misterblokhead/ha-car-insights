"""Charging prices: tariffs per charge target, learned charge spots, receipts, fixed costs and the card surcharge."""
import math
import uuid
from dataclasses import dataclass, field
from datetime import date

from . import db, store
from .kinds import CHARGE
from .zones import Zone, name_at

SPOT_RADIUS_M = 100
_PERIODS = ("month", "quarter", "year", "once")
_YEARS = (2000, 2100)  # beyond it the day-by-day cost sums would overflow or run for ages


def _num(v: float, hi: float, what: str) -> float:
    if not (math.isfinite(v) and 0 <= v <= hi):
        raise ValueError(f"{what} must be between 0 and {hi:g}")
    return v


def _name(name: str) -> str:
    name = name.strip()
    if not 1 <= len(name) <= 40:
        raise ValueError("name must be 1-40 characters")
    return name


def _year(d: date | None, what: str) -> None:
    if d is not None and not _YEARS[0] <= d.year <= _YEARS[1]:
        raise ValueError(f"{what} must be in the years {_YEARS[0]}-{_YEARS[1]}")


def _tariff_row(r) -> dict:
    return {"valid_from": r[0], "per_kwh": r[1], "start_fee": r[2], "per_min": r[3]}


def set_tariff(conn, target: str, valid_from: int, per_kwh: float, start_fee: float = 0, per_min: float = 0) -> None:
    _num(per_kwh, 5, "per_kwh"), _num(start_fee, 1000, "start_fee"), _num(per_min, 1000, "per_min")
    if target not in ("ac", "dc") and conn.execute("SELECT 1 FROM charge_spots WHERE spot_id=?", (target,)).fetchone() is None:
        raise KeyError(target)
    conn.execute("INSERT INTO tariffs VALUES(?,?,?,?,?) ON CONFLICT(target, valid_from) DO UPDATE SET "
                 "per_kwh=excluded.per_kwh, start_fee=excluded.start_fee, per_min=excluded.per_min",
                 (target, valid_from, per_kwh, start_fee, per_min))


def _spot_in(rows: list[tuple], lat: float, lon: float) -> tuple[str, str] | None:
    """rows: (spot_id, name, lat, lon, radius_m); the nearest spot whose radius holds the point."""
    sid = name_at([Zone(s, la, lo, r) for s, _, la, lo, r in rows], lat, lon)  # the zone name is the spot id
    return None if sid is None else next((s, n) for s, n, *_ in rows if s == sid)


def spot_name_at(conn, lat: float, lon: float) -> str | None:
    hit = _spot_in(conn.execute("SELECT spot_id, name, lat, lon, radius_m FROM charge_spots").fetchall(), lat, lon)
    return hit and hit[1]


def relabel(conn) -> None:
    """A charge shows its zone, else the spot it lies in, else nothing."""
    for c in store.charge_points(conn):
        new = c.get("zone") or spot_name_at(conn, c["lat"], c["lon"])
        if new != c.get("place"):
            store.set_place(conn, c["vehicle_id"], c["start"], new)


def create_spot(conn, vid: str, start: int, name: str, per_kwh: float, start_fee: float = 0, per_min: float = 0) -> str:
    name = _name(name)
    c = store.row(conn, CHARGE, vid, start)
    if c is None:
        raise KeyError(start)
    if c.get("lat") is None:
        raise ValueError("this charge has no GPS point")
    sid = uuid.uuid4().hex[:8]
    with db.tx(conn):
        conn.execute("INSERT INTO charge_spots VALUES(?,?,?,?,?)", (sid, name, c["lat"], c["lon"], SPOT_RADIUS_M))
        set_tariff(conn, sid, start, per_kwh, start_fee, per_min)  # a bad price rolls the spot back
        relabel(conn)
    return sid


def rename_spot(conn, spot_id: str, name: str) -> None:
    name = _name(name)
    with db.tx(conn):
        if conn.execute("UPDATE charge_spots SET name=? WHERE spot_id=?", (name, spot_id)).rowcount == 0:
            raise KeyError(spot_id)
        relabel(conn)


def delete_spot(conn, spot_id: str) -> None:
    with db.tx(conn):
        if conn.execute("DELETE FROM charge_spots WHERE spot_id=?", (spot_id,)).rowcount == 0:
            raise KeyError(spot_id)
        conn.execute("DELETE FROM tariffs WHERE target=?", (spot_id,))
        relabel(conn)


def set_receipt(conn, vid: str, start: int, amount: float | None) -> None:
    if amount is not None:
        _num(amount, 1000, "amount")
    c = store.row(conn, CHARGE, vid, start)
    if c is None:
        raise KeyError(start)
    with db.tx(conn):  # every receipt in the span goes: receipt_for reads the newest one, a charge re-derived earlier may hold an old one
        conn.execute("DELETE FROM charge_receipts WHERE vehicle_id=? AND start>=? AND (? IS NULL OR start<=?)", (vid, start, c["end"], c["end"]))
        if amount is not None:
            conn.execute("INSERT INTO charge_receipts VALUES(?,?,?)", (vid, start, amount))


def add_fixed_cost(conn, vid: str, name: str, amount: float, period: str, start: date, end: date | None) -> str:
    name = _name(name)
    _num(amount, 100_000, "amount")
    if period not in _PERIODS:
        raise ValueError(f"period must be one of {', '.join(_PERIODS)}")
    _year(start, "start"), _year(end, "end")
    if end is not None and end < start:
        raise ValueError("end must not be before start")
    if conn.execute("SELECT 1 FROM vehicles WHERE vehicle_id=?", (vid,)).fetchone() is None:
        raise KeyError(vid)
    cid = uuid.uuid4().hex[:8]
    conn.execute("INSERT INTO fixed_costs VALUES(?,?,?,?,?,?,?)",
                 (cid, vid, name, amount, period, start.isoformat(), end and end.isoformat()))
    return cid


def end_fixed_cost(conn, cost_id: str, end: date | None) -> str:
    r = conn.execute("SELECT vehicle_id, start FROM fixed_costs WHERE cost_id=?", (cost_id,)).fetchone()
    if r is None:
        raise KeyError(cost_id)
    _year(end, "end")
    if end is not None and end.isoformat() < r[1]:
        raise ValueError("end must not be before start")
    conn.execute("UPDATE fixed_costs SET end=? WHERE cost_id=?", (end and end.isoformat(), cost_id))
    return r[0]


def delete_fixed_cost(conn, cost_id: str) -> str:
    r = conn.execute("SELECT vehicle_id FROM fixed_costs WHERE cost_id=?", (cost_id,)).fetchone()
    if r is None:
        raise KeyError(cost_id)
    conn.execute("DELETE FROM fixed_costs WHERE cost_id=?", (cost_id,))
    return r[0]


def set_card(conn, vid: str, markup_pct: float, start_fee: float) -> None:
    _num(markup_pct, 100, "markup_pct"), _num(start_fee, 1000, "start_fee")
    if conn.execute("UPDATE vehicles SET card_markup_pct=?, card_start_fee=? WHERE vehicle_id=?", (markup_pct, start_fee, vid)).rowcount == 0:
        raise KeyError(vid)


@dataclass
class Book:
    """One vehicle's prices, loaded once: pricing a charge then needs no database."""
    tariffs: dict[str, list[dict]] = field(default_factory=dict)  # per target (ac, dc, a spot id), newest first
    spots: list[tuple] = field(default_factory=list)  # (spot_id, name, lat, lon, radius_m)
    receipts: list[tuple[int, float]] = field(default_factory=list)  # (start, amount), newest start first
    card: tuple[float, float] = (0.0, 0.0)  # (markup_pct, start_fee)

    def tariff_at(self, target: str, t: int) -> dict | None:
        return next((r for r in self.tariffs.get(target, ()) if r["valid_from"] <= t), None)

    def spot_at(self, lat: float, lon: float) -> tuple[str, str] | None:
        return _spot_in(self.spots, lat, lon)

    def receipt_for(self, start: int, end: int | None) -> float | None:
        """A receipt keeps the start it was saved with, so a charge re-derived with an earlier start still finds it."""
        return next((a for s, a in self.receipts if s >= start and (end is None or s <= end)), None)


def book(conn, vid: str) -> Book:
    tariffs: dict[str, list[dict]] = {}
    for target, *row in conn.execute("SELECT target, valid_from, per_kwh, start_fee, per_min FROM tariffs ORDER BY valid_from DESC"):
        tariffs.setdefault(target, []).append(_tariff_row(row))
    c = conn.execute("SELECT card_markup_pct, card_start_fee FROM vehicles WHERE vehicle_id=?", (vid,)).fetchone()
    return Book(tariffs, conn.execute("SELECT spot_id, name, lat, lon, radius_m FROM charge_spots").fetchall(),
                conn.execute("SELECT start, amount FROM charge_receipts WHERE vehicle_id=? ORDER BY start DESC", (vid,)).fetchall(),
                (float(c[0]), float(c[1])) if c else (0.0, 0.0))


def _tariffs(conn, target: str) -> list[dict]:
    return [_tariff_row(r) for r in conn.execute(
        "SELECT valid_from, per_kwh, start_fee, per_min FROM tariffs WHERE target=? ORDER BY valid_from DESC", (target,))]


def settings(conn) -> dict:
    spots = [{"id": s, "name": n, "lat": la, "lon": lo, "radius_m": r, "tariffs": _tariffs(conn, s)}
             for s, n, la, lo, r in conn.execute("SELECT spot_id, name, lat, lon, radius_m FROM charge_spots ORDER BY lower(name), spot_id")]
    fixed = [{"id": i, "vehicle_id": v, "name": n, "amount": a, "period": p, "start": s, "end": e}
             for i, v, n, a, p, s, e in conn.execute(
                 "SELECT cost_id, vehicle_id, name, amount, period, start, end FROM fixed_costs ORDER BY vehicle_id, start, cost_id")]
    cards = {v: {"markup_pct": m, "start_fee": f}
             for v, m, f in conn.execute("SELECT vehicle_id, card_markup_pct, card_start_fee FROM vehicles ORDER BY vehicle_id")}
    return {"ac": _tariffs(conn, "ac"), "dc": _tariffs(conn, "dc"), "spots": spots, "fixed_costs": fixed, "cards": cards}
