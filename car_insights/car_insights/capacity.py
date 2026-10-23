"""Learns the usable battery capacity from pairs of the cloud's SoC % and the car's battery_wh."""
import statistics

PAIR_MS = 120_000
WINDOW_MS = 30 * 86_400_000
MIN_PAIRS = 10


def learn(conn, vid: str, now_ms: int) -> float | None:
    ratios = []
    socs = conn.execute("SELECT t, value_json FROM samples WHERE vehicle_id=? AND key='soc_percent' AND t BETWEEN ? AND ?",
                        (vid, now_ms - WINDOW_MS, now_ms)).fetchall()
    for t, v in socs:
        soc = float(v)
        if not 0 < soc <= 100:
            continue
        r = conn.execute("SELECT value_json FROM samples WHERE vehicle_id=? AND key='battery_wh' AND t BETWEEN ? AND ? "
                         "ORDER BY ABS(t-?) LIMIT 1", (vid, t - PAIR_MS, t + PAIR_MS, t)).fetchone()
        if r is not None:
            ratios.append(float(r[0]) / (soc / 100))
    return statistics.median(ratios) if len(ratios) >= MIN_PAIRS else None
