# Vision Tooling

This package bundles the chest X-ray inference scripts and FastAPI service that
previously lived in the monorepo root.

## Quickstart

```bash
cd vision
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
```

### Run the API

```bash
uvicorn vision.api:app --reload --host 0.0.0.0 --port 8000
```

Send a JSON payload with base64 image bytes:

```bash
curl -X POST http://localhost:8000/predict/cxr \
  -H "Content-Type: application/json" \
  -d '{"image_base64": "<base64 string>"}'
```

Or upload a file:

```bash
curl -X POST http://localhost:8000/predict/cxr \
  -F "file=@path/to/image.dcm"
```

### Run the CLI

```bash
python -m vision.scripts.chest path/to/image.dcm
```

### Download Sample Images

```bash
python -m vision.scripts.download_samples --limit 10 --out samples
```

## Repository Notes

- All Python sources live under `vision/src/vision`.
- Entry points live in `vision/scripts`.
- Dependencies are managed through `vision/pyproject.toml`.
