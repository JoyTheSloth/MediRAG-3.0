# MediRag 2.0 - Quick Deployment Script (PowerShell)
# This script automates the complete deployment process for Windows

Write-Host "🚀 Starting MediRag 2.0 Deployment..." -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker found: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed. Please install Docker Desktop first." -ForegroundColor Red
    exit 1
}

try {
    $composeVersion = docker-compose --version
    Write-Host "✅ Docker Compose found: $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose is not installed." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check if running in correct directory
if (-not (Test-Path "docker-compose.yml")) {
    Write-Host "❌ Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Deployment Options:" -ForegroundColor Yellow
Write-Host "   1) Build and start all services (Recommended)"
Write-Host "   2) Start existing containers"
Write-Host "   3) Rebuild and restart"
Write-Host "   4) Stop all services"
Write-Host "   5) Clean up (remove containers and volumes)"
Write-Host ""

$choice = Read-Host "Choose an option (1-5)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🔨 Building Docker images..." -ForegroundColor Yellow
        docker-compose build
        
        Write-Host ""
        Write-Host "✅ Build complete! Starting services..." -ForegroundColor Green
        docker-compose up -d
        
        Write-Host ""
        Write-Host "✅ Services started!" -ForegroundColor Green
    }
    
    "2" {
        Write-Host ""
        Write-Host "▶️  Starting existing containers..." -ForegroundColor Yellow
        docker-compose up -d
        Write-Host "✅ Services started!" -ForegroundColor Green
    }
    
    "3" {
        Write-Host ""
        Write-Host "🔄 Stopping existing services..." -ForegroundColor Yellow
        docker-compose down
        
        Write-Host ""
        Write-Host "🔨 Rebuilding images..." -ForegroundColor Yellow
        docker-compose build --no-cache
        
        Write-Host ""
        Write-Host "✅ Rebuild complete! Starting services..." -ForegroundColor Green
        docker-compose up -d
    }
    
    "4" {
        Write-Host ""
        Write-Host "⏹️  Stopping all services..." -ForegroundColor Yellow
        docker-compose down
        Write-Host "✅ Services stopped!" -ForegroundColor Green
    }
    
    "5" {
        Write-Host ""
        Write-Host "⚠️  WARNING: This will remove all containers and data volumes!" -ForegroundColor Red
        $confirm = Read-Host "Are you sure? (y/N)"
        if ($confirm -eq "y" -or $confirm -eq "Y") {
            docker-compose down -v
            Write-Host "✅ Cleanup complete!" -ForegroundColor Green
        } else {
            Write-Host "Cleanup cancelled." -ForegroundColor Yellow
        }
    }
    
    default {
        Write-Host "❌ Invalid option" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "⏳ Waiting for services to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "📊 Service Status:" -ForegroundColor Cyan
docker-compose ps

Write-Host ""
Write-Host "🌐 Access URLs:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:80"
Write-Host "   Backend API: http://localhost:8000"
Write-Host "   API Docs: http://localhost:8000/docs"

Write-Host ""
Write-Host "📝 Useful commands:" -ForegroundColor Yellow
Write-Host "   View logs:     docker-compose logs -f"
Write-Host "   Stop services: docker-compose down"
Write-Host "   Restart:       docker-compose restart"

Write-Host ""
Write-Host "✅ Deployment complete! 🎉" -ForegroundColor Green
