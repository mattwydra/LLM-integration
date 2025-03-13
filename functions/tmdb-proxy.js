// functions/tmdb-proxy.js
exports.handler = async function(event) {
  const path = event.path.replace('/.netlify/functions/tmdb-proxy', '');
  const queryString = event.rawQuery;
  
  // Get the API key from environment variables
  const API_KEY = process.env.MY_API_KEY;
  
  // Extract the endpoint from the path
  const endpoint = path || '/movie/popular'; // Default endpoint
  
  try {
    // Build the URL to the TMDb API
    const url = `https://api.themoviedb.org/3${endpoint}?api_key=${API_KEY}&${queryString}`;
    
    // Make the request to TMDb
    const response = await fetch(url);
    const data = await response.json();
    
    // Return the data
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // For CORS
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    // Handle errors
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data from TMDb' })
    };
  }
};
