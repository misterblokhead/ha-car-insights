"""Learns the usable battery capacity from pairs of the cloud's SoC % and the car's battery_wh."""
import asyncio
import logging
import statistics
import time

from . import db

log = logging.getLogger(__name__)

PAIR_MS = 120_000
WINDOW_MS = 30 * 86_400_000
MIN_PAIRS = 10
PLAUSIBLE_WH = (10_000.0, 200_000.0)  # the add-on option's range: a learned value outside it is not stored


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


def update(conn, vid: str, now_ms: int, logged: set[str]) -> None:
    """Stores the learned capacity of a vehicle when plausible; an out-of-range value is logged once per vehicle (`logged`)."""
    try:
        wh = learn(conn, vid, now_ms)
        if wh is not None and PLAUSIBLE_WH[0] <= wh <= PLAUSIBLE_WH[1]:
            db.set_capacity_wh(conn, vid, wh)
        elif wh is not None and vid not in logged:
            logged.add(vid)
            log.warning("learned capacity %.0f Wh of %s is outside %.0f-%.0f Wh, keeping the previous value", wh, vid, *PLAUSIBLE_WH)
    except Exception:
        log.exception("learning the capacity of %s failed", vid)


async def run(conn, now_ms=lambda: int(time.time() * 1000), interval_s: float = 86_400) -> None:
    """Learns every vehicle's capacity, then again every interval (in memory: a restart learns at once)."""
    logged: set[str] = set()
    while True:
        try:
            now = now_ms()
            for (vid,) in conn.execute("SELECT DISTINCT vehicle_id FROM sources").fetchall():  # a cloud-only vehicle has no vehicles row
                update(conn, vid, now, logged)
        except Exception:
            log.exception("learning the capacities failed, retrying next interval")
        await asyncio.sleep(interval_s)
