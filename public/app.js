const form = document.getElementById("movie-form");
const list = document.getElementById("movies");

function renderMovie(movie, prepend = false) {
  const item = document.createElement("li");
  item.textContent = `${movie.title}${movie.year ? ` (${movie.year})` : ""}`;
  if (prepend) {
    list.prepend(item);
  } else {
    list.append(item);
  }
}

async function loadMovies() {
  const response = await fetch("/api/movies");
  const movies = await response.json();
  list.innerHTML = "";
  movies.reverse().forEach((movie) => renderMovie(movie));
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = {
    title: form.title.value,
    year: form.year.value,
  };

  const response = await fetch("/api/movies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    form.reset();
  }
});

loadMovies();

const events = new EventSource("/events");
events.addEventListener("movie-added", (event) => {
  const movie = JSON.parse(event.data);
  renderMovie(movie, true);
});
