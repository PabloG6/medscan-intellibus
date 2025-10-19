from __future__ import annotations

import argparse
from pathlib import Path

from vision.data.download import download_cli


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Download sample chest X-ray images from the Open-i dataset.")
    parser.add_argument("--limit", type=int, default=10, help="Number of images to save.")
    parser.add_argument("--out", type=Path, default=Path("samples"), help="Output directory for saved images.")
    return parser


def main(argv: list[str] | None = None) -> None:
    parser = build_parser()
    args = parser.parse_args(argv)
    download_cli(limit=args.limit, out_dir=args.out)


if __name__ == "__main__":
    main()
