// Makes a chalk-sketch version of each Made piece's gallery image.
// Runs before every build. For each src/content/made/<slug>/, it reads the
// thumbnail (or cover) from index.md and writes sketch.jpg next to it,
// skipping pieces whose sketch is already newer than the source photo.
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = 'src/content/made';
const SIZE = 800;

async function sourceImage(dir) {
  const md = await readFile(path.join(dir, 'index.md'), 'utf8');
  const front = md.split('---')[1] ?? '';
  // first `src:` under `thumbnail:`, otherwise under `cover:`
  for (const key of ['thumbnail', 'cover']) {
    const match = front.match(new RegExp(`^${key}:\\s*\\n\\s+src:\\s*(\\S+)`, 'm'));
    if (match) return path.join(dir, match[1]);
  }
  return null;
}

async function isFresh(src, out) {
  try {
    return (await stat(out)).mtimeMs >= (await stat(src)).mtimeMs;
  } catch {
    return false;
  }
}

async function chalk(src, out) {
  const { data, info } = await sharp(src)
    .rotate()
    .resize(SIZE)
    .grayscale()
    .blur(1.8)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const at = (x, y) => data[Math.min(h - 1, Math.max(0, y)) * w + Math.min(w - 1, Math.max(0, x))];

  // Sobel edge strength
  const edge = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const gx = -at(x - 1, y - 1) - 2 * at(x - 1, y) - at(x - 1, y + 1) + at(x + 1, y - 1) + 2 * at(x + 1, y) + at(x + 1, y + 1);
      const gy = -at(x - 1, y - 1) - 2 * at(x, y - 1) - at(x + 1, y - 1) + at(x - 1, y + 1) + 2 * at(x, y + 1) + at(x + 1, y + 1);
      edge[y * w + x] = Math.hypot(gx, gy);
    }
  }
  const sorted = Float32Array.from(edge).sort();
  const strong = sorted[Math.floor(sorted.length * 0.985)] || 1;

  // light lines on near-black, ignoring faint texture so wood grain stays quiet
  const pixels = Buffer.alloc(w * h);
  for (let i = 0; i < w * h; i++) {
    const line = Math.max(0, (Math.min(1, edge[i] / strong) - 0.18) / 0.82) ** 0.8;
    const shade = 0.1 * (data[i] / 255);
    pixels[i] = Math.round(22 + Math.min(1, line + shade) * 210);
  }
  await sharp(pixels, { raw: { width: w, height: h, channels: 1 } })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(out);
}

for (const slug of await readdir(root)) {
  const dir = path.join(root, slug);
  if (!(await stat(dir)).isDirectory()) continue;
  const src = await sourceImage(dir);
  if (!src) continue;
  const out = path.join(dir, 'sketch.jpg');
  if (await isFresh(src, out)) continue;
  await chalk(src, out);
  console.log(`sketch: ${out}`);
}
