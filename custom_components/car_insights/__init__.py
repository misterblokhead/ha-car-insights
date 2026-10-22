"""Car Insights receiver: verifies HMAC-signed car batches and forwards them to the add-on."""
import logging
import time
from pathlib import Path

from aiohttp import web
from homeassistant.components import persistent_notification, webhook
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryNotReady
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.network import NoURLAvailableError

from .const import CONF_DIR, DOMAIN, MAX_BODY, TOKEN_PATH
from .receiver import TokenCache, body_vehicle_matches, config_file_text, forward, is_https_url, map_addon_status, read_limited, verify_signature

_LOGGER = logging.getLogger(__name__)
_last_warn = 0.0


def _warn_bad_signature(vehicle_id: str) -> None:
    global _last_warn
    now = time.monotonic()
    if now - _last_warn >= 60:
        _last_warn = now
        _LOGGER.warning("Rejected request with bad signature for vehicle %s", vehicle_id)


def _write_conf(path: Path, text: str) -> bool:
    """Create the file only if absent; True if written."""
    path.parent.mkdir(parents=True, exist_ok=True)
    try:
        with path.open("x") as f:
            f.write(text)
    except FileExistsError:
        return False
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    vehicle_id = entry.data["vehicle_id"]
    secret = entry.data["secret"]
    addon_url = entry.data["addon_url"]
    webhook_id = entry.data["webhook_id"]
    tokens = TokenCache(TOKEN_PATH)

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
        token = await hass.async_add_executor_job(tokens.get)
        if token is None:
            return web.Response(status=503)
        session = async_get_clientsession(hass)
        status, resp_body = await forward(session, addon_url, token, body)
        if status == 401:  # token file recreated: reread once and retry
            fresh = await hass.async_add_executor_job(tokens.refresh)
            if fresh is not None and fresh != token:
                status, resp_body = await forward(session, addon_url, fresh, body)
        mapped_status, mapped_body = map_addon_status(status, resp_body)
        if mapped_status != status:
            _LOGGER.warning("Add-on returned status %s for vehicle %s", status, vehicle_id)
        return web.Response(status=mapped_status, body=mapped_body, content_type="application/json")

    try:
        url = webhook.async_generate_url(hass, webhook_id, allow_internal=False, prefer_external=True)
    except NoURLAvailableError as err:
        persistent_notification.async_create(
            hass,
            "Car Insights needs an external URL for Home Assistant (Nabu Casa or your own domain) "
            "so the car can reach the webhook. Configure one; setup will retry.",
            title="Car Insights receiver",
            notification_id=f"{DOMAIN}_{vehicle_id}_nourl",
        )
        raise ConfigEntryNotReady("No external URL available") from err
    if not is_https_url(url):
        persistent_notification.async_create(
            hass,
            f"Car Insights needs an https external URL for Home Assistant (Nabu Casa, or your own domain with TLS); "
            f"the car rejects http. Current URL: {url}. Fix it in Settings > System > Network; setup will retry.",
            title="Car Insights receiver",
            notification_id=f"{DOMAIN}_{vehicle_id}_nohttps",
        )
        raise ConfigEntryNotReady("External URL is not https")

    conf_path = CONF_DIR / f"{vehicle_id}.conf"
    text = config_file_text(url, secret, vehicle_id, entry.data["vehicle_name"])
    written = await hass.async_add_executor_job(_write_conf, conf_path, text)

    webhook.async_register(
        hass, DOMAIN, f"Car Insights {vehicle_id}", webhook_id, handler,
        local_only=False, allowed_methods=("POST",),
    )

    if written:
        persistent_notification.async_create(
            hass,
            f"Config file for {entry.data['vehicle_name']} written to {conf_path}. Copy it to the car USB stick. "
            f"Webhook URL: {url}",
            title="Car Insights receiver",
            notification_id=f"{DOMAIN}_{vehicle_id}",
        )
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    webhook.async_unregister(hass, entry.data["webhook_id"])
    return True


async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    # a re-added vehicle gets a new secret, so the stale .conf must go
    path = CONF_DIR / f"{entry.data['vehicle_id']}.conf"
    await hass.async_add_executor_job(lambda: path.unlink(missing_ok=True))
