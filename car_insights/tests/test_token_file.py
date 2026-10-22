import re

from car_insights.token_file import load_or_create


def test_token_created_once(tmp_path):
    p = tmp_path / "a" / "internal_token"
    t = load_or_create(p)
    assert re.fullmatch(r"[0-9a-f]{64}", t)
    assert load_or_create(p) == t


import pytest


@pytest.mark.parametrize("content", ["", "  \n", "garbage", "A" * 64, "a" * 63])
def test_invalid_token_file_is_replaced(tmp_path, content):
    p = tmp_path / "internal_token"
    p.write_text(content)
    t = load_or_create(p)
    assert re.fullmatch(r"[0-9a-f]{64}", t)
    assert p.read_text() == t
