"""
Makes public/textures/paper-tile.jpg: a seamless tile of the cream paper that
Donovan's pale renders sit on, for the homepage background (preview 2026-11-22).

It cuts a clean patch of paper from the Flame Lamp render, evens out the
lighting (so the repeat doesn't show as light and dark blotches), then
cross-fades the edges so the tile wraps with no seam.

Run: python3 scripts/make-paper-tile.py
"""
from PIL import Image, ImageFilter, ImageChops
import numpy as np

SRC = 'src/content/made/flame-lamp/lamp-render.jpg'
OUT = 'public/textures/paper-tile.jpg'
TILE = 640   # final tile size in source pixels
FADE = 160   # width of the cross-faded overlap

src = Image.open(SRC).convert('RGB')
patch = src.crop((20, 20, 20 + TILE + FADE, 20 + TILE + FADE))
a = np.asarray(patch).astype(np.float64)

# Even out slow light changes: divide by a heavy blur, keep the average color
blur = np.asarray(patch.filter(ImageFilter.GaussianBlur(60))).astype(np.float64)
mean = a.reshape(-1, 3).mean(0)
a = a / blur * mean
# Work on the texture detail around the average color, so the cross-fade keeps
# the grain's full strength (a plain blend would leave a smoother stripe)
a = a - mean

def wrap(arr, axis):
    n = arr.shape[axis] - FADE
    body = np.take(arr, range(0, n), axis=axis).copy()
    tail = np.take(arr, range(n, n + FADE), axis=axis)
    head = np.take(body, range(0, FADE), axis=axis)
    w = np.linspace(0, 1, FADE)
    shape = [1, 1, 1]; shape[axis] = FADE
    w = w.reshape(shape)
    blended = tail * np.cos(w * np.pi / 2) + head * np.sin(w * np.pi / 2)
    idx = [slice(None)] * 3; idx[axis] = slice(0, FADE)
    body[tuple(idx)] = blended
    return body

a = wrap(a, 1)
a = wrap(a, 0)
out = Image.fromarray(np.clip(a + mean, 0, 255).astype(np.uint8))
out.save(OUT, quality=78, optimize=True, progressive=True)
print(OUT, out.size, 'mean', mean.round())
