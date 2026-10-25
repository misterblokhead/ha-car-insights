"""Calendar periods in local time, as epoch ms."""
from datetime import date, datetime, time, timedelta, tzinfo

_WEEK_DAYS = 7


def midnight_ms(d: date, tz: tzinfo) -> int:
    return int(datetime.combine(d, time.min, tz).timestamp() * 1000)


def local_date(ms: int, tz: tzinfo) -> date:
    return datetime.fromtimestamp(ms / 1000, tz).date()


def period_starts(now_ms: int, tz: tzinfo) -> tuple[int, int]:
    """Local midnight of the 1st of this month and of 1 January."""
    today = local_date(now_ms, tz)
    return midnight_ms(today.replace(day=1), tz), midnight_ms(today.replace(month=1, day=1), tz)


def span(period: str, at: date) -> tuple[date, date]:
    """First day of the period containing `at` (weeks start on Monday) and of the next period."""
    if period == "week":
        lo = at - timedelta(days=at.weekday())
        return lo, lo + timedelta(days=7)
    if period == "month":
        lo = at.replace(day=1)
        return lo, (lo + timedelta(days=31)).replace(day=1)
    return date(at.year, 1, 1), date(at.year + 1, 1, 1)


def period_bounds(period: str, at: date, tz: tzinfo) -> tuple[int, int]:
    """Local midnight starting the period containing `at` (inclusive) and starting the next one (exclusive)."""
    lo, hi = span(period, at)
    return midnight_ms(lo, tz), midnight_ms(hi, tz)


def week_start_ms(now_ms: int, tz: tzinfo) -> int:
    """Local midnight of the first of the 7 days that end today: the earliest start the week's totals need."""
    return midnight_ms(local_date(now_ms, tz) - timedelta(days=_WEEK_DAYS - 1), tz)
