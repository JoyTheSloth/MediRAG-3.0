# 🚀 MediRag 2.0 - Production Deployment (Non-Docker)

## Prerequisites
- Python 3.10+ ✅ (You have Python 3.14.3)
- Node.js 18+ 
- pip and npm installed

---

## Step-by-Step Deployment

### 1️⃣ Backend Setup (Production)

```powershell
# Navigate to Backend
cd "e:\MediRag 2.0\Backend"

# Create/reuse virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Upgrade pip
python -m pip install --upgrade pip

# Install production dependencies
pip install -r requirements.txt

# Install gunicorn for Windows (production WSGI server)
pip install gunicorn uvicorn[standard]
```

#### Configure for Production

Edit `config.yaml` if needed:
```yaml
logging:
  level: WARNING  # Change from INFO to reduce log noise
```

#### Start Backend with Gunicorn (Production Mode)

```powershell
# Option A: Using gunicorn (recommended for production)
gunicorn src.api.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 --timeout 120

# Option B: Using uvicorn directly (also production-ready)
uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --workers 4 --loop uvloop --http httptools
```

**Windows Service (Optional - Auto-start on boot):**

Create `start_backend.bat`:
```batch
@echo off
cd /d "%~dp0"
call venv\Scripts\activate
gunicorn src.api.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 --timeout 120
```

Then use NSSM or Task Scheduler to run it as a service.

---

### 2️⃣ Frontend Setup (Production Build)

```powershell
# Navigate to Frontend
cd "e:\MediRag 2.0\Frontend"

# Update API URL for production
# Edit .env.production and set your backend URL
# VITE_API_URL=http://your-backend-domain.com/api

# Install dependencies
npm install

# Build optimized production bundle
npm run build

# The built files are in ./dist directory
```

#### Deploy Frontend Options:

**Option A: Serve with Nginx (Self-hosted)**

1. Download Nginx for Windows: https://nginx.org/en/download.html
2. Extract to `C:\nginx`
3. Replace `conf/nginx.conf` with the provided `Frontend/nginx.conf`
4. Copy `Frontend/dist/*` to `html/` folder
5. Run: `nginx.exe`

**Option B: Deploy to Vercel (Free, One-Click)**

```powershell
# Install Vercel CLI
npm install -g vercel

# Deploy
cd "e:\MediRag 2.0\Frontend"
vercel --prod
```

**Option C: Deploy to Netlify (Free)**

```powershell
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd "e:\MediRag 2.0\Frontend"
netlify deploy --prod --dir=dist
```

**Option D: Use IIS (Windows Built-in)**

1. Install IIS: "Turn Windows features on or off" → Internet Information Services
2. Install URL Rewrite module
3. Copy `dist/*` to `C:\inetpub\wwwroot\medirag`
4. Configure site in IIS Manager

---

### 3️⃣ Complete Startup Script

Create `start_production.bat` in project root:

```batch
@echo off
echo Starting MediRag 2.0 Production...

:: Start Backend
echo Starting Backend API...
start cmd /k "cd Backend && .\venv\Scripts\activate && gunicorn src.api.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 --timeout 120"

:: Wait for backend to initialize
timeout /t 5

:: Start Frontend (if using local Nginx or similar)
echo Starting Frontend...
start cmd /k "cd Frontend && npx serve dist -p 80"

echo Both services started!
echo Frontend: http://localhost:80
echo Backend: http://localhost:8000
echo API Docs: http://localhost:8000/docs
```

---

### 4️⃣ SSL/HTTPS Setup (Production Security)

**Using Let's Encrypt (Free SSL Certificate):**

1. Download Certbot for Windows: https://certbot.eff.org/instructions
2. Run:
```powershell
certbot certonly --standalone -d your-domain.com
```

3. Configure Nginx/Apache to use certificates in:
`C:\Program Files\Certbot\certs\`

---

### 5️⃣ Performance Optimization

#### Backend Optimizations:

```yaml
# config.yaml
modules:
  faithfulness:
    deberta_batch_size: 8  # Increase if you have GPU
```

```powershell
# Set environment variable for better performance
$env:PYTHONOPTIMIZE=2
$env:TOKENIZERS_PARALLELISM=true
```

#### Frontend Optimizations:

Already configured in `vite.config.js`:
- Minification enabled
- Tree-shaking active
- Code splitting ready

---

### 6️⃣ Monitoring & Logging

#### Backend Logs:

```powershell
# View logs in real-time
Get-Content "Backend\logs\medirag.log" -Wait -Tail 100

# Export logs
Get-Content "Backend\logs\medirag.log" > backend_export.log
```

#### Health Checks:

```powershell
# Check if backend is running
Invoke-RestMethod http://localhost:8000/health

# Check frontend
Invoke-RestMethod http://localhost:80
```

---

### 7️⃣ Backup Strategy

```powershell
# Backup data and indexes
$backupDir = "backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
New-Item -ItemType Directory -Path $backupDir
Copy-Item "Backend\data" -Destination "$backupDir\" -Recurse
Compress-Archive -Path $backupDir -DestinationPath "$backupDir.zip"
```

---

## 🎯 Quick Production Checklist

- [ ] Backend virtual environment created and activated
- [ ] All Python dependencies installed
- [ ] Gunicorn installed for production
- [ ] Backend running with 4 workers
- [ ] Frontend production build completed
- [ ] Frontend deployed (Vercel/Netlify/Nginx/IIS)
- [ ] API URL updated in frontend `.env.production`
- [ ] HTTPS/SSL configured
- [ ] Logs being captured
- [ ] Backups scheduled
- [ ] Monitoring enabled
- [ ] Firewall rules configured
- [ ] Domain DNS pointed to server

---

## 🔧 Troubleshooting

### Backend Won't Start
```powershell
# Check if port 8000 is in use
netstat -ano | findstr :8000

# Kill process using port 8000
Stop-Process -Id <PID> -Force

# Try different port
gunicorn src.api.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8001
```

### Frontend Build Fails
```powershell
# Clear cache and rebuild
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
npm run build
```

### Out of Memory
```powershell
# Reduce worker count
gunicorn src.api.main:app -w 2 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

---

## 📊 Production Architecture

```
┌─────────────┐
│   Users     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Frontend   │  Port 80
│  (Nginx/    │  or Custom Domain
│   Vercel)   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Backend   │  Port 8000
│  (Gunicorn  │  4 Workers
│   + UVicorn)│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Data      │  FAISS Index
│   Storage   │  Models Cache
│             │  Logs
└─────────────┘
```

---

## 🆘 Support Commands

```powershell
# Check Python version
python --version

# Check Node version
node --version

# List installed packages
pip list

# Check running processes
Get-Process | Where-Object {$_.ProcessName -like "*python*" -or $_.ProcessName -like "*node*"}

# View network listeners
netstat -ano | Select-String "LISTENING"
```

---

**Ready to deploy? Run:**
```powershell
.\start_production.bat
```

This will start both services in production mode! 🚀
