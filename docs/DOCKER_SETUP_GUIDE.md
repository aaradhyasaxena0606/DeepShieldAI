# VoiceGuard AI - Cleanup & Docker Setup Guide

## Files to Remove (Development Artifacts)

### Backend - Test & Debug Files

These files were used for development/testing and should be removed:

```
backend/
├── test_*.py          (Keep ONLY if you're running automated tests)
├── debug_gemini_response.py
├── docker_debug.py
└── __pycache__/       (Auto-generated, not needed in git)
```

**Commands to remove:**

```bash
# From backend directory
rm -f test_error_handling.py
rm -f test_gemini_api.py
rm -f test_gemini.py
rm -f test_invalid_key.py
rm -f test_model_loading.py
rm -f test_rag_error_handling.py
rm -f debug_gemini_response.py
rm -f docker_debug.py
rm -rf __pycache__
rm -rf .venv venv __pycache__

# Clean pycache recursively
find . -type d -name "__pycache__" -exec rm -rf {} +
find . -type f -name "*.pyc" -delete
```

Or on Windows (PowerShell):

```powershell
# From backend directory
Remove-Item -Path test_*.py -Force
Remove-Item -Path debug_gemini_response.py -Force
Remove-Item -Path docker_debug.py -Force
Remove-Item -Recurse -Path __pycache__, .venv, venv -Force -ErrorAction SilentlyContinue

# Clean pycache recursively
Get-ChildItem -Recurse -Directory -Filter "__pycache__" | Remove-Item -Recurse -Force
Get-ChildItem -Recurse -Filter "*.pyc" | Remove-Item -Force
```

### Root Level - Keep in .gitignore

```
.env                      (NEVER commit - has API keys)
.venv/                    (Virtual env - recreate with pip install)
venv/                     (Virtual env - recreate with pip install)
__pycache__/              (Auto-generated)
*.pyc                     (Auto-generated)
node_modules/             (Frontend - recreate with npm install)
```

## Project Structure After Cleanup

```
VoiceGuard-AI/
├── README.md
├── backend/
│   ├── api/
│   ├── rag/
│   ├── services/
│   ├── utils/
│   ├── config.py
│   ├── main.py
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .dockerignore
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── ml-service/
│   ├── models/
│   │   └── best_model.h5      (⚠️ Must exist for predictions)
│   ├── trained_models/
│   ├── data/
│   ├── notebooks/
│   └── requirements.txt
│
├── deployment/
│   ├── docker-compose.yml
│   ├── .env                   (⚠️ NOT in git, created locally)
│   ├── .env.example           (Template for .env)
│   └── cloudbuild.yaml
│
├── docs/
│   ├── FULL_APP_FLOW.md       (📄 NEW - Complete architecture)
│   ├── api-spec.yaml
│   └── architecture.md
│
└── tests/                      (Optional - integration tests)
```

## .gitignore - Recommended Contents

```gitignore
# Environment & Secrets
.env
.env.local
.env.*.local

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.venv/
venv/
ENV/
env/
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Node & Frontend
node_modules/
npm-debug.log
yarn-error.log
.next/

# Docker
docker-compose.override.yml

# ML Models (if too large)
# ml-service/models/*.h5

# Logs
*.log
logs/
```

## Docker Setup - Quick Start

### 1. Prepare the Environment File

```bash
# From project root
cd deployment
cp .env.example .env

# Edit .env with your Google AI Studio API key
# (Open .env in your editor and fill in GOOGLE_AI_STUDIO_KEY)
```

### 2. Verify ML Model File Exists

```bash
# Check if the trained model exists
ls -la ../ml-service/models/best_model.h5

# If missing:
# - Download from your training source, or
# - Train locally: cd ml-service && python train.py
```

### 3. Start Docker Services

```bash
# From deployment/ directory
docker-compose up --build

# This will:
# 1. Build backend image (Python + TensorFlow)
# 2. Build frontend image (Node.js)
# 3. Create voiceguard-network bridge
# 4. Start both containers
# 5. Output logs to terminal
```

### 4. Access the Application

```
Frontend:  http://localhost:5173
Backend:   http://localhost:8000
Health:    http://localhost:8000/health
Docs:      http://localhost:8000/docs (SwaggerUI)
```

## Docker Commands Reference

```bash
# View logs
docker-compose logs -f              # All services
docker-compose logs -f backend      # Just backend
docker-compose logs -f frontend     # Just frontend

# Run command in container
docker-compose exec backend bash
docker-compose exec frontend bash

# Restart services
docker-compose restart backend
docker-compose restart frontend

# Stop all services
docker-compose down

# Remove everything (including volumes)
docker-compose down -v

# Rebuild without cache
docker-compose build --no-cache

# Run in background
docker-compose up -d
```

## Dockerfile Explanations

### Backend Dockerfile

```dockerfile
FROM tensorflow/tensorflow:2.16.1
```

