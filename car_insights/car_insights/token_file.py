import os
import re
import secrets
from pathlib import Path

_VALID = re.compile(r"[0-9a-f]{64}")


def load_or_create(path: Path) -> str:
    if path.exists():
        existing = path.read_text().strip()
        if _VALID.fullmatch(existing):
            return existing
    path.parent.mkdir(parents=True, exist_ok=True)
    token = secrets.token_hex(32)
    tmp = path.with_name(path.name + ".tmp")
    tmp.write_text(token)
    os.replace(tmp, path)
    return token
