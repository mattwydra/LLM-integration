// MAL Analyzer using Jikan API
// This program fetches and analyzes a user's MyAnimeList data

class MALAnalyzer {
  constructor(username) {
    this.username = username;
    this.animeList = [];
    this.baseUrl = "https://api.jikan.moe/v4";
  }

  // Fetch all anime for a user
  async fetchUserAnimeList() {
    try {
      let hasNextPage = true;
      let page = 1;
      let allAnime = [];

      // Jikan API has pagination, so we need to fetch all pages
      while (hasNextPage) {
        console.log(`Fetching page ${page} of anime list...`);
        const response = await fetch(`${this.baseUrl}/users/${this.username}/animelist?page=${page}`);

        // Respect API rate limits (4 requests per second)
        await new Promise(resolve => setTimeout(resolve, 250));

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const data = await response.json();
        allAnime = [...allAnime, ...data.data];

        // Check if there are more pages
        hasNextPage = data.pagination.has_next_page;
        page++;
      }

      this.animeList = allAnime;
      console.log(`Successfully fetched ${this.animeList.length} anime entries.`);
      return this.animeList;
    } catch (error) {
      console.error("Error fetching anime list:", error);
      throw error;
    }
  }

  // Feature 1: Get top 5 most-watched genres
  getMostWatchedGenres() {
    const genreCounts = {};

    // Count occurrences of each genre
    this.animeList.forEach(entry => {
      const anime = entry.node;
      if (anime.genres) {
        anime.genres.forEach(genre => {
          const genreName = genre.name;
          genreCounts[genreName] = (genreCounts[genreName] || 0) + 1;
        });
      }
    });

    // Sort genres by count and get top 5
    const sortedGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([genre, count]) => ({ genre, count }));

    return sortedGenres;
  }

  // Feature 2: Get all shows with a rating of 10
  getPerfectlyRatedShows() {
    return this.animeList
      .filter(entry => entry.list_status.score === 10)
      .map(entry => ({
        title: entry.node.title,
        image: entry.node.main_picture?.medium,
        url: entry.node.url,
        genres: entry.node.genres?.map(g => g.name) || [],
        score: entry.list_status.score
      }));
  }

  // Feature 3: Get top 5 ranked shows from top 10 most-watched genres
  async getTopShowsByGenres() {
    try {
      // Get top 10 genres
      const genreCounts = {};
      this.animeList.forEach(entry => {
        const anime = entry.node;
        if (anime.genres) {
          anime.genres.forEach(genre => {
            const genreName = genre.name;
            genreCounts[genreName] = (genreCounts[genreName] || 0) + 1;
          });
        }
      });

      const top10Genres = Object.entries(genreCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([genre]) => genre);

      // For each genre, get top 5 shows
      const result = {};

      for (const genre of top10Genres) {
        // Need to get the genre ID first
        const genreSearchResponse = await fetch(`${this.baseUrl}/genres/anime?q=${encodeURIComponent(genre)}`);
        await new Promise(resolve => setTimeout(resolve, 250)); // Respect rate limit

        if (!genreSearchResponse.ok) {
          console.warn(`Could not find genre ID for ${genre}`);
          continue;
        }

        const genreData = await genreSearchResponse.json();
        const genreId = genreData.data.find(g => g.name === genre)?.mal_id;

        if (!genreId) {
          console.warn(`Could not find genre ID for ${genre}`);
          continue;
        }

        // Now get top anime for this genre
        const topAnimeResponse = await fetch(`${this.baseUrl}/anime?genres=${genreId}&order_by=score&sort=desc&limit=5`);
        await new Promise(resolve => setTimeout(resolve, 250)); // Respect rate limit

        if (!topAnimeResponse.ok) {
          console.warn(`Failed to fetch top anime for genre ${genre}`);
          continue;
        }

        const topAnimeData = await topAnimeResponse.json();
        result[genre] = topAnimeData.data.map(anime => ({
          title: anime.title,
          score: anime.score,
          image: anime.images?.jpg?.image_url,
          url: anime.url,
          episodes: anime.episodes
        }));
      }

      return {
        topGenres: top10Genres,
        showsByGenre: result
      };
    } catch (error) {
      console.error("Error fetching top shows by genre:", error);
      throw error;
    }
  }

  // Additional Feature: Get personalized recommendations based on user's top rated genres
  async getPersonalizedRecommendations() {
    try {
      // Get user's top 3 genres
      const topGenres = this.getMostWatchedGenres().slice(0, 3).map(g => g.genre);

      // Get list of anime IDs the user has already watched
      const watchedIds = new Set(this.animeList.map(entry => entry.node.id));

      const recommendations = [];

      for (const genre of topGenres) {
        // Search for genre ID
        const genreSearchResponse = await fetch(`${this.baseUrl}/genres/anime?q=${encodeURIComponent(genre)}`);
        await new Promise(resolve => setTimeout(resolve, 250)); // Respect rate limit

        if (!genreSearchResponse.ok) continue;

        const genreData = await genreSearchResponse.json();
        const genreId = genreData.data.find(g => g.name === genre)?.mal_id;

        if (!genreId) continue;

        // Get top-rated anime for this genre that the user hasn't watched
        const animeResponse = await fetch(`${this.baseUrl}/anime?genres=${genreId}&order_by=score&sort=desc&limit=10`);
        await new Promise(resolve => setTimeout(resolve, 250)); // Respect rate limit

        if (!animeResponse.ok) continue;

        const animeData = await animeResponse.json();

        // Filter out already watched shows and add to recommendations
        const genreRecs = animeData.data
          .filter(anime => !watchedIds.has(anime.mal_id))
          .slice(0, 3)
          .map(anime => ({
            title: anime.title,
            score: anime.score,
            image: anime.images?.jpg?.image_url,
            url: anime.url,
            genres: anime.genres?.map(g => g.name) || []
          }));

        recommendations.push(...genreRecs);
      }

      // Return top 10 unique recommendations sorted by score
      return [...new Map(recommendations.map(item => [item.title, item])).values()]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
    } catch (error) {
      console.error("Error getting personalized recommendations:", error);
      throw error;
    }
  }

  // Utility method to get user's recently watched anime
  getRecentlyWatched(limit = 5) {
    return this.animeList
      .sort((a, b) => new Date(b.list_status.updated_at) - new Date(a.list_status.updated_at))
      .slice(0, limit)
      .map(entry => ({
        title: entry.node.title,
        score: entry.list_status.score,
        image: entry.node.main_picture?.medium,
        lastUpdated: entry.list_status.updated_at
      }));
  }
}

