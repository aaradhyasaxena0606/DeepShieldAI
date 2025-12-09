# 🛡️ VoiceGuard AI - Deepfake Audio & Video Detection Platform

<div align="center">

**AI-Powered Real-time Deepfake Detection with Explainable Results**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.5-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.16.1-FF6F00?logo=tensorflow)](https://www.tensorflow.org/)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/VTG56/VoiceGuard-AI?style=social)](https://github.com/VTG56/VoiceGuard-AI)

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

### 🌟 Why VoiceGuard AI?

In an era where AI-generated content is becoming increasingly sophisticated, VoiceGuard AI provides:

- **Instant Detection**: Analyze audio and video files in seconds
- **Real-time Monitoring**: Continuous audio monitoring for live scenarios
- **Explainable Results**: Understand _why_ content is flagged as fake
- **High Accuracy**: ~94% accuracy with production-ready CNN model
- **User-Friendly**: Intuitive interface with drag-and-drop uploads

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
├── backend/                 # FastAPI backend service
│   ├── api/                # API routes and schemas
│   │   ├── routes.py       # Endpoint definitions
│   │   └── schemas.py      # Response models
│   ├── services/           # Business logic services
│   │   ├── audio_processor.py   # Audio feature extraction
│   │   ├── model_service.py     # CNN model inference
│   │   ├── rag_service.py       # RAG orchestration
│   │   ├── live_processor.py    # Live monitoring logic
│   │   └── video_processor.py   # Video to audio extraction
│   ├── rag/                # RAG system components
│   │   ├── explainer.py         # Gemini-based explanations
│   │   ├── pattern_matcher.py   # Pattern detection
│   │   └── knowledge_base.json  # Deepfake knowledge DB
│   ├── utils/              # Helper utilities
│   ├── tests/              # Backend-specific tests
│   ├── .env.example        # Backend environment template
│   ├── requirements.txt    # Python dependencies
│   └── README.md           # Backend documentation
│
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── Navbar.jsx           # Navigation header
│   │   │   ├── Footer.jsx           # Site footer
│   │   │   ├── AudioUploader.jsx    # File upload component
│   │   │   ├── LiveMonitorWidget.jsx # Floating monitor
│   │   │   ├── Waveform.jsx         # Audio visualization
│   │   │   ├── ConfidenceGauge.jsx  # Confidence meter
│   │   │   └── ...
│   │   ├── pages/          # Route page components
│   │   │   ├── LandingPage.jsx      # Marketing homepage
│   │   │   ├── HomePage.jsx         # Dashboard
│   │   │   ├── AnalyzePage.jsx      # Audio analysis
│   │   │   ├── AnalyzeVideoPage.jsx # Video analysis
│   │   │   ├── AnalyzeLivePage.jsx  # Live monitoring
│   │   │   ├── HistoryPage.jsx      # Analysis history
│   │   │   └── Profile.jsx          # User profile
│   │   ├── contexts/       # React Context providers
│   │   │   ├── AuthContext.jsx      # Authentication state
│   │   │   ├── ThemeContext.jsx     # Theme management
│   │   │   └── LiveMonitorContext.jsx # Live monitoring state
│   │   ├── services/       # API and audio services
│   │   │   ├── audioCapture.js      # Audio capture logic
│   │   │   └── liveAnalysisService.js # Live analysis API
│   │   ├── config/         # Firebase configuration
│   │   └── utils/          # Helper utilities
│   ├── public/             # Static assets
│   ├── .env.example        # Frontend environment template
│   ├── package.json        # Node dependencies
│   └── README.md           # Frontend documentation
│
├── ml-service/             # ML model training & development
│   ├── models/             # Trained model files
│   │   └── best_model.h5   # Production CNN model (~94% accuracy)
│   ├── notebooks/          # Jupyter notebooks
│   │   ├── Training_Model_Kuber_Monday (1).ipynb  # Main training
│   │   ├── live_analysis_imp.ipynb  # Live implementation
│   │   └── ...
│   ├── trained_models/     # Model version archive
│   └── README.md           # ML service documentation
│
├── deployment/             # Docker & deployment configs
│   ├── docker-compose.yml  # Multi-service orchestration
│   ├── cloudbuild.yaml     # Google Cloud Build config
│   ├── .env.example        # Deployment environment template
│   └── README.md           # Deployment documentation
│
├── tests/                  # Integration tests
│   ├── test_api.py        # API endpoint tests
│   ├── test_model.py      # Model inference tests
│   ├── test_rag.py        # RAG system tests
│   └── README.md          # Testing documentation
│
├── backend.Dockerfile      # Backend container build
├── railway.toml            # Railway deployment config
├── README.md               # This file (main documentation)
└── .gitignore              # Git ignore rules
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
- Check file permissions and path accessibility

#### 3. Audio Processing Errors

- Install FFmpeg (see Installation section)
- Check audio file format: `ffprobe audio_file.wav`
- Ensure librosa dependencies: `pip install librosa soundfile`
- Test with different audio files
- Verify sample rate and duration requirements

#### 4. Firebase Connection Issues

- Verify credentials in `frontend/.env`
- Check Firebase Console → Project Settings
- Ensure Firestore and Authentication are enabled
- Check browser console for specific errors
- Verify API keys and domain restrictions

#### 5. Gemini API Errors

- Verify `GEMINI_API_KEY` in `backend/.env`
- Check API quota (free tier: 15 requests/min, 1500/day)
- System provides fallback template explanations
- Validate API key at [Google AI Studio](https://aistudio.google.com/)
- Check for rate limiting errors

#### 6. Live Monitoring Not Working

- Grant microphone permissions in browser
- For system audio: Use screen share with audio option
- Check browser console for MediaRecorder errors
- Ensure HTTPS in production (required for getUserMedia)
- Test with different browsers (Chrome recommended)

#### 7. Docker Issues

```bash
# Clear Docker cache
docker system prune -a

# Remove all containers and images
docker-compose down --rmi all

# Rebuild from scratch
docker-compose up --build --force-recreate

# Check Docker resources (memory/CPU)
docker stats
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

# Try with legacy peer deps
npm install --legacy-peer-deps
```

#### 9. Python Dependencies Issues

```bash
# Upgrade pip first
python -m pip install --upgrade pip setuptools wheel

# Install with no cache
pip install --no-cache-dir -r requirements.txt

# Check Python version
python --version  # Should be 3.11+
```

#### 10. CORS Errors

- Update `VITE_API_BASE_URL` in frontend `.env`
- Configure CORS origins in backend `main.py`
- Check network/firewall settings
- Ensure ports are correctly mapped in Docker

### Performance Issues

**Slow Model Inference:**

- Use GPU acceleration if available
- Reduce audio duration to 2 seconds
- Check CPU/memory usage
- Consider model optimization

**High Memory Usage:**

- Limit concurrent requests
- Clear uploaded files after processing
- Monitor container memory limits
- Adjust Docker memory allocation

### Getting Help

- Check individual README files:
  - [`backend/README.md`](backend/README.md) - Backend setup
  - [`frontend/README.md`](frontend/README.md) - Frontend setup
  - [`ml-service/README.md`](ml-service/README.md) - ML details
  - [`deployment/README.md`](deployment/README.md) - Deployment
  - [`tests/README.md`](tests/README.md) - Testing
- Review API docs: http://localhost:8000/docs
- Open an issue on GitHub with:
  - Error messages and stack traces
  - Steps to reproduce
  - Environment details (OS, Python/Node versions)
  - Screenshots if applicable

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

- **Bhavya Chawat** - Backend Lead & AI Integration Specialist
- **Vishwaradhya S Aiholli** - Frontend Lead & DevOps Engineer
- **Shubhang Kuber** - Machine Learning Engineer
- **Kruthi Krishna** - ML Research & Planning Lead
- **Krish Agarwal** - QA Engineer & Documentation Lead

_Developed as part of an AI Security & Innovation Project_

---

## 📚 Documentation

### Main Documentation

- [**README.md**](README.md) - This file (comprehensive overview)
- [**Backend Documentation**](backend/README.md) - FastAPI backend setup
- [**Frontend Documentation**](frontend/README.md) - React frontend setup
- [**ML Service Documentation**](ml-service/README.md) - Model training & development
- [**Deployment Guide**](deployment/README.md) - Docker & deployment
- [**Testing Guide**](tests/README.md) - Running tests

### API Documentation

- **Interactive API Docs**: http://localhost:8000/docs (Swagger UI)
- **ReDoc**: http://localhost:8000/redoc (Alternative API docs)

### Architecture & Design

- **System Architecture**: See [System Architecture](#-system-architecture) section
- **ML Pipeline**: See [`ml-service/README.md`](ml-service/README.md)
- **RAG System**: See [`backend/README.md`](backend/README.md)

---

## 🤝 Contributing

We welcome contributions to VoiceGuard AI! Here's how you can help:

### Ways to Contribute

1. **Report Bugs**

   - Open an issue on GitHub
   - Provide detailed reproduction steps
   - Include environment details

2. **Suggest Features**

   - Open a feature request issue
   - Explain the use case
   - Discuss implementation approach

3. **Submit Pull Requests**
   - Fork the repository
   - Create a feature branch
   - Follow code style guidelines
   - Write tests for new features
   - Update documentation

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/VoiceGuard-AI.git
cd VoiceGuard-AI

# Create a new branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "Add: your feature description"

# Push to your fork
git push origin feature/your-feature-name

# Open a Pull Request on GitHub
```

### Code Style

- **Python**: Follow PEP 8 guidelines
- **JavaScript/React**: Follow Airbnb style guide
- **Commits**: Use conventional commits (feat:, fix:, docs:, etc.)
- **Testing**: Write tests for new features

### Testing Before Submission

```bash
# Backend tests
cd backend
pytest tests/

# Frontend tests (if applicable)
cd frontend
npm test

# Integration tests
cd tests
pytest
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

© 2024-2025 VoiceGuard AI Team. All rights reserved.

---

## 🙏 Acknowledgments

- **Google AI Studio** for Gemini API access
- **Firebase** for authentication and database services
- **TensorFlow/Keras** teams for ML framework
- **Librosa** for audio processing capabilities
- **FastAPI** for excellent API framework
- **React** and **Vite** communities
- **Open-source contributors** worldwide

### Datasets Used

- ASVspoof 2019 - Audio deepfake detection challenge
- FakeAVCeleb - Audio-video deepfake dataset
- Custom datasets for training and validation

### Research Inspiration

- "ASVspoof 2019: A large-scale public database of synthesized, converted and replayed speech"
- "FakeAVCeleb: A Novel Audio-Video Multimodal Deepfake Dataset"
- Various papers on deepfake detection and audio forensics

---

## 🔗 Additional Resources

### Documentation

- [Backend Documentation](backend/README.md) - FastAPI setup and services
- [Frontend Documentation](frontend/README.md) - React components and pages
- [ML Service Documentation](ml-service/README.md) - Model training details
- [Deployment Guide](deployment/README.md) - Docker and cloud deployment
- [Testing Guide](tests/README.md) - Test suite and coverage

### External Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [TensorFlow Guides](https://www.tensorflow.org/guide)
- [Librosa Tutorials](https://librosa.org/doc/latest/tutorial.html)
- [Firebase Setup](https://firebase.google.com/docs)
- [Google AI Studio](https://aistudio.google.com/)

### Community

- [GitHub Issues](https://github.com/VTG56/VoiceGuard-AI/issues) - Report bugs and request features
- [GitHub Discussions](https://github.com/VTG56/VoiceGuard-AI/discussions) - Ask questions
- [Pull Requests](https://github.com/VTG56/VoiceGuard-AI/pulls) - Contribute code

---

## 📊 Project Status

### Current Version

- **Version**: 1.0.0
- **Status**: Production Ready
- **Last Updated**: December 2024

### Roadmap

#### ✅ Completed

- [x] Audio file analysis (WAV, MP3, WebM)
- [x] Video file analysis (MP4, AVI, MOV)
- [x] Real-time live monitoring
- [x] RAG-based explanations with Gemini
- [x] Firebase authentication and history
- [x] Docker deployment support
- [x] Responsive dark-themed UI

#### 🚧 In Progress

- [ ] Mobile application (React Native)
- [ ] Batch processing for multiple files
- [ ] Advanced analytics dashboard
- [ ] API rate limiting and caching

#### 🔮 Future Plans

- [ ] Support for more languages
- [ ] Video deepfake detection (visual)
- [ ] Browser extension
- [ ] Enterprise API tier
- [ ] Custom model training interface
- [ ] Integration with social media platforms

---

## 🛡️ Security & Privacy

### Data Handling

- Audio/video files are processed temporarily and not permanently stored
- User authentication data secured via Firebase
- API keys and sensitive data in environment variables
- HTTPS recommended for production deployments

### Best Practices

- Keep dependencies updated
- Rotate API keys regularly
- Use environment-specific configurations
- Enable CORS only for trusted domains
- Implement rate limiting in production
- Monitor API usage and logs

### Reporting Security Issues

If you discover a security vulnerability, please email the team instead of opening a public issue.

---

## 📈 Performance Metrics

### Model Performance

- **Accuracy**: ~94%
- **Precision**: ~92%
- **Recall**: ~91%
- **ROC AUC**: 0.95
- **F1-Score**: ~91.5%

### System Performance

- **Audio Processing**: <100ms per 2-second clip
- **Model Inference**: 50-100ms per sample
- **End-to-end Latency**: <500ms for typical request
- **Concurrent Users**: Tested up to 50 simultaneous requests

### Supported Formats

- **Audio**: WAV, MP3, WebM, M4A, FLAC
- **Video**: MP4, AVI, MOV, MKV, WebM
- **Max File Size**: 50MB (configurable)
- **Duration**: Optimal at 2-10 seconds

---

<div align="center">

**Made with ❤️ using React, FastAPI, and TensorFlow**

⭐ **Star this repo if you find it useful!** ⭐

[Report Bug](https://github.com/VTG56/VoiceGuard-AI/issues) • [Request Feature](https://github.com/VTG56/VoiceGuard-AI/issues) • [View Demo](https://voiceguard-ai.vercel.app)

---

### 🌟 Key Highlights

✓ **94% Accuracy** on deepfake detection  
✓ **Real-time Monitoring** with live audio analysis  
✓ **Explainable AI** powered by Google Gemini  
✓ **Open Source** and ready for deployment  
✓ **Production Ready** with Docker support

---

_Protecting authenticity in the age of AI-generated content_

**VoiceGuard AI** - Detect. Explain. Protect.

</div>
