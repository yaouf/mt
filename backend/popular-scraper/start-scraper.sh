#!/bin/bash
# Activate the virtual environment
source venv/bin/activate

# Run the Flask application
python app.py

# To run in the background, use:
# nohup python app.py > scraper.log 2>&1 &
