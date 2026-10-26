"""Car Insights: verifies HMAC-signed car batches and ingests them in Home Assistant."""
import asyncio
import logging
import time
from pathlib import Path

from aiohttp import web
from homeassistant.components import cloud, persistent_notification, webhook
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryNotReady
from homeassistant.helpers.network import NoURLAvailableError

from .bridge import PLATFORMS
from .const import DOMAIN, MAX_BODY
from .receiver import body_vehicle_matches, config_file_text, is_https_url, read_limited, verify_signature, write_conf
from .panel import async_register_http, async_register_panel, remove_panel
from . import service as service_module
from .service import Service

_LOGGER = logging.getLogger(__name__)
_last_warn = float("-inf")  # the first warning counts, however soon after boot


def _warn_bad_signature(vehicle_id: str) -> None:
    global _last_warn
    now = time.monotonic()
    if now - _last_warn >= 60:
        _last_warn = now
        _LOGGER.warning("Rejected request with bad signature for vehicle %s", vehicle_id)


def _uses_cloud(hass: HomeAssistant) -> bool:
    return "cloud" in hass.config.components and cloud.async_active_subscription(hass)


async def _webhook_url(hass: HomeAssistant, webhook_id: str) -> str:
    """Nabu Casa cloudhook (always https, independent of the external URL) when subscribed, else the external URL."""
    if _uses_cloud(hass):
        try:
            return await cloud.async_get_or_create_cloudhook(hass, webhook_id)
        except (cloud.CloudNotAvailable, cloud.CloudNotConnected) as err:
            raise ConfigEntryNotReady("Nabu Casa cloud not connected") from err
    return webhook.async_generate_url(hass, webhook_id, allow_internal=False, prefer_external=True)


async def _release(hass: HomeAssistant) -> None:
    await Service.release(hass)
    if DOMAIN not in hass.data:  # the last entry is gone
        remove_panel(hass)


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    vehicle_id = entry.data["vehicle_id"]
    secret = entry.data["secret"]
    webhook_id = entry.data["webhook_id"]

    async def handler(hass: HomeAssistant, webhook_id: str, request: web.Request) -> web.Response:
        # cloud-relayed (MockRequest) requests have no content_length; chunked uploads have none either
        length = getattr(request, "content_length", None)
        if length is not None and length > MAX_BODY:
            return web.Response(status=413)
        body = await read_limited(request.content, MAX_BODY)
        if body is None:
            return web.Response(status=413)
        if request.headers.get("X-CI-Vehicle") != vehicle_id:
            return web.json_response({"error": "vehicle id mismatch"}, status=400)
        if not verify_signature(secret, body, request.headers.get("X-CI-Signature")):
            _warn_bad_signature(vehicle_id)
            return web.Response(status=401)
        if not body_vehicle_matches(body, vehicle_id):
            return web.Response(status=400)
        service = hass.data.get(DOMAIN)
        if service is None:  # the last entry is unloading
            return web.Response(status=503)
        try:
            status, reply = await service.ingest(body, int(time.time() * 1000))
        except (asyncio.CancelledError, RuntimeError) as err:  # the worker is stopping: HA is shutting down or the entry is unloading
            if isinstance(err, asyncio.CancelledError) and asyncio.current_task().cancelling():
                raise  # the request itself was cancelled (client gone)
            _LOGGER.warning("Car Insights is stopping, batch for vehicle %s not stored", vehicle_id)
            return web.Response(status=503)
        except Exception:
            _LOGGER.exception("Ingest failed for vehicle %s", vehicle_id)
            return web.Response(status=500)
        return web.json_response(reply, status=status)

    try:
        url = await _webhook_url(hass, webhook_id)
    except NoURLAvailableError as err:
        persistent_notification.async_create(
            hass,
            "Car Insights needs an external URL for Home Assistant (Nabu Casa or your own domain) "
            "so the car can reach the webhook. Configure one; setup will retry.",
            title="Car Insights",
            notification_id=f"{DOMAIN}_{vehicle_id}_nourl",
        )
        raise ConfigEntryNotReady("No external URL available") from err
    if not is_https_url(url):
        persistent_notification.async_create(
            hass,
            f"Car Insights needs an https external URL for Home Assistant (Nabu Casa, or your own domain with TLS); "
            "the car rejects http. Fix it in Settings > System > Network; setup will retry.",
            title="Car Insights",
            notification_id=f"{DOMAIN}_{vehicle_id}_nohttps",
        )
        raise ConfigEntryNotReady("External URL is not https")

    conf_path = Path(hass.config.path("car_insights", f"{vehicle_id}.conf"))
    text = config_file_text(url, secret, vehicle_id, entry.data["vehicle_name"])
    written = await hass.async_add_executor_job(write_conf, conf_path, text, url)

    await Service.acquire(hass)
    forwarded = False
    try:  # a failed setup is never unloaded, so it would not release
        await async_register_http(hass)
        await async_register_panel(hass)
        # after the service started: the bridge already holds its discovery, so the entities are made here
        forwarded = True
        await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
        if written:
            # the add-on's file is still there on an upgrade: the entry kept its URL and secret, so the car needs nothing
            moved = written == "created" and await hass.async_add_executor_job(Path(service_module.SHARE_DIR, "car_insights", f"{vehicle_id}.conf").exists)
            what = (
                f"The config file for {entry.data['vehicle_name']} moved to {conf_path} (same URL and secret as the add-on's): "
                "no new copy to the car is needed."
                if moved
                else f"Config file for {entry.data['vehicle_name']} written to {conf_path}. Copy it to the car USB stick."
                if written == "created"
                else f"The car's webhook URL changed. Copy the new {conf_path} to the USB stick and import it in the car app."
            )
            persistent_notification.async_create(
                hass, what, title="Car Insights", notification_id=f"{DOMAIN}_{vehicle_id}",
            )
        webhook.async_register(  # last: a failed setup is not unloaded, so nothing after this may fail
            hass, DOMAIN, f"Car Insights {vehicle_id}", webhook_id, handler,
            local_only=False, allowed_methods=("POST",),
        )
    except BaseException:
        if forwarded:
            await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
        await _release(hass)
        raise
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    if not await hass.config_entries.async_unload_platforms(entry, PLATFORMS):
        return False
    webhook.async_unregister(hass, entry.data["webhook_id"])
    await _release(hass)
    return True


async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    # a re-added vehicle gets a new secret, so the stale .conf must go
    path = Path(hass.config.path("car_insights", f"{entry.data['vehicle_id']}.conf"))
    await hass.async_add_executor_job(lambda: path.unlink(missing_ok=True))
    if _uses_cloud(hass):
        try:
            await cloud.async_delete_cloudhook(hass, entry.data["webhook_id"])
        except (cloud.CloudNotAvailable, ValueError):
            pass  # cloud gone or hook already deleted
