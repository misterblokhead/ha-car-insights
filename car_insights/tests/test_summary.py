from datetime import datetime, timedelta, timezone

from car_insights.summary import build, week_start_ms

TZ = timezone(timedelta(hours=2))


def ms(y, mo, d, h=0, mi=0):
    return int(datetime(y, mo, d, h, mi, tzinfo=TZ).timestamp() * 1000)


def trip(start, end, dist=1000.0, net=100.0):
    return {"start": start, "end": end, "distance_m": dist, "net_wh": net, "from": None, "to": None}


def charge(start, added=500.0):
    return {"start": start, "end": start + 3_600_000, "added_wh": added, "place": None}


NOW = ms(2026, 10, 22, 12)
H = 3_600_000


def summary(trips, charges, now=NOW):
    return build(trips, charges, trips, charges, now, TZ)


def test_rev_stable_and_changes():
    t1, t2 = trip(ms(2026, 10, 22, 8), ms(2026, 10, 22, 9)), trip(ms(2026, 10, 21, 8), ms(2026, 10, 21, 9))
    a, b = summary([t1], []), summary([t1], [], NOW + 60_000)
    assert a["rev"] == b["rev"] and len(a["rev"]) == 12
    assert a["updated"] != b["updated"]
    assert summary([t1, t2], [])["rev"] != a["rev"]


def test_week_and_today():
    d22, d21 = ms(2026, 10, 22), ms(2026, 10, 21)
    trips = [
        trip(d22 + 8 * H, d22 + 9 * H, 2000, 200),
        trip(ms(2026, 10, 21, 23, 50), ms(2026, 10, 22, 0, 20), 5000, 500),  # counts on its start day
        trip(d21 + 8 * H, d21 + 9 * H, None, None),
    ]
    charges = [charge(d22 + H, 700), charge(d21 + H, None)]
    s = summary(trips, charges)
    assert len(s["week"]) == 7
    assert [d["date"] for d in s["week"]][-2:] == ["2026-10-21", "2026-10-22"]
    assert s["week"][0] == {"date": "2026-10-16", "distance_m": 0, "net_wh": 0, "charged_wh": 0}
    assert s["today"] == s["week"][-1] == {"date": "2026-10-22", "distance_m": 2000, "net_wh": 200, "charged_wh": 700}
    assert s["week"][-2] == {"date": "2026-10-21", "distance_m": 5000, "net_wh": 500, "charged_wh": 0}
    assert sum(d["distance_m"] for d in s["week"]) == 7000


def test_lists_and_last_come_from_the_given_newest_rows_and_the_week_from_its_own():
    listed = [trip(ms(2026, 10, 1) - i * 1000, ms(2026, 10, 1), 1, 0) for i in range(3)]  # older than the week
    week = [trip(ms(2026, 10, 22, 8), ms(2026, 10, 22, 9), 2000, 200)]
    s = build(listed, [], week, [], NOW, TZ)
    assert s["trips"] == listed and s["last_trip"] is listed[0] and s["last_charge"] is None and s["charges"] == []
    assert s["today"]["distance_m"] == 2000 and sum(d["distance_m"] for d in s["week"]) == 2000


def test_no_current_trip_in_the_summary():
    assert "current_trip" not in summary([], [])


def test_empty():
    s = summary([], [])
    assert s["last_trip"] is None and s["today"]["distance_m"] == 0


def test_week_start_is_local_midnight_six_days_back():
    assert week_start_ms(NOW, TZ) == ms(2026, 10, 16)
    assert week_start_ms(ms(2026, 10, 22, 0, 0), TZ) == ms(2026, 10, 16)
    assert week_start_ms(ms(2026, 10, 22, 23, 59), TZ) == ms(2026, 10, 16)
