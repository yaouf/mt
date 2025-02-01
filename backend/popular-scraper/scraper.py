# /// script
# requires-python = ">=3.13"
# dependencies = [
#     "beautifulsoup4",
#     "requests",
# ]
# ///
# scrape this website: https://www.browndailyherald.com/ with python and beautifulsoup

import requests
from bs4 import BeautifulSoup

url = "https://www.browndailyherald.com/"

# Add headers to mimic a browser
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Connection': 'keep-alive',
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