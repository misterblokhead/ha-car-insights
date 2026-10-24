"""Demo server for visual checks: the real ui_api router (and ingress guard) over an in-memory database of made-up data.

    cd car_insights && .venv/Scripts/python dev/demo.py web/dist     # http://127.0.0.1:8765/
    DEMO_USER=u-viewer ...                                            # the same page as a non-admin who shares both cars

Two cars and a cost group: 10 days of Home / Work / Shop trips with GPS routes (the same drives repeat, so similar trips exist),
one trip to a place outside every zone, an open trip, charges timed by the car and by the cloud, and one cloud charge whose
energy is a state-of-charge estimate. Prices: AC 0.45 and DC 0.69 per kWh, a "Shop" spot at 0.35, a monthly 3.99 "Charge card" per car.
Everything is samples fed through the real Deriver. All coordinates are invented."""
import math
import os
import random
import sys
import time
from datetime import datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import uvicorn  # noqa: E402

from car_insights import access, db, prices, ui_api  # noqa: E402
from car_insights.api import create_app  # noqa: E402
from car_insights.derive import Deriver  # noqa: E402
from car_insights.protocol import Sample  # noqa: E402

TZ = ZoneInfo("Europe/Amsterdam")
PLACES = {"Home": (52.0, 5.0), "Work": (52.09, 5.11), "Shop": (52.03, 5.04), "Elsewhere": (52.06, 4.95)}  # Elsewhere is in no zone
CRUISE = {"Work": 24.0, "Shop": 11.0, "Elsewhere": 19.0, "Home": 17.0}  # m/s on the way to...
MIN = 60_000
CARS = {  # id -> (name, capacity Wh, has a cloud source, battery at the start)
    "demo-aurora": ("Aurora", 60_000.0, True, 0.8),
    "demo-breeze": ("Breeze", 40_000.0, False, 0.58),
}


def zones(lat: float, lon: float) -> str | None:
    return next((n for n, (a, b) in PLACES.items() if n != "Elsewhere" and math.hypot((lat - a) * 111_000, (lon - b) * 68_000) < 400), None)


def plan(vid: str, day) -> list[tuple[int, int, str, str]]:
    """(hour, minute, from, to) of the day's drives"""
    wd = day.weekday()
    if vid == "demo-aurora":
        if wd < 5:
            evening = [(17, 20, "Work", "Shop"), (18, 0, "Shop", "Home")] if wd == 2 else [(17, 20, "Work", "Home")]
            return [(7, 50, "Home", "Work"), *evening]
        return [(10, 30, "Home", "Shop"), (11, 25, "Shop", "Home")] if wd == 5 else [(14, 0, "Home", "Elsewhere"), (16, 40, "Elsewhere", "Home")]
    if wd in (0, 4):
        return [(8, 10, "Home", "Work"), (16, 45, "Work", "Home")]
    return [(9, 15, "Home", "Shop"), (11 if wd == 5 else 10, 0, "Shop", "Home")] if wd in (1, 3, 5) else []  # Saturday: long enough to charge at the Shop


def route(a: str, b: str, rng: random.Random):
    """polyline a -> b bowed to one side; (points, cumulative metres)"""
    (la, oa), (lb, ob) = PLACES[a], PLACES[b]
    dx, dy = lb - la, ob - oa
    n = math.hypot(dx, dy)
    bow, wig = rng.uniform(0.6, 1.4) * 0.12 * n, rng.uniform(0, 6)
    pts = []
    for i in range(81):
        u = i / 80
        side = (bow * math.sin(math.pi * u) + 0.1 * bow * math.sin(5 * math.pi * u + wig)) / n
        pts.append((la + dx * u - dy * side, oa + dy * u + dx * side))
    pts[0], pts[-1] = PLACES[a], PLACES[b]
    cum = [0.0]
    for p, q in zip(pts, pts[1:]):
        cum.append(cum[-1] + math.hypot((q[0] - p[0]) * 111_000, (q[1] - p[1]) * 68_000))
    return pts, cum


