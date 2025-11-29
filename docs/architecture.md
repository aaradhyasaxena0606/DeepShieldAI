# VoiceGuard AI Architecture

## Overview
Frontend (React + Vite + Tailwind) uploads audio to Backend (FastAPI). Backend preprocesses audio (librosa) -> mel-spectrogram features -> model inference (CNN) -> rule-based pattern matching + Gemini (later) for explanation.

## Components
- Frontend: Upload, waveform (wavesurfer.js), results display.
- Backend: `/analyze` endpoint, audio feature extraction, model service, RAG service.
- RAG: JSON knowledge base + simple matcher.
- ML Service: Separate training workspace for CNN model, exports model artifact consumed by backend.

## Data Flow
User Upload -> FastAPI receives bytes -> `audio_processor.extract_features` -> `model_service.predict` -> `rag_service.explain` -> Response JSON.

## Deployment Targets
- Backend: Cloud Run (container) or local.
- Frontend: Vercel / Firebase Hosting.
- Gemini: Vertex AI API call.

## Future Extensions
- Persist history in Firestore.
- Replace placeholder model logic with real TensorFlow saved model.
- Add authentication for enterprise API usage.
