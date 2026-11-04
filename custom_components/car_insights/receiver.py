"""Pure helpers (no Home Assistant imports) so they can be tested standalone."""
import hashlib
import hmac
import os
import shutil
import tempfile
from pathlib import Path

from .core.protocol import loads


def verify_signature(secret: str, body: bytes, header: str | None) -> bool:
    if not header or not header.startswith("sha256="):
        return False
    expected = hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()
    given = header[len("sha256="):].encode("utf-8", "surrogateescape")  # bytes: str compare raises on non-ASCII
    return hmac.compare_digest(expected.encode(), given)


def body_vehicle_matches(body: bytes, vehicle_id: str) -> bool:
    """The X-CI-Vehicle header is not signed; the signed body's vehicle_id must match the entry."""
    try:
        return loads(body).get("vehicle_id") == vehicle_id
    except (ValueError, AttributeError):  # bad JSON/UTF-8, deep nesting, or a non-object body
        return False


def is_https_url(url: str) -> bool:
    """The car only accepts https webhook URLs, so an http external URL must not produce a .conf."""
    return url.startswith("https://")


async def read_limited(content, limit: int) -> bytes | None:
    """Read a request stream, giving up (None) as soon as it exceeds limit instead of buffering it all.

    Only uses read(n): Nabu Casa-relayed webhooks arrive as HA's MockRequest, whose MockStreamReader has nothing else.
    """
    chunks, size = [], 0
    while chunk := await content.read(64 * 1024):
        size += len(chunk)
        if size > limit:
            return None
        chunks.append(chunk)
    return b"".join(chunks)


def config_file_text(webhook_url: str, secret: str, vehicle_id: str, vehicle_name: str) -> str:
    return f"webhook.url={webhook_url}\nsecret={secret}\nvehicle.id={vehicle_id}\nvehicle.name={vehicle_name}\n"


def conf_with_url(text: str, url: str) -> str | None:
    """The .conf text with its webhook.url line set to url (secret and the rest kept); None when it already holds url."""
    new = "".join(f"webhook.url={url}\n" if line.startswith("webhook.url=") else line for line in text.splitlines(keepends=True))
    return None if new == text else new


def write_conf(path: Path, text: str, url: str) -> str | None:
    """Create the .conf if absent ("created"); else point its webhook.url at url ("updated", or a full rewrite when
    the line is missing); None when unchanged. Replaces the file atomically, keeping its mode."""
    path.parent.mkdir(parents=True, exist_ok=True)
    try:
        with path.open("x") as f:
            f.write(text)
        return "created"
    except FileExistsError:
        pass
    old = path.read_text()
    new = conf_with_url(old, url) if "webhook.url=" in old else text
    if new is None or new == old:
        return None
    fd, tmp = tempfile.mkstemp(dir=path.parent, prefix=path.name, suffix=".tmp")
    try:
        with os.fdopen(fd, "w") as f:
            f.write(new)
        shutil.copymode(path, tmp)
        os.replace(tmp, path)
    except BaseException:
        Path(tmp).unlink(missing_ok=True)
        raise
    return "updated"
