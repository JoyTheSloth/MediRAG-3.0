# 🛡️ MediRAG-Eval 3.0

### *Because blind trust in medical AI is just a fancy way to commit malpractice.* 💊

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/)
[![HuggingFace](https://img.shields.io/badge/%F0%9F%A4%97%20HuggingFace-FFD21E?style=for-the-badge)](https://huggingface.co/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 🧐 "Wait, Is My AI Lying?"

Yes. LLMs are notoriously overconfident medical students who skipped the lecture on "not making stuff up." In healthcare, a "creative" hallucination isn't a feature; it's a safety hazard. 🛑

**MediRAG-Eval 3.0** is the forensic audit layer that sits between your sophisticated RAG pipeline and the patient. We automatically extract, score, and verify every medical claim against trusted literature (PubMed, PMC) so you can catch hallucinations before they reach a clinician.

---

## ⚡ The "MediRAG 3.0" Overhaul

We've consolidated everything into a single, high-fidelity command center:

- **💬 MediChat AI**: A standalone, immersive chat interface with real-time **Hallucination Risk Scoring (HRS)**, expandable source citations, and medical safety guards.
- **📤 App Integration Console**: Test and verify third-party healthcare integrations (like Apollo 247, Tata 1mg) by uploading patient docs and auditing AI responses.
- **🛡️ AI Governance Dashboard**: A complete audit log and compliance reporting system for medical AI oversight.
- **📄 Interactive API Documentation**: A live OpenAPI-powered developer portal for integrating the MediRAG scoring engine into any pipeline.

---

## 🧠 The 4-Layer Audit Engine

Every answer passes through our forensic pipeline (running locally on CPU/GPU):

1.  **Faithfulness Scorer (DeBERTa-v3 NLI)**: Checks if the LLM's claim is actually supported by the retrieved context. No support = Red Flag. 🚩
2.  **Medical Entity Verifier (SciSpaCy + DrugBank)**: Extracts drug names, dosages, and conditions. Mismatching 500mg with 500g? We flag it. 💊
3.  **Source Credibility Ranking**: Tiers your evidence (Tier 1: RCTs/Systematic Reviews → Tier 5: Grey Literature). 📚
4.  **Contradiction Detection**: Does the AI contradict itself in its own answer? Our internal NLI cross-check finds out. ⚠️

---

## 🚀 Quick Start (Stop guessing, start auditing)

### 1. Clone the Repository
```bash
git clone https://github.com/JoyTheSloth/MediRAG-3.0.git
cd MediRAG-3.0
```

### 2. Ignite the Backend (Python 3.10+)
```bash
cd Backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn src.api.main:app --reload --port 8000
```

### 3. Ignite the Frontend (Node.js)
```bash
cd ../Frontend
npm install
npm run dev
```

---

## 🛠️ The Stack

- **Frontend**: React 19 + GSAP (Motion) + Custom Glassmorphism CSS 🧊
- **Backend**: FastAPI + LangChain + FAISS + BM25 (Hybrid Retrieval) 🧱
- **NLP Models**: DeBERTa-v3 (grounding), SciSpaCy (biomedical NER), BioBERT (embeddings) 🤖
- **Vector DB**: FAISS (PubMed-indexed) 🗃️

---

## 🎯 The "Target-Lock" Cursor

We didn't just build a cursor; we built a **targeting computer**. 🎖️
- **Spinning Crosshairs**: Your idle state is a medical sensor.
- **Physical Snaps**: The cursor physically latches onto buttons and links to signal a "Ready for Audit" state.
- **Why?**: Because normal cursors are for shopping apps. This is a *Medical Command Center*.

---

## 📜 Disclaimer
MIT License. Use it, build it, just don't blame us if your LLM still thinks bleach is a valid cough medicine. 🧪 Built for **India Innovates 2026**.

---

*Built with ❤️ (and extreme amounts of caffeine) by the MediRAG-Eval Team.*
*Alapan Sen · Bikram Sardar · Joydeep Das*
*B.Tech CSE, 2026 — Amity University Kolkata* 🎓
