# ML Model Loading Issue - Diagnosis & Solutions

## Problem Summary

**The ML model fails to load due to TensorFlow version incompatibility**

### Error Details:

```
TypeError: functional_from_config.<locals>.get_tensor() takes 3 positional arguments but 11 were given
```

### Root Cause:

- Model file: `/app/ml-service/models/best_model.h5` (17.2 MB - found ✓)
- TensorFlow version in Docker: **2.16.1**
- The model was saved with a **different/older TensorFlow version** that's incompatible with 2.16.1
- When Keras tries to deserialize the model, the configuration format doesn't match the current version

---

## Solutions

### Solution 1: **Use Placeholder Mode (Quick Fix - for Testing)**

Enable placeholder predictions to test the system without the actual ML model.

**In `deployment/.env` or `docker-compose.yml`:**

```bash
ALLOW_PLACEHOLDER=1
```

**Then restart:**

```bash
docker-compose down
docker-compose up -d --build backend
```

**Result:** Backend will work with dummy predictions (always returns ~50% confidence)

---

### Solution 2: **Retrain/Re-export the Model (Recommended)**

Rebuild the model with TensorFlow 2.16.1 for compatibility.

**Steps:**

1. Go to `ml-service/` directory
2. Run the training script with current TensorFlow:

```bash
python train.py
```

3. Export the model properly:

```bash
python export_model.py
```

This will save a `best_model.h5` compatible with TensorFlow 2.16.1

**Then restart backend:**

```bash
docker-compose up -d --build backend
```

---

### Solution 3: **Downgrade TensorFlow Version**

Use an older TensorFlow version compatible with your saved model.

**Edit `backend/Dockerfile`:**

```dockerfile
# Change this line:
FROM tensorflow/tensorflow:2.16.1

# To this (example):
FROM tensorflow/tensorflow:2.10.0
```

**Then rebuild:**

```bash
docker-compose down
docker-compose up -d --build backend
```

---

### Solution 4: **Convert Model Format**

If the model needs to be compatible with multiple versions, save it in SavedModel format instead of HDF5.

**In training script:**

```python
# Instead of:
model.save('best_model.h5')

# Use:
model.save('best_model_savedmodel')  # Creates a directory
```

---

## Recommended Next Steps

1. **Immediate (for testing):** Use Solution 1 (ALLOW_PLACEHOLDER=1)

   - Allows frontend to work without model
   - Can test API endpoints and UI

2. **Short-term (for full functionality):** Use Solution 2 (Retrain model)

   - Regenerate model with current TensorFlow
   - Ensures full compatibility
   - Only one-time action needed

3. **Long-term (for robustness):** Use Solution 4 (SavedModel format)
   - More portable across TensorFlow versions
   - Better production practice

---

## Testing Commands

**Check if backend is running:**

```bash
curl http://localhost:8000/health
```

**View real-time logs:**

```bash
docker logs -f voiceguard-backend
```

**Check model compatibility:**

```bash
docker exec voiceguard-backend python /app/test_model_compatibility.py
```
