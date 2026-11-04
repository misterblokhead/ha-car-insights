import json

import pytest

from custom_components.car_insights.core.protocol import MAX_DEPTH, ProtocolError, Sample, parse_batch

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


def test_parse_summary_rev():
    assert parse_batch(VALID_WITH(summary_rev="abc123")).summary_rev == "abc123"
    assert parse_batch(VALID_WITH()).summary_rev is None
    assert parse_batch(VALID_WITH(summary_rev=None)).summary_rev is None
    assert parse_batch(VALID_WITH(summary_rev="a" * 64)).summary_rev == "a" * 64


@pytest.mark.parametrize("bad", ["a" * 65, 5, ["x"]])
def test_parse_summary_rev_rejects(bad):
    with pytest.raises(ProtocolError, match="bad summary_rev"):
        parse_batch(VALID_WITH(summary_rev=bad))


def test_huge_numbers_rejected():
    for bad in ({"seq": 1, "t": 2**63}, {"seq": 2**62, "t": 5}):
        with pytest.raises(ProtocolError):
            parse_batch(VALID_WITH(samples=[{**bad, "k": "speed", "v": 1}]))
    # gap to_seq < _MAX is implied by to_seq < seq < _MAX; this only pins the older to_seq < seq rule
    gap = {"seq": 2**62 - 1, "t": 5, "k": "gap", "v": {"from_seq": 1, "to_seq": 2**62}}
    with pytest.raises(ProtocolError):
        parse_batch(VALID_WITH(samples=[gap]))
    top = parse_batch(VALID_WITH(samples=[{"seq": 2**62 - 1, "t": 2**62 - 1, "k": "speed", "v": 1}]))
    assert top.samples[0].seq == 2**62 - 1


def _nested(n: int) -> bytes:
    """a valid batch whose extra key nests to depth n in all (the envelope is level 1)"""
    return b'{"v":1,"vehicle_id":"car1","source_id":"' + S.encode() + b'","samples":[],"x":' + b'[' * (n - 1) + b']' * (n - 1) + b'}'


def test_deep_json_rejected_at_a_fixed_depth():
    assert parse_batch(_nested(MAX_DEPTH)).vehicle_id == "car1"
    for n in (MAX_DEPTH + 1, 100_000):  # 100_000 parses with a big enough stack: the cap, not the stack, must reject it
        with pytest.raises(ProtocolError, match="bad json"):
            parse_batch(_nested(n))


def test_brackets_inside_strings_do_not_count_as_depth():
    v = '[{\\"' * 100  # brackets, a backslash and a quote inside the string: all escaped in the JSON
    assert parse_batch(VALID_WITH(samples=[{"seq": 1, "t": 1, "k": "mode", "v": v}])).samples[0].v == v
