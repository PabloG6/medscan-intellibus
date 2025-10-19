import os, io, base64, random
from pathlib import Path
from tqdm import tqdm
from datasets import load_dataset
from PIL import Image

OUT = Path("samples"); OUT.mkdir(exist_ok=True)

ds = load_dataset("ykumards/open-i", split="train", streaming=True)

def maybe_save(uid, key, val, idx):
    try:
        if isinstance(val, (bytes, bytearray)):
            data = bytes(val)
        elif isinstance(val, str) and val.startswith("/9j/"):  # base64-encoded JPEG
            data = base64.b64decode(val)
        else:
            return False

        img = Image.open(io.BytesIO(data)).convert("L")  # most are grayscale
        outpath = OUT / f"{uid}_{key}_{idx}.jpg"
        img.save(outpath, "JPEG", quality=92)
        return True
    except Exception:
        return False

saved = 0
for i, row in enumerate(tqdm(ds, desc="Streaming Open-i rows")):
    uid = row.get("uid", f"row{i}")
    hits = 0

    for k, v in row.items():
        if saved >= 10: break
        if maybe_save(uid, k, v, hits):
            saved += 1
            hits += 1
    if saved >= 10:
        break

print(f"Saved {saved} images to {OUT.resolve()}")
