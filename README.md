# Media Recommender

A [web application](https://mattwydra.github.io/LLM-integration/) that provides recommendations for anime, movies, games, and shows. The project is structured into multiple versions, each adding new features and data sources.

## Project Versions

### Version 1.0 - [Anime Recommendations](https://mattwydra.github.io/LLM-integration/v1/anime/index.html)

- **Objective:** Implement anime recommendations using a public API.
- **Details:** Utilize the Jikan API to fetch anime data and provide recommendations based on user input.

### Version 1.1 - Incorporate Game Recommendations

- **Objective:** Add game recommendations to the application.
- **Details:** Use the RAWG API to fetch game data and provide user recommendations.

### Version 1.2 - Incorporate Movie Recommendations

- **Objective:** Expand the application to include movie recommendations.
- **Details:** Integrate the TMDB (The Movie Database) API to fetch movie data and provide recommendations.

### Version 1.3 - Incorporate Show Recommendations

- **Objective:** Enhance the application with show recommendations.
- **Details:** Utilize the TV endpoints of the TMDB API to fetch show data and provide recommendations.

### Version 1.4 - Additional Recommendations

- **Objective:** Expand the application to include other forms of media.
- **Details:** Incorporate other recommendations for media such as books, manga, drawing inspiration, etc., using appropriate APIs or data sources.

### Version 1.x - Incorporate Additional Features

- **Objective:** Expand the functionality of the application to include recommendations based on certain factors (genre, favorites, dislikes, online profiles (such as [mal profile](https://anime.plus)), etc.).


## Future Enhancements

### Version 2.0 and Beyond

- **Objective:** Transition the backend to Cloudflare Workers for enhanced performance and scalability.
- **Details:** Migrate API calls to be handled by Cloudflare Workers, ensuring secure handling of API keys and reducing client-side processing. Further, explain what each version is capable of (larger LLMs, better uptime, etc.), and allow for version selection.

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

