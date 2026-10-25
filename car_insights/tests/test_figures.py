from car_insights.figures import pct, wh_per_100km


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
