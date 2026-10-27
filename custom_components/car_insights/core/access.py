"""Who may see which vehicle (Home Assistant user), cost groups, and the admin settings that edit both."""
import uuid
from collections.abc import Collection
from dataclasses import dataclass

from . import db


@dataclass(frozen=True)
class Viewer:
    user_id: str
    name: str | None
    is_admin: bool


def see(conn, viewer: Viewer, now_ms: int) -> None:
    conn.execute("INSERT INTO seen_users VALUES(?,?,?) ON CONFLICT(user_id) DO UPDATE SET "
                 "name=excluded.name, last_seen_ms=excluded.last_seen_ms", (viewer.user_id, viewer.name, now_ms))


def visible_vehicles(conn, viewer: Viewer) -> list[str]:
    q = ("SELECT vehicle_id FROM vehicles ORDER BY vehicle_id" if viewer.is_admin else
         "SELECT vehicle_id FROM vehicle_viewers WHERE user_id=? ORDER BY vehicle_id")
    return [r[0] for r in conn.execute(q, () if viewer.is_admin else (viewer.user_id,))]


def _groups(conn) -> dict[str, list[str]]:
    out: dict[str, list[str]] = {}
    for gid, vid in conn.execute("SELECT cost_group_id, vehicle_id FROM vehicles WHERE cost_group_id IN "
                                 "(SELECT group_id FROM cost_groups) ORDER BY vehicle_id"):
        out.setdefault(gid, []).append(vid)
    return out


def _listed_groups(conn, visible: list[str]) -> dict[str, list[str]]:
    """Groups with at least one vehicle, all of them visible: a partly hidden group would leak its total."""
    return {g: v for g, v in _groups(conn).items() if set(v) <= set(visible)}


def views(conn, viewer: Viewer) -> dict:
    visible = visible_vehicles(conn, viewer)
    names = dict(conn.execute("SELECT group_id, name FROM cost_groups"))
    groups = [{"id": g, "name": names[g], "vehicle_ids": v} for g, v in _listed_groups(conn, visible).items()]
    groups.sort(key=lambda g: (g["name"].lower(), g["id"]))
    return {"vehicles": [{"id": v, "name": db.device_info(conn, v)[0]} for v in visible], "groups": groups}


def resolve(conn, viewer: Viewer, view: str) -> list[str] | None:
    kind, _, ident = view.partition(":")
    visible = visible_vehicles(conn, viewer)
    if kind == "v":
        return [ident] if ident in visible else None
    if kind == "g":
        return _listed_groups(conn, visible).get(ident)
    return None


def _name(name: str) -> str:
    name = name.strip()
    if not 1 <= len(name) <= 40:
        raise ValueError("group name must be 1-40 characters")
    return name


def create_group(conn, name: str) -> str:
    name, gid = _name(name), uuid.uuid4().hex[:8]
    conn.execute("INSERT INTO cost_groups VALUES(?,?)", (gid, name))
    return gid


def rename_group(conn, gid: str, name: str) -> None:
    if conn.execute("UPDATE cost_groups SET name=? WHERE group_id=?", (_name(name), gid)).rowcount == 0:
        raise KeyError(gid)


def delete_group(conn, gid: str) -> None:
    with db.tx(conn):
        conn.execute("UPDATE vehicles SET cost_group_id=NULL WHERE cost_group_id=?", (gid,))
        conn.execute("DELETE FROM cost_groups WHERE group_id=?", (gid,))


def set_vehicle(conn, vid: str, group_id: str | None, viewers: list[str]) -> None:
    if conn.execute("SELECT 1 FROM vehicles WHERE vehicle_id=?", (vid,)).fetchone() is None:
        raise KeyError(vid)
    if group_id is not None and conn.execute("SELECT 1 FROM cost_groups WHERE group_id=?", (group_id,)).fetchone() is None:
        raise KeyError(group_id)
    with db.tx(conn):
        conn.execute("UPDATE vehicles SET cost_group_id=? WHERE vehicle_id=?", (group_id, vid))
        conn.execute("DELETE FROM vehicle_viewers WHERE vehicle_id=?", (vid,))
        conn.executemany("INSERT OR IGNORE INTO vehicle_viewers VALUES(?,?)", [(vid, u) for u in viewers])


def settings(conn, entry_vehicles: Collection[str]) -> dict:
    """The admin settings; a vehicle without a config entry is archived."""
    viewers: dict[str, list[str]] = {}
    for vid, uid in conn.execute("SELECT vehicle_id, user_id FROM vehicle_viewers ORDER BY user_id"):
        viewers.setdefault(vid, []).append(uid)
    vehicles = [{"id": vid, "name": db.device_info(conn, vid)[0], "group_id": gid, "viewers": viewers.get(vid, []),
                 "archived": vid not in entry_vehicles}
                for vid, gid in conn.execute("SELECT vehicle_id, cost_group_id FROM vehicles ORDER BY vehicle_id")]
    groups = [{"id": g, "name": n} for g, n in conn.execute("SELECT group_id, name FROM cost_groups ORDER BY lower(name), group_id")]
    users = [{"id": u, "name": n, "last_seen": t}
             for u, n, t in conn.execute("SELECT user_id, name, last_seen_ms FROM seen_users ORDER BY lower(COALESCE(name, user_id)), user_id")]
    return {"vehicles": vehicles, "groups": groups, "users": users}
