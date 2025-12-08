# VoiceGuard AI - Backend

FastAPI-based backend service for AI-powered deepfake audio and video detection using deep learning and RAG-based explanations.

## 🚀 Tech Stack

### Core Framework
- **FastAPI** - Modern, high-performance Python web framework
- **Uvicorn** - Lightning-fast ASGI server
- **Pydantic** - Data validation using Python type annotations

### Machine Learning & Audio Processing
- **TensorFlow 2.16.1** - Deep learning framework for CNN model
- **Librosa 0.10.2** - Audio analysis and feature extraction
- **SoundFile 0.13.1** - Audio file I/O
- **NumPy 1.24.3** - Numerical computing
- **SciPy 1.12.0** - Scientific computing and signal processing
- **Scikit-learn 1.7.2** - Machine learning utilities

### Video Processing
- **MoviePy 1.0.3** - Video editing and audio extraction

### AI & RAG System
- **Google Generative AI 0.8.3** - Gemini API for intelligent explanations
- **Custom RAG System** - Pattern matching and knowledge base

### Utilities
- **Python-dotenv** - Environment variable management
- **Python-multipart** - File upload handling
- **Requests** - HTTP library

## 📁 Project Structure

```
backend/
├── api/                    # API layer
│   ├── routes.py          # FastAPI route definitions
│   ├── schemas.py         # Pydantic response models
│   └── __init__.py
├── services/              # Business logic layer
│   ├── audio_processor.py # Audio feature extraction
│   ├── model_service.py   # CNN model inference
│   ├── rag_service.py     # RAG explanation generation
│   ├── video_processor.py # Video to audio extraction
│   └── __init__.py
├── rag/                   # RAG system components
│   ├── explainer.py       # Gemini-based explanations
│   ├── pattern_matcher.py # Pattern detection logic
│   ├── knowledge_base.json # Deepfake detection knowledge
│   └── __init__.py
├── utils/                 # Helper utilities
│   ├── helpers.py         # Common utility functions
│   └── __init__.py
├── main.py               # Application entry point
├── config.py             # Configuration management
└── requirements.txt      # Python dependencies
```

## 🔧 Core Components

### API Layer (`api/`)

#### routes.py
- **POST /analyze** - Audio file analysis endpoint
- **POST /analyze-video** - Video file analysis endpoint
- **GET /health** - Health check endpoint

Handles file upload, validation, processing orchestration, and response formatting.

#### schemas.py
- **AnalysisResponse** - Standardized response model
- Includes: label, confidence, explanation, detected patterns, audio features

### Services Layer (`services/`)

#### audio_processor.py
**Audio Feature Extraction Pipeline**
- Loads audio files (WAV, MP3, WebM) via soundfile/librosa
- Converts to mono and resamples to 16kHz
- Extracts 3-channel mel-spectrogram (mel, delta, delta-delta)
- Resizes to 128×128 using bilinear interpolation
- Normalizes each channel to [0, 1] range
- Computes additional features: pitch variance, spectral rolloff, MFCC std
- Returns preprocessed tensor ready for CNN model

**Configuration:**
- Sample Rate: 16kHz
- Duration: 2.0 seconds
- FFT: 2048 bins
- Hop Length: 512 samples
- Mel Bands: 128

#### model_service.py
**CNN Model Inference**
- Loads pre-trained TensorFlow model (`best_model.h5`)
- Accepts 3-channel 128×128 mel-spectrogram input
- Supports both sigmoid and softmax output layers
- Returns prediction label (REAL/FAKE) and confidence score
- Configurable decision threshold via environment variable

**Model Architecture:**
- Input: (1, 128, 128, 3) float32 tensor
- Output: Sigmoid [0, 1] or Softmax [fake_prob, real_prob]
- Decision: prob_real >= threshold → REAL, else FAKE

#### video_processor.py
**Video to Audio Extraction**
- Uses MoviePy to extract audio from video files
- Supports: MP4, AVI, MOV, MKV formats
- Converts video audio to WAV format
- Returns audio bytes for analysis pipeline
- Temporary file cleanup

