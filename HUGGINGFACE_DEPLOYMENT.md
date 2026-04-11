# 🚀 MediRAG Backend - Hugging Face Spaces Deployment Guide

## Overview

Deploy your MediRAG backend to Hugging Face Spaces using **Docker** for complete environment control.

---

## 📋 Prerequisites

1. **Hugging Face Account**: Sign up at https://huggingface.co/join
2. **Git**: Installed on your system
3. **Git LFS**: For large model files (optional)

---

## 🚀 Deployment Steps (Docker SDK)

### Step 1: Create Hugging Face Space with Docker

1. **Go to Hugging Face**: https://huggingface.co/spaces
2. **Click "Create new Space"**
3. **Configure:**
   - **Space name**: `medirag-backend` (or your preferred name)
   - **SDK**: Select **Docker** ⚠️ (NOT Gradio!)
   - **Space hardware**: CPU (free tier) or GPU (if available)
   - **Visibility**: Public or Private
4. **Click "Create Space"**

---

### Step 2: Prepare Your Repository

The Backend folder is already configured for Docker deployment.

**Files created/modified:**
- ✅ `Dockerfile` - Docker image definition
- ✅ `app.py` - Hugging Face entry point with Gradio UI
- ✅ `requirements_hf.txt` - Optimized dependencies
- ✅ `README.md` - Space documentation
- ✅ `.gitattributes` - Git LFS configuration

---

### Step 3: Upload Your Code

#### Option A: Using Git (Recommended)

```bash
# Navigate to your Backend folder
cd "e:\MediRag 2.0\Backend"

# Initialize git (if not already)
git init

# Add Hugging Face remote (replace with your username and space name)
git remote add hf https://huggingface.co/spaces/YOUR_USERNAME/medirag-backend

# Add all files
git add .

# Commit
git commit -m "Initial MediRAG backend deployment with Docker"

# Push to Hugging Face
git push hf main
```

#### Option B: Using Hugging Face CLI

```bash
# Install Hugging Face CLI
pip install huggingface-hub

# Login
huggingface-cli login

# Upload folder
huggingface-cli upload YOUR_USERNAME/medirag-backend . .
```

#### Option C: Drag & Drop (Easiest)

1. Go to your Space: `https://huggingface.co/spaces/YOUR_USERNAME/medirag-backend`
2. Click **"Files"** tab
3. Click **"Upload files"**
4. Drag and drop all files from `Backend/` folder

**Important**: Make sure `Dockerfile` is in the root of the uploaded files.

---

### Step 4: Configure Environment Variables

1. Go to your Space settings
2. Click **"Repository secrets"**
3. Add these secrets:

```
MISTRAL_API_KEY=your_mistral_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
```

**Get API Keys:**
- **Mistral**: https://console.mistral.ai/
- **Google (Gemini)**: https://makersuite.google.com/app/apikey

---

### Step 5: Handle Large Files (FAISS Index)

Your FAISS index and models are large. You have options:

#### Option A: Include in Repository (Git LFS)

```bash
# Track large files with Git LFS
git lfs track "data/index/*.index"
git lfs track "data/index/*.pkl"

# Add and commit
git add .gitattributes
git add data/index/
git commit -m "Add FAISS index with LFS"
git push hf main
```

⚠️ **Note**: Hugging Face has a 50GB storage limit for free tier.

#### Option B: Download at Runtime (Recommended)

Modify `app.py` to download models on first run:

```python
# Add to app.py
import os
from huggingface_hub import hf_hub_download

def download_index():
    """Download FAISS index from Hugging Face Dataset"""
    os.makedirs("data/index", exist_ok=True)
    
    # Download from your dataset
    hf_hub_download(
        repo_id="YOUR_USERNAME/medirag-index",
        filename="faiss.index",
        local_dir="data/index"
    )
    hf_hub_download(
        repo_id="YOUR_USERNAME/medirag-index",
        filename="metadata_store.pkl",
        local_dir="data/index"
    )

# Call at startup
download_index()
```

#### Option C: Use Hugging Face Inference API

For the embedding model, use HF Inference API instead of local:

```python
from huggingface_hub import InferenceClient

client = InferenceClient(token=os.getenv("HF_TOKEN"))
embeddings = client.feature_extraction(
    text,
    model="dmis-lab/biobert-v1.1"
)
```

---

### Step 6: Monitor Deployment

1. Go to your Space: `https://huggingface.co/spaces/YOUR_USERNAME/medirag-backend`
2. Click **"Files & versions"** to see uploaded files
3. Click **"App"** to see the running application
4. Check **"Logs"** tab for any errors

---

## 🔧 Configuration for Hugging Face

### Update Config for HF Environment

Create `config_hf.yaml`:

