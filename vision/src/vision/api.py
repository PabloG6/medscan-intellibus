import base64
from typing import Optional

from fastapi import Body, FastAPI, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, validator

from .inference import MODEL_NAME, VisionError, predict_bytes

app = FastAPI(title="Vision Chest API")


class PredictionRequest(BaseModel):
    image_base64: str = Field(..., description="Base64-encoded image or DICOM bytes.")

    @validator("image_base64")
    def strip_data_url(cls, value: str) -> str:
        if "," in value and value.split(",", 1)[0].strip().lower().startswith("data:"):
            return value.split(",", 1)[1]
        return value.strip()


@app.post("/predict/cxr")
async def predict(
    file: Optional[UploadFile] = File(default=None),
    payload: Optional[PredictionRequest] = Body(default=None),
) -> JSONResponse:
    data: Optional[bytes] = None

    if file is not None:
        data = await file.read()
        if not data:
            raise HTTPException(status_code=400, detail="Empty upload.")

    elif payload is not None:
        try:
            data = base64.b64decode(payload.image_base64, validate=True)
        except Exception as exc:
            raise HTTPException(status_code=400, detail=f"Invalid base64 payload: {exc}") from exc

    if data is None:
        raise HTTPException(status_code=400, detail="Provide either a file upload or JSON payload.")

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