def at(pts, cum, s):
    if s >= cum[-1]:
        return pts[-1]
    i = next(i for i, c in enumerate(cum) if c > s) - 1
    f = (s - cum[i]) / (cum[i + 1] - cum[i])
    return pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f


def drive(log, t0, a, b, wh, temp, rng, wake=True, until=None) -> tuple[int, float]:
    """The samples of one drive from t0; with `until` it stops there, still open. Returns (end time, battery Wh).
    wake=False leaves no battery reading between the car's last one and the drive (a cloud charge before it is then estimated)."""
    pts, cum = route(a, b, rng)
    if wake:
        log(t0 - 90_000, "battery_wh", round(wh))
    log(t0 - 90_000, "gear", 1)
    log(t0 - 90_000, "ignition", 4)
    log(t0 - 80_000, "outside_temp", round(temp, 1))
    log(t0, "battery_wh", round(wh))  # a reading at the start instant is the trip's base
    height = lambda s: 40 * math.sin(2 * math.pi * s / 2400 + phase)  # metres
    phase = rng.uniform(0, 6)
    t, s, v, n = t0, 0.0, 0.0, 0
    while True:
        rem = cum[-1] - s
        new = min(CRUISE[b], math.sqrt(2 * 1.6 * s) + 2, math.sqrt(2 * 1.8 * max(rem, 0)) + 1.5) * rng.uniform(0.94, 1.06)
        if t > t0:  # energy since the previous sample: air and rolling drag, kinetic energy and the rolling hills; 60 % of a gain is recovered
            e = v * 4 * (0.055 + 0.00018 * v * v) + 0.5 * 1700 * (new ** 2 - v ** 2) / 3600 + 4.6 * (height(s) - height(s - v * 4))
            wh -= e / 0.9 if e > 0 else e * 0.6
        log(t, "speed", round(new, 2))
        log(t, "gps", [*(round(x, 5) for x in at(pts, cum, s)), 5.0])
        n += 1
        if n % 3 == 0:
            log(t, "battery_wh", round(wh))
        if until is not None and t + 4000 > until:
            return t, wh
        if rem <= 0:
            break
        s += new * 4
        t, v = t + 4000, new
    log(t + 2000, "speed", 0)
    log(t + 2000, "gps", [*PLACES[b], 5.0])
    log(t + 2000, "battery_wh", round(wh))
    log(t + 3000, "gear", 4)
    log(t + 5000, "ignition", 2)
    return t + 5000, wh


def charge(log, t0, wh, cap, target, car_reports: bool) -> tuple[int, float]:
    """Plug in at t0 and charge to `target` Wh. The car reports its energy while plugged; the cloud reports charge state and level."""
    t = t0
    log(t, "plugged" if car_reports else "charging_state", True)
    if not car_reports:
        log(t, "plug_state", True)
    while True:
        log(t, "battery_wh" if car_reports else "soc_percent", round(wh) if car_reports else round(wh / cap * 100))
        if wh >= target:
            break
        wh = min(target, wh + (7400 if wh < 0.8 * cap else 3700) * 0.1 * 0.92)  # kW, tapering above 80 %; 6-minute steps
        t += 6 * MIN
    log(t, "plugged" if car_reports else "charging_state", False)
    if not car_reports:
        log(t, "plug_state", False)
    return t, wh


