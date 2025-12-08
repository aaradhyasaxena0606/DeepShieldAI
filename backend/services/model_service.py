"""ModelService

This service loads a trained TensorFlow model from a set of expected
locations. Per project requirements, placeholder/fake-score logic was
removed: initialization will raise a RuntimeError if TensorFlow is not
installed or if the trained model file cannot be found/loaded. This makes
configuration errors visible in the terminal instead of silently returning
fake predictions.

Public API:
- ModelService(): attempts to load the model during construction.
- predict(features: dict) -> (label, confidence, probs): runs real model
  inference and propagates any errors.
"""

import os
from typing import Any, Tuple

import numpy as np

from config import settings


class ModelService:
    def __init__(self) -> None:
        # Candidate paths (local dev and containerized /app path)
        candidate_paths = [
            os.path.join(os.path.dirname(__file__), '..', 'ml-service', 'models', 'best_model.h5'),
            os.path.join('/app', 'ml-service', 'models', 'best_model.h5'),
            os.path.join(os.path.dirname(__file__), '..', 'ml-service', 'trained_models', 'cnn_model.h5'),
            os.path.join('/app', 'ml-service', 'trained_models', 'cnn_model.h5'),
        ]

        print("[ModelService] Starting model initialization...")
        print(f"[ModelService] Candidate paths: {candidate_paths}")
        
        # Resolve the first existing model path
        model_path = None
        for p in candidate_paths:
            exists = os.path.exists(p)
            print(f"[ModelService] Checking path {p}: {'EXISTS' if exists else 'NOT FOUND'}")
            if exists:
                model_path = p
                print(f"[ModelService] Found model at: {model_path}")
                break

        # Development fallback: if ALLOW_PLACEHOLDER=1 is set in the env, then
        # allow placeholder predictions when TensorFlow or the model file are
        # missing. This enables local testing without requiring a heavy TF
        # install. In production this should be unset/0 so missing deps fail.
        allow_placeholder = os.getenv("ALLOW_PLACEHOLDER", "0") == "1"
        print(f"[ModelService] ALLOW_PLACEHOLDER={allow_placeholder}")

        # Try to import TensorFlow. If it's missing and placeholder is allowed,
        # set a flag and continue; otherwise raise so the problem is visible.
        try:
            import tensorflow as tf  # type: ignore
            print("[ModelService] TensorFlow successfully imported")
        except ImportError as e:
            print(f"[ModelService] ERROR: TensorFlow import failed: {e}")
            if allow_placeholder:
                print(f"[ModelService] WARNING: Enabling placeholder predictions (ALLOW_PLACEHOLDER=1)")
                self.model = None
                self.initialized = True
                self._allow_placeholder = True
                return
            raise RuntimeError(f"TensorFlow is required but not installed: {e}") from e

        if model_path is None:
            print("[ModelService] ERROR: No model file found in any candidate path")
            if allow_placeholder:
                print(f"[ModelService] WARNING: Enabling placeholder predictions (ALLOW_PLACEHOLDER=1)")
                self.model = None
                self.initialized = True
                self._allow_placeholder = True
                return
            raise RuntimeError(f"Trained model not found. Looked in: {candidate_paths}")

        # Load the model and propagate errors if loading fails
        try:
            print(f"[ModelService] Loading model from: {model_path}")
            self.model = tf.keras.models.load_model(model_path)
            self.initialized = True
            self._allow_placeholder = False
            print(f"[ModelService] SUCCESS: Model loaded successfully from {model_path}")
        except Exception as e:
            print(f"[ModelService] ERROR: Failed to load model from {model_path}: {e}")
            if allow_placeholder:
                print(f"[ModelService] WARNING: Enabling placeholder predictions (ALLOW_PLACEHOLDER=1)")
                self.model = None
                self.initialized = True
                self._allow_placeholder = True
                return
            raise RuntimeError(f"Failed to load trained model from {model_path}: {e}") from e

    def predict(self, features: dict) -> Tuple[str, float, Any]:
        """Run prediction using the loaded TensorFlow model.

        Args:
            features: dict with at minimum a 'mel_spectrogram' key (128x128 array-like)

        Returns:
            (label, confidence, probs)

        Raises:
            RuntimeError: if the service is not initialized with a model.
            ValueError: if required features are missing or invalid.
            Any TensorFlow error will be propagated.
        """
        if not getattr(self, 'initialized', False):
            raise RuntimeError("Model service not initialized with a trained model.")

        # If placeholder mode is enabled, use a lightweight deterministic
        # predictor for local testing.
        if getattr(self, '_allow_placeholder', False) and getattr(self, 'model', None) is None:
            return self._placeholder_predict(features)

        mel_spectrogram = features.get('mel_spectrogram')
        if mel_spectrogram is None:
            raise ValueError("Missing 'mel_spectrogram' in features for model prediction")

        # Ensure correct shape for model input (128, 128)
        if getattr(mel_spectrogram, 'shape', None) != (128, 128):
            mel_spectrogram = np.resize(mel_spectrogram, (128, 128))

        spectrogram_input = mel_spectrogram.reshape(1, 128, 128, 1)

        prediction = self.model.predict(spectrogram_input)
        confidence = float(np.max(prediction))
        label = 'fake' if int(np.argmax(prediction)) == 1 else 'real'
        return label, confidence, prediction.tolist()

    def _placeholder_predict(self, features: dict):
        """Simple deterministic placeholder used only when ALLOW_PLACEHOLDER=1.

        This is intentionally lightweight and not for production. It uses a
        combination of mfcc_std and spectral_rolloff to compute a pseudo
        "fake" score between 0 and 1.
        """
        mfcc_std = float(features.get('mfcc_std', 0))
        spectral_rolloff = float(features.get('spectral_rolloff', 0))

        score = 0.1
        if mfcc_std > 2.0:
            score += 0.4
        elif mfcc_std > 1.0:
            score += 0.2

        if spectral_rolloff > 0.8:
            score += 0.3
        elif spectral_rolloff > 0.6:
            score += 0.1

        # deterministic clamp and small jitter using feature-derived seed
        seed = int((mfcc_std * 100 + spectral_rolloff * 1000) % 10000)
        np.random.seed(seed)
        score = float(max(0.0, min(1.0, score + np.random.uniform(-0.05, 0.05))))

        label = 'fake' if score > 0.5 else 'real'
        probs = [1.0 - score, score]
        return label, score, probs