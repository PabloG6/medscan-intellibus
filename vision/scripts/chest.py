from __future__ import annotations

import argparse
from pathlib import Path

from vision.inference import format_ranked_predictions, predict_file


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Run chest X-ray inference on a single image.")
    parser.add_argument("path", type=Path, help="Path to an image or DICOM file.")
    parser.add_argument("--top", type=int, default=5, help="Number of top predictions to display.")
    return parser


def main(argv: list[str] | None = None) -> None:
    parser = build_parser()
    args = parser.parse_args(argv)
    predictions = predict_file(args.path, top_n=args.top)
    output = format_ranked_predictions(predictions)
    print()
    print(output)


if __name__ == "__main__":
    main()
