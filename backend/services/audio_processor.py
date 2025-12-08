# VoiceGuard AI - Audio Processing Service
# Matches the exact preprocessing pipeline from Training_Model_Kuber_Monday notebook
# Generates 3-channel mel-spectrogram: (mel, delta, delta-delta) for CNN input

import io
import numpy as np
from scipy.ndimage import zoom

try:
    import librosa
    import soundfile as sf
except ImportError:
    librosa = None
    sf = None

TARGET_SR = 16000
DURATION = 2.0
N_FFT = 2048
HOP_LENGTH = 512
N_MELS = 128

def extract_features(raw_bytes: bytes):
    """
    Load audio and produce (1,128,128,3) tensor matching training pipeline.
    Uses 3 channels: mel-spectrogram, delta, and delta-delta.
    """
    target_length = int(TARGET_SR * DURATION)
    
    # Robust load: try soundfile first, fallback to librosa
    try:
        audio_buf = io.BytesIO(raw_bytes)
        audio, sr = sf.read(audio_buf)
        # If stereo, convert to mono
        if audio.ndim > 1:
            audio = np.mean(audio, axis=1)
        # Resample if needed
        if sr != TARGET_SR:
            audio = librosa.resample(audio.astype(np.float32), orig_sr=sr, target_sr=TARGET_SR)
            sr = TARGET_SR
    except Exception as e_sf:
        try:
            audio_buf = io.BytesIO(raw_bytes)
            audio, sr = librosa.load(audio_buf, sr=TARGET_SR)
        except Exception as e_lb:
            raise RuntimeError(f"Failed to load audio with soundfile ({e_sf}) and librosa ({e_lb}).")
    
    # Ensure float32
    audio = audio.astype(np.float32)
    
    # Trim / pad to exact duration
    if len(audio) < target_length:
        audio = np.pad(audio, (0, target_length - len(audio)), mode="constant")
    else:
        audio = audio[:target_length]
    
    # Compute mel spectrogram and convert to dB (log scale)
    mel = librosa.feature.melspectrogram(
        y=audio,
        sr=TARGET_SR,
        n_fft=N_FFT,
        hop_length=HOP_LENGTH,
        n_mels=N_MELS,
        power=2.0
    )
    mel_db = librosa.power_to_db(mel, ref=np.max)
    
    # Resize to 128x128 using scipy.ndimage.zoom (bilinear interpolation)
    z_row = 128 / mel_db.shape[0]
    z_col = 128 / mel_db.shape[1]
    mel_resized = zoom(mel_db, (z_row, z_col), order=1)
    
    # Channel 0: Normalized mel-spectrogram (0-1)
    eps = 1e-8
    c0 = (mel_resized - mel_resized.min()) / (mel_resized.max() - mel_resized.min() + eps)
    
    # Compute delta and delta-delta on original mel (before resize) for stability
    delta = librosa.feature.delta(mel_db)
    delta2 = librosa.feature.delta(mel_db, order=2)
    
    # Resize delta channels
    delta_resized = zoom(delta, (128/delta.shape[0], 128/delta.shape[1]), order=1)
    delta2_resized = zoom(delta2, (128/delta2.shape[0], 128/delta2.shape[1]), order=1)
    
    # Channel 1: Normalized delta (0-1)
    c1 = (delta_resized - delta_resized.min()) / (delta_resized.max() - delta_resized.min() + eps)
    
    # Channel 2: Normalized delta-delta (0-1)
    c2 = (delta2_resized - delta2_resized.min()) / (delta2_resized.max() - delta2_resized.min() + eps)
    
    # Stack into 3-channel tensor and ensure float32
    mel_3ch = np.stack([c0, c1, c2], axis=-1).astype(np.float32)
    
    # Final sanity check
    if mel_3ch.shape != (128, 128, 3):
        raise ValueError(f"Preprocessed shape is wrong: {mel_3ch.shape}, expected (128, 128, 3)")
    
    # Additional simple indicators used by RAG pattern matcher
    try:
        pitch = librosa.yin(audio, fmin=50, fmax=350)
        pitch_variance = float(np.var(pitch)) if pitch.size else 0.0
    except Exception:
        pitch_variance = 0.0

    try:
        spectral_rolloff = float(np.mean(librosa.feature.spectral_rolloff(y=audio, sr=TARGET_SR)))
        spectral_rolloff = spectral_rolloff / (TARGET_SR / 2.0)
    except Exception:
        spectral_rolloff = 0.0

    try:
        mfcc = librosa.feature.mfcc(y=audio, sr=TARGET_SR, n_mfcc=13)
        mfcc_std = float(np.mean(np.std(mfcc, axis=1)))
    except Exception:
        mfcc_std = 0.0

    # Return dict with 3-channel mel-spectrogram and indicators
    return {
        'mel_spectrogram': mel_3ch,
        'pitch_variance': pitch_variance,
        'spectral_rolloff': spectral_rolloff,
        'mfcc_std': mfcc_std,
    }
