from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    PORT: int = int(os.getenv("PORT", "8000"))
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    GOOGLE_PROJECT_ID: str | None = os.getenv("GOOGLE_PROJECT_ID")
    GOOGLE_LOCATION: str = os.getenv("GOOGLE_LOCATION", "us-central1")

settings = Settings()
