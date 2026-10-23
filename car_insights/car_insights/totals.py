from datetime import date, datetime, time, tzinfo


def _midnight_ms(d: date, tz: tzinfo) -> int:
    return int(datetime.combine(d, time.min, tz).timestamp() * 1000)


def period_starts(now_ms: int, tz: tzinfo) -> tuple[int, int]:
    """Local midnight of the 1st of this month and of 1 January, as epoch ms."""
    today = datetime.fromtimestamp(now_ms / 1000, tz).date()
    return _midnight_ms(today.replace(day=1), tz), _midnight_ms(today.replace(month=1, day=1), tz)


def _one(conn, vids: list[str], since: int) -> dict:
    q = ",".join("?" * len(vids))
    # json null counts as 0 in the sums only
    d, n, nt = conn.execute(
        f"SELECT COALESCE(SUM(json_extract(json,'$.distance_m')),0), COALESCE(SUM(json_extract(json,'$.net_wh')),0), COUNT(*)"
        f" FROM trips WHERE vehicle_id IN ({q}) AND end IS NOT NULL AND start >= ?", (*vids, since)).fetchone()
    a, nc = conn.execute(
        f"SELECT COALESCE(SUM(json_extract(json,'$.added_wh')),0), COUNT(*)"
        f" FROM charges WHERE vehicle_id IN ({q}) AND end IS NOT NULL AND start >= ?", (*vids, since)).fetchone()
    return {"distance_m": float(d), "net_wh": float(n), "charged_wh": float(a), "trips": nt, "charges": nc}


def totals(conn, vids: list[str], now_ms: int, tz: tzinfo) -> dict:
    month, year = period_starts(now_ms, tz)
    return {"month": _one(conn, vids, month), "year": _one(conn, vids, year)}
