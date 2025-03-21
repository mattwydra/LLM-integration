# Media Recommender

A [web application](https://mattwydra.github.io/LLM-integration/) that provides recommendations for anime, movies, games, and shows. The project is structured into multiple versions, each adding new features and data sources.

## Project Versions

### Version 1.0 - [Anime Recommendations](https://mattwydra.github.io/LLM-integration/v1/anime/index.html)

- **Objective:** Implement anime recommendations using a public API.
- **Details:** Utilize the Jikan API to fetch anime data and provide recommendations based on user input.

### Version 1.1 - Incorporate [Game Recommendations](https://mattwydra.github.io/LLM-integration/v1/games/index.html)

- **Objective:** Add game recommendations to the application.
- **Details:** Use the RAWG API to fetch game data and provide user recommendations.

### Version 1.2 - Incorporate [Movie Recommendations](https://mattwydra.github.io/LLM-integration/v1/movies/index.html) (Partial Implementation)

- **Objective:** Expand the application to include movie recommendations.
- **Details:** Integrate the TMDB (The Movie Database) API to fetch movie data and provide recommendations.

### Version 1.3 - Incorporate [Show Recommendations](https://mattwydra.github.io/LLM-integration/v1/anime/index.html) (Partial Implementation)

- **Objective:** Enhance the application with show recommendations.
- **Details:** Utilize the TV endpoints of the TMDB API to fetch show data and provide recommendations.

### Version 1.4 - Additional Recommendations

- **Objective:** Expand the application to include other forms of media.
- **Details:** Incorporate other recommendations for media such as books, manga, drawing inspiration, etc., using appropriate APIs or data sources.

### Version 1.x - Incorporate Additional Features

- **Objective:** Expand the functionality of the application to include recommendations based on certain factors (genre, favorites, dislikes, online profiles (such as [mal profile](https://anime.plus)), etc.). Further features may include: library uploads (steam, psn, etc.), game saving, advanced search, etc.


## Future Enhancements

### Version 2.0-2.4:
- **Objective:** Incorporate hosting with cloud-based service.
- **Details:** Migrate API calls to be handled by Cloudflare Workers, ensuring secure handling of API keys and reducing client-side processing. Further, explain what each version is capable of (larger LLMs, better uptime, etc.), and allow for version selection.

### Version 3.0-3.4:
- **Objective:** Incorporate local hosting for better uptimes.
- **Details:** API Calls will be handled by my local machine for more permanent uptime.

### Version 4.0-4.4:
- **Objective:** Attempt serverless implementation.
- **Details:** Attempt conversion of the LLM to WebAssembly (WASM) and run entirely in the browser.
   - I'm not sure if this is possible, but will be fun to try.

## Setup and Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/mattwydra/LLM-integration.git
   cd anime-recommender
   ```

2. **Open `index.html` in Your Browser:**

   The application is built using HTML, CSS, and JavaScript and can be run directly in the browser.

## Usage

- Enter the name of an anime in the search bar.
- Click on the "Get Recommendations" button.
- The application will display a list of recommended anime based on your input.

