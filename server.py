from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import io, numpy as np, torch, torchvision, skimage.io, pydicom
import torchxrayvision as xrv
from torchxrayvision.datasets import XRayCenterCrop
from torchxrayvision.datasets import XRayResizer


app = FastAPI(title="Chest API")
MODEL_NAME = "densenet121-res224-chex"
model = xrv.models.get_model(MODEL_NAME).eval()
transform = torchvision.transforms.Compose([XRayCenterCrop()])

NIH14_LABELS = [
    "Atelectasis","Consolidation","Infiltration","Pneumothorax","Edema",
    "Emphysema","Fibrosis","Effusion","Pneumonia","Pleural Thickening",
    "Cardiomegaly","Nodule","Mass","Hernia","Lung Lesion","Fracture",
    "Lung Opacity","Enlarged Cardiomediastinum",
]

def resolve_labels(m, probs_len):
    labels = getattr(m, "pathologies", None) or getattr(m, "targets", None)
    if not labels or any((l is None) or (str(l).strip() == "") for l in labels):
        labels = NIH14_LABELS if probs_len == 18 else [f"output_{i}" for i in range(probs_len)]
    return labels

def _to_tensor(img: np.ndarray) -> torch.Tensor:
    img = xrv.datasets.normalize(img.astype("float32"), 255)
    img = img[None, :, :]
    img = transform(img)
    return torch.from_numpy(img).unsqueeze(0).float()

def _read_any_xray_bytes(b: bytes) -> torch.Tensor:
    try:
        ds = pydicom.dcmread(io.BytesIO(b))
        img = ds.pixel_array.astype("float32")
        slope = float(getattr(ds, "RescaleSlope", 1.0))
        intercept = float(getattr(ds, "RescaleIntercept", 0.0))
        img = img * slope + intercept
        if getattr(ds, "PhotometricInterpretation", "").upper() == "MONOCHROME1":
            img = img.max() - img
        img -= img.min()
        maxv = img.max() if img.max() > 0 else 1.0
        img = (img / maxv) * 255.0
        return _to_tensor(img)
    except Exception:
        img = skimage.io.imread(io.BytesIO(b)).astype("float32")
        if img.ndim == 3:
            img = img[..., 0]
        return _to_tensor(img)

@app.post("/predict/cxr")
async def predict(file: UploadFile = File(...)):
    data = await file.read()
    x = _read_any_xray_bytes(data)
    with torch.no_grad():
        logits = model(x)[0]
        probs = torch.sigmoid(logits).cpu().numpy().tolist()

    labels = resolve_labels(model, len(probs))
    ranked = sorted(
        [{"label": lab, "prob": float(p)} for lab, p in zip(labels, probs)],
        key=lambda d: d["prob"],
        reverse=True,
    )
    top5 = ranked[:5]
    return JSONResponse({"model": MODEL_NAME, "top5": top5})