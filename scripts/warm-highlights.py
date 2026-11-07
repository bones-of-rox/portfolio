"""
Warm the bright white lantern highlights in a photo, very subtly.

What it does:
1. Finds the near-white, blown-out areas (the glowing lantern shades).
2. Keeps only the big ones (drops small sparkles like the distant pole light).
3. Feathers that mask so the change fades in gently, with no hard edges.
4. Blends those areas toward a soft amber (#ffcc88 by default) at low strength,
   so the lanterns read as warm light instead of flat white.
The rest of the photo is left untouched.

Usage:
  python3 scripts/warm-highlights.py IN.jpg OUT.jpg [--tint ffcc88] [--strength 0.45] [--threshold 215]
  Add --mask MASK.png to also save the mask, for checking what was selected.
"""
import argparse

import numpy as np
from PIL import Image, ImageFilter


def build_mask(img: Image.Image, threshold: int, min_size: int) -> Image.Image:
    rgb = np.asarray(img, dtype=np.float32)
    luma = rgb @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
    spread = rgb.max(axis=2) - rgb.min(axis=2)  # low spread = close to white, not colored
    hard = ((luma >= threshold) & (spread <= 60)).astype(np.uint8) * 255
    mask = Image.fromarray(hard, "L")

    # Drop small specks: shrink, then grow back. Anything narrower than min_size disappears.
    mask = mask.filter(ImageFilter.MinFilter(min_size)).filter(ImageFilter.MaxFilter(min_size))
    # Grow a little past the hot core, then feather, so the glow's edges blend too
    mask = mask.filter(ImageFilter.MaxFilter(9))
    radius = max(img.size) / 120
    return mask.filter(ImageFilter.GaussianBlur(radius))


def warm(img: Image.Image, mask: Image.Image, tint: str, strength: float) -> Image.Image:
    rgb = np.asarray(img, dtype=np.float32) / 255
    t = np.array([int(tint[i : i + 2], 16) for i in (0, 2, 4)], dtype=np.float32) / 255
    m = (np.asarray(mask, dtype=np.float32) / 255)[..., None] * strength

    # Multiply by the tint keeps detail and shading; brightest areas shift most toward amber
    warmed = rgb * t
    # Lift slightly so the lanterns still glow rather than turning muddy
    warmed = 1 - (1 - warmed) * 0.85
    out = rgb * (1 - m) + warmed * m
    return Image.fromarray((out.clip(0, 1) * 255 + 0.5).astype(np.uint8), "RGB")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("src")
    ap.add_argument("out")
    ap.add_argument("--tint", default="ffcc88", help="hex color to warm toward")
    ap.add_argument("--strength", type=float, default=0.45, help="0 = no change, 1 = full tint")
    ap.add_argument("--threshold", type=int, default=215, help="how bright (0-255) counts as a highlight")
    ap.add_argument("--min-size", type=int, default=15, help="ignore bright spots smaller than this (px)")
    ap.add_argument("--mask", help="optional path to save the mask for checking")
    args = ap.parse_args()

    img = Image.open(args.src).convert("RGB")
    mask = build_mask(img, args.threshold, args.min_size)
    if args.mask:
        mask.save(args.mask)
    warm(img, mask, args.tint.lstrip("#"), args.strength).save(
        args.out, quality=85, optimize=True, progressive=True
    )


if __name__ == "__main__":
    main()
