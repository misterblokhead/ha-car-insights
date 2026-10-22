import json

import pytest

from car_insights.protocol import ProtocolError, Sample, parse_batch

S = "car_app-0000abcd"


def VALID_WITH(**over):
    d = {"v": 1, "vehicle_id": "car1", "source_id": S, "samples": [{"seq": 1, "t": 5, "k": "speed", "v": 1.5}]}
    d.update(over)
    return json.dumps(d).encode()


def test_parse_valid():
    b = parse_batch(VALID_WITH())
    assert b.samples[0] == Sample(1, 5, "speed", 1.5)
    assert (b.vehicle_id, b.source_id) == ("car1", S)


def _gap(v):
    return VALID_WITH(samples=[{"seq": 9, "t": 0, "k": "gap", "v": v}])


@pytest.mark.parametrize("bad", [pytest.param(b, id=str(i)) for i, b in enumerate([
    b"not json", b"[]", b'{"v":2}',
    VALID_WITH(v=True),
    VALID_WITH(samples=[{"seq": 2, "t": 0, "k": "gap", "v": {"from_seq": 3, "to_seq": 100}}]),
    VALID_WITH(samples=[{"seq": 3, "t": 0, "k": "gap", "v": {"from_seq": 1, "to_seq": 3}}]),
    VALID_WITH(samples=[{"seq": 1, "t": 0, "k": "meta", "v": 5}]),
    VALID_WITH(samples=[{"seq": 1, "t": 0, "k": "meta", "v": {"vehicle_name": 7}}]),
    VALID_WITH(vehicle_id="../x"), VALID_WITH(source_id="evil"),
    VALID_WITH(samples="x"),
    VALID_WITH(samples=[{"seq": "1", "t": 5, "k": "speed", "v": 1}]),
    VALID_WITH(samples=[{"seq": True, "t": 5, "k": "speed", "v": 1}]),
    VALID_WITH(samples=[{"seq": 0, "t": 5, "k": "speed", "v": 1}]),
    VALID_WITH(samples=[{"seq": 1, "t": 5, "k": "", "v": 1}]),
    VALID_WITH(samples=[{"seq": 1, "t": 5, "k": "speed"}]),
    VALID_WITH(samples=[{"seq": i, "t": 0, "k": "s", "v": 0} for i in range(1, 5002)]),
    _gap(5), _gap({"from_seq": 0, "to_seq": 3}), _gap({"from_seq": 4, "to_seq": 3}),
    _gap({"from_seq": "1", "to_seq": 3}), _gap({"from_seq": True, "to_seq": 3}), _gap({"from_seq": 1}),
])])
def test_parse_rejects(bad):  # noqa
    with pytest.raises(ProtocolError):
        parse_batch(bad)


def test_parse_valid_gap():
    assert parse_batch(_gap({"from_seq": 1, "to_seq": 3})).samples[0].v == {"from_seq": 1, "to_seq": 3}
