import os
import json
import requests
from flask import Flask, jsonify, request
from bs4 import BeautifulSoup
from apscheduler.schedulers.background import BackgroundScheduler

# Flask app
app = Flask(__name__)

# API Keys based on environment
API_KEYS = {
    "development": "WliA7ir3krfhXWiPAXwSD1FFJ6h2wREo",
    "production": "5b0540a9-0c0b-41c3-bed5-c88192a38e76"
}

# Determine environment
ENV = os.getenv("ENV", "development")  # Default to 'development'
STORAGE_FILE = "popular_articles.json"

def scrape_popular_articles():
    """Scrape the popular pages from Brown Daily Herald."""
    url = "https://www.browndailyherald.com/"
    headers = { 
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "X-API-KEY": API_KEYS.get(ENV)  # Pass the correct API key based on the environment
    }
    response = requests.get(url,headers=headers)
    
    if response.status_code != 200:
        print(f"Failed to fetch data: {response.status_code}")
        return
    
    soup = BeautifulSoup(response.text, "html.parser")
    popular_header = soup.find("div", string=lambda x: x and "popular" in x.lower())  # Adjust selector as needed
    
    if not popular_header:
        print("Popular header not found")
    else:
        # Find the container that holds the links (e.g., the next sibling or a nearby parent)
        popular_section = popular_header.find_parent().find_next_sibling()  # Adjust as needed
        
        if not popular_section:
            print("Popular section not found")
        else:
            articles = []
            for rank, a_tag in enumerate(popular_section.find_all("a", href=True), start=1):
                print(f"Found article: {a_tag['href']}")  # Debugging output
                articles.append({"url": a_tag["href"], "rank": rank})

            print("Scraped articles:", articles)
    print("articles",articles)
    print("Popular articles updated.")

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