#### rag_service.py
**RAG System Orchestration**
- Combines pattern matching and AI explanations
- Coordinates between pattern_matcher and explainer
- Generates comprehensive analysis reports
- Handles fallback scenarios gracefully

### RAG System (`rag/`)

#### pattern_matcher.py
**Rule-Based Pattern Detection**
- Analyzes audio features for deepfake indicators
- Detects patterns:
  - **Spectral Inconsistency** - Unusual frequency distributions
  - **Low Pitch Variance** - Robotic/synthetic voice characteristics
  - **High Frequency Artifacts** - Digital processing artifacts
  - **Unnatural Dynamics** - Inconsistent volume/energy patterns
  - **Phase Anomalies** - Digital manipulation signatures
- Scores each pattern (0.0 - 1.0)
- Returns detected patterns above threshold

#### explainer.py
**AI-Powered Explanations**
- Uses Google Gemini 1.5 Flash for natural language explanations
- Generates context-aware analysis reports
- Explains technical patterns in user-friendly language
- Provides confidence reasoning
- Fallback to template-based explanations if API fails

#### knowledge_base.json
**Deepfake Detection Knowledge**
- Curated database of deepfake characteristics
- Pattern definitions and thresholds
- Technical explanations and indicators
- Used by both pattern matcher and explainer

## 🔄 Analysis Workflow

### Audio Analysis Flow

```
1. Client Upload
   ↓
2. File Validation (routes.py)
   - Check file type (WAV/MP3/WebM)
   - Verify file size
   ↓
3. Feature Extraction (audio_processor.py)
   - Load and decode audio
   - Convert to mono, resample to 16kHz
   - Extract mel-spectrogram
   - Compute delta and delta-delta
   - Normalize to 128×128×3 tensor
   ↓
4. CNN Model Prediction (model_service.py)
   - Feed tensor to TensorFlow model
   - Get prediction (REAL/FAKE)
   - Calculate confidence score
   ↓
5. Pattern Detection (rag/pattern_matcher.py)
   - Analyze audio features
   - Detect deepfake indicators
   - Score each pattern
   ↓
6. AI Explanation (rag/explainer.py)
   - Generate natural language explanation
   - Contextualize patterns
   - Provide user-friendly insights
   ↓
7. Response Assembly (routes.py)
   - Combine all results
   - Format as AnalysisResponse
   - Return JSON to client
```

### Video Analysis Flow

```
1. Client Upload (Video File)
   ↓
2. Video Validation (routes.py)
   - Check file type (MP4/AVI/MOV)
   - Verify file size
   ↓
3. Audio Extraction (video_processor.py)
   - Extract audio track using MoviePy
   - Convert to WAV format
   - Return audio bytes
   ↓
4. Continue with Audio Analysis Flow (steps 3-7)
```

## 🛠️ Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Model Configuration
MODEL_PATH=ml-service/models/best_model.h5
DECISION_THRESHOLD=0.5

# Gemini API (for RAG explanations)
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
HOST=0.0.0.0
PORT=8000

# File Upload Limits
MAX_UPLOAD_SIZE=50MB
```

### Configuration Management (`config.py`)

- Loads environment variables
- Sets default values
- Validates configuration
- Provides centralized config access

## 📦 Installation

```bash
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

# Run the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 🚢 Deployment

### Docker Deployment

```bash
# Build Docker image
docker build -t voiceguard-backend .

# Run container
docker run -p 8000:8000 --env-file .env voiceguard-backend
```

### Production Deployment

```bash
# Install production server
pip install gunicorn

# Run with gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## 🧪 Testing

The backend includes comprehensive test files:

- **test_main.py** - API endpoint tests
- **test_model_loading.py** - Model initialization tests
- **test_model_compatibility.py** - TensorFlow compatibility tests
- **test_gemini_api.py** - Gemini API integration tests
- **test_gemini.py** - RAG system tests
- **test_rag_error_handling.py** - Error handling tests
- **test_error_handling.py** - General error scenarios
- **debug_gemini_response.py** - Debug Gemini responses
- **test_invalid_key.py** - API key validation tests

```bash
# Run all tests
pytest

