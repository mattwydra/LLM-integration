# Game Recommendation Service

## Features
- Fetches game recommendations based on user input.
- Uses the igdb API for game searches.
- Displays game titles, descriptions, and (eventually) cover images.
- Requires a backend for API calls.

## How It Works
1. User enters a game title.
2. The script searches for the game on igdb.
3. If found, the game’s Steam ID is used to fetch related recommendations.
4. The results are displayed with game titles and rating score.

## How to Use
- Clone the repo
- Run `backend.py`
- Open the `index.html` file.
- Type a game name and click the search button.
- View recommendations.
