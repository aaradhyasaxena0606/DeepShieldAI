# VoiceGuard AI - Audio Data Preprocessing
# Load audio files from data/raw/, resample to 16kHz using librosa
# Convert to mel-spectrograms (128x128), normalize pixel values to 0-1 range
# Save as numpy arrays to data/processed/spectrograms/, save labels to data/processed/labels.npy
# Usage: python preprocess.py --input data/raw/ --output data/processed/

