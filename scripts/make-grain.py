"""Makes public/textures/grain.png: a small seamless film-grain tile for the
homepage's charcoal background (2026-11-12). Run: python3 scripts/make-grain.py"""
import numpy as np
from PIL import Image

rng = np.random.default_rng(7)
t = 128
g = rng.random((t, t))
alpha = (np.abs(g - 0.5) * 2 * 40).astype(np.uint8)  # up to about 16% opacity
col = np.where(g > 0.5, 255, 0).astype(np.uint8)
Image.fromarray(np.dstack([col, col, col, alpha]), 'RGBA').save('public/textures/grain.png', optimize=True)
