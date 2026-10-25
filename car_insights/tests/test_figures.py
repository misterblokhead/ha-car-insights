from car_insights.figures import pct, wh_per_100km, with_figures
from car_insights.kinds import CHARGE, TRIP


def test_wh_per_100km():
    assert wh_per_100km(99, 50) is None
    assert wh_per_100km(100, 50) == 50_000
    assert wh_per_100km(None, 50) is None
    assert wh_per_100km(5000, None) is None


def test_pct_is_clamped():
    assert pct(-500, 60_000) == 0.0
    assert pct(61_000, 60_000) == 100.0
    assert pct(30_000, 60_000) == 50.0
    assert pct(None, 60_000) is None
    assert pct(30_000, 0) is None


def test_with_figures_by_kind():
    row = {"distance_m": 20_000, "net_wh": 5000, "start_wh": 30_000, "end_wh": 15_000}
    assert with_figures(TRIP, row, 60_000) == row | {"start_pct": 50.0, "end_pct": 25.0, "wh_per_100km": 25_000}
    assert with_figures(CHARGE, row, 60_000) == row | {"start_pct": 50.0, "end_pct": 25.0}  # a charge has no consumption
    assert with_figures(TRIP, {"distance_m": 10}, None) == {"distance_m": 10, "start_pct": None, "end_pct": None, "wh_per_100km": None}
