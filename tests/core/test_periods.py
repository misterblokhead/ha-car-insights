from datetime import date, datetime
from zoneinfo import ZoneInfo

from custom_components.car_insights.core.periods import midnight_ms, span, week_days, week_start_ms

TZ = ZoneInfo("Europe/Amsterdam")


def test_midnight_ms_across_the_dst_change():
    assert midnight_ms(date(2026, 10, 25), TZ) == int(datetime.fromisoformat("2026-10-25T00:00:00+02:00").timestamp() * 1000)
    assert midnight_ms(date(2026, 10, 26), TZ) == int(datetime.fromisoformat("2026-10-26T00:00:00+01:00").timestamp() * 1000)


def test_span_week_starts_on_monday():
    assert span("week", date(2026, 10, 21)) == (date(2026, 10, 19), date(2026, 10, 26))


def test_week_start_ms_is_six_days_back_at_local_midnight():
    now = int(datetime(2026, 10, 22, 23, 59, tzinfo=TZ).timestamp() * 1000)
    assert week_start_ms(now, TZ) == midnight_ms(date(2026, 10, 16), TZ)


def test_week_days_end_today_and_start_the_week():
    now = int(datetime(2026, 10, 26, 0, 30, tzinfo=TZ).timestamp() * 1000)  # the night after the clocks went back
    days = week_days(now, TZ)
    assert days[0] == date(2026, 10, 20) and days[-1] == date(2026, 10, 26) and len(days) == 7
    assert week_start_ms(now, TZ) == midnight_ms(days[0], TZ)
