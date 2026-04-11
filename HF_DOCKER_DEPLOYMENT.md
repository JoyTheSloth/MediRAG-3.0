# 🐳 MediRAG Backend - Hugging Face Docker Deployment (Quick Guide)

## ✅ Why Docker on Hugging Face?

- **Complete Control**: Full environment isolation
- **Dependency Management**: All packages pre-installed in image
- **Reproducibility**: Same environment every time
- **Custom Setup**: Install system packages, configure OS-level settings
- **Caching**: Docker layers cache for faster rebuilds

---

## 🚀 Quick Deploy (3 Steps)

### Step 1: Create Space
```
1. Go to https://huggingface.co/spaces
2. Click "Create new Space"
3. Name: medirag-backend
4. SDK: Select "Docker" ⚠️
5. Hardware: CPU (free) or GPU
6. Create Space
```

### Step 2: Upload Files
```bash
cd "e:\MediRag 2.0\Backend"

git init
git remote add hf https://huggingface.co/spaces/YOUR_USERNAME/medirag-backend
git add .
git commit -m "Docker deployment"
git push hf main
```

### Step 3: Add Secrets
```
1. Go to Space Settings
2. Click "Repository secrets"
3. Add:
   - MISTRAL_API_KEY=your_key
   - GOOGLE_API_KEY=your_key
```

---

## 📁 Files Structure

```
Backend/
├── Dockerfile              ← Docker image definition
├── app.py                  ← Gradio app entry point
├── requirements_hf.txt     ← Python dependencies
├── README.md               ← Space documentation
├── .gitattributes          ← Git LFS config
├── src/                    ← Source code
│   ├── api/
│   ├── pipeline/
│   ├── modules/
│   └── ...
├── config.yaml             ← Configuration
└── data/                   ← Data directory
    └── index/              ← FAISS index (optional)
```

---

## 🐳 Dockerfile Explained

```dockerfile
FROM python:3.10-slim          # Base image

WORKDIR /app                    # Working directory

# Install system dependencies
RUN apt-get update && apt-get install -y git curl build-essential

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV TRANSFORMERS_CACHE=/tmp/transformers_cache

# Copy and install Python dependencies
COPY requirements_hf.txt .
RUN pip install -r requirements_hf.txt

# Download spaCy model
RUN python -m spacy download en_core_sci_lg

# Copy application code
COPY . .

# Create directories
RUN mkdir -p data/index data/processed data/raw logs

# Expose port (HF uses 7860)
EXPOSE 7860

# Run the app
CMD ["python", "app.py"]
```

---

## 🔧 Local Testing with Docker

```bash
# Build image
docker build -t medirag-backend .

# Run locally
docker run -p 7860:7860 \
  -e PORT=7860 \
  -e GOOGLE_API_KEY=your_key \
  medirag-backend

# Access at http://localhost:7860
```

---

## 📊 Docker vs Gradio SDK

| Feature | Docker SDK | Gradio SDK |
|---------|-----------|------------|
| **Environment Control** | ✅ Full control | ⚠️ Limited |
| **System Packages** | ✅ Can install anything | ❌ No |
| **Build Time** | ⏱️ Longer (first time) | ⚡ Faster |
| **Image Size** | 📦 Larger | 📄 Smaller |
| **Customization** | ✅ Unlimited | ⚠️ Limited |
| **Caching** | ✅ Layer caching | ❌ No |
| **Debugging** | ✅ Full shell access | ⚠️ Limited |

---

## 🎯 When to Use Docker

**Use Docker when:**
- ✅ You need specific system packages
- ✅ You want full environment control
- ✅ You have complex dependencies
- ✅ You need to install spaCy models at build time
- ✅ You want reproducible builds

**Use Gradio SDK when:**
- ⚡ You want fastest deployment
- 📦 You have simple Python dependencies
- 🔄 You want automatic dependency management

---

## 🐛 Troubleshooting Docker on HF

### Issue: Build Timeout
```dockerfile
# Split into smaller layers
# Install heavy dependencies first
COPY requirements_hf.txt .
RUN pip install -r requirements_hf.txt

# Then copy code (changes often)
COPY . .
```

### Issue: Out of Memory
```dockerfile
# Use smaller base image
FROM python:3.10-alpine

# Or reduce workers in app.py
```

### Issue: Model Download Fails
```dockerfile
# Pre-download models in Dockerfile
RUN python -c "from transformers import AutoModel; AutoModel.from_pretrained('dmis-lab/biobert-v1.1')"
```

### Issue: Port Not Working
```python
# In app.py, use PORT env variable
port = int(os.environ.get("PORT", 7860))
demo.launch(server_name="0.0.0.0", server_port=port)
```

---

## 📈 Optimizing Docker Build

### 1. Multi-stage Build (Smaller Image)

```dockerfile
# Build stage
FROM python:3.10-slim as builder
WORKDIR /app
COPY requirements_hf.txt .
RUN pip install --user -r requirements_hf.txt

# Runtime stage
FROM python:3.10-slim
COPY --from=builder /root/.local /root/.local
COPY . .
ENV PATH=/root/.local/bin:$PATH
CMD ["python", "app.py"]
```

### 2. .dockerignore

```
__pycache__/
*.pyc
.git/
.gitignore
README.md
*.md
!README.md
```

### 3. Layer Caching

Order Dockerfile commands by change frequency:
1. System dependencies (rarely change)
2. Python requirements (sometimes change)
3. Application code (frequently changes)

---

## 🔗 Accessing Your Deployed API

### Gradio Interface
```
https://huggingface.co/spaces/YOUR_USERNAME/medirag-backend
```

### API Endpoint
```python
from gradio_client import Client

client = Client("YOUR_USERNAME/medirag-backend")
result = client.predict(
    question="What are side effects of metformin?",
    top_k=5,
    api_name="/query_medical"
)
```

### From Frontend
```javascript
// Update your frontend .env.production
VITE_API_URL=https://YOUR_USERNAME-medirag-backend.hf.space
```

---

## ✅ Deployment Checklist

- [ ] Created Space with **Docker** SDK
- [ ] Uploaded all files including `Dockerfile`
- [ ] Added API keys to Repository secrets
- [ ] Build successful (check Logs tab)
- [ ] Gradio interface loads
- [ ] Test query works
- [ ] Frontend can connect (CORS configured)

---

## 🎉 Success!

Your MediRAG backend is now running on Hugging Face Spaces with Docker!

**URL**: `https://huggingface.co/spaces/YOUR_USERNAME/medirag-backend`

---

## 📚 Additional Resources

- [Hugging Face Docker Spaces](https://huggingface.co/docs/hub/spaces-sdks-docker)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Gradio Docs](https://gradio.app/docs)
