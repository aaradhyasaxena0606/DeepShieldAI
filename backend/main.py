# VoiceGuard AI Backend - Main Entry Point
# Create FastAPI app instance with title="VoiceGuard AI API", version="1.0.0"
# Add CORS middleware: allow origins ["http://localhost:3000"], allow methods ["*"]
# Include router from api.routes, add root endpoint GET / returning {"status": "ok", "message": "VoiceGuard API"}
# Run with: uvicorn main:app --reload --host 0.0.0.0 --port 8000

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router as api_router

app = FastAPI(title="VoiceGuard AI Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"] ,
    allow_headers=["*"]
)

app.include_router(api_router)

@app.get("/health")
async def health():
    return {"status": "ok"}
