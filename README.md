# VoiceGuard AI - Deepfake Audio & Video Detection Platform

<div align="center">

**AI-Powered Real-time Deepfake Detection with Explainable Results**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.5-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.16.1-FF6F00?logo=tensorflow)](https://www.tensorflow.org/)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python)](https://www.python.org/)

[Features](#-features) • [Quick Start](#-quick-start) • [Installation](#-installation) • [API Docs](#-api-documentation) • [Troubleshooting](#-troubleshooting)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Environment Setup](#-environment-setup)
- [Installation](#-installation)
- [API Documentation](#-api-documentation)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Team](#-team)

---

## 🎯 Overview

VoiceGuard AI is a comprehensive deepfake detection platform that combines cutting-edge deep learning with explainable AI to detect manipulated audio and video content. The system provides real-time monitoring, detailed analysis, and user-friendly explanations powered by Google's Gemini AI.

### Key Capabilities

- 🎵 **Audio Analysis** - Upload WAV, MP3, or WebM files for instant detection
- 🎥 **Video Analysis** - Extract and analyze audio from MP4, AVI, MOV videos
- 🔴 **Live Monitoring** - Real-time system/microphone audio monitoring with background processing
- 🧠 **Explainable AI** - RAG-based explanations using pattern matching + Gemini
- 📊 **Confidence Metrics** - Visual confidence gauges and detailed scores
- 📜 **Analysis History** - Track and review past detections with Firebase
- 🔐 **User Authentication** - Secure login with Firebase Auth

---

## ✨ Features

### Detection Capabilities
- **Multi-format Support**: WAV, MP3, WebM audio | MP4, AVI, MOV video
- **Real-time Monitoring**: Background audio capture with 10-second chunk analysis
- **High Accuracy**: ~94% accuracy on test datasets
- **Fast Processing**: Sub-second analysis for 2-second audio clips

### User Experience
- **Drag-and-drop Upload**: Intuitive file upload interface
- **Waveform Visualization**: Visual audio representation
- **Confidence Gauges**: Clear visual feedback on detection confidence
- **Pattern Detection**: Identifies specific deepfake indicators
- **Detailed Explanations**: Natural language explanations of findings
- **Floating Monitor Widget**: Non-intrusive real-time monitoring display

### Technical Features
- **3-Channel CNN**: Mel-spectrogram with delta and delta-delta features
- **RAG System**: Pattern matching + Gemini AI for explanations
- **Firebase Integration**: User auth and history persistence
- **Docker Support**: Easy deployment with containerization
- **Responsive Design**: Mobile-friendly dark theme UI with maroon accents

---

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first styling
- **Firebase** - Authentication & Firestore database
- **Axios** - HTTP client for API calls
- **Lucide React** - Icon library
- **Web Audio API** - Real-time audio processing
- **MediaRecorder API** - Audio/video capture

### Backend
- **FastAPI** - High-performance Python web framework
- **Uvicorn** - ASGI server
- **TensorFlow 2.16** - Deep learning framework
- **Librosa 0.10** - Audio analysis library
- **MoviePy 1.0** - Video processing
- **Google Generative AI** - Gemini API for explanations
- **Pydantic** - Data validation
- **SoundFile** - Audio I/O

### Machine Learning
- **CNN Architecture** - 3-channel mel-spectrogram input (128×128×3)
- **TensorFlow/Keras** - Model training and inference
- **Scikit-learn** - ML utilities
- **NumPy & SciPy** - Numerical computing and signal processing

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

---

## 📁 Project Structure

```
voiceguard-ai/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Navbar.jsx           # Navigation header
│   │   │   ├── Footer.jsx           # Site footer
│   │   │   ├── AudioUploader.jsx    # File upload component
│   │   │   ├── LiveMonitorWidget.jsx # Floating monitor
│   │   │   ├── Waveform.jsx         # Audio visualization
│   │   │   ├── ConfidenceGauge.jsx  # Confidence meter
│   │   │   └── ...
│   │   ├── pages/           # Route page components
│   │   │   ├── LandingPage.jsx      # Marketing homepage
│   │   │   ├── HomePage.jsx         # Dashboard
│   │   │   ├── AnalyzePage.jsx      # Audio analysis
│   │   │   ├── AnalyzeVideoPage.jsx # Video analysis
│   │   │   ├── AnalyzeLivePage.jsx  # Live monitoring
│   │   │   ├── HistoryPage.jsx      # Analysis history
│   │   │   ├── Profile.jsx          # User profile
│   │   │   └── ...
│   │   ├── contexts/        # React Context providers
│   │   │   ├── AuthContext.jsx      # Authentication state
│   │   │   └── LiveMonitorContext.jsx # Live monitoring state
│   │   ├── services/        # API and audio services
│   │   │   ├── audioCapture.js      # Audio capture logic
│   │   │   └── liveAnalysisService.js # Live analysis API
│   │   ├── config/          # Firebase configuration
│   │   └── utils/           # Helper utilities
│   ├── public/              # Static assets
│   ├── .env.example         # Frontend environment template
│   ├── package.json         # Node dependencies
│   ├── Dockerfile           # Frontend container config
│   └── README.md            # Frontend documentation
│
├── backend/                 # FastAPI backend service
│   ├── api/                 # API routes and schemas
│   │   ├── routes.py       # Endpoint definitions
│   │   └── schemas.py      # Response models
│   ├── services/            # Business logic services
│   │   ├── audio_processor.py   # Audio feature extraction
│   │   ├── model_service.py     # CNN model inference
│   │   ├── rag_service.py       # RAG orchestration
│   │   └── video_processor.py   # Video to audio extraction
│   ├── rag/                 # RAG system components
│   │   ├── explainer.py         # Gemini-based explanations
│   │   ├── pattern_matcher.py   # Pattern detection
│   │   └── knowledge_base.json  # Deepfake knowledge DB
│   ├── utils/               # Helper utilities
│   ├── .env.example         # Backend environment template
│   ├── requirements.txt     # Python dependencies
│   ├── Dockerfile           # Backend container config
│   └── README.md            # Backend documentation
│
├── ml-service/              # ML model training & notebooks
│   ├── models/              # Trained model files
│   │   └── best_model.h5   # Pre-trained CNN model
│   ├── notebooks/           # Jupyter notebooks
│   └── scripts/             # Training scripts
│
├── deployment/              # Docker orchestration
│   └── docker-compose.yml   # Multi-service setup
│
├── docs/                    # Documentation
│   ├── api-spec.yaml        # OpenAPI specification
│   └── architecture.md      # System architecture
│
├── tests/                   # Integration tests
│
├── README.md                # This file
├── INSTALL_FFMPEG.md        # FFmpeg installation guide
├── TROUBLESHOOTING_MODEL_LOADING.md # Model debugging
├── SYSTEM_AUDIO_UPDATE.md   # System audio setup
└── .gitignore               # Git ignore rules
```

---

## 🚀 Quick Start

### Prerequisites

- **Docker** & **Docker Compose** (Recommended) OR
- **Python 3.11+** & **Node.js 18+** (Manual setup)
- **FFmpeg** (For WebM audio support)
- **Google AI Studio API Key** (For RAG explanations)
- **Firebase Project** (For authentication & history)

### Option 1: Docker Setup (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/VTG56/VoiceGuard-AI.git
cd VoiceGuard-AI

# 2. Set up environment variables
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env

# 3. Edit frontend/.env with your Firebase config
VITE_API_BASE_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# 4. Edit backend/.env with your Gemini API key
GEMINI_API_KEY=your_gemini_api_key_here
MODEL_PATH=ml-service/models/best_model.h5
DECISION_THRESHOLD=0.5

# 5. Build and run with Docker Compose
cd deployment
docker-compose up --build

# 6. Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Manual Setup

#### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Ensure ML model exists
# Place best_model.h5 in ml-service/models/

# Run the backend server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Firebase and API configuration

# Run the development server
npm run dev

# Access at http://localhost:5173
```

---

## 🔧 Environment Setup

### Frontend Environment Variables

Create `frontend/.env`:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:8000

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Getting Firebase Credentials:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Go to Project Settings → Your Apps → Add Web App
4. Copy the configuration values to your `.env`

**Enable Firebase Services:**
1. In Firebase Console, enable **Authentication** → Sign-in method → Email/Password
2. Enable **Firestore Database** → Create database in production mode
3. Set Firestore rules for authenticated users

### Backend Environment Variables

Create `backend/.env`:

```env
# Model Configuration
MODEL_PATH=ml-service/models/best_model.h5
DECISION_THRESHOLD=0.5

# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

# Server Configuration
HOST=0.0.0.0
PORT=8000

# Optional: File Upload Limits
MAX_UPLOAD_SIZE=50MB
```

**Getting Gemini API Key:**
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API key" in the sidebar
4. Create a new API key or use existing one
5. Copy the API key to your `.env` file

### FFmpeg Installation

FFmpeg is required for WebM audio support and video processing.

**Windows:**
```powershell
winget install --id Gyan.FFmpeg -e --accept-source-agreements
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

**macOS:**
```bash
brew install ffmpeg
```

**Verify Installation:**
```bash
ffmpeg -version
```

See [INSTALL_FFMPEG.md](INSTALL_FFMPEG.md) for detailed instructions.

---

## 📦 Installation

### Full Stack Installation

```bash
# 1. Clone repository
git clone https://github.com/VTG56/VoiceGuard-AI.git
cd VoiceGuard-AI

# 2. Install backend dependencies
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cd ..

# 3. Install frontend dependencies
cd frontend
npm install
cd ..

# 4. Set up environment variables
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
# Edit both .env files with your configuration

# 5. Ensure ML model is in place
# Download or place best_model.h5 in ml-service/models/

# 6. Install FFmpeg (see FFmpeg Installation section)

# 7. Run backend
cd backend
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 8. Run frontend (in new terminal)
cd frontend
npm run dev
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:8000
```

### Endpoints

#### POST /analyze
Analyze an audio file for deepfake detection.

**Request:**
```http
POST /analyze
Content-Type: multipart/form-data

file: <audio_file> (WAV, MP3, WebM)
```

**Response:**
```json
{
  "label": "fake",
  "confidence": 0.87,
  "explanation": "This audio exhibits characteristics typical of AI-generated speech, including consistent pitch patterns and subtle spectral anomalies...",
  "detected_patterns": [
    {
      "name": "Low Pitch Variance",
      "score": 0.82,
      "description": "Voice lacks natural pitch variation"
    },
    {
      "name": "Spectral Inconsistency",
      "score": 0.68,
      "description": "Unusual frequency distribution patterns"
    }
  ],
  "pitch_variance": 0.023,
  "spectral_rolloff": 0.76,
  "mfcc_std": 1.34
}
```

#### POST /analyze-video
Analyze a video file (extracts and analyzes audio track).

**Request:**
```http
POST /analyze-video
Content-Type: multipart/form-data

file: <video_file> (MP4, AVI, MOV, MKV)
```

**Response:** Same format as `/analyze`

#### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

### Interactive API Docs
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 💻 Development

### Running in Development Mode

**Backend (with hot reload):**
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend (with HMR):**
```bash
cd frontend
npm run dev
```

### Code Formatting

**Backend:**
```bash
# Format Python code
black backend/
flake8 backend/
mypy backend/
isort backend/
```

**Frontend:**
```bash
# Lint JavaScript/React code
cd frontend
npm run lint
```

### Project Guidelines

- Follow component naming conventions (PascalCase for components)
- Use consistent color scheme (maroon/beige/dark)
- Add PropTypes or TypeScript types for components
- Write unit tests for new features
- Update documentation when adding features

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
pytest

# Run specific test file
pytest test_main.py

# Run with coverage
pytest --cov=. --cov-report=html

# Test specific components
python test_gemini_api.py          # Test Gemini integration
python test_model_loading.py       # Test model initialization
python test_rag_error_handling.py  # Test error scenarios
python test_error_handling.py      # General error tests
```

### Frontend Tests

```bash
cd frontend

# Run tests (if configured)
npm test

# Run with coverage
npm run test:coverage
```

### Manual Testing Workflow

1. **Audio Upload**: Test with real/fake audio samples
2. **Video Upload**: Test video file processing
3. **Live Monitoring**: Enable microphone/system audio monitoring
4. **Authentication**: Test signup, login, logout flows
5. **History**: Verify analysis history persistence
6. **Responsiveness**: Test on mobile, tablet, desktop

---

## 🚢 Deployment

### Docker Deployment

```bash
# Build and start all services
cd deployment
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes and rebuild
docker-compose down -v
docker-compose up --build
```

### Production Deployment

**Backend (with Gunicorn):**
```bash
cd backend
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

**Frontend (build for production):**
```bash
cd frontend
npm run build
# Serve the dist/ folder with nginx or similar
```

### Environment-Specific Configs

- **Development**: Use `.env` files
- **Staging**: Use `.env.staging` 
- **Production**: Use environment variables or secrets management (AWS Secrets Manager, Azure Key Vault, etc.)

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using the port
# Windows:
netstat -ano | findstr :8000
# Linux/Mac:
lsof -i :8000

# Kill the process or change port in .env
```

#### 2. Model Loading Errors
- Ensure `best_model.h5` exists in `ml-service/models/`
- Check TensorFlow version: `pip show tensorflow`
- Verify model file integrity (not corrupted)
- See [TROUBLESHOOTING_MODEL_LOADING.md](TROUBLESHOOTING_MODEL_LOADING.md)

#### 3. Audio Processing Errors
- Install FFmpeg (see Installation section)
- Check audio file format: `ffprobe audio_file.wav`
- Ensure librosa dependencies: `pip install librosa soundfile`
- Test with different audio files

#### 4. Firebase Connection Issues
- Verify credentials in `frontend/.env`
- Check Firebase Console → Project Settings
- Ensure Firestore and Authentication are enabled
- Check browser console for specific errors

#### 5. Gemini API Errors
- Verify `GEMINI_API_KEY` in `backend/.env`
- Check API quota (15 requests/min for free tier)
- System provides fallback template explanations
- Test API key: `python backend/test_gemini_api.py`

#### 6. Live Monitoring Not Working
- Grant microphone permissions in browser
- For system audio: Use screen share with audio
- Check browser console for MediaRecorder errors
- See [SYSTEM_AUDIO_UPDATE.md](SYSTEM_AUDIO_UPDATE.md)

#### 7. Docker Issues
```bash
# Clear Docker cache
docker system prune -a

# Remove all containers and images
docker-compose down --rmi all

# Rebuild from scratch
docker-compose up --build --force-recreate
```

#### 8. Frontend Build Errors
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node version
node -v  # Should be 18+
```

### Getting Help

- Check individual README files in `frontend/` and `backend/`
- Review troubleshooting guides: `TROUBLESHOOTING_*.md`
- Check API docs: http://localhost:8000/docs
- Open an issue on GitHub with:
  - Error messages
  - Steps to reproduce
  - Environment details (OS, Node/Python versions)

---

## 📊 System Architecture

### Analysis Pipeline

```
┌─────────────┐
│   Client    │
│  (React)    │
└──────┬──────┘
       │ Upload Audio/Video
       ▼
┌──────────────────┐
│   FastAPI        │
│   Backend        │
└────┬──────┬──────┘
     │      │
     │      └─────────┐
     ▼                ▼
┌─────────┐    ┌──────────┐
│ Audio   │    │  Video   │
│Process  │    │ Process  │
│(librosa)│    │(MoviePy) │
└────┬────┘    └────┬─────┘
     │              │
     └──────┬───────┘
            ▼
    ┌───────────────┐
    │ Mel-Spectrogram│
    │  Extraction    │
    │  (128×128×3)   │
    └───────┬────────┘
            ▼
    ┌───────────────┐
    │  CNN Model    │
    │ (TensorFlow)  │
    │ Prediction    │
    └───────┬────────┘
            │
            ├──────────────┐
            ▼              ▼
    ┌──────────┐   ┌──────────┐
    │ Pattern  │   │ Gemini   │
    │ Matcher  │   │ Explainer│
    └────┬─────┘   └────┬─────┘
         │              │
         └──────┬───────┘
                ▼
        ┌───────────────┐
        │ RAG Service   │
        │ (Combine)     │
        └───────┬───────┘
                ▼
        ┌───────────────┐
        │   Response    │
        │   to Client   │
        └───────────────┘
```

### Live Monitoring Flow

```
Browser (Web Audio API)
       ↓
MediaRecorder (10s chunks)
       ↓
WebM Audio Capture
       ↓
POST /analyze
       ↓
Backend Processing
       ↓
LiveMonitorWidget Update
```

---

## 🎨 Design System

### Color Palette
- **Primary**: Maroon (#800020, #991B1B, #DC2626)
- **Secondary**: Beige (#F5F5DC, #FDF4DC)
- **Background**: Dark (#000000, #0A0A0A)
- **Text**: Beige-100 (#FDF6E3)

### Components
- Consistent spacing: px-4, py-2, gap-2/4
- Border radius: rounded-lg, rounded-xl
- Shadows: shadow-lg, shadow-maroon-600/30
- Transitions: transition-all duration-300

---

## 👥 Team

**VoiceGuard AI Development Team**

Developed as part of an AI Security Hackathon/Project

---

## 📄 License

This project is provided for educational and demonstration purposes.

© 2025 VoiceGuard AI Team. All rights reserved.

---

## 🙏 Acknowledgments

- Google AI Studio for Gemini API
- Firebase for authentication and database
- TensorFlow and Keras teams
- Librosa audio processing library
- FastAPI and React communities
- Open-source contributors

---

## 🔗 Additional Resources

- **Frontend Documentation**: [frontend/README.md](frontend/README.md)
- **Backend Documentation**: [backend/README.md](backend/README.md)
- **API Specification**: [docs/api-spec.yaml](docs/api-spec.yaml)
- **Architecture Details**: [docs/architecture.md](docs/architecture.md)

---

<div align="center">

**Made with ❤️ using React, FastAPI, and TensorFlow**

⭐ Star this repo if you find it useful!

[Report Bug](https://github.com/VTG56/VoiceGuard-AI/issues) • [Request Feature](https://github.com/VTG56/VoiceGuard-AI/issues)

</div>
