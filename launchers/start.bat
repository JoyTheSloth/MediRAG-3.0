@echo off
echo Starting MediRAG 2.0 Backend...
cd Backend
start cmd /k ".\venv\Scripts\python -m uvicorn src.api.main:app --reload --host 0.0.0.0 --port 8000"

echo Starting MediRAG 2.0 Frontend...
cd ../Frontend
start cmd /k "npm run dev"

echo Both services started!
