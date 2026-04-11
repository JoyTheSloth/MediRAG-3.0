# 🚀 MediRag 2.0 - Deployment Quick Reference

## ⚡ One-Command Deployment (Docker)

### Windows PowerShell
```powershell
.\deploy.ps1
```

### Linux/Mac Bash
```bash
chmod +x deploy.sh
./deploy.sh
```

### Manual Docker Compose
```bash
docker-compose up -d --build
```

---

## 📦 What Gets Deployed

| Service | Port | Technology | Purpose |
|---------|------|------------|---------|
| **Frontend** | 80 | Nginx + React | User Interface |
| **Backend** | 8000 | FastAPI + UVicorn | AI/ML API Server |

---

## 🔗 Access Points

- **Application:** http://localhost:80
- **API Server:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs
- **Swagger UI:** http://localhost:8000/redoc

---

## 🛑 Stop Services

```bash
docker-compose down
```

## 📊 View Logs

```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend
```

---

## 🔄 Rebuild After Changes

```bash
# Rebuild everything
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Rebuild specific service
docker-compose build backend
docker-compose up -d backend
```

---

## 🧹 Complete Cleanup (WARNING: Deletes Data)

```bash
docker-compose down -v
```

---

## 🎯 Traditional Deployment Summary

### Backend (Production Server)
```bash
cd Backend
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend (Static Hosting)
```bash
cd Frontend
npm install
npm run build
# Deploy ./dist to Netlify, Vercel, or Nginx
```

---

## ☁️ Cloud Platforms

### Railway.app (Easiest)
1. Push to GitHub
2. Connect Railway to repo
3. Auto-detects and deploys

### Vercel (Frontend Only)
```bash
cd Frontend
vercel --prod
```

### AWS/GCP/Azure
- Use provided Dockerfiles
- Push images to container registry
- Deploy to ECS, Cloud Run, or AKS

---

## ⚙️ Configuration Files Created

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Orchestrates both services |
| `Backend/Dockerfile` | Backend container definition |
| `Frontend/Dockerfile` | Frontend container definition |
| `Frontend/nginx.conf` | Nginx reverse proxy config |
| `Backend/.dockerignore` | Excludes unnecessary files |
| `Frontend/.dockerignore` | Excludes unnecessary files |

---

## 🐛 Common Issues

### Port Already in Use
```yaml
# Change port in docker-compose.yml
ports:
  - "8080:80"  # Use 8080 instead of 80
```

### Out of Memory
```yaml
# Reduce batch sizes in Backend/config.yaml
deberta_batch_size: 2
```

### Cannot Connect to Backend
```bash
# Check if backend is running
docker-compose ps

# View backend logs
docker-compose logs backend
```

---

## 📈 Performance Tips

1. **GPU Acceleration**: Add NVIDIA runtime to docker-compose.yml
2. **Increase Workers**: `--workers 4` in uvicorn command
3. **Use Production Mode**: Set `ENV=production` in containers
4. **Enable Caching**: Configure Redis for frequently accessed data
5. **CDN**: Serve static assets from CDN for better performance

---

## 🔒 Security Checklist

- [ ] Change default API keys in config.yaml
- [ ] Enable HTTPS with SSL certificates
- [ ] Set up firewall rules
- [ ] Use environment variables for secrets
- [ ] Enable CORS only for trusted domains
- [ ] Implement rate limiting
- [ ] Regular security updates

---

## 📞 Need Help?

```bash
# Check service health
docker-compose ps

# View all logs
docker-compose logs --tail=100

# Restart failed service
docker-compose restart <service-name>

# Enter running container (debugging)
docker exec -it medirag-backend bash
```

---

**Quick Start Command:**
```bash
docker-compose up -d --build && docker-compose logs -f
```

This builds and starts everything, then shows live logs! 🎉
