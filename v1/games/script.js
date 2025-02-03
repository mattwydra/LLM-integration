const STEAM_API_KEY = "47283DA8AB19ACC94182D16254E6BFC1"; // Replace with your actual Steam API key

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

        // Step 1: Get the game ID from Steam search
        const searchResponse = await fetch(`https://store.steampowered.com/api/storesearch/?term=${gameName}&cc=us&l=en`);
        if (!searchResponse.ok) {
            throw new Error(`Search API request failed with status ${searchResponse.status}`);
        }

        const searchData = await searchResponse.json();
        console.log("Search API response:", searchData);

        if (!searchData.items || searchData.items.length === 0) {
            resultsDiv.innerHTML = "<p>No game found.</p>";
            return;
        }

        const gameId = searchData.items[0].id; // Get the Steam App ID
        console.log("Game ID found:", gameId);

        // Step 2: Fetch recommended games (Steam has a "similar" endpoint)
        const recResponse = await fetch(`https://store.steampowered.com/recommender/${gameId}/similar?key=${STEAM_API_KEY}`);

        if (!recResponse.ok) {
            throw new Error(`Recommendation API request failed with status ${recResponse.status}`);
        }

        const recData = await recResponse.json();
        console.log("Recommendations API response:", recData);

        if (!recData || !recData.similar || recData.similar.length === 0) {
            resultsDiv.innerHTML = "<p>No recommendations found.</p>";
            return;
        }

        // Step 3: Display recommendations
        resultsDiv.innerHTML = "<h2>Recommended Games:</h2>";
        recData.similar.slice(0, 5).forEach(rec => {
            resultsDiv.innerHTML += `<p>${rec.name} - <a href="https://store.steampowered.com/app/${rec.id}/" target="_blank">View on Steam</a></p>`;
        });

    } catch (error) {
        resultsDiv.innerHTML = "<p>Failed to fetch recommendations. Try again later.</p>";
        console.error("Error in getRecommendations:", error);
    }
}
