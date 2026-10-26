"""A thread with its own asyncio loop. SQLite lives there only: the connection has no lock, so every job runs on this loop, one step at a time."""
import asyncio
import inspect
import logging
import threading
from concurrent.futures import Future
from typing import Any, Callable, Coroutine

log = logging.getLogger(__name__)
EXECUTOR_JOIN_S = 5  # at stop, how long to wait for threads a cancelled job left running (a history fetch can take a minute)


class Worker:
    def __init__(self, name: str):
        self._loop = asyncio.new_event_loop()
        self._thread = threading.Thread(target=self._run, name=name, daemon=True)
        self._tasks: set[asyncio.Task] = set()
        self._lock = threading.Lock()  # a call cannot slip in between "stopping" being set and the loop stopping
        self._stopping = False
        self._open = asyncio.Event()  # cleared by hold(): a call waits for it before it runs
        self._open.set()

    def start(self) -> None:
        self._thread.start()

    def _run(self) -> None:
        asyncio.set_event_loop(self._loop)
        try:
            self._loop.run_forever()
        finally:
            tasks = asyncio.all_tasks(self._loop)  # the spawned jobs and any call still waiting
            for task in tasks:
                task.cancel()
            self._loop.run_until_complete(asyncio.gather(*tasks, return_exceptions=True))
            self._loop.run_until_complete(self._loop.shutdown_default_executor(timeout=EXECUTOR_JOIN_S))
            self._loop.close()

    def call(self, fn: Callable[..., Any], *args) -> Future:
        """Run `fn(*args)` on the worker loop (a coroutine result is awaited there). HA's side awaits it with `asyncio.wrap_future`."""
        async def run():
            await self._open.wait()
            result = fn(*args)
            return await result if inspect.isawaitable(result) else result

        coro = run()
        try:
            with self._lock:
                if self._stopping:
                    raise RuntimeError("worker is stopped")
                return asyncio.run_coroutine_threadsafe(coro, self._loop)
        except BaseException:
            coro.close()
            raise

    def hold(self) -> None:
        """From inside a call on the worker: calls made from now on wait until `release`. Jobs from `spawn` keep running."""
        self._open.clear()

    def release(self) -> None:
        """From any thread; nothing to do once the worker is stopping (a backup that ends during shutdown)."""
        with self._lock:
            if not self._stopping:
                self._loop.call_soon_threadsafe(self._open.set)

    def spawn(self, coro_fn: Callable[[], Coroutine]) -> None:
        """A long-running job on the worker loop, cancelled at stop."""
        def start() -> None:
            task = self._loop.create_task(coro_fn())
            self._tasks.add(task)
            task.add_done_callback(self._ended)

        with self._lock:
            if self._stopping:
                raise RuntimeError("worker is stopped")
            self._loop.call_soon_threadsafe(start)

    def _ended(self, task: asyncio.Task) -> None:
        self._tasks.discard(task)
        if not task.cancelled() and task.exception() is not None:
            log.error("background job %s ended", task.get_coro(), exc_info=task.exception())

    def stop(self) -> None:
        """Cancel every job, then join the thread. Blocks: call it off Home Assistant's loop (a job may be waiting for that loop's answer)."""
        with self._lock:
            if self._stopping:
                return
            self._stopping = True
            if self._thread.is_alive():
                self._loop.call_soon_threadsafe(self._loop.stop)
        if self._thread.is_alive():
            self._thread.join()
        elif not self._loop.is_closed():  # never started
            self._loop.close()

