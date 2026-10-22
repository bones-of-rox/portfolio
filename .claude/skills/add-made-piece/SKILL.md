---
name: add-made-piece
description: Add a new piece to the Made gallery from photos, videos, and a dictated description Donovan sends, usually from their phone.
---

# Add a Made piece

Donovan sends photos (and sometimes a video), plus a dictated title, background, and date. Turn that into a gallery entry, show a preview, and publish only when Donovan says so.

## 1. Read what was sent
- Look at every photo and video frame. Note what each one shows.
- Pull out the title, story, date, and who it was for from the dictation. Keep Donovan's words and voice: fix grammar and dictation slips, but don't add facts. Ask about anything you'd otherwise guess, such as materials, tools, size, or who designed the model.

## 2. Prepare media (originals never go in the repo)
- Copy the original files to `originals/<slug>/`. That folder is git-ignored.
- Photos: use `sharp` (already installed with Astro) to auto-rotate, fit within 1800×1800, and save as JPEG at quality 80 with mozjpeg. Sharp's output drops EXIF, which removes phone location data. Save with descriptive names in `src/content/made/<slug>/`.
- Gallery thumbnail: tiles are 4:5 portrait. If the cover photo doesn't crop well to 4:5, or Donovan picks a different image, make a 4:5 crop and set it as `thumbnail`. Trim black bars from phone screenshots.
- Video: install `ffmpeg-static` in the scratchpad, not the project. Strip the audio when it's silent or not needed. Otherwise it needs captions. Scale to 720px wide at 30fps. Export both `public/made/<slug>/<name>.mp4` (H.264, CRF 26, `+faststart`) and `<name>.webm` (VP9, CRF 38). Save a poster frame as `src/content/made/<slug>/<name>-poster.jpg`.

## 3. Write the entry
Create `src/content/made/<slug>/index.md`. The fields are defined in `src/content.config.ts`, and `brain-trust-shot-glasses` is a complete example.
- `title`, `summary` (one line), `type` (`3D print`, `Furniture`, or `Other`), `date` (an approximate date is fine, since it's used for sorting) and `dateLabel` (e.g. "Fall 2025").
- Optional: `madeFor`, `materials`, `tools`, `size`, `thumbnail`, `photos`, `video`.
- Every photo needs `alt` text: describe what matters about the piece in that photo (shape, material, scale, setting), in a sentence or two. A video needs a `description` of what it shows.
- The body is the story, in short paragraphs.

## 4. Check
- Run `npm run build`. It fails if an image is missing alt text.
- Preview at phone and desktop sizes, and run axe. Expect zero violations.

## 5. Preview and publish
- Send Donovan screenshots of the gallery tile and the detail page, plus the drafted alt text and any questions.
- Publish (merge to `main`) only after Donovan says so.
