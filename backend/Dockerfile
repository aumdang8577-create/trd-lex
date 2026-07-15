# ===================================
# TRD-LEX Backend — Production Dockerfile
# Multi-stage build for FastAPI + Prisma
# ===================================

FROM python:3.12-slim AS base

WORKDIR /app

# Install system dependencies for Prisma
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates \
    libatomic1 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (Docker layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy Prisma schema and generate client
COPY prisma/ prisma/
RUN python -m prisma generate --schema=prisma/schema.prisma

# Copy application code
COPY app/ app/
COPY seed.py .

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1

# Run with Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
