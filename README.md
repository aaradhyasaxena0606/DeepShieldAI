# VoiceGuard AI - Deepfake Audio Detection Platform

> **Project overview with setup instructions, tech stack, team members, demo links, and "Run Locally" guide**

Lightweight deepfake audio detection with interpretable explanations.

## Features

- Upload audio (WAV/MP3) and get fake/real prediction.
- Confidence gauge + badge.
- Advanced RAG explanation using pattern matching + FREE Google AI Studio Gemini API.
- Modular architecture (frontend, backend, ml-service).

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: FastAPI (Python)
- **ML Service**: CNN-based model training with TensorFlow
- **AI Explanation**: Google AI Studio Gemini API
- **Deployment**: Docker

## Quick Start

### Docker Setup (Recommended)

Using Docker is the easiest way to run the application with full ML functionality:

```bash
# From the project root directory
cd deployment
docker-compose up --build
```

This will start both the frontend (port 5173) and backend (port 8000) services with all dependencies properly configured.

### Manual Setup

If you prefer to run the services manually:

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

#### Backend

```bash
cd backend
# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Set up environment variables (see Environment Variables section below)
uvicorn main:app --reload --port 8000
```

## Environment Variables

### Backend Configuration

Create a `.env` file in the `deployment` directory with the following variables:

```env
# REQUIRED: Your Google AI Studio API Key
GOOGLE_AI_STUDIO_KEY=your_actual_api_key_here

# OPTIONAL: Customize the model (defaults to gemini-1.5-flash)
GEMINI_MODEL=gemini-1.5-flash

# OPTIONAL: Server port (defaults to 8000)
PORT=8000
```

To get your Google AI Studio API key:

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click on "Get API key" in the sidebar
4. Create a new API key or use an existing one
5. Copy the API key to your `.env` file

## API

See `docs/api-spec.yaml` for OpenAPI definition.

Main endpoints:

- `POST /analyze` - Analyze an audio file
- `GET /health` - Health check endpoint

## Folder Structure

- `frontend/` React + Vite + Tailwind
- `backend/` FastAPI services, RAG logic, gemini service
- `ml-service/` Training scripts and notebooks
- `docs/` Architecture, API spec, demo script
- `tests/` Placeholder integration tests
- `deployment/` Docker configuration

## Development

### ML Model Development

The ML service includes:

- Data preprocessing scripts
- CNN model definition
- Training and evaluation scripts
- Model export utilities

To train a model:

```bash
cd ml-service
python train.py
```

### Testing

To test the Gemini integration:

```bash
cd backend
python test_gemini.py
```

## Troubleshooting

### Common Issues

1. **Port already in use**:

   - Make sure no other applications are using ports 5173 or 8000
   - You can change the ports in docker-compose.yml if needed

2. **Permission denied errors**:

   - On Linux, you might need to run Docker with sudo
   - On Windows/macOS, make sure Docker Desktop is running

3. **Build failures**:
   - Clear Docker cache: `docker builder prune`
   - Remove existing images: `docker-compose down --rmi all`

### Gemini API Issues

1. **"Gemini not initialized"**:

   - Check that you've set the `GOOGLE_AI_STUDIO_KEY` in your `.env` file
   - Ensure the API key is valid and hasn't been revoked

2. **"400 Bad Request" or "API key not valid"**:

   - Verify your API key is correct and properly formatted
   - Make sure there are no extra spaces or characters in the key

3. **"429 Too Many Requests"**:
   - You've hit the rate limit (15 requests per minute)
   - Wait a minute and try again

## Roadmap

- Replace placeholder model with trained CNN export
- Add history persistence (Firestore)
- Implement user authentication
- Add batch processing capabilities

## License

Provided for hackathon demonstration purposes.
