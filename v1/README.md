# Media Recommendation Services - Version 1.4

This repository contains the **first implementations** of various media recommendation services, covering **[anime](/v1/anime/README.md), [movies](/v1/movies/README.md), [TV shows](/v1/shows/README.md), and [games](/v1/games/README.md)**. These projects use different APIs to fetch recommendations based on user input with the goal to work with only **HTML, CSS, and JavaScript** (no backend required). However, this has proven somewhat difficult (hopefully not impossible), so other solutions may be necessary.

## Overview
Each recommendation service allows users to enter a title and receive related recommendations based on that media type. The current implementations focus on retrieving basic data and presenting it in a user-friendly format.

### Implemented Recommendation Services:
- **Anime Recommendations**: Uses the **MyAnimeList API** via Jikan to fetch similar anime.
- **Movie Recommendations**: Uses **TMDb API** to provide movie recommendations.
- **TV Show Recommendations**: Also utilizes the **TMDb API** to suggest similar TV shows.
- **Game Recommendations**: Currently exploring different sources like IGDB, Steam, and RAWG for game recommendations.

## Features (Version 1.4)
- **Search Input**: Users enter a media title.
- **API Integration**: Fetches recommendations using external APIs.
- **Display Results**: Shows recommended media with images, titles, and brief descriptions.
- **Basic Error Handling**: Displays messages for invalid searches or API failures.

## Next Steps & Improvements
While this is the first functional version of the project, there are areas for enhancement:
- Find a way to host locally, or find APIs that don't require a backend or API keys.
- Improve game recommendation accuracy by finalizing the best API source.
- Optimize search functionality and handle edge cases better.
- Implement additional filtering options (e.g., genre, release year, popularity).
- Enhance the UI for a more polished user experience.
- Consider backend integration for caching and reducing API calls.

## How to Use
1. Clone the repository or download the project files.
2. Retrieve and update code with necessary APIs
3. Start any necessary backend flask apps.
4. Open `index.html` in a browser.
5. Enter a media title in the search bar.
6. View recommendations based on the selected media type.

## Future Plans
As development continues, new features and refinements will be introduced. Each recommendation service will be improved and possibly expanded with additional metadata, better filtering, and more refined recommendation logic.
