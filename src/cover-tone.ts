/*
  Cover tone: looks at a project's top photo at build time and works out
  1. the photo's overall color (its "tone"), and
  2. how much of it is near-white.
  The project page lays a soft wash of that tone over the photo (multiply blend),
  so bright white areas pick up a gentle tint and the white title on top stays readable.
  Photos with almost no white get no wash.
*/
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

export interface CoverTone {
  tint: string; // e.g. "hsl(42 55% 78%)"
  strength: number; // 0 (no wash) to 1
}

const NONE: CoverTone = { tint: 'transparent', strength: 0 };

export async function coverTone(slug: string): Promise<CoverTone> {
  const dir = path.join('src/content/made', slug);
  try {
    const md = await readFile(path.join(dir, 'index.md'), 'utf8');
    const match = md.match(/^cover:\s*\n\s+src:\s*(\S+)/m);
    if (!match) return NONE;

    const { data, info } = await sharp(path.join(dir, match[1]))
      .rotate()
      .resize(160)
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    let white = 0;
    let r = 0, g = 0, b = 0, weight = 0;
    const pixels = info.width * info.height;
    for (let i = 0; i < data.length; i += 3) {
      const [pr, pg, pb] = [data[i], data[i + 1], data[i + 2]];
      const max = Math.max(pr, pg, pb);
      const min = Math.min(pr, pg, pb);
      if (min > 215) white++;
      // The tone comes from colorful mid-tones, not blacks, whites or grays
      const w = (max - min) * (max > 40 && min < 215 ? 1 : 0);
      r += pr * w; g += pg * w; b += pb * w; weight += w;
    }

    const whiteShare = white / pixels;
    if (whiteShare < 0.01 || weight === 0) return NONE;

    const hue = toHue(r / weight, g / weight, b / weight);
    // More white in the photo means a stronger wash, capped so it stays soft
    const strength = Math.min(1, 0.8 + whiteShare * 3);
    return { tint: `hsl(${Math.round(hue)} 85% 72%)`, strength: Number(strength.toFixed(2)) };
  } catch {
    return NONE;
  }
}

function toHue(r: number, g: number, b: number): number {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min || 1;
  let h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h *= 60;
  return h < 0 ? h + 360 : h;
}
