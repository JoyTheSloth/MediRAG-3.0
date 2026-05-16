#!/bin/bash

# MediRag 2.0 - Quick Deployment Script
# This script automates the complete deployment process

set -e  # Exit on error

echo "🚀 Starting MediRag 2.0 Deployment..."
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker and Docker Compose found${NC}"
echo ""

# Check if running in correct directory
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}❌ Please run this script from the project root directory${NC}"
    exit 1
fi

echo "📋 Deployment Options:"
echo "   1) Build and start all services (Recommended)"
echo "   2) Start existing containers"
echo "   3) Rebuild and restart"
echo "   4) Stop all services"
echo "   5) Clean up (remove containers and volumes)"
echo ""
read -p "Choose an option (1-5): " choice

case $choice in
    1)
        echo ""
        echo -e "${YELLOW}🔨 Building Docker images...${NC}"
        docker-compose build
        
        echo ""
        echo -e "${GREEN}✅ Build complete! Starting services...${NC}"
        docker-compose up -d
        
        echo ""
        echo -e "${GREEN}✅ Services started!${NC}"
        ;;
        
    2)
        echo ""
        echo -e "${YELLOW}▶️  Starting existing containers...${NC}"
        docker-compose up -d
        echo -e "${GREEN}✅ Services started!${NC}"
        ;;
        
    3)
        echo ""
        echo -e "${YELLOW}🔄 Stopping existing services...${NC}"
        docker-compose down
        
        echo ""
        echo -e "${YELLOW}🔨 Rebuilding images...${NC}"
        docker-compose build --no-cache
        
        echo ""
        echo -e "${GREEN}✅ Rebuild complete! Starting services...${NC}"
        docker-compose up -d
        ;;
        
    4)
        echo ""
        echo -e "${YELLOW}⏹️  Stopping all services...${NC}"
        docker-compose down
        echo -e "${GREEN}✅ Services stopped!${NC}"
        ;;
        
    5)
        echo ""
        echo -e "${RED}⚠️  WARNING: This will remove all containers and data volumes!${NC}"
        read -p "Are you sure? (y/N): " confirm
        if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
            docker-compose down -v
            echo -e "${GREEN}✅ Cleanup complete!${NC}"
        else
            echo "Cleanup cancelled."
        fi
        ;;
        
    *)
        echo -e "${RED}❌ Invalid option${NC}"
        exit 1
        ;;
esac

echo ""
echo "⏳ Waiting for services to initialize..."
sleep 5

echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "🌐 Access URLs:"
echo "   Frontend: http://localhost:80"
echo "   Backend API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"

echo ""
echo -e "${YELLOW}📝 Useful commands:${NC}"
echo "   View logs:     docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart:       docker-compose restart"

echo ""
echo -e "${GREEN}✅ Deployment complete! 🎉${NC}"
