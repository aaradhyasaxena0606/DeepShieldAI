import numpy as np

class ModelService:
    def __init__(self):
        # Placeholder: load trained model later
        self.model = None

    def predict(self, features: dict):
        # Placeholder logic: random but deterministic based on mfcc_std
        seed = int(features.get('mfcc_std', 0) * 1000) % 2
        rng = np.random.default_rng(seed)
        probs = rng.random(2)
        probs = probs / probs.sum()
        confidence = float(max(probs))
        label = 'fake' if probs[1] > probs[0] else 'real'
        return label, confidence, probs.tolist()
