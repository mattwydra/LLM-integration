// movies/script.js
const BASE_URL = '/api/tmdb-proxy';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

async function getMovieId(movieName) {
    const url = `${BASE_URL}/search/movie?query=${encodeURIComponent(movieName)}`;
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

    try {
        const movieId = await getMovieId(movieName);
        if (!movieId) {
            resultsDiv.innerHTML = "<p>Movie not found.</p>";
            return;
        }

        const recommendUrl = `${BASE_URL}/movie/${movieId}/recommendations`;
        const response = await fetch(recommendUrl);
        const data = await response.json();

        if (data.results.length === 0) {
            resultsDiv.innerHTML = "<p>No recommendations found.</p>";
            return;
        }

        resultsDiv.innerHTML = "<h2>Recommended Movies:</h2>";
        data.results.slice(0, 5).forEach(movie => {
            // Fix: Using title instead of name for movies
            resultsDiv.innerHTML += `
                <div>
                    <h3>${movie.title || movie.name}</h3>
                    <img src="${IMG_BASE_URL + movie.poster_path}" alt="${movie.title || movie.name}">
                    <p>${movie.overview}</p>
                </div>
            `;
        });
    } catch (error) {
        resultsDiv.innerHTML = "<p>Failed to fetch recommendations. Try again later.</p>";
        console.error("Error fetching recommendations:", error);
    }
}