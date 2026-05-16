@echo off
REM MediRag 2.0 - Production Startup Script
REM This script starts both backend and frontend in production mode

echo ========================================
echo   MediRag 2.0 - Production Deployment
echo ========================================
echo.

:: Check if running as administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ⚠️  Running in non-administrator mode
    echo.
)

echo 📍 Current directory: %CD%
echo.

REM === Start Backend ===
echo 🔧 Starting Backend API...
cd /d "%~dp0Backend"

if not exist "venv\" (
    echo ❌ Virtual environment not found!
    echo Please run: python -m venv venv
    echo Then: .\venv\Scripts\activate
    echo Then: pip install -r requirements.txt
    pause
    exit /b 1
)

echo ✅ Virtual environment found
start cmd /k "title MediRag Backend && cd /d %~dp0Backend && .\venv\Scripts\activate && echo Starting Gunicorn on port 8000... && gunicorn src.api.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 --timeout 120"

echo ⏳ Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

REM === Start Frontend ===
echo.
echo 🎨 Starting Frontend...
cd /d "%~dp0Frontend"

if not exist "node_modules\" (
    echo ⚠️  node_modules not found. Installing dependencies...
    call npm install
)

if not exist "dist\" (
    echo 🏗️  Building production bundle...
    call npm run build
)

echo 🌐 Starting production server on port 80...
start cmd /k "title MediRag Frontend && cd /d %~dp0Frontend && npx serve dist -p 80 -s"

echo.
echo ========================================
echo   ✅ Services Started Successfully!
echo ========================================
echo.
echo 🌐 Access Points:
echo    Frontend:  http://localhost:80
echo    Backend:   http://localhost:8000
echo    API Docs:  http://localhost:8000/docs
echo.
echo 📝 Useful Commands:
echo    - View backend logs: Get-Content Backend\logs\medirag.log -Wait -Tail 100
echo    - Stop services: Close the command windows or press Ctrl+C
echo    - Restart: Run this script again
echo.
echo ⚠️  Press any key to exit this window...
pause >nul
