const titleCache = {}; // Cache to store English titles

async function getEnglishTitle(mal_id) {
    if (titleCache[mal_id]) return titleCache[mal_id]; // Use cached title if available

    try {
        await new Promise(resolve => setTimeout(resolve, 500)); // Small delay to avoid rate limiting
        const response = await fetch(`https://api.jikan.moe/v4/anime/${mal_id}`);

        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();

        if (!data.data) throw new Error("Invalid data structure");

        const title = data.data.title_english || data.data.title;
        titleCache[mal_id] = title; // Store in cache
        return title;
    } catch (error) {
        console.error(`Failed to fetch English title for MAL ID ${mal_id}`, error);
        return "Unknown Title";
    }
}

async function getRecommendations() {
    const animeName = document.getElementById("animeInput").value;
    const resultsDiv = document.getElementById("results");

    if (!animeName) {
        resultsDiv.innerHTML = "<p>Please enter an anime name.</p>";
        return;
    }

    resultsDiv.innerHTML = "<p>Loading...</p>";

    try {
        const searchResponse = await fetch(`https://api.jikan.moe/v4/anime?q=${animeName}&limit=1`);
        const searchData = await searchResponse.json();

        if (searchData.data.length === 0) {
            resultsDiv.innerHTML = "<p>No anime found.</p>";
            return;
        }

        const animeId = searchData.data[0].mal_id;

        const recResponse = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/recommendations`);
        const recData = await recResponse.json();

        if (recData.data.length === 0) {
            resultsDiv.innerHTML = "<p>No recommendations found.</p>";
            return;
        }

        resultsDiv.innerHTML = "<h2>Recommended Anime:</h2>";

        for (const rec of recData.data.slice(0, 5)) {
            const title = await getEnglishTitle(rec.entry.mal_id);
            resultsDiv.innerHTML += `<p>${title}</p>`;
        }

    } catch (error) {
        resultsDiv.innerHTML = "<p>Failed to fetch recommendations. Try again later.</p>";
        console.error(error);
    }
}
