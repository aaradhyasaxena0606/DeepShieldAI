# VoiceGuard AI - Backend

## 🎯 Overview

FastAPI backend for VoiceGuard AI deepfake audio detection system. Uses a CNN model with 3-channel mel-spectrogram preprocessing (mel, delta, delta-delta) for robust audio deepfake detection.

---

## 🏗️ Architecture

```
User Audio/Video Upload
    ↓
FastAPI Routes (/api/analyze, /api/analyze-video)
    ↓
Audio Processor (3-channel mel-spectrogram: mel, delta, delta-delta)
    ↓
Model Service (TensorFlow CNN model - best_model.h5)
    ↓
RAG Service (Pattern matching + Gemini AI explanation)
    ↓
JSON Response (prediction, confidence, explanation, patterns)
```

---

## 📊 Current Model

**best_model.h5** - CNN Model

- Input: (128, 128, 3) - 3-channel mel-spectrogram
- Architecture: Conv2D(32) → Conv2D(64) → Conv2D(128) → Dense(128) → Sigmoid
- Output: Binary classification (REAL vs FAKE)
- Training: From `Training_Model_Kuber_Monday (1).ipynb`
- Metrics: ~90% accuracy, 0.95 ROC AUC

**Location**: `ml-service/models/best_model.h5`

---

## 🔄 Preprocessing Pipeline

### 3-Channel Mel-Spectrogram

```python
Channel 0: Mel-spectrogram (frequency content, 0-1 normalized)
Channel 1: Delta (first derivative - velocity)
Channel 2: Delta-delta (second derivative - acceleration)

Parameters:
- Sample rate: 16kHz
- Duration: 2 seconds (32,000 samples)
- FFT: n_fft=2048, hop_length=512
- Mel bands: 128
- Resolution: 128x128 (bilinear resize)
```

### Processing Steps

1. Load audio (soundfile → librosa fallback)
2. Convert stereo → mono
3. Resample to 16kHz
4. Pad/trim to 2 seconds
5. Compute mel-spectrogram → convert to dB
6. Resize to 128x128
7. Compute delta and delta-delta
8. Normalize each channel to [0, 1]
9. Stack into (1, 128, 128, 3) tensor

---

## 🚀 Quick Start

### 1. Install Dependencies (Python 3.11 recommended)

```bash
cd backend

# Upgrade pip first (important!)
python -m pip install --upgrade pip setuptools wheel

# Install dependencies
pip install -r requirements.txt
```

**Note**: Uses flexible numpy versioning (`numpy>=1.24.0,<2.0.0`) to ensure prebuilt wheels work on Python 3.11+.

### 2. Set Environment Variables

Create `.env` file:

```bash
# Required for RAG explanations
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Model behavior
DECISION_THRESHOLD=0.5        # Threshold for REAL vs FAKE (0.0-1.0)
LOW_CONF_MARGIN=0.15          # Margin for uncertainty detection
ALLOW_PLACEHOLDER=0           # Set to 1 for testing without TensorFlow
```

### 3. Start Backend Server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Server runs at: http://localhost:8000  
API Docs (Swagger): http://localhost:8000/docs

---

## 📡 API Endpoints

### POST /api/analyze

Analyze audio file for deepfake detection.

**Request**:

```bash
curl -X POST "http://localhost:8000/api/analyze" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@audio.wav"
```

**Response**:

```json
{
  "prediction": "FAKE",
  "confidence": 0.87,
  "confidence_level": "HIGH",
  "ai_explanation": "The audio exhibits synthetic artifacts...",
  "detected_patterns": [
    "Unnatural prosody detected",
    "Missing frequency bands",
    "Spectral anomalies"
  ],
  "recommendation": "High confidence FAKE detection...",
  "processing_time_ms": 2341
}
```

**Supported formats**: WAV, MP3, WebM

### POST /api/analyze-video

Extract audio from video and analyze.

**Request**:

```bash
curl -X POST "http://localhost:8000/api/analyze-video" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@video.mp4"
```

**Supported formats**: MP4, MOV, AVI

---

## 🧪 Model Prediction Details

### Output Interpretation

```python
# Model outputs sigmoid probability [0.0, 1.0]
probability = model.predict(mel_spectrogram)

# Apply threshold (default 0.5)
if probability >= 0.5:
    label = "REAL"
    confidence = probability
else:
    label = "FAKE"
    confidence = 1.0 - probability
```

### Uncertainty Detection (NEW)

Predictions within `LOW_CONF_MARGIN` (default 0.15) of the threshold are flagged as **uncertain**:

```python
# Example with threshold=0.5, margin=0.15
if abs(probability - 0.5) < 0.15:
    # probability in [0.35, 0.65] → uncertain
    # Recommend human review
```

This matches the new training notebook's confidence checking approach.

---

## 📂 Project Structure