# Run specific test file
pytest test_main.py

# Run with coverage
pytest --cov=. --cov-report=html
```

## 📊 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### API Endpoints

#### POST /analyze
Analyze audio file for deepfake detection.

**Request:**
```
Content-Type: multipart/form-data
file: <audio_file> (WAV, MP3, WebM)
```

**Response:**
```json
{
  "label": "fake",
  "confidence": 0.87,
  "explanation": "This audio exhibits characteristics typical of AI-generated speech...",
  "detected_patterns": [
    {
      "name": "Low Pitch Variance",
      "score": 0.82,
      "description": "Voice lacks natural pitch variation"
    }
  ],
  "pitch_variance": 0.023,
  "spectral_rolloff": 0.76,
  "mfcc_std": 1.34
}
```

#### POST /analyze-video
Analyze video file (extracts and analyzes audio track).

**Request:**
```
Content-Type: multipart/form-data
file: <video_file> (MP4, AVI, MOV, MKV)
```

**Response:** Same as /analyze

#### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

## 🎯 Model Details

### CNN Architecture
- **Input Layer**: 128×128×3 (mel-spectrogram with delta features)
- **Convolutional Layers**: Feature extraction from spectrograms
- **Pooling Layers**: Dimensionality reduction
- **Dense Layers**: Classification
- **Output Layer**: Sigmoid or Softmax activation

### Training Data
- Real audio samples from human speakers
- Fake audio from various TTS/voice cloning systems
- Preprocessed to 16kHz, 2-second clips
- Balanced dataset for binary classification

### Performance Metrics
- Accuracy: ~94% on test set
- Precision: ~92%
- Recall: ~96%
- F1-Score: ~94%

## 🔐 Security Features

- File type validation
- File size limits
- Input sanitization
- Error message sanitization (no internal paths exposed)
- CORS configuration for frontend integration
- Environment-based secrets management

## 🐛 Debugging

Enable debug mode:
```bash
# Set in .env
DEBUG=true

# Or run with debug flag
uvicorn main:app --reload --log-level debug
```

Debug utilities:
- `debug_gemini_response.py` - Test Gemini API responses
- `docker_debug.py` - Debug Docker container issues

## 🔧 Development Tools

```bash
# Format code
black .

# Lint code
flake8 .

# Type checking
mypy .

# Sort imports
isort .
```

## 📈 Performance Optimization

- Async file handling with FastAPI
- Lazy model loading (loaded once on startup)
- Efficient audio processing with librosa
- Optimized mel-spectrogram computation
- Caching for repeated pattern detections

## 🤝 Contributing

Follow the main project's contribution guidelines. Key areas for contribution:
- Model improvements and retraining
- Additional pattern detection rules
- Enhanced RAG explanations
- Performance optimizations
- New audio/video format support

## 📄 License

Part of the VoiceGuard AI project.

## 🆘 Troubleshooting

### Model Loading Issues
- Ensure `best_model.h5` exists in `ml-service/models/`
- Check TensorFlow version compatibility
- Verify model file is not corrupted

### Audio Processing Errors
- Install ffmpeg for WebM support: `winget install ffmpeg` (Windows) or `apt-get install ffmpeg` (Linux)
- Check audio file format and sample rate
- Ensure librosa dependencies are installed

### Gemini API Errors
- Verify `GEMINI_API_KEY` in `.env`
- Check API quota and rate limits
- System falls back to template explanations if API fails

### Video Processing Issues
- Ensure MoviePy is installed
- Check video codec compatibility
- Verify ffmpeg is in system PATH

## 📞 Support

For issues related to the backend, check:
1. Server logs in terminal
2. Error messages in API responses
3. Test files for example usage
4. API documentation at `/docs`
