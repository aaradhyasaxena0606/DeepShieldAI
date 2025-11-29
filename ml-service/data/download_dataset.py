# VoiceGuard AI - Dataset Download & Organization
# Download 500 audio samples (250 fake from FakeAVCeleb or WaveFake, 250 real from LibriSpeech)
# Use kaggle API or wget to download, extract to data/raw/ directory
# Create metadata.csv with columns: filename, label (0=real, 1=fake), duration, source
# Usage: python download_dataset.py --output data/raw/

