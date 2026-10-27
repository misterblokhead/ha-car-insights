from dataclasses import replace

from custom_components.car_insights.core.presets import RegEntry, capacity_entry, match


def _ren(rid, key, domain="sensor"):
    return RegEntry(rid, f"{domain}.invented_{key}", domain, "renault", None, f"vf1invented00000001_{key}")


def _stl(rid, key, domain="sensor"):
    return RegEntry(rid, f"{domain}.invented_{key}", domain, "stellantis_vehicles", key, f"vr3invented00000001_{key}")


RENAULT_ENTRIES = [
    _ren("r-bat", "battery_level"), _ren("r-mil", "mileage"), _ren("r-cs", "charge_state"),
    _ren("r-ps", "plug_state"), _ren("r-energy", "battery_available_energy"),
    _ren("r-aut", "battery_autonomy"), _ren("r-loc", "location", "device_tracker"),
    _ren("r-act", "battery_last_activity"),
]
STELLANTIS_ENTRIES = [
    _stl("s-bat", "battery"), _stl("s-mil", "mileage"), _stl("s-chg", "battery_charging", "binary_sensor"),
    _stl("s-plug", "battery_plugged", "binary_sensor"), _stl("s-res", "battery_residual"),
    _stl("s-aut", "autonomy"), _stl("s-loc", "vehicle", "device_tracker"), _stl("s-speed", "speed"),
    _stl("s-engine", "engine", "binary_sensor"), _stl("s-moving", "moving", "binary_sensor"),
    _stl("s-cap", "battery_capacity"),
]
STELLANTIS_BY_KEY = {e.translation_key: e for e in STELLANTIS_ENTRIES}


def test_renault_preset_matches_by_unique_id_suffix():
    name, got = match("renault", RENAULT_ENTRIES)
    assert name == "renault"
    assert got == {"charge_level": "r-bat", "odometer": "r-mil", "charging": "r-cs", "plugged": "r-ps",
                   "battery_energy": "r-energy", "range": "r-aut", "location": "r-loc", "report_time": "r-act"}


def test_stellantis_preset_falls_back_to_moving_for_ignition():
    name, got = match("stellantis_vehicles", [e for e in STELLANTIS_ENTRIES if e.translation_key != "engine"])
    assert name == "stellantis" and got["ignition"] == "s-moving" and got["speed"] == "s-speed"


def test_other_integration_and_foreign_platform_entries_do_not_match():
    assert match("tesla_custom", RENAULT_ENTRIES) == (None, {})
    foreign = [replace(e, platform="template") for e in RENAULT_ENTRIES]
    assert match("renault", foreign) == ("renault", {})


def test_battery_suffix_does_not_match_battery_residual():
    _, got = match("stellantis_vehicles", [STELLANTIS_BY_KEY["battery_residual"]])
    assert "charge_level" not in got


def test_stellantis_capacity_entry():
    assert capacity_entry("stellantis_vehicles", STELLANTIS_ENTRIES).registry_id == "s-cap"
    assert capacity_entry("renault", RENAULT_ENTRIES) is None
