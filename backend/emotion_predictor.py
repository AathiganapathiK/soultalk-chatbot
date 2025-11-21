from transformers import pipeline
import numpy as np
import os

# Audio classification pipeline (pretrained SER model)
_audio_classifier = pipeline(
    task="audio-classification",
    model="superb/hubert-large-superb-er"
)

UNCLEAR_THRESHOLD = float(os.getenv("AUDIO_UNCLEAR_THRESHOLD", "0.45"))

def predict_emotion_from_audio(file_path):
    """Return (label, confidence). If below threshold, label is 'UNCLEAR'."""
    try:
        preds = _audio_classifier(file_path)
        if isinstance(preds, list) and len(preds) > 0 and isinstance(preds[0], dict):
            top = max(preds, key=lambda p: p.get("score", 0.0))
            label = str(top.get("label", "UNKNOWN")).upper()
            confidence = float(top.get("score", 0.0))
        else:
            label = "UNKNOWN"
            confidence = 0.0

        if confidence < UNCLEAR_THRESHOLD:
            return "UNCLEAR", confidence
        return label, confidence
    except Exception as e:
        print(f"❌ Error in predicting emotion: {e}")
        return "UNKNOWN", 0.0