// Example usage:
async function analyzeMALProfile(username) {
  const analyzer = new MALAnalyzer(username);

  try {
    await analyzer.fetchUserAnimeList();

    // Feature 1: Top 5 most watched genres
    const topGenres = analyzer.getMostWatchedGenres();
    console.log("Top 5 Most Watched Genres:", topGenres);

    // Feature 2: Shows with perfect 10 rating
    const perfectShows = analyzer.getPerfectlyRatedShows();
    console.log("Shows Rated 10/10:", perfectShows);

    // Feature 3: Top shows from most watched genres
    const topShowsByGenre = await analyzer.getTopShowsByGenres();
    console.log("Top Shows by Genre:", topShowsByGenre);

    // Additional Feature: Personalized recommendations
    const recommendations = await analyzer.getPersonalizedRecommendations();
    console.log("Personalized Recommendations:", recommendations);

    return {
      username,
      topGenres,
      perfectShows,
      topShowsByGenre,
      recommendations,
      recentlyWatched: analyzer.getRecentlyWatched()
    };
  } catch (error) {
    console.error("Error analyzing profile:", error);
    throw error;
  }
}

// Run the analysis (replace with actual username)
// analyzeMALProfile("your_username_here").then(result => console.log(result));

// Example for building a simple UI in a browser environment
function createUI() {
  const app = document.getElementById('app') || document.body;

  // Create form
  const form = document.createElement('div');
  form.innerHTML = `
    <div class="container p-4">
      <h1 class="text-xl font-bold mb-4">MyAnimeList Analyzer</h1>
      <div class="mb-4">
        <label class="block mb-2">Enter MAL Username:</label>
        <input type="text" id="username" class="border p-2 w-full" placeholder="MAL Username">
      </div>
      <button id="analyze" class="bg-blue-500 text-white p-2 rounded">Analyze Profile</button>
      
      <div id="loading" class="hidden mt-4">Loading data, please wait...</div>
      
      <div id="results" class="mt-8"></div>
    </div>
  `;

  app.appendChild(form);

  // Set up event listener
  document.getElementById('analyze').addEventListener('click', async () => {
    const username = document.getElementById('username').value.trim();
    if (!username) {
      alert('Please enter a valid username');
      return;
    }

    const loadingDiv = document.getElementById('loading');
    const resultsDiv = document.getElementById('results');

    loadingDiv.classList.remove('hidden');
    resultsDiv.innerHTML = '';

    try {
      const data = await analyzeMALProfile(username);
      loadingDiv.classList.add('hidden');

      // Display results
      resultsDiv.innerHTML = `
        <h2 class="text-lg font-bold mb-2">Analysis for ${username}</h2>
        
        <div class="mb-6">
          <h3 class="font-bold">Recently Watched</h3>
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
            ${data.recentlyWatched.map(anime => `
              <div class="border p-2 rounded">
                <img src="${anime.image || '/api/placeholder/150/225'}" alt="${anime.title}" class="w-full">
                <div class="mt-2">${anime.title}</div>
                <div>Score: ${anime.score || 'N/A'}</div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="mb-6">
          <h3 class="font-bold">Top 5 Most Watched Genres</h3>
          <ul class="list-disc pl-5">
            ${data.topGenres.map(genre => `
              <li>${genre.genre} (${genre.count} anime)</li>
            `).join('')}
          </ul>
        </div>
        
        <div class="mb-6">
          <h3 class="font-bold">Shows Rated 10/10</h3>
          ${data.perfectShows.length ? `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              ${data.perfectShows.map(anime => `
                <div class="border p-2 rounded">
                  <img src="${anime.image || '/api/placeholder/150/225'}" alt="${anime.title}" class="w-full">
                  <div class="mt-2">${anime.title}</div>
                  <div>Genres: ${anime.genres.join(', ')}</div>
                </div>
              `).join('')}
            </div>
          ` : '<p>No shows rated 10/10</p>'}
        </div>
        
        <div class="mb-6">
          <h3 class="font-bold">Top Shows by Genre</h3>
          <select id="genreSelector" class="border p-2 w-full mb-2">
            <option value="">Select a genre</option>
            ${data.topShowsByGenre.topGenres.map(genre => `
              <option value="${genre}">${genre}</option>
            `).join('')}
          </select>
          
          <div id="genreShowcase"></div>
        </div>
        
        <div class="mb-6">
          <h3 class="font-bold">Personalized Recommendations</h3>
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
            ${data.recommendations.map(anime => `
              <div class="border p-2 rounded">
                <img src="${anime.image || '/api/placeholder/150/225'}" alt="${anime.title}" class="w-full">
                <div class="mt-2">${anime.title}</div>
                <div>Score: ${anime.score || 'N/A'}</div>
                <div class="text-xs">Genres: ${anime.genres.join(', ')}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      // Set up genre selector
      document.getElementById('genreSelector').addEventListener('change', (e) => {
        const genre = e.target.value;
        const showcaseDiv = document.getElementById('genreShowcase');

        if (!genre) {
          showcaseDiv.innerHTML = '';
          return;
        }

        const shows = data.topShowsByGenre.showsByGenre[genre] || [];

        showcaseDiv.innerHTML = shows.length ? `
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mt-2">
            ${shows.map(anime => `
              <div class="border p-2 rounded">
                <img src="${anime.image || '/api/placeholder/150/225'}" alt="${anime.title}" class="w-full">
                <div class="mt-2">${anime.title}</div>
                <div>Score: ${anime.score || 'N/A'}</div>
                <div>Episodes: ${anime.episodes || 'N/A'}</div>
              </div>
            `).join('')}
          </div>
        ` : '<p>No data available for this genre</p>';
      });

    } catch (error) {
      loadingDiv.classList.add('hidden');
      resultsDiv.innerHTML = `<div class="text-red-500">Error: ${error.message}</div>`;
    }
  });
}

// Export the functions
export { MALAnalyzer, analyzeMALProfile, createUI };
