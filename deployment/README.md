# Deployment Configuration

This directory contains Docker and deployment configurations for VoiceGuard AI.

## 📁 Contents

```
deployment/
├── docker-compose.yml    # Multi-service Docker orchestration
├── cloudbuild.yaml       # Google Cloud Build configuration
├── .env.example          # Environment variables template
└── .env                  # Local environment variables (git-ignored)
```

## 🐳 Docker Compose

### Services

The `docker-compose.yml` defines two main services:

1. **Backend Service**

   - FastAPI + TensorFlow backend
   - Port: 8000
   - Python 3.11 base image
   - Hot-reload enabled for development

2. **Frontend Service**
   - React + Vite frontend
   - Port: 5173
   - Node.js 18 base image
   - Hot-reload enabled for development

### Quick Start

```bash
cd deployment

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# Add GOOGLE_AI_STUDIO_KEY and other required variables

# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Remove volumes and rebuild
docker-compose down -v
docker-compose up --build
```

### Configuration

#### Environment Variables (.env)

```env
# Gemini AI Configuration
GOOGLE_AI_STUDIO_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash-exp

# Backend Configuration
PORT=8000
ALLOW_PLACEHOLDER=1

# Frontend Configuration (set in frontend/.env)
# VITE_API_BASE_URL=http://localhost:8000
# VITE_FIREBASE_API_KEY=...
```

#### Network Configuration

Both services run on a shared bridge network `voiceguard-network` for inter-service communication.

#### Volume Mounts

**Backend:**

```yaml
volumes:
  - ../backend:/app # Backend source code
  - ../ml-service:/app/ml-service # ML models
```

**Frontend:**

```yaml
volumes:
  - ../frontend:/app # Frontend source code
  - /app/node_modules # Preserve node_modules
```

## ☁️ Cloud Build (Google Cloud)

### cloudbuild.yaml

Configuration for Google Cloud Build CI/CD pipeline.

**Features:**

- Automated builds on git push
- Multi-stage Docker builds
- Container Registry integration
- Cloud Run deployment support

**Steps:**

1. Clone repository
2. Build backend Docker image
3. Build frontend Docker image
4. Push images to Container Registry
5. Deploy to Cloud Run

### Usage

```bash
# Submit build manually
gcloud builds submit --config=cloudbuild.yaml

# Set up automated triggers
gcloud builds triggers create github \
  --repo-name=VoiceGuard-AI \
  --repo-owner=VTG56 \
  --branch-pattern=^main$ \
  --build-config=deployment/cloudbuild.yaml
```

## 🚀 Deployment Options

### Option 1: Local Development (Docker Compose)

Best for: Development and testing

```bash
cd deployment
docker-compose up
```

Access:

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Option 2: Production (Separate Containers)

Best for: Production deployment

**Backend:**

```bash
cd backend
docker build -t voiceguard-backend .
docker run -d -p 8000:8000 \
  -e GEMINI_API_KEY=your_key \
  voiceguard-backend
```

**Frontend:**

```bash
cd frontend
docker build -t voiceguard-frontend .
docker run -d -p 80:80 voiceguard-frontend
```

### Option 3: Cloud Platforms

#### Railway

- Use `railway.toml` in root directory
- Automatic deployments from GitHub
- Environment variables via Railway dashboard

#### Google Cloud Run

- Use `cloudbuild.yaml` for automated builds
- Serverless auto-scaling
- Pay-per-request pricing

#### AWS / Azure

- Export Docker images
- Deploy to ECS/EKS (AWS) or Container Instances (Azure)
- Use managed container services

## 🔧 Development Workflow

### 1. Initial Setup

```bash
cd deployment
cp .env.example .env
# Edit .env with your credentials
docker-compose up --build
```

### 2. Making Changes

- Edit code in `backend/` or `frontend/`
- Changes auto-reload in containers
- Restart specific service if needed:
  ```bash
  docker-compose restart backend
  docker-compose restart frontend
  ```

### 3. Debugging

```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Execute commands in containers
docker-compose exec backend bash
docker-compose exec frontend sh

# Rebuild specific service
docker-compose up -d --build backend
```

### 4. Clean Reset

```bash
# Remove all containers, volumes, and images
docker-compose down -v --rmi all

# Rebuild from scratch
docker-compose up --build
```

## 📊 Health Checks

### Backend Health Check

```bash
curl http://localhost:8000/health
# Should return: {"status": "healthy"}
```

### Frontend Health Check

```bash
curl http://localhost:5173
# Should return HTML content
```

## 🔒 Security Considerations

### Environment Variables

- Never commit `.env` files
- Use secrets management in production
- Rotate API keys regularly

### Network Security

- Use HTTPS in production
- Configure CORS properly
- Implement rate limiting

### Container Security

- Use non-root users in Dockerfiles
- Scan images for vulnerabilities
- Keep base images updated

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port
netstat -ano | findstr :8000
netstat -ano | findstr :5173

# Kill process or change port in docker-compose.yml
```

### Container Build Fails

```bash
# Clear Docker cache
docker system prune -a

# Rebuild with no cache
docker-compose build --no-cache
```

### Volume Permission Issues

```bash
# Linux/Mac: Fix permissions
sudo chown -R $USER:$USER .

# Windows: Ensure Docker has drive access
# Docker Desktop → Settings → Resources → File Sharing
```

### Out of Memory

```bash
# Increase Docker memory limit
# Docker Desktop → Settings → Resources → Memory

# Or use smaller build
docker-compose build --build-arg NODE_OPTIONS=--max_old_space_size=4096
```

## 📝 Configuration Files

### docker-compose.yml Customization

**Change ports:**

```yaml
ports:
  - "3000:8000" # Map host:3000 to container:8000
```

**Add environment variables:**

```yaml
environment:
  - DEBUG=true
  - LOG_LEVEL=debug
```

**Mount additional volumes:**

```yaml
volumes:
  - ../data:/app/data
  - ../logs:/app/logs
```

## 🔗 Related Documentation

- [Backend Dockerfile](../backend/Dockerfile)
- [Frontend Dockerfile](../frontend/Dockerfile)
- [Main README](../README.md)
- [Backend Setup](../backend/README.md)
- [Frontend Setup](../frontend/README.md)

## 📚 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Google Cloud Build Docs](https://cloud.google.com/build/docs)
- [Railway Deployment Guide](https://docs.railway.app/)

---

For production deployment guides and platform-specific instructions, see the main [README.md](../README.md#-deployment) section.
