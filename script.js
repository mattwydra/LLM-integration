async function getRecommendations() {
    const animeName = document.getElementById("animeInput").value;
    const resultsDiv = document.getElementById("results");
    
    if (!animeName) {
        resultsDiv.innerHTML = "<p>Please enter an anime name.</p>";
        return;
    }

    resultsDiv.innerHTML = "<p>Loading...</p>";

    try {
        // Fetch anime search results
        const searchResponse = await fetch(`https://api.jikan.moe/v4/anime?q=${animeName}&limit=1`);
        const searchData = await searchResponse.json();
        
        if (searchData.data.length === 0) {
            resultsDiv.innerHTML = "<p>No anime found.</p>";
            return;
        }

        const animeId = searchData.data[0].mal_id; // Get the anime ID
        
        // Fetch recommendations based on the anime ID
        const recResponse = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/recommendations`);
        const recData = await recResponse.json();

        if (recData.data.length === 0) {
            resultsDiv.innerHTML = "<p>No recommendations found.</p>";
            return;
        }

        // Display recommendations
        resultsDiv.innerHTML = "<h2>Recommended Anime:</h2>";
        recData.data.slice(0, 5).forEach(rec => {
            resultsDiv.innerHTML += `<p>${rec.entry.title}</p>`;
        });

    } catch (error) {
        resultsDiv.innerHTML = "<p>Failed to fetch recommendations. Try again later.</p>";
        console.error(error);
    }
}
