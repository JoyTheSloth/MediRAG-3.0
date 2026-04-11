@echo off
REM MediRag 2.0 - Production Setup Script
REM Run this ONCE to prepare the production environment

echo ========================================
echo   MediRag 2.0 - Production Setup
echo ========================================
echo.

:: Check Python
echo 🔍 Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found! Please install Python 3.10+
    pause
    exit /b 1
)
echo ✅ Python found
python --version
echo.

:: Setup Backend
echo ========================================
echo   Setting Up Backend
echo ========================================
cd /d "%~dp0Backend"

if exist "venv\" (
    echo ℹ️  Virtual environment already exists
) else (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

echo 🔄 Activating virtual environment...
call venv\Scripts\activate.bat

echo 📈 Upgrading pip...
python -m pip install --upgrade pip --quiet

echo 📥 Installing production dependencies...
pip install -r requirements.txt --quiet

echo 🚀 Installing gunicorn for production...
pip install gunicorn uvicorn[standard] --quiet

echo ✅ Backend setup complete!
echo.

:: Setup Frontend
echo ========================================
echo   Setting Up Frontend
echo ========================================
cd /d "%~dp0Frontend"

if exist "node_modules\" (
    echo ℹ️  Node modules already installed
) else (
    echo 📦 Installing Node dependencies...
    call npm install
)

echo 🏗️  Building production bundle...
call npm run build

echo ✅ Frontend setup complete!
echo.

:: Summary
echo ========================================
echo   ✅ Setup Complete!
echo ========================================
echo.
echo Next steps:
echo   1. Review config.yaml if you need to change settings
echo   2. Update Frontend\.env.production with your backend URL (for remote deployment)
echo   3. Run: start_production.bat
echo.
echo 🆘 Need help? See PRODUCTION_DEPLOYMENT.md
echo.
pause
