// shows/script.js
const BASE_URL = '/api/tmdb-proxy';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

async function getTVShowId(showName) {
    const url = `${BASE_URL}/search/tv?query=${encodeURIComponent(showName)}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results.length > 0 ? data.results[0] : null;
}

async function getRecommendations() {
    const showName = document.getElementById("showInput").value;
    const resultsDiv = document.getElementById("results");

    if (!showName) {
        resultsDiv.innerHTML = "<p>Please enter a TV show name.</p>";
        return;
    }

    resultsDiv.innerHTML = "<p>Loading...</p>";

    try {
        const show = await getTVShowId(showName);
        if (!show) {
            resultsDiv.innerHTML = "<p>No TV show found.</p>";
            return;
        }

        const recUrl = `${BASE_URL}/tv/${show.id}/recommendations`;
        const recResponse = await fetch(recUrl);
        const recData = await recResponse.json();

        if (recData.results.length === 0) {
            resultsDiv.innerHTML = "<p>No recommendations found.</p>";
            return;
        }

        resultsDiv.innerHTML = `<h2>Recommended Shows for: ${show.name}</h2>`;
        recData.results.slice(0, 5).forEach(rec => {
            resultsDiv.innerHTML += `
                <div>
                    <h3>${rec.name}</h3>
                    <img src="${IMG_BASE_URL + rec.poster_path}" alt="${rec.name}">
                    <p>${rec.overview}</p>
                </div>
            `;
        });
    } catch (error) {
        resultsDiv.innerHTML = "<p>Failed to fetch recommendations. Try again later.</p>";
        console.error("Error fetching recommendations:", error);
    }
}