# VoiceGuard AI Backend - Configuration Module
# Load environment variables using dotenv: GOOGLE_CLOUD_PROJECT, MODEL_PATH, PORT
# Define constants: SAMPLE_RATE=16000, MEL_SPEC_SHAPE=(128, 128), MAX_FILE_SIZE=10*1024*1024 (10MB)
# Export settings class with validation using Pydantic

from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    PORT: int = int(os.getenv("PORT", "8000"))
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    GOOGLE_PROJECT_ID: str | None = os.getenv("GOOGLE_PROJECT_ID")
    GOOGLE_LOCATION: str = os.getenv("GOOGLE_LOCATION", "us-central1")

settings = Settings()
