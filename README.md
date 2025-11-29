# VoiceGuard AI - Deepfake Audio Detection Platform

> **Project overview with setup instructions, tech stack, team members, demo links, and "Run Locally" guide**
> Include problem statement, features list, architecture diagram link, and hackathon context

Lightweight deepfake audio detection with interpretable explanations.

## Features
- Upload audio (WAV/MP3) and get fake/real prediction.
- Confidence gauge + badge.
- Simple RAG explanation using pattern matching + (future) Gemini.
- Modular architecture (frontend, backend, ml-service).

## Quick Start
```powershell
# Frontend
cd frontend
npm install
npm run dev

# Backend (create venv first)
cd ../backend
python -m venv .venv; . .venv/Scripts/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## API
See `docs/api-spec.yaml` for OpenAPI definition.

## Folder Structure
Described in PRD and aligned with team roles:
- `frontend/` React + Vite + Tailwind
- `backend/` FastAPI services, RAG logic, gemini service
- `ml-service/` Training scripts and notebooks
- `docs/` Architecture, API spec, demo script
- `tests/` Placeholder integration tests

## Environment Variables
Frontend: `VITE_API_BASE_URL` in `.env`
Backend: `PORT`, `GEMINI_MODEL`, `GOOGLE_PROJECT_ID`, `GOOGLE_LOCATION`

## Roadmap
- Replace placeholder model with trained CNN export
- Integrate Gemini API in RAG service
- Add history persistence (Firestore)

## License
Provided for hackathon demonstration purposes.