def build(conn, now: int) -> Deriver:
    rng = random.Random(7)
    today = datetime.fromtimestamp(now / 1000, TZ).date()
    local = lambda day, h, m: int(datetime(day.year, day.month, day.day, h, tzinfo=TZ).timestamp() * 1000) + m * MIN
    for vid, (name, cap, cloud, full) in CARS.items():
        car, sky = [], []
        log = lambda t, k, v, rows=car: rows.append((int(t), k, v))
        cloud_log = lambda t, k, v: sky.append((int(t), k, v))
        wh, estimate_next = full * cap, False
        log(local(today - timedelta(days=10), 0, 0), "meta", {"vehicle_name": name, "make": "Demo", "model": "E1"})
        log(local(today - timedelta(days=10), 0, 1), "odometer_km", 12_345.0)
        for d in range(9, -1, -1):
            day = today - timedelta(days=d)
            for h, m, a, b in plan(vid, day):
                t0 = local(day, h, m + rng.randint(-10, 10))
                if t0 > now - 45 * MIN:  # still to come (or too close to now to have finished)
                    continue
                end, wh = drive(log, t0, a, b, wh, 9 + 3 * math.sin(d) + rng.uniform(-1, 1), rng, wake=not estimate_next)
                estimate_next = False
                if vid == "demo-breeze" and day.weekday() == 5 and b == "Shop" and end + 70 * MIN < now:  # the one charge away from home, for the Shop price
                    _, wh = charge(log, end + 3 * MIN, wh, cap, min(wh + 5400, 0.98 * cap), car_reports=True)
            # evening at home: plug in when below 70 %; the Aurora's cloud charge four days ago is left as a state-of-charge estimate
            start = local(day, 19, 30) + rng.randint(0, 120) * MIN
            if (wh < 0.7 * cap or (cloud and d == 4)) and start < now - 6 * 3600_000:
                _, wh = charge(cloud_log if cloud else log, start, wh, cap, rng.uniform(0.82, 0.96) * cap, car_reports=not cloud)
                estimate_next = cloud and d == 4
        if cloud:  # the open trip: out for 5 minutes
            drive(log, now - 5 * MIN, "Home", "Work", wh, 11.0, rng, wake=not estimate_next, until=now)
        for source, rows in (("car", car), ("cloud", sky)):
            if rows:
                rows.sort(key=lambda r: r[0])  # stable: samples of one instant keep their order
                db.ingest(conn, vid, f"{source}-00000001", [Sample(i, t, k, v) for i, (t, k, v) in enumerate(rows, 1)], now)
        db.set_capacity_wh(conn, vid, cap)
    gid = access.create_group(conn, "Household")
    for vid in CARS:
        access.set_vehicle(conn, vid, gid, ["u-viewer"])
    deriver = Deriver(conn, zones, lambda vid: db.capacity_wh(conn, vid, 60_000.0))
    for vid in CARS:
        deriver.update(vid, None, now)
    first = today - timedelta(days=10)
    for target, per_kwh in (("ac", 0.45), ("dc", 0.69)):
        prices.set_tariff(conn, target, local(first, 0, 0), per_kwh)
    shop = conn.execute("SELECT vehicle_id, start FROM charges WHERE json_extract(json, '$.place') = 'Shop' ORDER BY start").fetchone()
    if shop:  # none when the Saturday visit falls outside the 10 days
        prices.create_spot(conn, *shop, "Shop", 0.35)
    for vid in CARS:
        prices.add_fixed_cost(conn, vid, "Charge card", 3.99, "month", first, None)
    return deriver


class AsUser:
    """ASGI wrapper standing in for the Supervisor's ingress proxy: every request comes from this user."""

    def __init__(self, app, user: str):
        self.app, self.header = app, (b"x-remote-user-id", user.encode())

    async def __call__(self, scope, receive, send):
        if scope["type"] in ("http", "websocket"):
            scope = {**scope, "headers": [*scope["headers"], self.header]}
        await self.app(scope, receive, send)


def main(web_dir: str) -> None:
    conn = db.connect(":memory:")
    now = int(time.time() * 1000)
    deriver = build(conn, now)
    user = os.environ.get("DEMO_USER", "u-admin")

    async def is_admin(uid: str) -> bool:  # the one thing faked: Home Assistant's user list
        return uid == "u-admin"

    capacity = lambda vid: db.capacity_wh(conn, vid, 60_000.0)
    router = ui_api.router(conn, deriver, zones, TZ, capacity, is_admin, ingress_hosts=("127.0.0.1",))
    app = create_app(conn, "demo-token", lambda *a: None, ui=router, web_dir=Path(web_dir))
    uvicorn.run(AsUser(app, user), host="127.0.0.1", port=8765)


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "web/dist")
