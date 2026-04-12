# MediRAG Backend - Hugging Face Spaces Docker Deployment
# Optimized for faster builds
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies (libmupdf deps bundled in pymupdf wheel, no extra needed)
RUN apt-get update && apt-get install -y \
    git \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV TRANSFORMERS_CACHE=/tmp/transformers_cache
ENV HF_HOME=/tmp/hf_home
ENV TORCH_HOME=/tmp/torch_cache
ENV PIP_NO_CACHE_DIR=1
ENV PIP_DISABLE_PIP_VERSION_CHECK=1

# Copy requirements first for better caching
COPY requirements_minimal.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements_minimal.txt

# Copy the rest of the application
COPY . .

# Create necessary directories
RUN mkdir -p data/processed data/raw logs

# Expose port (Hugging Face Spaces uses 7860)
EXPOSE 7860

# Run FastAPI backend directly
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]

