import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/*
  Made: one folder per piece in src/content/made/<slug>/ holding index.md
  and its resized photos. Videos go in public/made/<slug>/.
  See .claude/skills/add-made-piece/SKILL.md for the full routine.
*/
const made = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './src/content/made' }),
  schema: ({ image }) => {
    const photo = z.object({
      src: image(),
      alt: z.string().min(1, 'Every photo needs alt text'),
      caption: z.string().optional(),
    });

    return z.object({
      title: z.string(),
      summary: z.string(),
      type: z.enum(['3D print', 'Furniture', 'Other']),
      date: z.coerce.date(), // used for sorting, newest first
      dateLabel: z.string().optional(), // how the date reads on the page, e.g. "Fall 2025"
      madeFor: z.string().optional(),
      materials: z.array(z.string()).optional(),
      tools: z.array(z.string()).optional(),
      size: z.string().optional(),
      cover: photo, // lead photo on the detail page
      // Which part of the cover to keep when a narrow screen crops it, e.g. "20% 50%" (left of center)
      coverFocus: z.string().optional(),
      // true: no automatic color wash over the cover (the photo is already graded)
      coverPlain: z.boolean().default(false),
      // true: the top photo is light (e.g. a pale render), so the title and site header switch to dark text
      coverLight: z.boolean().default(false),
      // 'content': the top image is sized to the text column instead of filling the window, on a
      // paper texture that runs edge to edge. Crop the image so the object spans its middle, with
      // coverPad (a share of the object's width) of paper on each side; the object then lines up
      // with the left and right edges of the text below at every screen size.
      coverAlign: z.enum(['full', 'content']).default('full'),
      coverPad: z.number().min(0).default(0),
      // Large pull-quote above the photos, e.g. the design challenge
      callout: z
        .object({
          label: z.string().optional(), // small label above, e.g. "The challenge"
          text: z.string(),
          style: z.enum(['paper', 'dark', 'accent']).default('paper'),
          image: photo.optional(), // shown under the text, inside the colored band (use a transparent PNG)
        })
        .optional(),
      thumbnail: photo.optional(), // gallery tile (4:5); falls back to cover
      photos: z.array(photo).default([]),
      // mixed: tall photos as 4:5 tiles, wide photos span the row
      // grid: every photo as an even square tile (good for a series of similar objects)
      photoLayout: z.enum(['mixed', 'grid']).default('mixed'),
      videos: z
        .array(
          z.object({
            src: z.string(), // base name in public/made/<slug>/; needs both <name>.mp4 and <name>.webm
            poster: image(),
            title: z.string().optional(), // shown as a heading above the video when set
            description: z.string().min(1, 'Describe what the video shows'),
          }),
        )
        .default([]),
      draft: z.boolean().default(false),
    });
  },
});

export const collections = { made };
