async function getRecommendations() {
    const gameName = document.getElementById("mediaInput").value;
    const resultsDiv = document.getElementById("results");

    if (!gameName) {
        resultsDiv.innerHTML = "<p>Please enter a game name.</p>";
        return;
    }

    resultsDiv.innerHTML = "<p>Loading...</p>";

    try {
        // Step 1: Fetch game details based on user input
        console.log("Fetching game details for:", gameName);

        const searchResponse = await fetch(`https://api.rawg.io/api/games?key=a25dc7a8317948e2a14a436752f0d0ae&search=${gameName}`);

        if (!searchResponse.ok) {
            throw new Error(`Search API request failed with status ${searchResponse.status}`);
        }

        const searchData = await searchResponse.json();
        console.log("Search API response:", searchData);

        if (!searchData.results || searchData.results.length === 0) {
            resultsDiv.innerHTML = "<p>No game found.</p>";
            return;
        }

        const gameId = searchData.results[0].id; // Get the game ID
        console.log("Game ID found:", gameId);

        // Step 2: Fetch recommended games based on the game ID
        const recResponse = await fetch(`https://api.rawg.io/api/games/${gameId}/suggested?key=a25dc7a8317948e2a14a436752f0d0ae`);

        if (!recResponse.ok) {
            throw new Error(`Recommendation API request failed with status ${recResponse.status}`);
        }

        let recData;

        try {
            recData = await recResponse.json();
            console.log("Recommendations API response:", recData);
        } catch (error) {
            console.error("Failed to parse JSON:", error);
            resultsDiv.innerHTML = "<p>Failed to parse recommendations.</p>";
            return;
        }

        if (!recData || !recData.results || recData.results.length === 0) {
            resultsDiv.innerHTML = "<p>No recommendations found.</p>";
            return;
        }

        // Step 3: Display recommendations
        resultsDiv.innerHTML = "<h2>Recommended Games:</h2>";
        recData.results.slice(0, 5).forEach(rec => {
            resultsDiv.innerHTML += `<p>${rec.name}</p>`;
        });

    } catch (error) {
        resultsDiv.innerHTML = "<p>Failed to fetch recommendations. Try again later.</p>";
        console.error("Error in getRecommendations:", error);
    }
}
