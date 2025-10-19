FROM python:3.9 AS builder

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1
WORKDIR /app

RUN python -m venv .venv
COPY . .
RUN .venv/bin/pip install .

FROM python:3.9-slim
WORKDIR /app

# Install system dependencies for PyTorch, OpenCV, and torchxrayvision
RUN apt-get update && apt-get install -y \
    libgomp1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/.venv .venv/
COPY . .
CMD ["/app/.venv/bin/uvicorn", "vision.api:app", "--host", "0.0.0.0", "--port", "8000"]
