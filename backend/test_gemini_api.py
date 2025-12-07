#!/usr/bin/env python3
"""
Test script to verify Gemini API integration
"""

import os
import sys
import requests
import json

# Add the backend directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

# Load environment variables directly
from dotenv import load_dotenv
# Load from the deployment directory where the .env file is located
dotenv_path = os.path.join(os.path.dirname(__file__), '..', 'deployment', '.env')
load_dotenv(dotenv_path)

# Get the API key and model name from environment
api_key = os.getenv("GOOGLE_AI_STUDIO_KEY")
model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

def test_gemini_api():
    """Test the Gemini API with a simple request"""
    print("Testing Gemini API integration...")
    
    print(f"API Key: {'***' + api_key[-4:] if api_key else 'None'}")
    print(f"Model Name: {model_name}")
    
    if not api_key:
        print("ERROR: API key not set!")
        return False
    
    # Prepare a simple test prompt
    prompt = "Say hello world in a single sentence."
    
    # Prepare the request
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
    
    headers = {
        "Content-Type": "application/json"
    }
    
    data = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 100,
        }
    }
    
    print(f"Making request to: {url}")
    
    try:
        # Make the API request
        response = requests.post(url, headers=headers, json=data)
        
        print(f"Response status: {response.status_code}")
        print(f"Response headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            response_data = response.json()
            print("Response data:")
            print(json.dumps(response_data, indent=2))
            
            if "candidates" in response_data and len(response_data["candidates"]) > 0:
                candidate = response_data["candidates"][0]
                if "content" in candidate and "parts" in candidate["content"]:
                    text = candidate["content"]["parts"][0]["text"]
                    print(f"\nGenerated text: {text}")
                    print("SUCCESS: Gemini API is working correctly!")
                    return True
        
        print(f"ERROR: API request failed with status {response.status_code}")
        print(f"Response text: {response.text}")
        return False
        
    except Exception as e:
        print(f"ERROR: Exception occurred: {e}")
        return False

if __name__ == "__main__":
    test_gemini_api()