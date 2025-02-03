from flask import Flask, request, jsonify
import requests
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

@app.route("/search", methods=["GET"])
def search_game():
    global ACCESS_TOKEN  

    game_name = request.args.get("name")
    if not game_name:
        return jsonify({"error": "Missing game name"}), 400

    headers = {
        "Client-ID": CLIENT_ID,
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }

    # 1️⃣ Get the exact game + genre(s)
    body = f'search "{game_name}"; fields name, genres; limit 1;'
    response = requests.post(IGDB_API_URL, headers=headers, data=body)

    if response.status_code == 401:  
        ACCESS_TOKEN = get_access_token()
        headers["Authorization"] = f"Bearer {ACCESS_TOKEN}"
        response = requests.post(IGDB_API_URL, headers=headers, data=body)

    game_data = response.json()
    
    if not game_data:
        return jsonify({"error": "Game not found"}), 404

    game = game_data[0]
    genre_ids = game.get("genres", [])

    if not genre_ids:
        return jsonify({"error": "No genres found for this game"}), 404

    # 2️⃣ Get highly-rated games from the same genre(s)
    genre_filter = ",".join(map(str, genre_ids))  # Format: "1,2,3"
    recommendation_body = f'fields name, rating; where genres = ({genre_filter}) & rating > 80; limit 10; sort rating desc;'
    
    rec_response = requests.post(IGDB_API_URL, headers=headers, data=recommendation_body)

    if rec_response.status_code == 401:  
        ACCESS_TOKEN = get_access_token()
        headers["Authorization"] = f"Bearer {ACCESS_TOKEN}"
        rec_response = requests.post(IGDB_API_URL, headers=headers, data=recommendation_body)

    recommendations = rec_response.json()

    return jsonify({"game": game["name"], "recommendations": recommendations})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
