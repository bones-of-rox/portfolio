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
