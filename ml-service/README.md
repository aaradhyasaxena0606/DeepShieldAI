# ML Service - Model Training & Development

This directory contains the machine learning models, training notebooks, and related scripts for VoiceGuard AI's deepfake audio detection system.

## 📁 Directory Structure

```
ml-service/
├── models/                      # Trained model files
│   ├── __init__.py
│   └── best_model.h5           # Production CNN model (3-channel, ~94% accuracy)
├── notebooks/                   # Jupyter notebooks for research & training
│   ├── live_analysis_imp.ipynb # Live monitoring implementation
│   ├── live_analysis_imp.py    # Converted Python script
│   ├── ML Workflow.txt         # Training workflow documentation
│   ├── pre_process+train.py    # Preprocessing and training script
│   ├── train_colab_drive.ipynb # Google Colab training notebook
│   ├── Training_Model_Kuber_Monday (1).ipynb  # Main training notebook
│   └── tuesday_gdg_model_training.py          # Training script
└── trained_models/              # Archive of trained model versions
```

## 🧠 Current Model: best_model.h5

### Architecture

- **Input Shape**: (128, 128, 3) - 3-channel mel-spectrogram
  - Channel 0: Mel-spectrogram (frequency content)
  - Channel 1: Delta (first derivative - velocity)
  - Channel 2: Delta-delta (second derivative - acceleration)
- **Model Architecture**:

  ```
  Input (128, 128, 3)
  ↓
  Conv2D(32, 3×3) + MaxPooling2D
  ↓
  Conv2D(64, 3×3) + MaxPooling2D
  ↓
  Conv2D(128, 3×3) + MaxPooling2D
  ↓
  Flatten + Dense(128) + Dropout(0.5)
  ↓
  Dense(1, sigmoid) - Binary Output
  ```

- **Performance Metrics**:
  - Accuracy: ~94%
  - ROC AUC: 0.95
  - Precision: ~92%
  - Recall: ~91%

### Training Details

- **Framework**: TensorFlow/Keras
- **Training Notebook**: `Training_Model_Kuber_Monday (1).ipynb`
- **Dataset**: Audio samples from ASVspoof, FakeAVCeleb, and custom datasets
- **Preprocessing**:
  - Sample rate: 16kHz
  - Duration: 2 seconds per sample
  - FFT parameters: n_fft=2048, hop_length=512
  - Mel bands: 128

## 📓 Notebooks

### Training Notebooks

1. **Training_Model_Kuber_Monday (1).ipynb**

   - Main training notebook used to create `best_model.h5`
   - Includes data preprocessing, augmentation, and model training
   - Contains evaluation metrics and visualizations

2. **train_colab_drive.ipynb**

   - Google Colab version for GPU training
   - Integrates with Google Drive for dataset management

3. **pre_process+train.py**

   - Standalone preprocessing and training script
   - Can be run directly without Jupyter

4. **tuesday_gdg_model_training.py**
   - Alternative training script with different hyperparameters

### Implementation Notebooks

1. **live_analysis_imp.ipynb**

   - Live monitoring system implementation
   - Chunk-based audio processing
   - Real-time inference testing

2. **live_analysis_imp.py**
   - Python script version of live analysis
   - Used for integration testing

### Documentation

- **ML Workflow.txt** - Detailed workflow documentation for the ML pipeline

## 🚀 Usage

### Loading the Model

```python
from tensorflow import keras

# Load the pre-trained model
model = keras.models.load_model('ml-service/models/best_model.h5')

# Model is ready for inference
predictions = model.predict(preprocessed_audio)
```

### Preprocessing Audio for Inference

```python
import librosa
import numpy as np

def preprocess_audio(audio_path):
    # Load audio
    y, sr = librosa.load(audio_path, sr=16000, duration=2.0)

    # Compute mel-spectrogram
    mel_spec = librosa.feature.melspectrogram(
        y=y, sr=sr, n_fft=2048, hop_length=512, n_mels=128
    )
    mel_spec_db = librosa.power_to_db(mel_spec, ref=np.max)

    # Compute deltas
    delta = librosa.feature.delta(mel_spec_db)
    delta2 = librosa.feature.delta(mel_spec_db, order=2)

    # Stack channels and resize
    combined = np.stack([mel_spec_db, delta, delta2], axis=-1)
    # Resize to 128x128 and normalize to [0, 1]

    return combined
```

## 🔄 Retraining the Model

### Prerequisites

- Python 3.11+
- TensorFlow 2.16+
- Librosa 0.10+
- Jupyter Notebook
- GPU recommended (CUDA-compatible)

### Steps

1. **Prepare Dataset**

   - Organize audio files into `real/` and `fake/` folders
   - Ensure consistent format (WAV recommended)

2. **Open Training Notebook**

   ```bash
   cd ml-service/notebooks
   jupyter notebook Training_Model_Kuber_Monday\ \(1\).ipynb
   ```

3. **Configure Parameters**

   - Adjust batch size, epochs, learning rate
   - Modify data augmentation settings
   - Set validation split ratio

4. **Run Training**

   - Execute cells sequentially
   - Monitor training/validation metrics
   - Save best model based on validation accuracy

5. **Evaluate Model**

   - Test on hold-out dataset
   - Generate confusion matrix
   - Calculate ROC curve and AUC

6. **Export Model**
   - Save as `best_model.h5`
   - Document model metrics
   - Archive previous version in `trained_models/`

## 📊 Model Versioning

Previous model versions are stored in `trained_models/` with naming convention:

```
model_YYYY-MM-DD_accuracy_XXXX.h5
```

Example:

```
trained_models/
├── model_2024-01-15_accuracy_0.92.h5
├── model_2024-02-20_accuracy_0.93.h5
└── model_2024-03-10_accuracy_0.94.h5
```

## 🧪 Testing

### Quick Test

```python
# Test model loading
from tensorflow import keras
model = keras.models.load_model('models/best_model.h5')
print(model.summary())

# Test with sample audio
import numpy as np
test_input = np.random.rand(1, 128, 128, 3)  # Random input
prediction = model.predict(test_input)
print(f"Prediction: {prediction[0][0]:.4f}")
```

### Full Evaluation

Run the evaluation cells in `Training_Model_Kuber_Monday (1).ipynb` to:

- Calculate accuracy, precision, recall, F1-score
- Generate confusion matrix
- Plot ROC curve
- Test on real-world samples

## 📚 References

### Datasets Used

- **ASVspoof 2019**: Audio deepfake detection challenge dataset
- **FakeAVCeleb**: Deepfake audio-video dataset
- **Custom Dataset**: Collected from various sources

### Research Papers

- "ASVspoof 2019: A large-scale public database of synthesized, converted and replayed speech"
- "FakeAVCeleb: A Novel Audio-Video Multimodal Deepfake Dataset"

### Libraries

- TensorFlow/Keras - Model training
- Librosa - Audio processing
- NumPy/SciPy - Numerical computing
- Scikit-learn - ML utilities

## 🔗 Integration

The trained model is used by:

- `backend/services/model_service.py` - Main inference service
- `backend/services/audio_processor.py` - Audio preprocessing
- `backend/services/live_processor.py` - Live monitoring

## 📝 Notes

- Model file size: ~15MB (lightweight for deployment)
- Inference time: ~50-100ms per 2-second clip
- GPU acceleration supported but not required
- Model is frozen - no retraining during inference

## 🤝 Contributing

When training new models:

1. Document changes in notebook
2. Update metrics in this README
3. Archive old model in `trained_models/`
4. Update model path in backend config
5. Test integration with backend service

---

For more information on using the model in production, see [`backend/README.md`](../backend/README.md).
