import json
import os

import pytz
import requests
from apscheduler.schedulers.background import BackgroundScheduler
from bs4 import BeautifulSoup
from dotenv import load_dotenv  # Import dotenv
from flask import Flask, jsonify, request

# Load environment variables
load_dotenv()
# Flask app
app = Flask(__name__)


# API Key from environment
API_KEY = os.getenv("API_KEY")

# Determine environment
ENV = os.getenv("ENV", "development")  # Default to 'development'
STORAGE_FILE = "popular_articles.json"

def scrape_popular_articles():
    """Scrape the popular pages from Brown Daily Herald."""
    url = "https://www.browndailyherald.com/"

# Add headers to mimic a browser
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        "X-API-KEY": API_KEY  
    }

    try:
        print(f"Making request to {url} with headers: {headers}")
        response = requests.get(url, headers=headers)
        print(f"Response status code: {response.status_code}")
        
        # Debug 403 errors specifically
        if response.status_code == 403:
            print("403 Forbidden Error detected!")
            print(f"Response headers: {dict(response.headers)}")
            print(f"Response content: {response.text[:500]}...")  # Print first 500 chars
            return  # Exit function if we get a 403
            
        response.raise_for_status()  # Raise exception for other HTTP errors
        soup = BeautifulSoup(response.text, 'html.parser')

        # Find the "Popular" section
        popular_section = soup.find('div', class_='subheader', string='Popular')
        articles_data = []
        
        if popular_section:
            # Get the container that follows the Popular header
            popular_container = popular_section.find_parent('div').find_next_sibling('div')
            # Find all articles within this container
            popular_articles = popular_container.find_all('article')
            
            for article in popular_articles:
                link = article.find('a')
                if link:
                    title = link.text.strip()
                    url = link['href']
                    print(f"Title: {title}")
                    print(f"URL: {url}")
                    print("-" * 50)
                    
                    # Add article to our data
                    articles_data.append({
                        "title": title,
                        "url": url
                    })
        else:
            print("Could not find 'Popular' section in the HTML")
            print("HTML structure may have changed or the section doesn't exist")
            # Print a small portion of the HTML for debugging
            print(f"HTML snippet: {soup.prettify()[:1000]}...")
    
        # Save articles to file
        if articles_data:
            with open(STORAGE_FILE, 'w') as f:
                json.dump(articles_data, f)
            print(f"Saved {len(articles_data)} articles to {STORAGE_FILE}")
        else:
            print("No articles found to save")
    except requests.exceptions.HTTPError as e:
        print(f"HTTP Error occurred: {e}")
        print(f"Response status code: {e.response.status_code}")
        print(f"Response headers: {dict(e.response.headers)}")
    except Exception as e:
        print(f"Error occurred during scraping: {type(e).__name__}: {e}")

# Load stored articles
def load_articles():
    if os.path.exists(STORAGE_FILE):
        with open(STORAGE_FILE, "r") as f:
            data= json.load(f)
            print("loaded",data)
            return data
    return []

# Health check endpoint (no authentication required)
@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "ok",
        "message": "Server is running",
        "env": ENV,
        "api_key_configured": bool(API_KEY)  # Just reports if an API key exists, not the actual key
    })

# API Endpoint
@app.route("/api/popular-articles", methods=["GET"])
def get_popular_articles():
    api_key = request.headers.get("X-API-KEY")

    print(f"Received API Key: {api_key}")  # Debugging output
    print(f"Expected API Key: {API_KEY}")  # Debugging output
    print(f"API Keys match: {api_key == API_KEY}")  # Check if keys match
    print(f"Headers: {dict(request.headers)}")  # Print all headers
    print(f"Client IP: {request.remote_addr}")  # Log client IP
    print(f"Request method: {request.method}")  # Log request method
    print(f"Request path: {request.path}")  # Log request path

    if api_key != API_KEY:
        print("Unauthorized access attempt")
        error_response = {
            "error": "Unauthorized", 
            "message": "Invalid or missing API key",
            "status_code": 401
        }
        return jsonify(error_response), 401

    articles = load_articles()
    print(f"Returning articles: {articles}")  # Print articles being returned
    return jsonify(articles)


# Scheduler to scrape every 12 hours
scheduler = BackgroundScheduler(timezone=pytz.UTC)
scheduler.add_job(scrape_popular_articles, "interval", hours=12)
scheduler.start()


# Initial scrape on startup
scrape_popular_articles()



if __name__ == "__main__":
    port = 5001
    host = "0.0.0.0"  # Listen on all available interfaces
    
    # Print server URLs
    if ENV == "development":
        print(f"\nServer running in DEVELOPMENT mode")
        print(f"Local URL: http://localhost:{port}")
        print(f"Network URL: http://<your-ip-address>:{port}")
    else:
        print(f"\nServer running in PRODUCTION mode")
        print(f"Server URL: http://<server-address>:{port}")
    
    print(f"\nAPI Endpoints:")
    print(f"- Health check: GET /health")
    print(f"- Popular articles: GET /popular-articles (requires X-API-KEY)")
    print(f"- Manual scrape: POST /scrape-popular (requires X-API-KEY)")
    
    # Try to get the actual IP address
    try:
        import socket
        hostname = socket.gethostname()
        local_ip = socket.gethostbyname(hostname)
        print(f"\nDetected IP address: {local_ip}")
        print(f"You can access the server at: http://{local_ip}:{port}")
    except Exception as e:
        print(f"Could not determine IP address: {e}")
    
    print("\nPress Ctrl+C to stop the server")
    
    app.run(debug=(ENV == "development"), host=host, port=port)
