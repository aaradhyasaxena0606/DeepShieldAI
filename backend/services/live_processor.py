# VoiceGuard AI - Live Audio Processing Service
# Dedicated processor for real-time audio monitoring
# Handles continuous audio stream analysis with optimized performance

import io
import numpy as np
from scipy.ndimage import zoom

try:
    import librosa
    import soundfile as sf
except ImportError:
    librosa = None
    sf = None

try:
    from pydub import AudioSegment
except ImportError:
    AudioSegment = None

# Same preprocessing parameters as training
TARGET_SR = 16000
DURATION = 2.0
N_FFT = 2048
HOP_LENGTH = 512
N_MELS = 128

def process_live_audio(raw_bytes: bytes):
    """
    Process live audio stream chunks for real-time detection.
    Optimized for continuous monitoring with WebM/Opus support.
    Returns 3-channel mel-spectrogram (128x128x3) for CNN inference.
    
    NOTE: Processes 10-second chunks but extracts only first 2 seconds for model.
    This may cause prediction fluctuations as different 2s segments are analyzed.
    Consider temporal smoothing in frontend for more stable results.
    """
    target_length = int(TARGET_SR * DURATION)
    
    # Primary: Try pydub first for WebM (most common in live monitoring)
    if AudioSegment is not None:
        try:
            audio_segment = AudioSegment.from_file(io.BytesIO(raw_bytes))
            
            # Convert to mono if stereo
            if audio_segment.channels > 1:
                audio_segment = audio_segment.set_channels(1)
            
            # Convert to target sample rate
            if audio_segment.frame_rate != TARGET_SR:
                audio_segment = audio_segment.set_frame_rate(TARGET_SR)
            
            # Export to WAV in memory
            wav_buffer = io.BytesIO()
            audio_segment.export(wav_buffer, format="wav")
            wav_buffer.seek(0)
            
            # Read with soundfile
            audio, sr = sf.read(wav_buffer, dtype='float32')
            
        except Exception as e_pydub:
            # Fallback to soundfile for WAV
            try:
                audio_buf = io.BytesIO(raw_bytes)
                audio, sr = sf.read(audio_buf)
                
                # Convert stereo to mono
                if audio.ndim > 1:
                    audio = np.mean(audio, axis=1)
                
                # Resample if needed
                if sr != TARGET_SR:
                    audio = librosa.resample(audio.astype(np.float32), orig_sr=sr, target_sr=TARGET_SR)
                    sr = TARGET_SR
                    
            except Exception as e_sf:
                # Last resort: librosa
                try:
                    audio_buf = io.BytesIO(raw_bytes)
                    audio, sr = librosa.load(audio_buf, sr=TARGET_SR)
                except Exception as e_lb:
                    raise RuntimeError(
                        f"Failed to load live audio stream. "
                        f"pydub: {e_pydub}, soundfile: {e_sf}, librosa: {e_lb}"
                    )
    else:
        # No pydub available, try soundfile then librosa
        try:
            audio_buf = io.BytesIO(raw_bytes)
            audio, sr = sf.read(audio_buf)
            
            if audio.ndim > 1:
                audio = np.mean(audio, axis=1)
            
            if sr != TARGET_SR:
                audio = librosa.resample(audio.astype(np.float32), orig_sr=sr, target_sr=TARGET_SR)
                sr = TARGET_SR
                
        except Exception as e_sf:
            try:
                audio_buf = io.BytesIO(raw_bytes)
                audio, sr = librosa.load(audio_buf, sr=TARGET_SR)
            except Exception as e_lb:
                raise RuntimeError(f"Failed to load audio: soundfile ({e_sf}), librosa ({e_lb})")
    
    # Ensure float32
    audio = audio.astype(np.float32)
    
    # Validate audio is not silent
    if len(audio) == 0 or np.abs(audio).max() < 1e-6:
        raise ValueError("Received silent or empty audio stream")
    
    # Trim or pad to exact duration (2 seconds)
    if len(audio) < target_length:
        audio = np.pad(audio, (0, target_length - len(audio)), mode="constant")
    else:
        audio = audio[:target_length]
    
    # Extract mel-spectrogram features
    mel = librosa.feature.melspectrogram(
        y=audio,
        sr=TARGET_SR,
        n_fft=N_FFT,
        hop_length=HOP_LENGTH,
        n_mels=N_MELS,
        power=2.0
    )
    mel_db = librosa.power_to_db(mel, ref=np.max)
    
    # Resize to 128x128
    z_row = 128 / mel_db.shape[0]
    z_col = 128 / mel_db.shape[1]
    mel_resized = zoom(mel_db, (z_row, z_col), order=1)
    
    # Channel 0: Normalized mel-spectrogram
    eps = 1e-8
    c0 = (mel_resized - mel_resized.min()) / (mel_resized.max() - mel_resized.min() + eps)
    
    # Compute delta and delta-delta
    delta = librosa.feature.delta(mel_db)
    delta2 = librosa.feature.delta(mel_db, order=2)
    
    # Resize delta channels
    delta_resized = zoom(delta, (128/delta.shape[0], 128/delta.shape[1]), order=1)
    delta2_resized = zoom(delta2, (128/delta2.shape[0], 128/delta2.shape[1]), order=1)
    
    # Channel 1: Normalized delta
    c1 = (delta_resized - delta_resized.min()) / (delta_resized.max() - delta_resized.min() + eps)
    
    # Channel 2: Normalized delta-delta
    c2 = (delta2_resized - delta2_resized.min()) / (delta2_resized.max() - delta2_resized.min() + eps)
    
    # Stack into 3-channel tensor
    mel_3ch = np.stack([c0, c1, c2], axis=-1).astype(np.float32)
    
    # Validate output shape
    if mel_3ch.shape != (128, 128, 3):
        raise ValueError(f"Invalid feature shape: {mel_3ch.shape}, expected (128, 128, 3)")
    
    # Extract additional audio features for pattern matching
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

    # Return preprocessed features
    return {
        'mel_spectrogram': mel_3ch,
        'pitch_variance': pitch_variance,
        'spectral_rolloff': spectral_rolloff,
        'mfcc_std': mfcc_std,
    }


def validate_audio_chunk(raw_bytes: bytes) -> bool:
    """
    Quick validation of audio chunk before processing.
    Returns True if chunk is valid for analysis.
    """
    if not raw_bytes or len(raw_bytes) < 100:
        return False
    
    try:
        # Try to detect format
        if AudioSegment is not None:
            AudioSegment.from_file(io.BytesIO(raw_bytes))
            return True
        else:
            # Try soundfile
            sf.read(io.BytesIO(raw_bytes))
            return True
    except Exception:
        return False
