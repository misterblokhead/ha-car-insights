"""What a charge costs: receipt, else the spot's tariff, else the AC/DC default."""
from . import prices

DC_ABOVE_W = 22_000
LOSS = {"ac": 1.10, "dc": 1.05}  # grid-to-battery losses; the car reports energy added to the battery


def charge_cost(conn, vid: str, charge: dict) -> dict:
    start, end, wh = charge["start"], charge.get("end"), charge.get("added_wh")
    kind = "dc" if (charge.get("avg_w") or 0) > DC_ABOVE_W else "ac"
    spot = prices.spot_at(conn, charge["lat"], charge["lon"]) if charge.get("lat") is not None else None
    markup, card_fee = prices.card(conn, vid)
    out = {"amount": None, "basis": None, "kind": kind, "spot_id": spot and spot[0], "spot": spot and spot[1],
           "tariff": None, "loss": LOSS[kind], "card_markup_pct": markup, "card_start_fee": card_fee}
    receipt = prices.receipt_for(conn, vid, start, end)
    if receipt is not None:
        return out | {"amount": receipt, "basis": "receipt"}
    if end is None or wh is None:
        return out
    tariff, basis = (spot and prices.tariff_at(conn, spot[0], start)), "spot"
    if tariff is None:
        tariff, basis = prices.tariff_at(conn, kind, start), "default"
    if tariff is None:
        return out
    amount = (wh / 1000 * LOSS[kind] * tariff["per_kwh"] * (1 + markup / 100)
              + tariff["start_fee"] + card_fee + tariff["per_min"] * (charge.get("duration_s") or 0) / 60)
    return out | {"amount": amount, "basis": basis, "tariff": tariff}
