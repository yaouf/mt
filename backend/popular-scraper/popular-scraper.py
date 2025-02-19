import os
import json
import requests
from flask import Flask, jsonify, request
from bs4 import BeautifulSoup
from apscheduler.schedulers.background import BackgroundScheduler
from dotenv import load_dotenv  # Import dotenv

# Load environment variables
load_dotenv()
# Flask app
app = Flask(__name__)



# API Keys based on environment
API_KEYS = {
    "development": os.getenv("API_KEYS_DEVELOPMENT"),
    "production": os.getenv("API_KEYS_DEVELOPMENT")
}

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
        "X-API-KEY": API_KEYS.get(ENV)  
    }

    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Find the "Popular" section
    popular_section = soup.find('div', class_='subheader', string='Popular')
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

# Load stored articles
def load_articles():
    if os.path.exists(STORAGE_FILE):
        with open(STORAGE_FILE, "r") as f:
            data= json.load(f)
            print("loaded",data)
            return data
    return []

# API Endpoint
@app.route("/popular-articles", methods=["GET"])
def get_popular_articles():
    api_key = request.headers.get("X-API-KEY")

    print(f"Received API Key: {api_key}")  # Debugging output
    print(f"Expected API Key: {API_KEYS.get(ENV)}")  # Debugging output

    if api_key != API_KEYS.get(ENV):
        return jsonify({"error": "Unauthorized"}), 401

    articles = load_articles()
    return jsonify(articles)


# Scheduler to scrape every 12 hours
scheduler = BackgroundScheduler()
scheduler.add_job(scrape_popular_articles, "interval", hours=12)
scheduler.start()


# Initial scrape on startup
scrape_popular_articles()



if __name__ == "__main__":
    app.run(debug=(ENV == "development"), port=5000)
