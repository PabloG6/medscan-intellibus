import base64
import asyncio
from typing import Optional

from fastapi import Body, FastAPI, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, validator

from .inference import MODEL_NAME, VisionError, predict_bytes, get_model

app = FastAPI(title="Vision Chest API")


# Background model loading
@app.on_event("startup")
async def load_model_on_startup():
    """Load the model in the background on startup to warm up the cache."""
    async def _load():
        try:
            print("🔄 Starting background model loading...")
            # Load model in a separate thread to not block startup
            await asyncio.to_thread(get_model, MODEL_NAME)
            print("✅ Model loaded successfully!")
        except Exception as e:
            print(f"⚠️  Model loading failed: {e}")
            # Don't crash the app - model will load on first request

    # Start loading in background
    asyncio.create_task(_load())


class PredictionRequest(BaseModel):
    image_base64: str = Field(..., description="Base64-encoded image or DICOM bytes.")

    @validator("image_base64")
    def strip_data_url(cls, value: str) -> str:
        if "," in value and value.split(",", 1)[0].strip().lower().startswith("data:"):
            return value.split(",", 1)[1]
        return value.strip()


@app.post("/predict/cxr")
async def predict(
    payload: PredictionRequest = Body(...),
) -> JSONResponse:
    try:
        data = base64.b64decode(payload.image_base64, validate=True)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Invalid base64 payload: {exc}") from exc

    try:
        predictions = predict_bytes(data, top_n=5)
    except VisionError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return JSONResponse(
        {
            "model": MODEL_NAME,
            "top5": [p.dict() for p in predictions],
        }
    )


@app.post("/predict/cxr/upload")
async def predict_upload(
    file: UploadFile = File(...),
) -> JSONResponse:
    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Empty upload.")

    try:
        predictions = predict_bytes(data, top_n=5)
    except VisionError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return JSONResponse(
        {
            "model": MODEL_NAME,
            "top5": [p.dict() for p in predictions],
        }
    )
