import hmac
import logging
import sqlite3
import time
from typing import Callable

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from .db import ingest
from .protocol import ProtocolError, Sample, parse_batch

log = logging.getLogger(__name__)
# Layered limits: car batches <= 256 KB, receiver accepts 300 KB, this add-on 1 MiB (deliberately the largest so it never rejects what the receiver forwarded).
MAX_BODY = 1024 * 1024


def create_app(
    conn: sqlite3.Connection,
    token: str,
    on_ingested: Callable[[str, list[Sample], int], None],
    now_ms: Callable[[], int] = lambda: int(time.time() * 1000),
) -> FastAPI:
    if not token:
        raise ValueError("token must not be empty")
    app = FastAPI()

    @app.get("/health")
    def health():
        return {"ok": True}

    # async def with no awaits around the work: it runs on the event loop, so ingests on the
    # shared connection are serialized without a lock. shortcut: blocks the loop per batch.
    @app.post("/ingest")
    async def post_ingest(request: Request):
        auth = request.headers.get("authorization", "")
        if not hmac.compare_digest(auth.encode(), f"Bearer {token}".encode()):
            return JSONResponse({"error": "unauthorized"}, status_code=401)
        body = bytearray()
        async for chunk in request.stream():
            body += chunk
            if len(body) > MAX_BODY:
                return JSONResponse({"error": "body too large"}, status_code=413)
        try:
            batch = parse_batch(body)
        except ProtocolError as e:
            return JSONResponse({"error": str(e)}, status_code=400)
        received = now_ms()
        try:
            acked = ingest(conn, batch.vehicle_id, batch.source_id, batch.samples, received)
        except Exception:
            log.exception("ingest failed")
            return JSONResponse({"error": "internal error"}, status_code=500)
        try:
            on_ingested(batch.vehicle_id, batch.samples, received)
        except Exception:
            log.exception("on_ingested failed")
        return {"acked_seq": acked}

    return app
