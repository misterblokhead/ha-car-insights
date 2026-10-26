import math

from custom_components.car_insights.core import route
from custom_components.car_insights.core.protocol import Sample

M_LAT = 1 / 110_540  # degrees of latitude per metre
M_LON = 1 / (111_320 * math.cos(math.radians(52.0)))  # degrees of longitude per metre at 52 N


def line(n=11, step_m=100.0):
    return [(52.0 + i * step_m * M_LAT, 5.0) for i in range(n)]


def test_simplify_drops_points_within_5_m():
    pts = line()
    pts[5] = (pts[5][0], 5.0 + 3 * M_LON)
    assert route.simplify(pts) == [pts[0], pts[-1]]
    pts[5] = (pts[5][0], 5.0 + 20 * M_LON)
    out = route.simplify(pts)
    assert pts[5] in out and out[0] == pts[0] and out[-1] == pts[-1]


def test_simplify_keeps_one_and_two_points():
    assert route.simplify([]) == []
    assert route.simplify([(52.0, 5.0)]) == [(52.0, 5.0)]
    assert route.simplify([(52.0, 5.0), (52.0, 5.0)]) == [(52.0, 5.0), (52.0, 5.0)]


def test_simplify_keeps_the_far_point_of_a_closed_loop():
    out = route.simplify([(52.0, 5.0), (52.001, 5.0), (52.0, 5.0)])
    assert out == [(52.0, 5.0), (52.001, 5.0), (52.0, 5.0)]


def test_from_samples_uses_gps_fixes_only():
    samples = [Sample(1, 0, "gps", [52.123456789, 5.000004]), Sample(2, 1, "gps", None), Sample(3, 2, "speed", 10.0),
               Sample(4, 3, "gps", [52.5, 5.5])]
    assert route.from_samples(samples) == [[52.12346, 5.0], [52.5, 5.5]]


def test_from_samples_caps_300_and_card_48():
    zig = [Sample(i + 1, i, "gps", [52.0 + i * 10 * M_LAT, 5.0 + (20 if i % 2 else -20) * M_LON]) for i in range(2000)]
    pts = route.from_samples(zig)
    assert len(pts) == 300 and pts[0] == [round(zig[0].v[0], 5), round(zig[0].v[1], 5)]
    assert pts[-1] == [round(zig[-1].v[0], 5), round(zig[-1].v[1], 5)]
    c = route.card(pts)
    assert len(c) == 48 and c[0] == pts[0] and c[-1] == pts[-1]
    assert route.card(pts[:10]) == pts[:10]
