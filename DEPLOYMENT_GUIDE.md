# 🚀 MediRag 2.0 - Complete Deployment Guide

## Table of Contents
1. [Docker Deployment (Recommended)](#docker-deployment-recommended)
2. [Traditional Deployment](#traditional-deployment)
3. [Cloud Deployment Options](#cloud-deployment-options)
4. [Post-Deployment Configuration](#post-deployment-configuration)
5. [Troubleshooting](#troubleshooting)

---

## 🐳 Docker Deployment (Recommended)

### Prerequisites
- Docker Desktop installed (Windows/Mac/Linux)
- Docker Compose v3.8+ support
- At least 8GB RAM allocated to Docker
- 20GB free disk space

### Quick Start with Docker

#### Step 1: Navigate to Project Root
```bash
cd "e:\MediRag 2.0"
```

#### Step 2: Build and Run All Services
```bash
docker-compose up --build
```

**What this does:**
- Builds the backend container with Python 3.10 + all ML models
- Builds the frontend container with Nginx
- Creates persistent volumes for data/models
- Sets up networking between services
- Starts both services

#### Step 3: Access the Application
- **Frontend:** http://localhost:80
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

### Docker Commands Reference

```bash
# Start in detached mode (background)
docker-compose up -d --build

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v

# Rebuild specific service
docker-compose build backend
docker-compose up -d backend

# Scale (if needed in future)
docker-compose up -d --scale backend=2
```

### Container Structure

**Backend Container (`medirag-backend`):**
- Python 3.10-slim base
- All ML dependencies (FAISS, transformers, etc.)
- Pre-loaded models: BioBERT, DeBERTa-v3, SciSpaCy
- Exposed port: 8000
- Persistent volumes for data/index and logs

**Frontend Container (`medirag-frontend`):**
- Nginx Alpine (lightweight)
- Built React application
- Reverse proxy to backend
- Exposed port: 80

---

## 💻 Traditional Deployment

### Backend Deployment (Production Server)

#### Option A: Ubuntu/Debian Server

```bash
# SSH into your server
ssh user@your-server-ip

# Install Python 3.10+
sudo apt update
sudo apt install python3.10 python3.10-venv python3-pip git

# Clone repository
git clone https://github.com/JoyTheSloth/MediRAG-3.0.git
cd MediRAG-3.0/Backend

# Create virtual environment
python3.10 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create necessary directories
mkdir -p data/index data/processed data/raw logs

# Set up environment variables
export HOST=0.0.0.0
export PORT=8000
export PYTHONPATH=/path/to/Backend

# Run with Gunicorn (production WSGI server)
# Install gunicorn first: pip install gunicorn
gunicorn src.api.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

#### Option B: Windows Server

```powershell
# Open PowerShell as Administrator
cd E:\MediRag 2.0\Backend

# Create virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Install gunicorn for Windows
pip install gunicorn

# Run with uvicorn (production mode)
uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --workers 4
```

#### Systemd Service (Linux)

Create `/etc/systemd/system/medirag-backend.service`:

```ini
[Unit]
Description=MediRag Backend API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/Backend
Environment="PATH=/path/to/Backend/venv/bin"
Environment="HOST=0.0.0.0"
Environment="PORT=8000"
ExecStart=/path/to/Backend/venv/bin/uvicorn src.api.main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start
sudo systemctl enable medirag-backend
sudo systemctl start medirag-backend
sudo systemctl status medirag-backend
```

---

### Frontend Deployment

#### Build for Production

```bash
cd Frontend

# Install dependencies
npm install

# Build optimized production bundle
npm run build

# The built files are in ./dist directory
```

#### Deploy to Vercel (One-Click)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd Frontend
vercel --prod
```

#### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd Frontend
netlify deploy --prod --dir=dist
```

#### Manual Nginx Deployment

```bash
# Copy dist folder to nginx
sudo cp -r dist/* /var/www/medirag/

# Nginx configuration (already created as nginx.conf)
sudo nano /etc/nginx/sites-available/medirag

# Content:
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/medirag;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/medirag /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## ☁️ Cloud Deployment Options

### AWS Deployment

#### Using ECS (Elastic Container Service)

1. **Push to ECR (Elastic Container Registry)**
```bash
# Backend
aws ecr get-login-password --region region | docker login --username AWS --password-stdin aws_account_id.dkr.ecr.region.amazonaws.com
docker tag medirag-backend:latest aws_account_id.dkr.ecr.region.amazonaws.com/medirag-backend:latest
docker push aws_account_id.dkr.ecr.region.amazonaws.com/medirag-backend:latest

# Frontend
docker tag medirag-frontend:latest aws_account_id.dkr.ecr.region.amazonaws.com/medirag-frontend:latest
docker push aws_account_id.dkr.ecr.region.amazonaws.com/medirag-frontend:latest
```

2. **Deploy to ECS Fargate**
- Create task definitions for both containers
- Set up load balancer
- Configure security groups
- Deploy service

### Google Cloud Platform

#### Using Cloud Run

```bash
# Build and push to Container Registry
gcloud builds submit --tag gcr.io/PROJECT_ID/medirag-backend
gcloud builds submit --tag gcr.io/PROJECT_ID/medirag-frontend

# Deploy backend
gcloud run deploy medirag-backend \
  --image gcr.io/PROJECT_ID/medirag-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8000

# Deploy frontend
gcloud run deploy medirag-frontend \
  --image gcr.io/PROJECT_ID/medirag-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 80
```

### Railway.app (Easiest)

1. **Backend:**
   - Push code to GitHub
   - Connect Railway to your repo
   - Point to `/Backend` directory
   - Railway auto-detects Python
   - Set start command: `uvicorn src.api.main:app --host 0.0.0.0 --port 8000`

2. **Frontend:**
   - Already deployed at: https://medirag-frontend.vercel.app
   - Or redeploy: Connect Railway to `/Frontend` directory

---

## ⚙️ Post-Deployment Configuration

### Environment Variables

**Backend (.env or environment):**
```bash
# API Configuration
HOST=0.0.0.0
PORT=8000

# Model Configuration (from config.yaml)
MISTRAL_API_KEY=your_api_key_here
EMBEDDING_MODEL=dmis-lab/biobert-v1.1
NLI_MODEL=cross-encoder/nli-deberta-v3-base

# Optional: Custom paths
DATA_PATH=/app/data
LOG_LEVEL=INFO
```

**Frontend (.env.production):**
```bash
# Update API URL to point to your backend
VITE_API_URL=http://your-backend-domain.com/api
```

### SSL/HTTPS Setup (Production)

#### Using Let's Encrypt (Free SSL)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is set up automatically
sudo certbot renew --dry-run
```

### Database & Data Persistence

**For Docker:**
- Volumes already configured in `docker-compose.yml`
- Data persists across container restarts
- Backup: `docker run --rm -v medirag_data:/data -v $(pwd):/backup alpine tar czf /backup/medirag_backup.tar.gz -C /data .`

**For Traditional Deploy:**
- Ensure write permissions to `data/` directory
- Regular backups of `data/index/` and `data/processed/`

---

## 🔧 Troubleshooting

### Backend Issues

**Problem: Models not loading**
```bash
# Check if models downloaded
docker exec medirag-backend ls -la /app/data/index/

# If empty, you need to run ingestion
docker exec -it medirag-backend python src/pipeline/ingest.py
```

**Problem: Port already in use**
```bash
# Change port in docker-compose.yml
ports:
  - "8001:8000"  # Use 8001 instead
```

**Problem: Out of memory**
```bash
# Reduce batch sizes in config.yaml
deberta_batch_size: 2  # Instead of 4 or 8
```

### Frontend Issues

**Problem: Cannot connect to backend**
```bash
# Check network connectivity
docker exec medirag-frontend ping backend

# Verify API URL in .env.production matches your backend
```

**Problem: Build fails**
```bash
# Clear cache and rebuild
cd Frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Performance Optimization

**Reduce Initial Load Time:**
1. Enable gzip compression (already configured in nginx.conf)
2. Use CDN for static assets
3. Implement lazy loading in React

**Backend Optimization:**
1. Use GPU acceleration (add NVIDIA runtime to docker-compose)
2. Cache frequently accessed data
3. Increase worker count based on CPU cores

---

## 📊 Monitoring & Logging

### Docker Logs
```bash
# Real-time logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100 backend

# Export logs
docker-compose logs backend > backend.log
```

### Health Checks
```bash
# Backend health
curl http://localhost:8000/health

# Frontend health
curl http://localhost:80
```

---

## 🎯 Deployment Checklist

- [ ] Docker/images built successfully
- [ ] Both containers running without errors
- [ ] Frontend accessible on port 80
- [ ] Backend API responding on port 8000
- [ ] API docs available at /docs
- [ ] Data volumes mounted and persisting
- [ ] Logs being written correctly
- [ ] Network connectivity between services
- [ ] Environment variables configured
- [ ] SSL certificates installed (if using HTTPS)
- [ ] Backup strategy implemented
- [ ] Monitoring/alerting configured

---

## 📞 Support

For issues or questions:
- Check existing issues on GitHub
- Review logs: `docker-compose logs -f`
- API documentation: http://localhost:8000/docs

---

**Last Updated:** March 31, 2026  
**Version:** 2.0
