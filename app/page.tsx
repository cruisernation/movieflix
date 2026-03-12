"use client";

import { useMemo, useState } from "react";
import { MovieCard } from "@/components/MovieCard";
import { movies, vibes } from "@/data/movies";

export default function HomePage() {
  const [selectedVibe, setSelectedVibe] = useState<(typeof vibes)[number] | "All">("All");

  const featuredMovie = movies[0];

  const filteredMovies = useMemo(() => {
    if (selectedVibe === "All") {
      return movies;
    }

    return movies.filter((movie) => movie.vibe === selectedVibe);
  }, [selectedVibe]);

  return (
    <main className="page">
      <section className="hero">
        <p className="hero__eyebrow">✨ CURATED DISCOVERY EXPERIENCE</p>
        <h1>CineNova</h1>
        <p>
          Find your next movie by vibe, not algorithm fatigue. Explore handpicked stories from cozy feel-good
          moments to universe-sized adventures.
        </p>
        <div className="hero__spotlight">
          <p>Tonight&apos;s spotlight</p>
          <h2>{featuredMovie.title}</h2>
          <span>
            {featuredMovie.genre} · {featuredMovie.runtime} · {featuredMovie.rating}★
          </span>
        </div>
      </section>

      <section className="filters">
        <h2>Pick your movie mood</h2>
        <div className="filters__row">
          <button
            type="button"
            className={selectedVibe === "All" ? "is-active" : ""}
            onClick={() => setSelectedVibe("All")}
          >
            All
          </button>
          {vibes.map((vibe) => (
            <button
              key={vibe}
              type="button"
              className={selectedVibe === vibe ? "is-active" : ""}
              onClick={() => setSelectedVibe(vibe)}
            >
              {vibe}
            </button>
          ))}
        </div>
      </section>

      <section className="grid">
        {filteredMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </section>
    </main>
  );
}
