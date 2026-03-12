#!/usr/bin/env python3
import json
import os
import queue
import sqlite3
import threading
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "movies.db"
PUBLIC_DIR = BASE_DIR / "public"

SSE_CLIENTS: set[queue.Queue] = set()
SSE_LOCK = threading.Lock()


def init_db() -> None:
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS movies (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                year INTEGER,
                created_at TEXT NOT NULL
            )
            """
        )
        conn.commit()


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def list_movies() -> list[dict]:
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT id, title, year, created_at FROM movies ORDER BY id DESC"
        ).fetchall()
    return [dict(row) for row in rows]


def add_movie(title: str, year: int | None) -> dict:
    created_at = datetime.now(timezone.utc).isoformat()
    with get_connection() as conn:
        cursor = conn.execute(
            "INSERT INTO movies (title, year, created_at) VALUES (?, ?, ?)",
            (title, year, created_at),
        )
        conn.commit()
        movie_id = cursor.lastrowid
    return {"id": movie_id, "title": title, "year": year, "created_at": created_at}


def broadcast(event: str, payload: dict) -> None:
    message = f"event: {event}\ndata: {json.dumps(payload)}\n\n"
    with SSE_LOCK:
        for client in list(SSE_CLIENTS):
            try:
                client.put_nowait(message)
            except Exception:
                SSE_CLIENTS.discard(client)


class MovieHandler(BaseHTTPRequestHandler):
    server_version = "MovieAppHTTP/1.0"

    def _send_json(self, payload: dict | list, status: int = HTTPStatus.OK) -> None:
        encoded = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)

    def _send_file(self, file_path: Path) -> None:
        if not file_path.exists() or not file_path.is_file():
            self.send_error(HTTPStatus.NOT_FOUND, "File not found")
            return

        content_type = "text/plain; charset=utf-8"
        if file_path.suffix == ".html":
            content_type = "text/html; charset=utf-8"
        elif file_path.suffix == ".css":
            content_type = "text/css; charset=utf-8"
        elif file_path.suffix == ".js":
            content_type = "application/javascript; charset=utf-8"

        data = file_path.read_bytes()
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self) -> None:
        path = urlparse(self.path).path

        if path == "/api/movies":
            self._send_json(list_movies())
            return

        if path == "/events":
            self._serve_events()
            return

        if path == "/":
            self._send_file(PUBLIC_DIR / "index.html")
            return

        static_file = (PUBLIC_DIR / path.lstrip("/")).resolve()
        if str(static_file).startswith(str(PUBLIC_DIR.resolve())):
            self._send_file(static_file)
            return

        self.send_error(HTTPStatus.NOT_FOUND, "Not found")

    def do_POST(self) -> None:
        path = urlparse(self.path).path
        if path != "/api/movies":
            self.send_error(HTTPStatus.NOT_FOUND, "Not found")
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            body = self.rfile.read(length)
            data = json.loads(body.decode("utf-8") or "{}")
        except (ValueError, json.JSONDecodeError):
            self._send_json({"error": "Invalid JSON payload"}, status=HTTPStatus.BAD_REQUEST)
            return

        title = str(data.get("title", "")).strip()
        year = data.get("year")
        if not title:
            self._send_json({"error": "title is required"}, status=HTTPStatus.BAD_REQUEST)
            return

        if year in ("", None):
            year = None
        else:
            try:
                year = int(year)
            except (TypeError, ValueError):
                self._send_json({"error": "year must be a number"}, status=HTTPStatus.BAD_REQUEST)
                return

        movie = add_movie(title=title, year=year)
        broadcast("movie-added", movie)
        self._send_json(movie, status=HTTPStatus.CREATED)

    def _serve_events(self) -> None:
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", "text/event-stream")
        self.send_header("Cache-Control", "no-cache")
        self.send_header("Connection", "keep-alive")
        self.end_headers()

        client_queue: queue.Queue[str] = queue.Queue()
        with SSE_LOCK:
            SSE_CLIENTS.add(client_queue)

        try:
            self.wfile.write(b"event: connected\ndata: {\"ok\": true}\n\n")
            self.wfile.flush()
            while True:
                message = client_queue.get(timeout=30)
                self.wfile.write(message.encode("utf-8"))
                self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError, queue.Empty):
            pass
        finally:
            with SSE_LOCK:
                SSE_CLIENTS.discard(client_queue)


if __name__ == "__main__":
    init_db()
    port = int(os.getenv("PORT", "8000"))
    server = ThreadingHTTPServer(("0.0.0.0", port), MovieHandler)
    print(f"Movie app backend running on http://localhost:{port}")
    server.serve_forever()
