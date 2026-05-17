# 🛡️ MediRAG-Eval 3.2

### *Because blind trust in medical AI is just a fancy way to commit malpractice.* 💊

[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/)
[![HuggingFace](https://img.shields.io/badge/🤗_HuggingFace-FFD21E?style=for-the-badge)](https://huggingface.co/)
[![Python](https://img.shields.io/badge/Python_3.10+-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

---

## 🧐 The Problem

LLMs are notoriously overconfident. In healthcare, hallucinations aren't "creative outputs" — they're safety hazards that can lead to misdiagnosis, dangerous drug interactions, and legal exposure.

**MediRAG-Eval** is the forensic audit layer that sits between your RAG pipeline and the clinician. We automatically extract, score, and verify every medical claim against trusted literature before anything reaches a patient.

---

## ✨ What's Inside — Feature Map

| Page | Description |
|---|---|
| 🏠 **Home** | Mission overview, feature cards, live stats, and animated clinical domain showcase |
| 💬 **MediChat (Chat Now)** | Immersive AI clinical chat with real-time Hallucination Risk Scoring, source citation cards, doc-aware reasoning, and PDF/Lab upload |
| 🔬 **Evaluate (Research Lab)** | Side-by-side A/B clinical persona testing with live RAGAS + HRS scoring |
| 🚦 **MediAPI Agent (Console)** | Real-time developer simulator showing the full safety middleware pipeline flow |
| 🛡️ **Safety Agent** | Interactive demo of the 5-phase autonomous safety pipeline with live module visualization |
| 📘 **API Docs** | Complete developer API reference for all MediRAG endpoints |
| 🔗 **Integration** | Third-party integration guide: REST, Python SDK, and webhook setup |
| 👤 **Patient Experience** | Patient-facing view of how safety-verified answers are delivered |
| ⚙️ **Governance** | Full audit log, compliance reporting, and AI oversight dashboard |
| ℹ️ **About** | Team, architecture deep-dive, national impact, and technology philosophy |

---

## 🧠 The 5-Phase Safety Pipeline

Every clinical answer passes through our autonomous forensic pipeline (runs locally, zero paid APIs):

```
User Query
    │
    ▼
Phase 1 ──► 🔒 PHI Privacy Shield
            Auto PII/PHI redaction before external processing
    │
    ▼
Phase 2 ──► ⚖️ Consensus Judge
            Cross-references multiple AI models against retrieved clinical dataset
    │
    ▼
Phase 3 ──► 📊 Evidence Grounding
            Scientific verification — every claim must cite a source text chunk
    │
    ▼
Phase 4 ──► 🔍 Entity Validation
            Drug names, dosages, and clinical entities checked against dataset + guidelines
    │
    ▼
Phase 5 ──► 📄 Dataset Credibility Ranking
            Tiers source reliability: RCT → Guidelines → Case Studies
    │
    ▼
Clinical-Grade Verified Response ✅
```

**Pipeline completes in < 30 seconds on CPU. All models on HuggingFace. Zero vendor lock-in.**

---

## 🔬 The 4-Layer Audit Engine (Under the Hood)

1. **Faithfulness Scorer (DeBERTa-v3 NLI)** — Checks if the LLM claim is supported by retrieved context. No support = 🚩 Red Flag.
2. **Mistral 2-Pass Verification** — Dual-call system: Answer generation → Independent "Authority" cross-examination pass.
3. **Medical Entity Verifier (SciSpaCy + DrugBank)** — Extracts drug names, dosages, and conditions, flags mismatches.
4. **Contradiction Detector** — Internal NLI cross-check to catch self-contradictions within a single AI response. ⚠️

---

## 📱 Mobile-First Responsive UI (v3.2)

All pages have been fully optimized for mobile viewports:

- **Compact Navigation** — Hamburger sidebar, auto-hiding header, bottom-safe layouts
- **Phone Wallpapers** — Dedicated mobile background images (`/chatnowphone.png`) with `background-attachment: scroll` to prevent iOS/Android stretch bugs
- **Stacked Grids** — All multi-column card layouts (team, impact, problem cards, stats) collapse to clean single-column on `< 768px`
- **Compact Input Bar** — Scaled send button (36×36px), dense padding, and compact attachment chip for virtual keyboard clearance
- **Pipeline Visualizations** — Left-aligned vertical flow on mobile with downsized phase indicators

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/JoyTheSloth/MediRAG-.git
cd MediRAG-
```

### 2. Start the Backend (Python 3.10+)
```bash
cd Backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# Mac/Linux
source .venv/bin/activate

pip install -r requirements.txt
python -m uvicorn src.api.main:app --reload --port 8000
```

### 3. Start the Frontend (Node.js 18+)
```bash
cd ../Frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

### 4. Optional: Full Stack via Docker
```bash
docker-compose up --build
```

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite | Component framework and dev server |
| GSAP (Motion) | High-performance clinical animations |
| Vanilla CSS + Glassmorphism | Custom design system, no CSS framework dependency |
| React Router v6 | Client-side SPA navigation |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | High-performance Python API server |
| LangChain | RAG orchestration and chain management |
| FAISS | 107,425-vector semantic search index |
| BM25 | Keyword-based retrieval for hybrid search |
| Uvicorn | ASGI production server |

### AI / NLP Models
| Model | Purpose |
|---|---|
| BioBERT | Clinical embedding generation |
| DeBERTa-v3-large | NLI faithfulness scoring |
| SciSpaCy (en_core_sci_lg) | Biomedical named entity recognition |
| Mistral-Large-Latest | Answer generation and 2-pass verification |
| Groq (llama3-8b-8192) | MediRAG Project Guide assistant |

---

## 📂 Project Structure

```
MediRAG-/
├── Frontend/                    # React 19 SPA (Vite)
│   └── src/
│       ├── pages/               # All route-level page components
│       │   ├── Home.jsx         # Landing page
│       │   ├── MediChat.jsx     # Clinical Chat interface
│       │   ├── Evaluate.jsx     # Research A/B testing lab
│       │   ├── MediApiAgent.jsx # API safety console
│       │   ├── PatientExperience.jsx
│       │   ├── Governance.jsx   # Audit + compliance dashboard
│       │   ├── ApiDocs.jsx      # Developer API documentation
│       │   ├── Console.jsx      # Traffic Control simulator
│       │   └── About.jsx        # Team + mission
│       ├── components/          # Shared components (Navbar, Modals, etc.)
│       └── index.css            # Global design system tokens
│
├── Backend/                     # FastAPI pipeline engine
│   └── src/
│       ├── api/                 # Route definitions
│       ├── pipeline/            # 5-phase safety pipeline modules
│       │   ├── privacy.py       # PHI redaction
│       │   ├── retriever.py     # Hybrid FAISS + BM25 retrieval
│       │   └── ...
│       └── models/              # Model loaders and wrappers
│
├── dev_tools/                   # Dataset + deployment automation scripts
├── launchers/                   # Quick-start batch/shell scripts
├── docker-compose.yml           # Full stack orchestration
└── vercel.json                  # Frontend deployment config
```

---

## 📊 Evaluation Benchmarks

The audit pipeline has been evaluated on:

- **PubMedQA** — Biomedical question answering from PubMed abstracts
- **MedQA-USMLE** — US Medical Licensing Examination style questions
- **BioASQ 2023** — Large-scale biomedical QA and information retrieval

---

## 🎯 National Impact Context

| Platform | Integration Potential |
|---|---|
| **eSanjeevani** | Audit AI advice for 13+ crore teleconsultation users |
| **ABDM** | Safety layer for Ayushman Bharat Digital Mission AI tools |
| **ICMR Research** | Faithfulness verification for clinical guideline-based QA |
| **Pharma AI** | Drug interaction and hallucination detection |
| **Consumer Health** | Safety auditing for Practo, Tata 1mg, Apollo 24/7 chatbots |
| **CDSCO Regulation** | Alignment with India's upcoming AI-in-healthcare SaMD framework |

---

## 🧪 100% Open Source. Zero Cost. Maximum Transparency.

- ❌ No OpenAI API required
- ✅ Runs on free Google Colab T4 GPU
- ✅ All models available on HuggingFace
- ✅ Local LLM support via Ollama
- ✅ Public benchmark datasets only

---

## 📜 License & Disclaimer

MIT License. Use it, build with it, contribute to it — just don't blame us if your LLM still thinks bleach is a valid cough medicine. 🧪

> This software is a research prototype built for educational and demonstration purposes. It is **not** a certified medical device and should **not** be used as the sole basis for any clinical decision.

---

## 👥 Team

**Built for India Innovates 2026 — Bharat Mandapam, New Delhi**
**B.Tech Computer Science & Engineering, 2026 — Amity University Kolkata**

| Name | Role |
|---|---|
| **Alapan Sen** | Team Lead · RAG pipeline architecture · faithfulness scoring · system integration |
| **Joydeep Das** | Evaluation · RAGAS integration · React SPA UI · FastAPI endpoint |

---

*Built with ❤️ and extreme amounts of caffeine by the MediRAG-Eval Team.*
