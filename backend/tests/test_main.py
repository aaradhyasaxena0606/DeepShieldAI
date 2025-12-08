# Simplified VoiceGuard AI Backend - Main Entry Point for Testing
# Create FastAPI app instance with title="VoiceGuard AI API", version="1.0.0"
# Add CORS middleware: allow origins ["http://localhost:3000"], allow methods ["*"]
# Include router from api.routes, add root endpoint GET / returning {"status": "ok", "message": "VoiceGuard API"}
# Run with: uvicorn main:app --reload --host 0.0.0.0 --port 8000

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="VoiceGuard AI Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"] ,
    allow_headers=["*"]
)

@app.get("/")
async def root():
    return {"status": "ok", "message": "VoiceGuard API"}

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)