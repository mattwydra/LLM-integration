// movies/script.js
const API_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Function to get encrypted API key from GitHub Actions
async function getEncryptedKey() {
    try {
        // Fetch the encrypted key file that's generated during build
        const response = await fetch('/LLM-integration/api-key.js');
        const text = await response.text();
        // Extract the encrypted key from the file
        const match = text.match(/const ENCRYPTED_KEY = ["']([^"']+)["']/);
        if (match && match[1]) {
            return match[1];
        }
        throw new Error('Could not find encrypted key');
    } catch (error) {
        console.error('Error fetching encrypted key:', error);
        return null;
    }
}

// Simple encryption/decryption (this is security through obscurity, not true security)
function decrypt(encryptedKey) {
    // This is a very basic decryption - in a real app you'd use something more robust
    return atob(encryptedKey);
}

async function getMovieId(movieName) {
    try {
        const encryptedKey = await getEncryptedKey();
        if (!encryptedKey) throw new Error('Failed to get API key');

        const key = decrypt(encryptedKey);
        const url = `${API_URL}/search/movie?api_key=${key}&query=${encodeURIComponent(movieName)}`;

        const response = await fetch(url);
        const data = await response.json();
        return data.results.length > 0 ? data.results[0].id : null;
    } catch (error) {
        console.error('Error getting movie ID:', error);
        return null;
    }
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

        const encryptedKey = await getEncryptedKey();
        if (!encryptedKey) throw new Error('Failed to get API key');

        const key = decrypt(encryptedKey);
        const recommendUrl = `${API_URL}/movie/${movieId}/recommendations?api_key=${key}`;

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