import pytest

from custom_components.car_insights.core import db, onboarding, prices
from custom_components.car_insights.core.db import connect, json_dumps
from conftest import s

CARS = {"car1": {"source": "car_app", "missing_entities": False}, "car2": {"source": "integration", "missing_entities": True}}


@pytest.fixture
def conn():
    c = connect(":memory:")
    c.execute("INSERT INTO vehicles(vehicle_id, meta_json) VALUES(?,?)", ("car1", json_dumps({"vehicle_name": "Zed"})))
    return c


def sample(conn, vid, key, value=1.0):
    db.ingest(conn, vid, "src-0001", [s(1_000, key, value)], 2_000)


def test_new_install_lists_each_car_without_data(conn):
    got = onboarding.state(conn, CARS)
    assert got == {"cars": [{"id": "car2", "name": "car2", "source": "integration", "has_data": False, "missing_entities": True},
                            {"id": "car1", "name": "Zed", "source": "car_app", "has_data": False, "missing_entities": False}],
                   "price_set": False, "opened": [], "hidden": False}  # sorted by name; car2 has no vehicles row yet, so its name is its id


def test_first_sample_ticks_has_data(conn):
    sample(conn, "car1", "soc_percent")
    sample(conn, "car2", "meta", {"vehicle_name": "Two"})
    by_id = {c["id"]: c["has_data"] for c in onboarding.state(conn, CARS)["cars"]}
    assert by_id == {"car1": True, "car2": False}


def test_price_set_from_ac_or_dc_default(conn):
    prices.set_tariff(conn, "dc", 0, 0.5)
    assert onboarding.state(conn, CARS)["price_set"] is True


def test_existing_install_starts_hidden(conn):
    sample(conn, "car1", "soc_percent")
    prices.set_tariff(conn, "ac", 0, 0.3)
    assert onboarding.state(conn, CARS)["hidden"] is True
    assert conn.execute("SELECT COUNT(*) FROM settings WHERE key=?", (onboarding.KEY,)).fetchone()[0] == 1


def test_hidden_is_decided_once(conn):
    assert onboarding.state(conn, CARS)["hidden"] is False
    sample(conn, "car1", "soc_percent")
    prices.set_tariff(conn, "ac", 0, 0.3)
    assert onboarding.state(conn, CARS)["hidden"] is False


def test_archived_cars_do_not_count(conn):
    sample(conn, "car9", "soc_percent")
    prices.set_tariff(conn, "ac", 0, 0.3)
    got = onboarding.state(conn, CARS)
    assert [c["id"] for c in got["cars"]] == ["car2", "car1"] and not any(c["has_data"] for c in got["cars"])
    assert got["hidden"] is False


def test_update_opened_and_hidden(conn):
    onboarding.update(conn, CARS, opened="dashboard")
    onboarding.update(conn, CARS, opened="viewers")
    onboarding.update(conn, CARS, opened="viewers")
    assert onboarding.state(conn, CARS)["opened"] == ["viewers", "dashboard"]  # once each, in step order
    onboarding.update(conn, CARS, hidden=True)
    got = onboarding.state(conn, CARS)
    assert got["hidden"] is True and got["opened"] == ["viewers", "dashboard"]
    onboarding.update(conn, CARS, hidden=False)
    assert onboarding.state(conn, CARS)["hidden"] is False


def test_update_before_any_read_still_decides_hidden(conn):
    sample(conn, "car1", "soc_percent")
    prices.set_tariff(conn, "ac", 0, 0.3)
    onboarding.update(conn, CARS, opened="viewers")
    got = onboarding.state(conn, CARS)
    assert got["hidden"] is True and got["opened"] == ["viewers"]


@pytest.mark.parametrize("stored", ["{not json", "[]", "null", '{"hidden": true}', '{"opened": "viewers", "hidden": "yes"}',
                                    '{"opened": ["viewers", "prices", 3], "hidden": false}'])
def test_a_damaged_row_still_gives_a_working_state_and_can_be_updated(conn, stored):
    conn.execute("INSERT INTO settings VALUES(?,?)", (onboarding.KEY, stored))
    got = onboarding.state(conn, CARS)
    assert isinstance(got["opened"], list) and set(got["opened"]) <= set(onboarding.STEPS_OPENED) and isinstance(got["hidden"], bool)
    onboarding.update(conn, CARS, opened="dashboard")
    assert "dashboard" in onboarding.state(conn, CARS)["opened"]


def test_a_row_missing_a_key_keeps_the_other_key(conn):
    conn.execute("INSERT INTO settings VALUES(?,?)", (onboarding.KEY, '{"hidden": true}'))
    assert onboarding.state(conn, CARS)["hidden"] is True
    conn.execute("UPDATE settings SET value=? WHERE key=?", ('{"opened": ["dashboard"]}', onboarding.KEY))
    assert onboarding.state(conn, CARS)["opened"] == ["dashboard"]
