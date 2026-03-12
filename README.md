# Movie App (Realtime + Database)

This project now includes a realtime backend and persistent database for movies.

## Features
- SQLite database (`movies.db`) for persistent movie storage.
- REST API:
  - `GET /api/movies` lists movies.
  - `POST /api/movies` inserts a movie.
- Realtime stream with Server-Sent Events:
  - `GET /events` emits a `movie-added` event whenever a new movie is created.
- Basic web UI in `public/` that receives realtime updates.

## Run
```bash
python3 app.py
```

Then open `http://localhost:8000`.
