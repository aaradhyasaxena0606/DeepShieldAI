# VoiceGuard AI Backend - Configuration Module
# Load environment variables using dotenv: GOOGLE_CLOUD_PROJECT, MODEL_PATH, PORT
# Define constants: SAMPLE_RATE=16000, MEL_SPEC_SHAPE=(128, 128), MAX_FILE_SIZE=10*1024*1024 (10MB)
# Export settings class with validation using Pydantic

from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

class Settings:
    PORT = int(os.getenv("PORT", "8000"))
    # Use a model that's actually available in the API
    GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    # For Google AI Studio API (free tier)
    GOOGLE_AI_STUDIO_KEY = os.getenv("GOOGLE_AI_STUDIO_KEY")
    # Deprecated - for Vertex AI (paid)
    GOOGLE_PROJECT_ID = os.getenv("GOOGLE_PROJECT_ID")
    GOOGLE_LOCATION = os.getenv("GOOGLE_LOCATION", "us-central1")

settings = Settings()