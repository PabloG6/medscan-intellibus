import sys, io, numpy as np, torch, torchvision
import skimage.io
import torchxrayvision as xrv
import pydicom

MODEL_NAME = "densenet121-res224-chex"

def load_any_xray(path: str) -> torch.Tensor:
    try:
        if path.lower().endswith(".dcm"):
            ds = pydicom.dcmread(path)
            img = ds.pixel_array.astype("float32")

            slope = float(getattr(ds, "RescaleSlope", 1.0))
            intercept = float(getattr(ds, "RescaleIntercept", 0.0))
            img = img * slope + intercept

            if getattr(ds, "PhotometricInterpretation", "").upper() == "MONOCHROME1":
                img = img.max() - img

            img -= img.min()
            maxv = img.max() if img.max() > 0 else 1.0
            img = (img / maxv) * 255.0
        else:
            img = skimage.io.imread(path).astype("float32")
            if img.ndim == 3:
                img = img[..., 0]  

        img = xrv.datasets.normalize(img, 255)  
        img = img[None, :, :]                    

        transform = torchvision.transforms.Compose([xrv.datasets.XRayCenterCrop()])
        img = transform(img)                   

        return torch.from_numpy(img).unsqueeze(0).float() 
    except Exception as e:
        raise RuntimeError(f"Failed to load {path}: {e}")

def main(path):
    model = xrv.models.get_model(MODEL_NAME).eval()
    x = load_any_xray(path)

    with torch.no_grad():
        logits = model(x)[0]                 
        probs = torch.sigmoid(logits).cpu().numpy().tolist()

    labels = getattr(model, "pathologies", None) or getattr(model, "targets", None)

    pairs = sorted(zip(labels, probs), key=lambda kv: kv[1], reverse=True)

    POS = 0.70       
    BORDER_LOW = 0.55 
    BAR_W = 22

    def bar(p):
        n = int(p * BAR_W)
        return "#"*n + "-"*(BAR_W-n)

    print("\n=== Predicted positives (≥ {:.0%}) ===".format(POS))
    any_pos = False
    for lab, p in pairs:
        if p >= POS:
            any_pos = True
            print(f"- {lab:24s} {p:6.2%}  [{bar(p)}]")
    if not any_pos:
        print("(none)")

    print("\n=== Borderline ({}–{}%) ===".format(int(BORDER_LOW*100), int(POS*100)))
    any_border = False
    for lab, p in pairs:
        if BORDER_LOW <= p < POS:
            any_border = True
            print(f"- {lab:24s} {p:6.2%}  [{bar(p)}]")
    if not any_border:
        print("(none)")

    print("\n=== Top other findings (< {}%) ===".format(int(BORDER_LOW*100)))
    for lab, p in pairs[:5]:
        if p < BORDER_LOW:
            print(f"- {lab:24s} {p:6.2%}  [{bar(p)}]")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage:z")
        sys.exit(1)
    main(sys.argv[1])

