# VoiceGuard AI Backend - Dockerfile
# Use Python 3.9 base image for compatibility with ML packages
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies with retry logic
RUN pip install --no-cache-dir --retries 5 --default-timeout=1000 -r requirements.txt || \
    pip install --no-cache-dir --retries 5 --default-timeout=1000 -r requirements.txt

# Copy application code
COPY . .

# Create necessary directories for ML models
RUN mkdir -p /app/ml-service/models /app/ml-service/trained_models

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]