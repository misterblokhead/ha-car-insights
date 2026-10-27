from datetime import timedelta

from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.components.recorder.common import async_wait_recording_done

from custom_components.car_insights import ha_adapters
from custom_components.car_insights.core.ha_entities import parse_history


async def test_history_shape(recorder_mock, hass):
    start = dt_util.utcnow().replace(microsecond=0) - timedelta(minutes=30)
    eid, other = "sensor.invented_battery", "sensor.invented_plug"
    for i, state in enumerate(("50", "50", "55", "60"), 1):  # a repeat is no change; every real change is kept (not only "significant" ones)
        hass.states.async_set(eid, state, {"unit_of_measurement": "%"}, timestamp=(start + timedelta(minutes=5 * i)).timestamp())
    hass.states.async_set(other, "unplugged", timestamp=(start + timedelta(minutes=1)).timestamp())
    await async_wait_recording_done(hass)
    end = int((dt_util.utcnow() + timedelta(minutes=1)).timestamp() * 1000)
    got = await hass.async_add_executor_job(ha_adapters.history, hass, [eid, "sensor.invented_missing", other], int(start.timestamp() * 1000), end)
    assert [r[0]["entity_id"] for r in got] == [eid, other]
    assert all(set(row) <= {"entity_id", "state", "last_changed"} for rows in got for row in rows)
    assert [r["state"] for r in got[0]] == ["50", "55", "60"]
    parsed = parse_history(got)  # what the poller does with it
    assert [s for _, s, _ in parsed[eid]] == ["50", "55", "60"] and [s for _, s, _ in parsed[other]] == ["unplugged"]
