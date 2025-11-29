# VoiceGuard AI - Feature Extraction Module
# extract_mfcc(audio, sr=16000): Compute 13 MFCC coefficients, return mean and std across time
# extract_spectral_features(audio, sr=16000): Calculate spectral rolloff, spectral centroid, bandwidth
# extract_prosody_features(audio, sr=16000): Detect pitch (f0) using librosa.pyin, calculate variance and range
# extract_all_features(audio_path): Wrapper function returning complete feature dict for pattern matching

