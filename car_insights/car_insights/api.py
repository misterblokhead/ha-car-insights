import asyncio
import hmac
import logging
import sqlite3
import time
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Awaitable, Callable, Sequence

from fastapi import APIRouter, FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from .db import ingest
from .pipeline import late_min_t
from .protocol import ProtocolError, Sample, parse_batch

log = logging.getLogger(__name__)
# Layered limits: car batches <= 256 KB, receiver accepts 300 KB, this add-on 1 MiB (deliberately the largest so it never rejects what the receiver forwarded).
MAX_BODY = 1024 * 1024


def create_app(
    conn: sqlite3.Connection,
    token: str,
    on_ingested: Callable[[str, list[Sample], int], None],
    now_ms: Callable[[], int] = lambda: int(time.time() * 1000),
    *,
    ingested: Callable[[str, int | None, int], None] | None = None,  # (vehicle, oldest sample worth a re-derive, received): derive and publish
    reply: Callable[[str, int], tuple] | None = None,  # (vehicle, received) -> (open trip, summary), the car's answer
    background: Sequence[Callable[[], Awaitable[None]]] = (),  # long-running coroutines (the cloud poller), run on this loop
    ui: APIRouter | None = None,  # the sidebar page's API (ui_api.router)
    web_dir: Path | None = None,  # the built sidebar page, served at / when the directory exists
) -> FastAPI:
    if not token:
        raise ValueError("token must not be empty")

    @asynccontextmanager
    async def lifespan(_: FastAPI):
        tasks = [asyncio.ensure_future(b()) for b in background]
        yield
        for t in tasks:
            t.cancel()
        await asyncio.gather(*tasks, return_exceptions=True)

    app = FastAPI(lifespan=lifespan)

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
        out = {"acked_seq": acked}
        if ingested:
            try:
                ingested(batch.vehicle_id, late_min_t(batch.samples, received), received)
            except Exception:
                log.exception("ingested failed")  # the reply still answers from the stored rows
        if reply:
            try:
                current_trip, s = reply(batch.vehicle_id, received)
                out["current_trip"] = current_trip  # every ack: it changes every few seconds, the summary does not
                if s["rev"] != batch.summary_rev:
                    out["summary"] = s
            except Exception:
                log.exception("reply failed")
        return out

    if ui is not None:
        app.include_router(ui)
    if web_dir is not None and web_dir.is_dir():
        app.mount("/", StaticFiles(directory=web_dir, html=True), name="web")  # last: it matches every path the routes above did not
    return app
