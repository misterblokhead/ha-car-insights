"""Statistics over the stored trips and charges."""
import sqlite3


def similar_trips(conn: sqlite3.Connection, vid: str, trip: dict, limit: int = 20) -> dict | None:
    """The newest earlier trips between the same two zones, or None when the zones are unknown or nothing matches."""
    a, b = trip.get("from"), trip.get("to")
    if a is None or b is None:
        return None
    rows = conn.execute(
        "SELECT json_extract(json,'$.duration_s'), json_extract(json,'$.distance_m'), json_extract(json,'$.net_wh') FROM trips "
        "WHERE vehicle_id=? AND end IS NOT NULL AND start<? AND json_extract(json,'$.from')=? AND json_extract(json,'$.to')=? "
        "ORDER BY start DESC LIMIT ?", (vid, trip["start"], a, b, limit)).fetchall()
    if not rows:
        return None
    durs = [d for d, _, _ in rows if d is not None]
    used = [(m, wh) for _, m, wh in rows if m and m > 0 and wh is not None]
    dist = sum(m for m, _ in used)
    return {"n": len(rows), "avg_duration_s": sum(durs) / len(durs) if durs else None,
            "avg_wh_per_100km": sum(wh for _, wh in used) / dist * 100_000 if used else None}
