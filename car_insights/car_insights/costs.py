"""What a charge costs: receipt, else the spot's tariff, else the AC/DC default. What a trip costs: energy plus its share of the fixed costs."""
import json
from datetime import date, datetime, timedelta

from . import prices
from .periods import midnight_ms

ENERGY_WINDOW_MS = 30 * 86_400_000
FIXED_DAYS = 365
MIN_FIXED_KM = 100
DC_ABOVE_W = 22_000
LOSS = {"ac": 1.10, "dc": 1.05}  # grid-to-battery losses; the car reports energy added to the battery


def charge_cost(conn, vid: str, charge: dict) -> dict:
    start, end, wh = charge["start"], charge.get("end"), charge.get("added_wh")
    kind = "dc" if (charge.get("avg_w") or 0) > DC_ABOVE_W else "ac"
    # the nearest spot prices the charge even inside an HA zone (the zone only names the place): on purpose
    spot = prices.spot_at(conn, charge["lat"], charge["lon"]) if charge.get("lat") is not None else None
    markup, card_fee = prices.card(conn, vid)
    out = {"amount": None, "basis": None, "kind": kind, "spot_id": spot and spot[0], "spot": spot and spot[1],
           "tariff": None, "loss": LOSS[kind], "card_markup_pct": markup, "card_start_fee": card_fee}
    receipt = prices.receipt_for(conn, vid, start, end)
    if receipt is not None:
        return out | {"amount": receipt, "basis": "receipt"}
    if end is None or wh is None or wh < 0:  # a negative wh is a SoC estimate that went down
        return out
    tariff, basis = (spot and prices.tariff_at(conn, spot[0], start)), "spot"
    if tariff is None:
        tariff, basis = prices.tariff_at(conn, kind, start), "default"
    if tariff is None:
        return out
    amount = (wh / 1000 * LOSS[kind] * tariff["per_kwh"] * (1 + markup / 100)
              + tariff["start_fee"] + card_fee + tariff["per_min"] * (charge.get("duration_s") or 0) / 60)
    return out | {"amount": amount, "basis": basis, "tariff": tariff}


def _period_days(period: str, d: date) -> int:
    """Days in the calendar month, quarter or year containing d."""
    n = {"month": 1, "quarter": 3, "year": 12}[period]
    m = (d.month - 1) // n * n
    return (date(d.year + (m + n) // 12, (m + n) % 12 + 1, 1) - date(d.year, m + 1, 1)).days


def fixed_between(conn, vids: list[str], lo: date, hi: date) -> float:
    """Fixed costs falling in [lo, hi): recurring ones spread per day over their period, a one-off in full on its date."""
    total = 0.0
    q = ",".join("?" * len(vids))
    for amount, period, start, end in conn.execute(
            f"SELECT amount, period, start, end FROM fixed_costs WHERE vehicle_id IN ({q})", vids).fetchall():
        start, end = date.fromisoformat(start), end and date.fromisoformat(end)
        if period == "once":
            total += amount if lo <= start < hi else 0
            continue
        first, last = max(lo, start), min(hi, end + timedelta(days=1)) if end else hi
        total += sum(amount / _period_days(period, d) for d in (first + timedelta(days=i) for i in range((last - first).days)))
    return total


def _energy(conn, vid: str, trip: dict) -> float | None:
    if trip.get("net_wh") is None:
        return None
    end = trip["end"]
    amount = kwh = 0.0
    for (js,) in conn.execute("SELECT json FROM charges WHERE vehicle_id=? AND end IS NOT NULL AND end BETWEEN ? AND ?",
                              (vid, end - ENERGY_WINDOW_MS, end)):
        ch = json.loads(js)
        a = charge_cost(conn, vid, ch)["amount"]
        if a is not None and (ch.get("added_wh") or 0) > 0:
            amount, kwh = amount + a, kwh + ch["added_wh"] / 1000
    if kwh > 0:
        per_kwh = amount / kwh
    else:
        tariff = prices.tariff_at(conn, "ac", end)
        if tariff is None:
            return None
        per_kwh = tariff["per_kwh"] * LOSS["ac"]
    return max(0, trip["net_wh"]) / 1000 * per_kwh


def _fixed(conn, vid: str, trip: dict, tz) -> float | None:
    if trip.get("distance_m") is None:
        return None
    end_day = datetime.fromtimestamp(trip["end"] / 1000, tz).date()
    first = conn.execute("SELECT COALESCE(MIN(start), ?) FROM trips WHERE vehicle_id=?", (trip["start"], vid)).fetchone()[0]
    lo = max(end_day - timedelta(days=FIXED_DAYS - 1), datetime.fromtimestamp(first / 1000, tz).date())
    km = conn.execute("SELECT COALESCE(SUM(json_extract(json,'$.distance_m')),0) / 1000.0 FROM trips "
                      "WHERE vehicle_id=? AND end IS NOT NULL AND start>=? AND end<=?",
                      (vid, midnight_ms(lo, tz), trip["end"])).fetchone()[0]
    if km < MIN_FIXED_KM:
        return None
    return fixed_between(conn, [vid], lo, end_day + timedelta(days=1)) / km * trip["distance_m"] / 1000


def trip_cost(conn, vid: str, trip: dict, tz) -> dict:
    """Energy at the recent charges' average price (else the AC default), plus the trip's km share of a year of fixed costs."""
    if trip.get("end") is None:
        return {"energy": None, "fixed": None, "total": None}
    energy, fixed = _energy(conn, vid, trip), _fixed(conn, vid, trip, tz)
    total = None if energy is None else energy + (fixed or 0)
    return {"energy": energy, "fixed": fixed, "total": total}


def period_costs(conn, vids: list[str], lo: int, hi: int, tz, now_ms: int) -> dict:
    """Costs of the closed charges starting in [lo, hi) plus the fixed costs of the days up to the period's last day, or today if still running."""
    q = ",".join("?" * len(vids))
    energy, uncosted = 0.0, 0
    for vid, js in conn.execute(
            f"SELECT vehicle_id, json FROM charges WHERE vehicle_id IN ({q}) AND end IS NOT NULL AND start >= ? AND start < ?", (*vids, lo, hi)):
        a = charge_cost(conn, vid, json.loads(js))["amount"]
        energy, uncosted = (energy + a, uncosted) if a is not None else (energy, uncosted + 1)
    day = lambda ms: datetime.fromtimestamp(ms / 1000, tz).date()
    fixed = fixed_between(conn, vids, day(lo), min(day(hi - 1), day(now_ms)) + timedelta(days=1))
    return {"energy": energy, "fixed": fixed, "total": energy + fixed, "uncosted": uncosted}
