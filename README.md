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

- **💬 MediChat AI**: A standalone, immersive chat interface with real-time **Hallucination Risk Scoring (HRS)**, rich source cards, and doc-aware reasoning.
- **📄 Document-Aware Chat**: Upload PDFs/Lab Reports to get **Smart Suggestions** (clinical follow-up questions) and answers grounded directly in your patient docs + the medical literature.
- **🔬 Researcher Lab (A/B Testing)**: A high-fidelity module for comparing clinical personas and system instructions side-by-side with real-time RAGAS/HRS scores.
- **🚦 Traffic Control Visualization**: A real-time developer simulation showing the medical safety pipeline as it sanitizes, authorizes, or blocks API requests.
- **🛡️ AI Governance Dashboard**: A complete audit log and compliance reporting system for medical AI oversight.
- **🧭 MediRAG Project Guide**: A Groq-powered interactive chatbot providing on-demand technical documentation and platform walkthroughs.

---

## 🧠 The 4-Layer Audit Engine

Every answer passes through our forensic pipeline (running locally on CPU/GPU):

1.  **Faithfulness Scorer (DeBERTa-v3 NLI)**: Checks if the LLM's claim is actually supported by the retrieved context. No support = Red Flag. 🚩
2.  **Mistral 2-Pass Verification**: A dual-call system that first generates an answer from the document, then triggers an independent "Authority" pass to cross-examine the answer for hallucinations.
3.  **Medical Entity Verifier (SciSpaCy + DrugBank)**: Extracts drug names, dosages, and conditions. Mismatching 500mg with 500g? We flag it. 💊
4.  **Source Credibility Ranking (Hybrid)**: Tiers your evidence (Tier 1: Systematic Reviews → Tier 5: Reviews) while showing an animated **Relevance Bar (0-100%)** based on FAISS/BM25 scores.
5.  **Contradiction Detection**: Does the AI contradict itself in its own answer? Our internal NLI cross-check finds out. ⚠️

---

## 🔬 Latest Architectural Updates (v3.1)

- **Vector Expansion**: Our retriever is now powered by **107,425 clinical vectors** sourced from PubMed and MedQA, ensuring high-density specialized knowledge.
- **Hybrid Search Strategy**: Combining **FAISS (Semantic BioBERT)** and **BM25 (Keyword-based)** to provide both conceptual and exact-match retrieval.
- **Smart Follow-ups**: The system statically analyzes uploaded clinical text to suggest highly relevant questions (e.g., "Are there any contraindications listed here?").
- **Rich Citation Cards**: Each source now displays its evidence tier, publication year, journal name, and a text excerpt with an animated similarity score.

---

## 🚀 v3.2 Safety & Research Evolution (Latest)

- **Side-by-Side Prompt Engineering**: Clinical researchers can now test multiple "Personas" (Control vs. Variant) against the same query to find the safest system instructions.
- **The "Traffic Control" Simulator**: A developer-centric glassmorphic terminal summarizing the real-time middleware flow of sanitization, authorization, and clinical blocking.
- **Backend AI Proxy**: Implemented a secure server-side relay for third-party AI requests (Groq/Gemini) to bypass browser CORS restrictions and enhance key security.
- **Mobile-Adaptive Experience**: Full-width prompt engineering workspaces and a persistent top-right theme toggle for researchers on the go.

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
- **NLP Models**: DeBERTa-v3 (grounding), SciSpaCy (biomedical NER), BioBERT (embeddings), Mistral-Large-Latest (Generation & Verification) 🤖
- **Vector DB**: FAISS indexed with **107,425 clinical entries** 🗃️
- **Retrieval**: Hybrid BioBERT + BM25 ranking 🧱

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
