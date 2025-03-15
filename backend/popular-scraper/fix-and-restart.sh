#!/bin/bash

# Navigate to the script directory
cd "$(dirname "$0")"

# Activate virtual environment
source venv/bin/activate

# Fix the JSON file
echo "Fixing popular_articles.json file..."
echo "[]" > popular_articles.json
echo "File fixed with empty array."

# Restart the service
echo "Attempting to restart the service..."

# Try systemctl first (if running as a systemd service)
if command -v systemctl &> /dev/null && systemctl is-active --quiet popular-scraper.service; then
    echo "Restarting with systemctl..."
    sudo systemctl restart popular-scraper.service
    echo "Service restarted with systemctl."
# Try PM2 next (if running with PM2)
elif command -v pm2 &> /dev/null && pm2 list | grep -q "popular-scraper-prod"; then
    echo "Restarting with PM2..."
    pm2 restart popular-scraper-prod
    echo "Service restarted with PM2."
else
    echo "Could not detect running service. Starting manually..."
    # Kill any existing Python processes running app.py
    pkill -f "python app.py" || true
    
    # Start in background
    nohup python app.py > logs/scraper.log 2>&1 &
    echo "Service started manually in background."
fi

echo "Done! Check logs for any errors." 