```
backend/
├── main.py                   # FastAPI application entry point
├── config.py                 # Configuration settings
├── requirements.txt          # Python dependencies
├── .env                      # Environment variables (create this)
├── .gitignore               # Git ignore patterns
│
├── api/
│   ├── routes.py            # API endpoints
│   └── schemas.py           # Pydantic models
│
├── services/
│   ├── audio_processor.py   # Audio preprocessing (3-channel mel)
│   ├── model_service.py     # Model loading & inference
│   ├── rag_service.py       # Explanation generation
│   └── video_processor.py   # Video audio extraction
│
├── rag/
│   ├── explainer.py         # Gemini AI integration
│   ├── pattern_matcher.py   # Pattern detection
│   └── knowledge_base.json  # Technical knowledge base
│
├── tests/
│   └── ...                  # Unit tests
│
└── utils/
    └── helpers.py           # Utility functions
```

---

## 🔧 Configuration

### Environment Variables

| Variable             | Default | Description                                       |
| -------------------- | ------- | ------------------------------------------------- |
| `GEMINI_API_KEY`     | -       | Google Gemini API key (required for explanations) |
| `DECISION_THRESHOLD` | 0.5     | Probability threshold for REAL vs FAKE            |
| `LOW_CONF_MARGIN`    | 0.15    | Margin for uncertainty detection                  |
| `ALLOW_PLACEHOLDER`  | 0       | Enable placeholder predictions (testing only)     |

### Model Location

Model file: `ml-service/models/best_model.h5`

---

## 🐛 Troubleshooting

### Issue 1: Numpy Installation Fails

```bash
# Solution
python -m pip install --upgrade pip setuptools wheel
pip install --prefer-binary numpy
pip install -r requirements.txt
```

### Issue 2: TensorFlow Not Found

```bash
# Solution
pip install tensorflow==2.16.1
```

**Note**: TensorFlow 2.16.1 requires Python 3.9-3.12. Use Python 3.11 for best compatibility.

### Issue 3: Model Not Found

```bash
# Check if model exists
ls -lh ../ml-service/models/best_model.h5

# Output should show:
# best_model.h5 (file size ~40MB)
```

### Issue 4: Low Confidence Predictions

**Symptoms**: All predictions near 0.5 confidence

**Possible causes**:

- Wrong model loaded (check logs)
- Preprocessing mismatch
- Audio quality issues

**Debug**:

```python
# Check preprocessing output
features = extract_features(audio_bytes)
mel = features['mel_spectrogram']
print(f"Shape: {mel.shape}")  # Should be (1, 128, 128, 3)
print(f"Range: [{mel.min():.3f}, {mel.max():.3f}]")  # Should be [0, 1]
```

---

## 🚢 Deployment

### Docker

```bash
cd backend
docker build -t voiceguard-backend .
docker run -p 8000:8000 --env-file .env voiceguard-backend
```

### Production Checklist

- [ ] Set `ALLOW_PLACEHOLDER=0` (ensure real model is used)
- [ ] Configure `GEMINI_API_KEY` for explanations
- [ ] Set appropriate `DECISION_THRESHOLD` based on use case
- [ ] Enable HTTPS/TLS
- [ ] Add rate limiting
- [ ] Set up monitoring/logging
- [ ] Test with diverse audio samples

---

## 📈 Model Training

**Current Model: best_model.h5**

- Training notebook: `Training_Model_Kuber_Monday (1).ipynb`
- Architecture: Custom CNN (3 Conv blocks + Dense layers)
- Dataset: 3-channel mel-spectrogram (mel, delta, delta-delta)
- Training: Basic augmentation, stratified train/val/test split
- Metrics: ~90% accuracy, 0.95 ROC AUC on test set

### Future Training (Optional)

The `Tuesday GDG Model Training.ipynb` notebook includes advanced techniques for training a more robust model:

- Transfer Learning (EfficientNetB0/MobileNetV2)
- Advanced augmentation (Mixup, SpecAugment, Audio augmentation)
- OOD (Out-of-Distribution) evaluation
- Better generalization to unseen deepfake methods

You can use this notebook to train a `best_model_robust.h5` when needed.

---

## 🔒 Security

- File size limits enforced
- MIME type validation
- Temporary file cleanup
- No model file modifications at runtime
- Environment variable protection (.env in .gitignore)

---

## 📚 Key Dependencies

```
tensorflow==2.16.1          # Model inference
librosa==0.10.2.post1       # Audio processing
soundfile==0.13.1           # Audio I/O
scipy==1.12.0               # Signal processing
numpy>=1.24.0,<2.0.0        # Numerical computing
fastapi==0.115.5            # Web framework
uvicorn==0.32.0             # ASGI server
google-generativeai==0.8.3  # Gemini AI
moviepy==1.0.3              # Video processing
```

---

## 📞 Support

For issues:

1. Check logs for detailed error messages
2. Verify model files exist in `ml-service/models/`
3. Ensure all dependencies installed correctly
4. Test with known audio samples

---

**Last Updated**: December 2025  
**Current Model**: best_model.h5 (CNN from Training_Model_Kuber_Monday)  
**Backend Version**: VoiceGuard AI v1.0
