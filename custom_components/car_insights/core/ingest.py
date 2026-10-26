import logging

from . import db, pipeline
from .protocol import ProtocolError, parse_batch
from .publisher import Publisher

log = logging.getLogger(__name__)


def handle_batch(app: pipeline.App, publisher: Publisher, body: bytes, received: int) -> tuple[int, dict]:
    """Store one car batch and answer it: (HTTP status, reply body). Runs on one thread at a time, so the shared connection needs no lock."""
    try:
        batch = parse_batch(body)
    except ProtocolError as e:
        return 400, {"error": str(e)}
    try:
        acked = db.ingest(app.conn, batch.vehicle_id, batch.source_id, batch.samples, received)
    except Exception:
        log.exception("ingest failed")
        return 500, {"error": "internal error"}
    try:
        publisher.on_ingested(batch.vehicle_id, batch.samples, received)
    except Exception:
        log.exception("on_ingested failed")
    out = {"acked_seq": acked}
    try:
        pipeline.ingested(app, batch.vehicle_id, pipeline.late_min_t(batch.samples, received), received)
    except Exception:
        log.exception("ingested failed")  # the reply still answers from the stored rows
    try:
        current_trip, s = pipeline.reply(app, batch.vehicle_id, received)
        out["current_trip"] = current_trip  # every ack: it changes every few seconds, the summary does not
        if s["rev"] != batch.summary_rev:
            out["summary"] = s
    except Exception:
        log.exception("reply failed")
    return 200, out
