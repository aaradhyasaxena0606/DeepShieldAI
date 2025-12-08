#!/usr/bin/env python3
"""
Diagnostic script to check model file compatibility and TensorFlow setup.
"""

import os
import sys

print("[DIAGNOSIS] Model Compatibility Check")
print("=" * 60)

# Check TensorFlow
try:
    import tensorflow as tf
    print(f"✓ TensorFlow version: {tf.__version__}")
except ImportError as e:
    print(f"✗ TensorFlow import failed: {e}")
    sys.exit(1)

# Check model paths
candidate_paths = [
    os.path.join(os.path.dirname(__file__), 'ml-service', 'models', 'best_model.h5'),
    os.path.join('/app', 'ml-service', 'models', 'best_model.h5'),
    os.path.join(os.path.dirname(__file__), 'ml-service', 'trained_models', 'cnn_model.h5'),
    os.path.join('/app', 'ml-service', 'trained_models', 'cnn_model.h5'),
]

print("\n[DIAGNOSIS] Checking model file locations:")
print("-" * 60)
model_path = None
for p in candidate_paths:
    if os.path.exists(p):
        size = os.path.getsize(p)
        print(f"✓ Found: {p} ({size} bytes)")
        model_path = p
    else:
        print(f"✗ Not found: {p}")

if model_path is None:
    print("\n✗ ERROR: No model file found!")
    sys.exit(1)

# Try to load the model
print(f"\n[DIAGNOSIS] Attempting to load model from: {model_path}")
print("-" * 60)

try:
    model = tf.keras.models.load_model(model_path)
    print(f"✓ Model loaded successfully!")
    print(f"  Model type: {type(model)}")
    print(f"  Model input shape: {model.input_shape}")
    print(f"  Model output shape: {model.output_shape}")
except Exception as e:
    print(f"✗ Model loading failed!")
    print(f"  Error type: {type(e).__name__}")
    print(f"  Error message: {e}")
    print("\n[DIAGNOSIS] This error suggests:")
    print("  1. Model was saved with a different TensorFlow version")
    print("  2. Need to retrain/re-export the model")
    print("  3. Or use TensorFlow version compatible with model")
    sys.exit(1)

print("\n" + "=" * 60)
print("[DIAGNOSIS] All checks passed! Model is compatible.")
