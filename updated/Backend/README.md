---
title: MediRAG API
emoji: 🏥
colorFrom: blue
colorTo: green
sdk: docker
pinned: false
---

# MediRAG Backend - Hugging Face Spaces (Docker)

🏥 **Medical RAG System with Hallucination Detection**

This is the **backend API** for MediRAG 2.0, designed to work with a **React frontend**.

## 🐳 Docker Deployment

This Space provides the backend API. The React frontend connects to this backend.

### Backend Features
- 🔍 **Hybrid Retrieval**: FAISS (BioBERT) + BM25 keyword search
- 🧠 **LLM Generation**: Mistral/Gemini for medical answer generation
- 🛡️ **4-Layer Audit**: Faithfulness, Entity Verification, Source Credibility, Contradiction Detection
- ⚠️ **Safety Interventions**: Auto-blocks high-risk responses
- 📊 **Health Risk Score (HRS)**: 0-100 composite safety metric
- 🔌 **REST API**: Full FastAPI endpoints for React frontend

## 🚀 Usage

### For React Frontend
Connect your React app to this backend:
```javascript
const API_URL = "https://joytheslothh-medirag-api.hf.space";
```

### API Endpoints
- `GET /health` - Health check
- `POST /query` - Full RAG pipeline
- `POST /evaluate` - Evaluate answer
- `GET /docs` - Swagger API documentation

### Environment Variables
Set in Hugging Face Space settings:
- `MISTRAL_API_KEY` - For Mistral LLM
- `GOOGLE_API_KEY` - For Gemini LLM

## 🏗️ Architecture
```
React Frontend → FastAPI Backend → RAG Pipeline → Response
```

## ⚠️ Disclaimer
**This system is for research purposes only. Always consult qualified medical professionals for health decisions.**

## 📄 License
MIT License - See repository for details.
