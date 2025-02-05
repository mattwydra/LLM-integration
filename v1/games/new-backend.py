from flask import Flask, request, jsonify
import requests
import math
import os
from flask_cors import CORS
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

# Load environment variables from the .env file
load_dotenv("/LLM-integration/v1/secrets/games/.env")

# Replace these with your IGDB credentials
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
TOKEN_URL = "https://id.twitch.tv/oauth2/token"
IGDB_API_URL = "https://api.igdb.com/v4/games"

# Get an access token from IGDB
def get_access_token():
    response = requests.post(TOKEN_URL, data={
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "grant_type": "client_credentials"
    })
    
    if response.status_code == 200:
        return response.json().get("access_token")
    else:
        return None

ACCESS_TOKEN = get_access_token()

# Function to calculate the score based on the formula
def calculate_score(r, p):
    try:
        score = (r * math.log(p)) / (1 + math.log(r))
        return score
    except:
        return 0  # Return 0 if there's an error (e.g., log(0) or other issues)

@app.route("/search", methods=["GET"])
def search_game():
    global ACCESS_TOKEN  # Reuse the token until it expires

    game_name = request.args.get("name")  # Get game name from query params
    if not game_name:
        return jsonify({"error": "Missing game name"}), 400

    headers = {
        "Client-ID": CLIENT_ID,
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    body = f'search "{game_name}"; fields name,genres,cover,rating,ratings_count; limit 5;'

    response = requests.post(IGDB_API_URL, headers=headers, data=body)

    if response.status_code == 401:  # Token expired, refresh it
        ACCESS_TOKEN = get_access_token()
        headers["Authorization"] = f"Bearer {ACCESS_TOKEN}"
        response = requests.post(IGDB_API_URL, headers=headers, data=body)

    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch data from IGDB"}), 500

    games = response.json()
    recommended_games = []

    # Calculate score for each game
    for game in games:
        rating = game.get("rating", 0) / 100  # Normalize the rating to 0-1 range
        ratings_count = game.get("ratings_count", 1)  # Avoid dividing by 0
        score = calculate_score(ratings_count, rating)
        game['score'] = score  # Add the score to the game data
        recommended_games.append(game)

    # Sort games by score (descending)
    recommended_games.sort(key=lambda x: x['score'], reverse=True)

    return jsonify(recommended_games)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