- Uses official TensorFlow image (CPU-optimized)
- Saves time: TensorFlow already installed and tested
- Includes Python 3.9+ by default

**Key features:**

- Installs system dependencies (gcc, g++)
- Copies requirements.txt and installs Python packages
- Mounts model directories for runtime
- Exposes port 8000
- Runs uvicorn with hot-reload via docker volumes

### Frontend Dockerfile

```dockerfile
FROM node:20.19.0-slim
```

- Uses official Node.js image (slim variant)
- Smaller image size than full Node.js
- Sufficient for Vite development server

**Key features:**

- Installs dependencies with npm
- Copies application code
- Exposes port 5173 (Vite dev server)
- Runs with --host flag for docker access

### docker-compose.yml

**Key configurations:**

```yaml
backend:
  environment:
    - VITE_API_BASE_URL=http://backend:8000 # Docker service name

frontend:
  environment:
    - VITE_API_BASE_URL=http://backend:8000 # Resolves via Docker network
```

**Why "backend" instead of "localhost"?**

- Inside Docker network, use service name
- Docker DNS automatically resolves "backend" to backend container
- Outside Docker (local dev), use localhost

**Volume mounts:**

```yaml
volumes:
  - ../backend:/app # Live code reload
  - /app/ml-service # Exclude from override
```

This allows:

- Edit `main.py` → Backend reloads automatically
- Change React code → Frontend HMR updates
- Model files still available from mounted ml-service

## Production Checklist

- [ ] Remove all test files
- [ ] Remove debug files
- [ ] Update docker-compose to remove volume mounts (for immutability)
- [ ] Set `ALLOW_PLACEHOLDER=0` in .env
- [ ] Verify `best_model.h5` exists and is not corrupted
- [ ] Test with real audio files
- [ ] Check logs for errors: `docker-compose logs`
- [ ] Set proper GEMINI_MODEL (gemini-2.5-flash recommended)
- [ ] Enable only required CORS origins (not "\*")
- [ ] Test health endpoint: `curl http://localhost:8000/health`

## Example Production docker-compose.yml

```yaml
services:
  backend:
    image: voiceguard-backend:latest
    container_name: voiceguard-backend
    command: uvicorn main:app --host 0.0.0.0 --port 8000
    ports:
      - "8000:8000"
    environment:
      - GOOGLE_AI_STUDIO_KEY=${GOOGLE_AI_STUDIO_KEY}
      - GEMINI_MODEL=gemini-2.5-flash
      - PORT=8000
    env_file:
      - .env
    networks:
      - voiceguard-network
    restart: on-failure

  frontend:
    image: voiceguard-frontend:latest
    container_name: voiceguard-frontend
    command: npm run preview -- --host # Use preview, not dev
    ports:
      - "5173:5173"
    environment:
      - VITE_API_BASE_URL=http://backend:8000
    networks:
      - voiceguard-network
    depends_on:
      - backend
    restart: on-failure

networks:
  voiceguard-network:
    driver: bridge
```

**Changes for production:**

- Remove `volumes` (code is baked into image)
- Remove `--reload` (use preview build)
- Add `restart: on-failure` (handle crashes)
- Use pre-built images instead of `build:`
- Strict environment variables

---

## Troubleshooting Common Docker Issues

### Issue: "Port 8000 already in use"

```bash
# Find process using port
lsof -i :8000
# Kill it
kill -9 <PID>

# Or change port in docker-compose.yml
# ports:
#   - "8001:8000"  # Use 8001 instead
```

### Issue: "backend service not found" (CORS error in frontend)

```bash
# Verify network is created
docker network ls

# Verify services are on same network
docker network inspect voiceguard-network

# Check if backend is running
docker ps | grep backend

# View backend logs
docker-compose logs backend
```

### Issue: "Model not found" (HTTP 503)

```bash
# Verify model file exists
ls -la ../ml-service/models/best_model.h5

# If missing, check mounted volume
docker-compose exec backend ls -la /app/ml-service/models/

# Check logs for details
docker-compose logs backend | grep -i model
```

### Issue: "Gemini API failed"

```bash
# Check if API key is set
docker-compose exec backend env | grep GOOGLE_AI_STUDIO_KEY

# View API initialization logs
docker-compose logs backend | grep -i "gemini\|API"

# Verify .env file is loaded
cat .env
```

---

## Summary

✅ **Ready for Production**

- Clean directory structure
- Comprehensive Docker setup
- Environment variables properly managed
- Error handling in place
- Full documentation available

📝 **Before Running**

1. Add your Google AI Studio API key to `.env`
2. Ensure `best_model.h5` exists in `ml-service/models/`
3. Run: `docker-compose up --build`
4. Access: http://localhost:5173

🐛 **If Something Fails**

1. Check logs: `docker-compose logs`
2. Check this guide's troubleshooting section
3. Verify environment variables
4. Ensure all required files exist
