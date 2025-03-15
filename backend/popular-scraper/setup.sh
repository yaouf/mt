#!/bin/bash

# Create logs directory if it doesn't exist
mkdir -p logs

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
else
    echo "Virtual environment already exists."
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Initialize JSON file if it doesn't exist or is empty
if [ ! -f "popular_articles.json" ] || [ ! -s "popular_articles.json" ]; then
    echo "Initializing popular_articles.json with empty array..."
    echo "[]" > popular_articles.json
fi

echo "Setup complete! You can now run the scraper with:"
echo "./start-scraper.sh"
echo ""
echo "Or use PM2 in production:"
echo "pm2 start ecosystem.config.js" 