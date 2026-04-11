# Getting Started Guide

<cite>
**Referenced Files in This Document**
- [README.md](file://README.md)
- [START_INSTRUCTIONS.txt](file://START_INSTRUCTIONS.txt)
- [Backend README.md](file://Backend/README.md)
- [Frontend README.md](file://Frontend/README.md)
- [Backend requirements.txt](file://Backend/requirements.txt)
- [Backend config.yaml](file://Backend/config.yaml)
- [Backend src/api/main.py](file://Backend/src/api/main.py)
- [Frontend package.json](file://Frontend/package.json)
- [Frontend vite.config.js](file://Frontend/vite.config.js)
- [Frontend src/main.jsx](file://Frontend/src/main.jsx)
- [start.bat](file://start.bat)
- [docker-compose.yml](file://docker-compose.yml)
- [DEPLOYMENT_GUIDE.md](file://DEPLOYMENT_GUIDE.md)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Quick Start Commands](#quick-start-commands)
4. [Step-by-Step Installation](#step-by-step-installation)
5. [Default Configuration Options](#default-configuration-options)
6. [Port Configuration](#port-configuration)
7. [System Health Checks](#system-health-checks)
8. [Verification Steps](#verification-steps)
9. [Troubleshooting Guide](#troubleshooting-guide)
10. [Additional Resources](#additional-resources)

## Introduction
Welcome to MediRAG 3.0, the forensic audit layer for medical AI systems. This guide will help you quickly set up and configure the platform for local development. MediRAG provides a comprehensive evaluation pipeline that checks LLM-generated answers for hallucinations, entity accuracy, source credibility, and internal consistency.

## Prerequisites
Before installing MediRAG 3.0, ensure your system meets these requirements:

### Python Environment
- Python 3.10 or higher (required)
- Virtual environment support (recommended)

### Node.js Environment
- Node.js 16 or higher (recommended)
- npm 8 or higher

### System Requirements
- **Minimum RAM**: 8GB (16GB recommended for optimal performance)
- **Disk Space**: 2GB free space for models and indices
- **GPU**: Optional but recommended for faster inference
- **Internet Access**: Required for downloading models and dependencies

### Additional Dependencies
- **Conda**: Required for installing scispacy and related biomedical libraries
- **Git**: For cloning the repository

**Section sources**
- [Backend requirements.txt:1-35](file://Backend/requirements.txt#L1-L35)
- [Backend config.yaml:44-66](file://Backend/config.yaml#L44-L66)

## Quick Start Commands
Here are the fastest commands to get MediRAG 3.0 running:

### One-Command Launch (Windows)
```batch
start.bat
```

### Manual Quick Start
```bash
# Backend (Python)
cd Backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn src.api.main:app --reload --port 8000

# Frontend (Node.js)
cd ../Frontend
npm install
npm run dev
```

**Section sources**
- [README.md:54-76](file://README.md#L54-L76)
- [START_INSTRUCTIONS.txt:13-32](file://START_INSTRUCTIONS.txt#L13-L32)
- [start.bat:1-11](file://start.bat#L1-L11)

## Step-by-Step Installation

### Backend Installation (Python)

#### 1. Create Virtual Environment
```bash
cd Backend
python -m venv venv
```

#### 2. Activate Virtual Environment
```bash
# Linux/macOS
source venv/bin/activate
# Windows
venv\Scripts\activate
```

#### 3. Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### 4. Install Biomedical Libraries (Conda)
```bash
# Install scispacy and biomedical models
conda install -c conda-forge scispacy
conda install -c conda-forge en_core_sci_lg
```

### Frontend Installation (Node.js)

#### 1. Install Dependencies
```bash
cd ../Frontend
npm install
```

#### 2. Start Development Server
```bash
npm run dev
```

**Section sources**
- [README.md:62-76](file://README.md#L62-L76)
- [Backend requirements.txt:14-16](file://Backend/requirements.txt#L14-L16)
- [Frontend package.json:1-32](file://Frontend/package.json#L1-L32)

## Default Configuration Options

### Backend Configuration (config.yaml)
The default configuration includes:

#### Retrieval Settings
- **Top-K Results**: 5 documents
- **Chunk Size**: 512 tokens
- **Chunk Overlap**: 50 tokens
- **Embedding Model**: dmis-lab/biobert-v1.1

#### LLM Provider (Mistral)
- **Provider**: mistral
- **Model**: mistral-large-latest
- **Base URL**: http://localhost:11434
- **Timeout**: 120 seconds

#### API Settings
- **Host**: 0.0.0.0 (accessible from other machines)
- **Port**: 8000
- **Max Query Length**: 500 tokens
- **Max Answer Length**: 2000 tokens

#### Logging Configuration
- **Log Level**: INFO
- **Log File**: logs/medirag.log
- **Log Format**: Timestamp, level, name, message

**Section sources**
- [Backend config.yaml:1-66](file://Backend/config.yaml#L1-L66)

## Port Configuration

### Default Ports
- **Backend API**: Port 8000 (HTTP)
- **Frontend Development**: Port 5173 (HTTP)

### Changing Backend Port
To change the backend port, modify the configuration in `config.yaml`:

```yaml
api:
  host: 0.0.0.0
  port: 8000  # Change this value
```

Or override via command line:
```bash
python -m uvicorn src.api.main:app --reload --host 0.0.0.0 --port 8080
```

### Docker Port Mapping
For Docker deployments, update the port mapping in `docker-compose.yml`:

```yaml
ports:
  - "8000:8000"  # host:container
```

**Section sources**
- [Backend config.yaml:54-60](file://Backend/config.yaml#L54-L60)
- [docker-compose.yml:9-10](file://docker-compose.yml#L9-L10)

## System Health Checks

### Backend Health Endpoint
Verify the backend is running properly:

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "ok",
  "ollama_available": true
}
```

### Frontend Accessibility
Check if the frontend is accessible:
```bash
curl http://localhost:5173
```

### Model Loading Status
Monitor the backend logs for successful model initialization:
- DeBERTa pre-warm complete
- Retriever pre-warm complete
- FAISS index loaded successfully

**Section sources**
- [Backend src/api/main.py:206-217](file://Backend/src/api/main.py#L206-L217)

## Verification Steps

### 1. Backend Verification
```bash
# Check if backend is listening
netstat -an | grep 8000

# Test health endpoint
curl -s http://localhost:8000/health | grep "ok"

# Verify model loading
# Check backend logs for "pre-warm complete" messages
```

### 2. Frontend Verification
```bash
# Check if frontend is running
curl -s http://localhost:5173 | grep -i "react\|vite"
```

### 3. Full System Test
```bash
# Test the complete pipeline
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the treatment for hypertension?"}'
```

### 4. Database Verification
Check if the SQLite database is created:
```bash
ls -la Backend/data/logs.db
```

**Section sources**
- [Backend src/api/main.py:75-120](file://Backend/src/api/main.py#L75-L120)

## Troubleshooting Guide

### Common Installation Issues

#### Python Dependencies Fail to Install
**Problem**: Some packages fail to install on Python 3.13+
**Solution**: 
```bash
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
```

#### Missing Conda Packages
**Problem**: scispacy installation fails
**Solution**:
```bash
conda install -c conda-forge scispacy
conda install -c conda-forge en_core_sci_lg
```

#### Port Already in Use
**Problem**: Port 8000 is busy
**Solution**:
```bash
# Change to a different port
python -m uvicorn src.api.main:app --reload --host 0.0.0.0 --port 8080
```

#### Memory Issues
**Problem**: Out of memory during model loading
**Solution**: Reduce batch sizes in config.yaml:
```yaml
modules:
  faithfulness:
    deberta_batch_size: 2
  contradiction:
    deberta_batch_size: 2
```

#### CORS Issues
**Problem**: Frontend cannot connect to backend
**Solution**: Check CORS configuration in main.py allows all origins for development.

### Environment Variables

#### Required for LLM Providers
```bash
# For OpenAI
export OPENAI_API_KEY="your-api-key"

# For Gemini
export GEMINI_API_KEY="your-api-key"

# For Mistral
export MISTRAL_API_KEY="your-api-key"
```

#### Optional Configuration
```bash
# Ollama host (if using local Ollama)
export OLLAMA_HOST="http://localhost:11434"
```

**Section sources**
- [Backend requirements.txt:4-8](file://Backend/requirements.txt#L4-L8)
- [Backend config.yaml:44-52](file://Backend/config.yaml#L44-L52)
- [DEPLOYMENT_GUIDE.md:370-413](file://DEPLOYMENT_GUIDE.md#L370-L413)

## Additional Resources

### Official Documentation
- [MediRAG 3.0 Main README](README.md)
- [Backend Technical Documentation](Backend/README.md)
- [Frontend Development Guide](Frontend/README.md)

### Deployment Guides
- [Docker Compose Configuration](docker-compose.yml)
- [Production Deployment Guide](DEPLOYMENT_GUIDE.md)

### API Reference
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://reactjs.org/)

### Community Support
- GitHub Issues: Report bugs and request features
- Pull Requests: Contribute improvements
- Discussion Forums: Get help from the community

### Related Tools
- [Vite Development Server](https://vitejs.dev/)
- [Uvicorn ASGI Server](https://www.uvicorn.org/)
- [LangChain Documentation](https://python.langchain.com/)