```yaml
retrieval:
  top_k: 5
  chunk_size: 512
  chunk_overlap: 50
  embedding_model: dmis-lab/biobert-v1.1
  index_path: data/index/faiss.index
  metadata_path: data/index/metadata_store.pkl

modules:
  faithfulness:
    nli_model: cross-encoder/nli-deberta-v3-base
    entailment_threshold: 0.75
    max_nli_tokens: 510
    truncate_side: left
    deberta_batch_size: 2  # Reduced for HF CPU
  entity_verifier:
    spacy_model: en_core_sci_lg
    critical_entity_types: [DRUG, DOSAGE]
    dosage_tolerance_pct: 10
    rxnorm_api_url: https://rxnav.nlm.nih.gov/REST/approximateTerm.json
    rxnorm_api_timeout_s: 3
    rxnorm_cache_path: data/rxnorm_cache.csv
  source_credibility:
    method: keyword
    tier_weights: [1.0, 0.85, 0.65, 0.40, 0.20]
  contradiction:
    nli_model: cross-encoder/nli-deberta-v3-base
    confidence_threshold: 0.75
    max_sentence_pairs: 20  # Reduced for HF
    deberta_batch_size: 2

aggregator:
  weights:
    faithfulness: 0.40
    entity_accuracy: 0.25
    source_credibility: 0.20
    contradiction_risk: 0.15
  risk_bands:
    low: [0, 30]
    moderate: [31, 60]
    high: [61, 85]
    critical: [86, 100]

llm:
  provider: google  # Use Gemini on HF (Mistral may timeout)
  mistral_api_key: ${MISTRAL_API_KEY}
  google_api_key: ${GOOGLE_API_KEY}
  model: gemini-1.5-flash
  timeout_seconds: 60
  judge_temperature: 0.0
  generation_temperature: 0.7

api:
  host: 0.0.0.0
  port: 7860
  max_query_length: 500
  max_answer_length: 2000
  max_chunks: 10
  max_chunk_length: 2000

logging:
  level: INFO
  file: logs/medirag.log
  format: "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
```

---

## 🌐 Accessing Your Deployed API

### Gradio Interface

Your Space provides a web UI at:
```
https://huggingface.co/spaces/YOUR_USERNAME/medirag-backend
```

### Direct API Access

Hugging Face Spaces expose APIs via Gradio's API mode:

```python
from gradio_client import Client

client = Client("YOUR_USERNAME/medirag-backend")
result = client.predict(
    question="What are the side effects of metformin?",
    top_k=5,
    api_name="/query_medical"
)
print(result)
```

### Using with Frontend

Update your frontend `.env.production`:

```bash
# For Hugging Face Spaces
VITE_API_URL=https://YOUR_USERNAME-medirag-backend.hf.space/api
```

---

## ⚡ Optimizations for Hugging Face

### 1. Reduce Model Loading Time

Add model caching in `app.py`:

```python
import functools

@functools.lru_cache(maxsize=1)
def get_cached_retriever():
    return Retriever(config)
```

### 2. Use Smaller Models (Optional)

For faster inference on CPU:

```yaml
# In config_hf.yaml
retrieval:
  embedding_model: sentence-transformers/all-MiniLM-L6-v2  # Smaller, faster

modules:
  faithfulness:
    nli_model: cross-encoder/nli-deberta-v3-xsmall  # Smaller variant
```

### 3. Enable Persistent Storage

Hugging Face Spaces have ephemeral storage. For persistent data:

```python
# Use Hugging Face Hub to save/load data
from huggingface_hub import HfApi

api = HfApi()
# Upload logs/results to your dataset repo
```

---

## 🐛 Troubleshooting

### Issue: Build Timeout

**Solution**: Reduce dependencies or use pre-built Docker image

```dockerfile
# Create Dockerfile
FROM huggingface/spaces-cpu:latest

COPY requirements_hf.txt .
RUN pip install -r requirements_hf.txt

COPY . .
CMD ["python", "app.py"]
```

### Issue: Out of Memory

**Solution**: Reduce batch sizes and model sizes

```yaml
modules:
  faithfulness:
    deberta_batch_size: 1
  contradiction:
    deberta_batch_size: 1
    max_sentence_pairs: 10
```

### Issue: Model Download Fails

**Solution**: Use Hugging Face cache

```python
import os
os.environ["TRANSFORMERS_CACHE"] = "/tmp/transformers_cache"
os.environ["HF_HOME"] = "/tmp/hf_home"
```

### Issue: CORS Errors from Frontend

**Solution**: Update CORS in `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend.vercel.app",
        "https://huggingface.co",
        "*"  # For development only
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📊 Monitoring

### View Logs

1. Go to your Space
2. Click **"Logs"** tab
3. View real-time logs

### Check Usage

```python
# Add to your app
from huggingface_hub import space_info

info = space_info("YOUR_USERNAME/medirag-backend")
print(f"Runtime: {info.runtime}")
print(f"Storage: {info.storage}")
```

---

## 🔒 Security Best Practices

1. **Never commit API keys** - Use Repository Secrets
2. **Rate limiting** - Add to your FastAPI app
3. **Input validation** - Already in place via Pydantic
4. **CORS restrictions** - Limit to your frontend domain

---

## 🎯 Next Steps

After deployment:

1. ✅ Test the Gradio interface
2. ✅ Connect your frontend to the HF Space URL
3. ✅ Set up monitoring
4. ✅ Configure auto-restart on failure
5. ✅ Consider upgrading to GPU for faster inference

---

## 📞 Support

- Hugging Face Docs: https://huggingface.co/docs/hub/spaces
- Gradio Docs: https://gradio.app/docs
- MediRAG Issues: Check your GitHub repository

---

## 🎉 Success!

Your MediRAG backend is now deployed on Hugging Face Spaces!

**URL**: `https://huggingface.co/spaces/YOUR_USERNAME/medirag-backend`
