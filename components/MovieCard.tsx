import { Movie } from "@/data/movies";

type MovieCardProps = {
  movie: Movie;
};

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="movie-card__header">
        <p className="movie-card__vibe">{movie.vibe}</p>
        <p className="movie-card__rating">★ {movie.rating}</p>
      </div>
      <h3>{movie.title}</h3>
      <p className="movie-card__meta">
        {movie.year} · {movie.runtime} · {movie.genre}
      </p>
      <p>{movie.synopsis}</p>
      <button type="button">+ Add to Watchlist</button>
    </article>
  );
}
