async function getRecommendations() {
    const gameName = document.getElementById("mediaInput").value;
    const resultsDiv = document.getElementById("results");

    if (!gameName) {
        resultsDiv.innerHTML = "<p>Please enter a game name.</p>";
        return;
    }

    resultsDiv.innerHTML = "<p>Loading...</p>";

    try {
        console.log("Fetching game details for:", gameName);
        const searchResponse = await fetch(`http://localhost:5000/search?name=${gameName}`);

        if (!searchResponse.ok) {
            throw new Error(`Search API request failed with status ${searchResponse.status}`);
        }

        const searchData = await searchResponse.json();
        console.log("Search API response:", searchData);

        if (!searchData || !searchData.recommendations || searchData.recommendations.length === 0) {
            resultsDiv.innerHTML = "<p>No recommendations found.</p>";
            return;
        }

        resultsDiv.innerHTML = `<h2>Recommendations based on ${searchData.game}:</h2>`;
        searchData.recommendations.forEach(game => {
            resultsDiv.innerHTML += `<p>${game.name} (Rating: ${Math.round(game.rating)})</p>`;
        });

    } catch (error) {
        resultsDiv.innerHTML = "<p>Failed to fetch recommendations. Try again later.</p>";
        console.error("Error in getRecommendations:", error);
    }
}
