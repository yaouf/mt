# Popular Articles Scraper

A Flask-based service that scrapes the "Popular" section from the Brown Daily Herald website and provides the data via a REST API.

## Overview

This service:
1. Scrapes the popular articles from the Brown Daily Herald website
2. Stores them in a JSON file
3. Provides an API endpoint to retrieve the popular articles
4. Automatically refreshes the data every 12 hours

## Setup

### Prerequisites

- Python 3.8+
- Virtual environment (venv)

### Installation

1. Clone the repository
2. Navigate to the popular-scraper directory
3. Create and activate a virtual environment:

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate
```

4. Install dependencies:

```bash
pip install -r requirements.txt
```

5. Configure environment variables:

Create a `.env` file in the project root with the following variables:
```
ENV=development  # or production
API_KEY=your_api_key_here
```

You can generate a new API key using the included script:
```bash
python api-key-generator.py
```

## Running the Service

### Development Mode

```bash
# Activate the virtual environment
source venv/bin/activate

# Run the Flask app
python app.py
```

### Production Mode

1. Make the start script executable:
```bash
chmod +x start-scraper.sh
```

2. Run the script:
```bash
./start-scraper.sh
```

3. For running as a background service with PM2:
```bash
pm2 start ecosystem.config.js
```

## API Endpoints

### Health Check
- **URL**: `/api/health`
- **Method**: `GET`
- **Authentication**: None
- **Response**: Status of the service

### Get Popular Articles
- **URL**: `/api/popular-articles`
- **Method**: `GET`
- **Headers**: `X-API-KEY: your_api_key_here`
- **Response**: JSON array of popular articles

### Manual Scrape
- **URL**: `/api/scrape-popular`
- **Method**: `POST`
- **Headers**: `X-API-KEY: your_api_key_here`
- **Response**: Status of the scraping operation

## Troubleshooting

### Empty JSON File

If the `popular_articles.json` file is empty or corrupted, the service will:
1. Log a warning
2. Return an empty array
3. Attempt to re-scrape the data

You can manually trigger a scrape using the `/api/scrape-popular` endpoint.

### 403 Forbidden Errors

If you're getting 403 errors when scraping:
1. Check if the website has changed its structure
2. Verify your API key is correct
3. Try updating the User-Agent header in the code

### JSON Decode Errors

If you see JSON decode errors in the logs:
1. The `popular_articles.json` file might be corrupted
2. Delete the file and restart the service, or
3. Use the manual scrape endpoint to regenerate the file

## Deployment

For production deployment, consider:
1. Setting up a systemd service
2. Using PM2 for process management
3. Setting up proper logging
4. Configuring a reverse proxy (Nginx/Apache)

## Logs

Logs are printed to stdout/stderr. In production, you can redirect them:

```bash
nohup python app.py > scraper.log 2>&1 &
```

Or use PM2's logging capabilities. 