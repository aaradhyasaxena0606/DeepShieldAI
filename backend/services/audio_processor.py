import io
import numpy as np
import librosa

TARGET_SR = 16000
N_MELS = 128
SPEC_SHAPE = (N_MELS, 128)

def extract_features(raw_bytes: bytes):
    """Return a dict of features including mel-spectrogram and simple stats."""
    audio_buf = io.BytesIO(raw_bytes)
    y, sr = librosa.load(audio_buf, sr=TARGET_SR)
    mel = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=N_MELS)
    mel_db = librosa.power_to_db(mel, ref=np.max)

    # Resize / pad to fixed width
    if mel_db.shape[1] < SPEC_SHAPE[1]:
        pad_width = SPEC_SHAPE[1] - mel_db.shape[1]
        mel_db = np.pad(mel_db, ((0,0),(0,pad_width)), mode='constant')
    else:
        mel_db = mel_db[:, :SPEC_SHAPE[1]]

    pitch = librosa.yin(y, fmin=50, fmax=350)
    pitch_variance = float(np.var(pitch)) if pitch.size else 0.0
    spectral_rolloff = float(np.mean(librosa.feature.spectral_rolloff(y=y, sr=sr)))
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    mfcc_std = float(np.mean(np.std(mfcc, axis=1)))

    return {
        'mel_spectrogram': mel_db.astype(np.float32),
        'pitch_variance': pitch_variance,
        'spectral_rolloff': spectral_rolloff/ (sr/2),  # normalize
        'mfcc_std': mfcc_std
    }
