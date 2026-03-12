export type Movie = {
  id: number;
  title: string;
  year: number;
  runtime: string;
  genre: string;
  vibe: "Feel-Good" | "Mind-Bender" | "Dark & Gritty" | "Epic Adventure";
  rating: number;
  synopsis: string;
};

export const movies: Movie[] = [
  {
    id: 1,
    title: "Moonlight Frequency",
    year: 2021,
    runtime: "1h 58m",
    genre: "Sci-Fi Drama",
    vibe: "Mind-Bender",
    rating: 8.7,
    synopsis:
      "A radio astronomer receives messages from her future self and has one night to rewrite the timeline."
  },
  {
    id: 2,
    title: "Paper Cities",
    year: 2019,
    runtime: "2h 11m",
    genre: "Crime Thriller",
    vibe: "Dark & Gritty",
    rating: 8.1,
    synopsis:
      "An idealistic cartographer uncovers a hidden criminal grid coded into city maps."
  },
  {
    id: 3,
    title: "Solaris Kids",
    year: 2023,
    runtime: "1h 44m",
    genre: "Family Adventure",
    vibe: "Feel-Good",
    rating: 7.9,
    synopsis:
      "Two siblings build a rooftop observatory and accidentally trigger an interstellar scavenger hunt."
  },
  {
    id: 4,
    title: "The Last Compass",
    year: 2020,
    runtime: "2h 26m",
    genre: "Fantasy",
    vibe: "Epic Adventure",
    rating: 8.5,
    synopsis:
      "A runaway mapmaker and a retired guardian cross floating continents to restore a broken star compass."
  },
  {
    id: 5,
    title: "Neon Sundays",
    year: 2022,
    runtime: "1h 36m",
    genre: "Romance",
    vibe: "Feel-Good",
    rating: 7.6,
    synopsis:
      "Two rival street photographers challenge each other to find the city's most magical hidden corners."
  },
  {
    id: 6,
    title: "Echoes of Atlas",
    year: 2024,
    runtime: "2h 03m",
    genre: "Action Mystery",
    vibe: "Epic Adventure",
    rating: 8.3,
    synopsis:
      "An archaeologist decodes a singing relic that points to a kingdom erased from every map."
  }
];

export const vibes = ["Feel-Good", "Mind-Bender", "Dark & Gritty", "Epic Adventure"] as const;
