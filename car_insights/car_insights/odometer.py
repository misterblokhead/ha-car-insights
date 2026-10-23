def chain(conn, vid: str, start: int, distance_m: float | None) -> tuple[float | None, float | None]:
    """Odometer at a trip's start and end: the newest odometer_km reading (any source) at or before the start,
    plus the distance of closed trips since it. Re-anchoring moves odometer values only, never a trip's distance."""
    a = conn.execute("SELECT t, value_json FROM samples WHERE vehicle_id=? AND key='odometer_km' AND t<=? ORDER BY t DESC LIMIT 1",
                     (vid, start)).fetchone()
    if a is None:
        return None, None
    since = conn.execute("SELECT COALESCE(SUM(json_extract(json, '$.distance_m')), 0) FROM trips WHERE vehicle_id=? AND start>=? AND end<=?",
                         (vid, a[0], start)).fetchone()[0]
    odo = float(a[1]) + since / 1000
    return round(odo, 1), None if distance_m is None else round(odo + distance_m / 1000, 1)
