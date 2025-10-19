from __future__ import annotations

import base64
import io
from pathlib import Path
from typing import Any

from datasets import load_dataset
from PIL import Image
from tqdm import tqdm


def _maybe_decode_image(value: Any) -> bytes | None:
    if isinstance(value, (bytes, bytearray)):
        return bytes(value)
    if isinstance(value, str) and value.startswith("/9j/"):
        try:
            return base64.b64decode(value)
        except Exception:
            return None
    return None


def _save_image(data: bytes, destination: Path) -> bool:
    try:
        image = Image.open(io.BytesIO(data)).convert("L")
        destination.parent.mkdir(parents=True, exist_ok=True)
        image.save(destination, "JPEG", quality=92)
        return True
    except Exception:
        return False


def download_samples(limit: int = 10, out_dir: Path | str = Path("samples")) -> int:
    out_dir = Path(out_dir)
    dataset = load_dataset("ykumards/open-i", split="train", streaming=True)

    saved = 0
    for idx, row in enumerate(tqdm(dataset, desc="Streaming Open-i rows")):
        uid = row.get("uid", f"row{idx}")
        hits = 0
        for key, value in row.items():
            if saved >= limit:
                break
            data = _maybe_decode_image(value)
            if not data:
                continue
            destination = out_dir / f"{uid}_{key}_{hits}.jpg"
            if _save_image(data, destination):
                saved += 1
                hits += 1
        if saved >= limit:
            break
    return saved


def main(limit: int = 10, out_dir: Path | str = Path("samples")) -> int:
    return download_samples(limit=limit, out_dir=out_dir)


def download_cli(limit: int, out_dir: Path | str) -> None:
    total = download_samples(limit=limit, out_dir=out_dir)
    print(f"Saved {total} images to {Path(out_dir).resolve()}")
