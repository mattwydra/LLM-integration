const API_KEY = "API_KEY";  // Replace manually when testing

async function getMovieId(movieName) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movieName)}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results.length > 0 ? data.results[0].id : null;
}

async function getRecommendations() {
    const movieName = document.getElementById("mediaInput").value;
    const resultsDiv = document.getElementById("results");

    if (!movieName) {
        resultsDiv.innerHTML = "<p>Please enter a movie name.</p>";
        return;
    }

    resultsDiv.innerHTML = "<p>Loading...</p>";

    const movieId = await getMovieId(movieName);
    if (!movieId) {
        resultsDiv.innerHTML = "<p>Movie not found.</p>";
        return;
    }

    const recommendUrl = `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${API_KEY}`;
    const response = await fetch(recommendUrl);
    const data = await response.json();

    if (data.results.length === 0) {
        resultsDiv.innerHTML = "<p>No recommendations found.</p>";
        return;
    }

    resultsDiv.innerHTML = "<h2>Recommended Movies:</h2>";
    data.results.slice(0, 5).forEach(movie => {
        resultsDiv.innerHTML += `<p><strong>${movie.title}</strong> (Rating: ${movie.vote_average})</p>`;
    });
}