// require('dotenv').config();
// const API_KEY = process.env.MY_KEY

// const API_KEY = "1475717fdf169bf70ce87bd0348f2cec";  // Replace manually when testing
const API_KEY = "KEY";
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

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
        resultsDiv.innerHTML += `
                        <div>
                            <h3>${movie.name}</h3>
                            <img src="${IMG_BASE_URL + movie.poster_path}" alt="${movie.name}">
                            <p>${movie.overview}</p>
                        </div>
                    `;
    });
}