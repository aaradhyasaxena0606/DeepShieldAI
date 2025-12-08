# VoiceGuard AI Backend - Dockerfile
# Use lightweight Python base image instead of TensorFlow (saves ~3GB)
FROM python:3.11-slim

# Working directory
WORKDIR /app

# Install system dependencies needed for Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    libsndfile1 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY backend/requirements.txt /app/requirements.txt

# Install Python dependencies. TensorFlow is already present in the base image,
# so pip will quickly skip or satisfy that requirement. Keep retry logic.
RUN pip install --no-cache-dir --retries 5 --default-timeout=1000 -r /app/requirements.txt || \
    pip install --no-cache-dir --retries 5 --default-timeout=1000 -r /app/requirements.txt

# Copy application code
COPY backend/ /app

# Create directories for model mount points (will be mounted at runtime)
RUN mkdir -p /app/ml-service/models /app/ml-service/trained_models

# Expose port used by Uvicorn
EXPOSE 8000

# Run the application (reload removed for container stability; use docker volumes for dev)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]