from __future__ import annotations

import io
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from typing import Iterable, Sequence

import numpy as np
import pydicom
import skimage.io
import torch
import torchxrayvision as xrv
import torchvision
from torchxrayvision.datasets import XRayCenterCrop

MODEL_NAME = "densenet121-res224-chex"
_TRANSFORM = torchvision.transforms.Compose([XRayCenterCrop()])


class VisionError(RuntimeError):
    """Raised when an image cannot be processed."""


@dataclass(frozen=True)
class Prediction:
    label: str
    prob: float

    def dict(self) -> dict[str, float | str]:
        return {"label": self.label, "prob": float(self.prob)}


def _to_tensor(img: np.ndarray) -> torch.Tensor:
    img = xrv.datasets.normalize(img.astype("float32"), 255)
    img = img[None, :, :]
    img = _TRANSFORM(img)
    return torch.from_numpy(img).unsqueeze(0).float()


def _load_dicom(data: io.BufferedIOBase) -> np.ndarray:
    ds = pydicom.dcmread(data)
    img = ds.pixel_array.astype("float32")

    slope = float(getattr(ds, "RescaleSlope", 1.0))
    intercept = float(getattr(ds, "RescaleIntercept", 0.0))
    img = img * slope + intercept

    if getattr(ds, "PhotometricInterpretation", "").upper() == "MONOCHROME1":
        img = img.max() - img

    img -= img.min()
    maxv = img.max() if img.max() > 0 else 1.0
    return (img / maxv) * 255.0


def _load_image(data: io.BufferedIOBase) -> np.ndarray:
    img = skimage.io.imread(data).astype("float32")
    if img.ndim == 3:
        img = img[..., 0]
    return img


def load_any_xray(path: str | Path) -> torch.Tensor:
    path = Path(path)
    if not path.exists():
        raise FileNotFoundError(path)

    try:
        if path.suffix.lower() == ".dcm":
            with path.open("rb") as fh:
                img = _load_dicom(fh)
        else:
            with path.open("rb") as fh:
                img = _load_image(fh)
        return _to_tensor(img)
    except Exception as exc:  # pragma: no cover - defensive
        raise VisionError(f"Failed to load {path}: {exc}") from exc


def load_any_xray_bytes(data: bytes) -> torch.Tensor:
    buf = io.BytesIO(data)
    try:
        buf.seek(0)
        return _to_tensor(_load_dicom(buf))
    except Exception:
        buf.seek(0)
        try:
            return _to_tensor(_load_image(buf))
        except Exception as exc:  # pragma: no cover - defensive
            raise VisionError(f"Failed to load image bytes: {exc}") from exc


@lru_cache(maxsize=1)
def get_model(model_name: str = MODEL_NAME) -> torch.nn.Module:
    model = xrv.models.get_model(model_name)
    model.eval()
    return model


def resolve_labels(model: torch.nn.Module, probs_len: int) -> Sequence[str]:
    labels = getattr(model, "pathologies", None) or getattr(model, "targets", None)
    if not labels or any((label is None) or (str(label).strip() == "") for label in labels):
        return NIH14_LABELS if probs_len == len(NIH14_LABELS) else [f"output_{i}" for i in range(probs_len)]
    return labels


NIH14_LABELS = [
    "Atelectasis",
    "Consolidation",
    "Infiltration",
    "Pneumothorax",
    "Edema",
    "Emphysema",
    "Fibrosis",
    "Effusion",
    "Pneumonia",
    "Pleural Thickening",
    "Cardiomegaly",
    "Nodule",
    "Mass",
    "Hernia",
    "Lung Lesion",
    "Fracture",
    "Lung Opacity",
    "Enlarged Cardiomediastinum",
]


def _rank_predictions(labels: Iterable[str], probs: Sequence[float], top_n: int | None = None) -> list[Prediction]:
    ranked = sorted(
        (Prediction(label=str(label), prob=float(probs[idx])) for idx, label in enumerate(labels)),
        key=lambda pred: pred.prob,
        reverse=True,
    )
    return ranked[:top_n] if top_n is not None else ranked


def predict_tensor(tensor: torch.Tensor, model_name: str = MODEL_NAME, top_n: int | None = None) -> list[Prediction]:
    model = get_model(model_name)
    with torch.no_grad():
        logits = model(tensor)[0]
        probs = torch.sigmoid(logits).cpu().numpy().tolist()
    labels = resolve_labels(model, len(probs))
    return _rank_predictions(labels, probs, top_n=top_n)


def predict_file(path: str | Path, top_n: int | None = 5) -> list[Prediction]:
    tensor = load_any_xray(path)
    return predict_tensor(tensor, top_n=top_n)


def predict_bytes(data: bytes, top_n: int | None = 5) -> list[Prediction]:
    tensor = load_any_xray_bytes(data)
    return predict_tensor(tensor, top_n=top_n)


def format_ranked_predictions(
    predictions: Sequence[Prediction],
    pos_threshold: float = 0.70,
    borderline_low: float = 0.55,
    bar_width: int = 22,
) -> str:
    def bar(prob: float) -> str:
        n = int(prob * bar_width)
        return "#" * n + "-" * (bar_width - n)

    lines = []

    def append_section(title: str, preds: Iterable[Prediction]) -> None:
        lines.append(title)
        added = False
        for pred in preds:
            lines.append(f"- {pred.label:24s} {pred.prob:6.2%}  [{bar(pred.prob)}]")
            added = True
        if not added:
            lines.append("(none)")
        lines.append("")

    pos = [p for p in predictions if p.prob >= pos_threshold]
    borderline = [p for p in predictions if borderline_low <= p.prob < pos_threshold]
    remaining = [p for p in predictions if p.prob < borderline_low]

    append_section(f"=== Predicted positives (≥ {pos_threshold:.0%}) ===", pos)
    append_section(
        f"=== Borderline ({int(borderline_low*100)}–{int(pos_threshold*100)}%) ===",
        borderline,
    )
    append_section(f"=== Top other findings (< {int(borderline_low*100)}%) ===", remaining[:5])

    return "\n".join(lines).strip()
