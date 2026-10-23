import pytest

from car_insights import access
from car_insights.access import Viewer
from car_insights.db import connect, json_dumps

ADMIN = Viewer("u-admin", "Admin", True)
VIEWER = Viewer("u-viewer", "Viewer", False)


@pytest.fixture
def conn():
    c = connect(":memory:")
    for vid, name in (("car1", "Car One"), ("car2", None), ("car3", "Car Three")):
        c.execute("INSERT INTO vehicles(vehicle_id, meta_json) VALUES(?,?)",
                  (vid, json_dumps({"vehicle_name": name}) if name else None))
    return c


def test_admin_sees_every_vehicle(conn):
    assert access.visible_vehicles(conn, ADMIN) == ["car1", "car2", "car3"]


def test_viewer_sees_only_listed_vehicles(conn):
    access.set_vehicle(conn, "car3", None, ["u-viewer"])
    access.set_vehicle(conn, "car1", None, ["u-viewer", "u-other"])
    access.set_vehicle(conn, "car2", None, ["u-other"])
    assert access.visible_vehicles(conn, VIEWER) == ["car1", "car3"]
    assert access.views(conn, VIEWER)["vehicles"] == [{"id": "car1", "name": "Car One"}, {"id": "car3", "name": "Car Three"}]
    assert access.visible_vehicles(conn, Viewer("u-nobody", None, False)) == []


def test_vehicle_name_falls_back_to_id(conn):
    assert {"id": "car2", "name": "car2"} in access.views(conn, ADMIN)["vehicles"]


def test_group_listed_only_when_all_members_visible(conn):
    gid = access.create_group(conn, "Fleet")
    access.set_vehicle(conn, "car1", gid, ["u-viewer"])
    access.set_vehicle(conn, "car2", gid, [])
    assert access.views(conn, VIEWER)["groups"] == []
    assert access.resolve(conn, VIEWER, f"g:{gid}") is None
    access.set_vehicle(conn, "car2", gid, ["u-viewer"])
    assert access.views(conn, VIEWER)["groups"] == [{"id": gid, "name": "Fleet", "vehicle_ids": ["car1", "car2"]}]
    assert access.resolve(conn, VIEWER, f"g:{gid}") == ["car1", "car2"]
    assert access.resolve(conn, ADMIN, f"g:{gid}") == ["car1", "car2"]


def test_empty_group_not_listed(conn):
    gid = access.create_group(conn, "Empty")
    assert access.views(conn, ADMIN)["groups"] == []
    assert access.resolve(conn, ADMIN, f"g:{gid}") is None


def test_resolve_rejects_unknown_prefix_and_hidden_vehicle(conn):
    access.set_vehicle(conn, "car1", None, ["u-viewer"])
    assert access.resolve(conn, VIEWER, "v:car1") == ["car1"]
    assert access.resolve(conn, VIEWER, "v:car2") is None
    assert access.resolve(conn, ADMIN, "v:nope") is None
    for bad in ("car1", "x:car1", "", "v", "g:nope"):
        assert access.resolve(conn, ADMIN, bad) is None


def test_headers_admin_from_groups():
    h = {"X-Remote-User-Id": "u-admin", "X-Remote-User-Groups": "system-users,system-admin"}
    assert access.viewer_from_headers(h).is_admin is True
    h["X-Remote-User-Groups"] = "system-users"
    assert access.viewer_from_headers(h).is_admin is False
    assert access.viewer_from_headers({"X-Remote-User-Id": "u-viewer"}).is_admin is False
    # a group that merely contains the word must not count
    assert access.viewer_from_headers({"X-Remote-User-Id": "u", "X-Remote-User-Groups": "not-system-admin"}).is_admin is False


def test_headers_are_case_insensitive():
    v = access.viewer_from_headers({"x-remote-user-id": "u-admin", "x-remote-user-groups": "system-admin"})
    assert v == Viewer("u-admin", None, True)


def test_headers_without_user_id_is_none():
    assert access.viewer_from_headers({}) is None
    assert access.viewer_from_headers({"X-Remote-User-Name": "x", "X-Remote-User-Groups": "system-admin"}) is None
    assert access.viewer_from_headers({"X-Remote-User-Id": "  "}) is None


def test_display_name_falls_back_to_username():
    h = {"X-Remote-User-Id": "u-viewer", "X-Remote-User-Name": "uname", "X-Remote-User-Display-Name": "Display"}
    assert access.viewer_from_headers(h).name == "Display"
    del h["X-Remote-User-Display-Name"]
    assert access.viewer_from_headers(h).name == "uname"
    assert access.viewer_from_headers({"X-Remote-User-Id": "u-viewer"}).name is None


def test_delete_group_clears_vehicle_group(conn):
    gid = access.create_group(conn, "Fleet")
    access.set_vehicle(conn, "car1", gid, [])
    access.delete_group(conn, gid)
    assert conn.execute("SELECT cost_group_id FROM vehicles WHERE vehicle_id='car1'").fetchone() == (None,)
    assert access.settings(conn)["groups"] == []


def test_set_vehicle_unknown_group_or_vehicle_raises(conn):
    access.set_vehicle(conn, "car1", None, ["u-viewer"])
    with pytest.raises(KeyError):
        access.set_vehicle(conn, "car1", "nope", [])
    with pytest.raises(KeyError):
        access.set_vehicle(conn, "nope", None, [])
    # a rejected call changes nothing
    assert access.visible_vehicles(conn, VIEWER) == ["car1"]


def test_set_vehicle_replaces_viewers_and_dedupes(conn):
    access.set_vehicle(conn, "car1", None, ["u-a", "u-b", "u-a"])
    access.set_vehicle(conn, "car1", None, ["u-c"])
    assert access.settings(conn)["vehicles"][0]["viewers"] == ["u-c"]


def test_group_name_validation(conn):
    assert access.create_group(conn, "  Fleet  ") and access.settings(conn)["groups"][0]["name"] == "Fleet"
    for bad in ("", "   ", "x" * 41):
        with pytest.raises(ValueError):
            access.create_group(conn, bad)
    gid = access.settings(conn)["groups"][0]["id"]
    assert len(gid) == 8
    access.rename_group(conn, gid, "x" * 40)
    with pytest.raises(ValueError):
        access.rename_group(conn, gid, " ")
    with pytest.raises(KeyError):
        access.rename_group(conn, "nope", "ok")


def test_see_upserts_last_seen(conn):
    access.see(conn, VIEWER, 1000)
    access.see(conn, Viewer("u-viewer", "Renamed", False), 2000)
    access.see(conn, Viewer("u-anon", None, False), 1500)
    users = {u["id"]: u for u in access.settings(conn)["users"]}
    assert users["u-viewer"] == {"id": "u-viewer", "name": "Renamed", "last_seen": 2000}
    assert users["u-anon"]["name"] is None and len(users) == 2


def test_settings_shape(conn):
    gid = access.create_group(conn, "Fleet")
    access.set_vehicle(conn, "car1", gid, ["u-b", "u-a"])
    s = access.settings(conn)
    assert s["vehicles"][0] == {"id": "car1", "name": "Car One", "group_id": gid, "viewers": ["u-a", "u-b"]}
    assert [v["id"] for v in s["vehicles"]] == ["car1", "car2", "car3"] and s["vehicles"][1]["group_id"] is None
    assert s["groups"] == [{"id": gid, "name": "Fleet"}]
