"""Charging prices: tariffs per charge target, learned charge spots, receipts, fixed costs and the card surcharge."""
import math
import uuid
from datetime import date

from . import db
from .zones import Zone, name_at

SPOT_RADIUS_M = 100
_PERIODS = ("month", "quarter", "year", "once")


def _num(v: float, hi: float, what: str) -> float:
    if not (math.isfinite(v) and 0 <= v <= hi):
        raise ValueError(f"{what} must be between 0 and {hi:g}")
    return v


def _name(name: str) -> str:
    name = name.strip()
    if not 1 <= len(name) <= 40:
        raise ValueError("name must be 1-40 characters")
    return name


def _tariff_row(r) -> dict:
    return {"valid_from": r[0], "per_kwh": r[1], "start_fee": r[2], "per_min": r[3]}


def tariff_at(conn, target: str, t: int) -> dict | None:
    r = conn.execute("SELECT valid_from, per_kwh, start_fee, per_min FROM tariffs WHERE target=? AND valid_from<=? "
                     "ORDER BY valid_from DESC LIMIT 1", (target, t)).fetchone()
    return None if r is None else _tariff_row(r)


def set_tariff(conn, target: str, valid_from: int, per_kwh: float, start_fee: float = 0, per_min: float = 0) -> None:
    _num(per_kwh, 5, "per_kwh"), _num(start_fee, 1000, "start_fee"), _num(per_min, 1000, "per_min")
    if target not in ("ac", "dc") and conn.execute("SELECT 1 FROM charge_spots WHERE spot_id=?", (target,)).fetchone() is None:
        raise KeyError(target)
    conn.execute("INSERT INTO tariffs VALUES(?,?,?,?,?) ON CONFLICT(target, valid_from) DO UPDATE SET "
                 "per_kwh=excluded.per_kwh, start_fee=excluded.start_fee, per_min=excluded.per_min",
                 (target, valid_from, per_kwh, start_fee, per_min))


def spot_at(conn, lat: float, lon: float) -> tuple[str, str] | None:
    rows = conn.execute("SELECT spot_id, name, lat, lon, radius_m FROM charge_spots").fetchall()
    sid = name_at([Zone(s, la, lo, r) for s, _, la, lo, r in rows], lat, lon)  # the zone name is the spot id
    return None if sid is None else next((s, n) for s, n, *_ in rows if s == sid)


def spot_name_at(conn, lat: float, lon: float) -> str | None:
    hit = spot_at(conn, lat, lon)
    return hit and hit[1]


def relabel(conn) -> None:
    """A charge shows its zone, else the spot it lies in, else nothing."""
    rows = conn.execute("SELECT vehicle_id, start, json_extract(json,'$.lat'), json_extract(json,'$.lon'), "
                        "json_extract(json,'$.zone'), json_extract(json,'$.place') FROM charges "
                        "WHERE json_extract(json,'$.lat') IS NOT NULL").fetchall()
    for vid, start, lat, lon, zone, old in rows:
        new = zone or spot_name_at(conn, lat, lon)
        if new != old:
            conn.execute("UPDATE charges SET json=json_set(json,'$.place',?) WHERE vehicle_id=? AND start=?", (new, vid, start))


def create_spot(conn, vid: str, start: int, name: str, per_kwh: float, start_fee: float = 0, per_min: float = 0) -> str:
    name = _name(name)
    r = conn.execute("SELECT json_extract(json,'$.lat'), json_extract(json,'$.lon') FROM charges WHERE vehicle_id=? AND start=?",
                     (vid, start)).fetchone()
    if r is None:
        raise KeyError(start)
    if r[0] is None:
        raise ValueError("this charge has no GPS point")
    sid = uuid.uuid4().hex[:8]
    with db.tx(conn):
        conn.execute("INSERT INTO charge_spots VALUES(?,?,?,?,?)", (sid, name, r[0], r[1], SPOT_RADIUS_M))
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
    if conn.execute("SELECT 1 FROM charges WHERE vehicle_id=? AND start=?", (vid, start)).fetchone() is None:
        raise KeyError(start)
    if amount is None:
        conn.execute("DELETE FROM charge_receipts WHERE vehicle_id=? AND start=?", (vid, start))
    else:
        conn.execute("INSERT INTO charge_receipts VALUES(?,?,?) ON CONFLICT(vehicle_id, start) DO UPDATE SET amount=excluded.amount",
                     (vid, start, amount))


def receipt_for(conn, vid: str, start: int, end: int | None) -> float | None:
    """A receipt keeps the start it was saved with, so a charge re-derived with an earlier start still finds it."""
    r = conn.execute("SELECT amount FROM charge_receipts WHERE vehicle_id=? AND start>=? AND (? IS NULL OR start<=?) "
                     "ORDER BY start DESC LIMIT 1", (vid, start, end, end)).fetchone()
    return r and r[0]


def add_fixed_cost(conn, vid: str, name: str, amount: float, period: str, start: date, end: date | None) -> str:
    name = _name(name)
    _num(amount, 100_000, "amount")
    if period not in _PERIODS:
        raise ValueError(f"period must be one of {', '.join(_PERIODS)}")
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


def card(conn, vid: str) -> tuple[float, float]:
    r = conn.execute("SELECT card_markup_pct, card_start_fee FROM vehicles WHERE vehicle_id=?", (vid,)).fetchone()
    return (float(r[0]), float(r[1])) if r else (0.0, 0.0)


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
