# Donovan Preddy portfolio

Personal portfolio for Donovan, a UX designer and UX leader. Sections: UX case studies (some leadership-focused), a gallery of 3D-printed products and furniture, shown on the site as "Le Fab Lab" (internally still the "Made" gallery, at /made/), and About.

## Working with Donovan

- Donovan is not a developer. Explain in plain language and handle Git, installs, and tooling for them.
- Work in small stages. Before each stage, say what you're about to do. After it, say what changed and how Donovan can check it themselves.
- Ask one or two questions at a time.
- Ask before publishing anything.

## Standing rules

1. **Accessible:** meet WCAG 2.2 AA. Use semantic HTML, keyboard access, visible focus, sufficient contrast, and a 24×24px minimum target size.
2. **Mobile-first:** write base styles for small screens, and add larger layouts with `min-width` media queries.
3. **Design tokens:** colors, type, and spacing come only from design tokens (CSS custom properties). No hard-coded values in components.
4. **Images:** resize and compress every image before it's added. Original full-size photos never go in the repo. Keep them outside the project, or in the git-ignored `originals/` folder.
5. **Alt text:** every image gets meaningful alt text that describes what matters in context. Decorative images use `alt=""` on purpose, never by omission.

## Tech

- [Astro](https://astro.build), a static site. Content is Markdown files. Use `astro:assets` images, which enforce alt text and optimize images.
- Hosted on GitHub Pages and deployed by `.github/workflows/deploy.yml` on every push to `main`.
- Domain: donovanpreddy.com, to be connected at launch (stage 7).
- Design tokens live in `src/styles/tokens.css`. Base styles are in `src/styles/global.css`, and the page frame is `src/layouts/BaseLayout.astro`. The `/style-guide/` page shows every token.
- Look: dark grays, with an orange accent for buttons, links, and focus, and a teal highlight for small labels. Fraunces (serif) for headings, Inter (sans) for body text.
- Made gallery tiles show a chalk sketch (light lines on near-black) that fades to the real photo on hover or focus. `scripts/make-sketches.mjs` generates the sketches and runs before `dev` and `build`.
- Commands: `npm run dev` for a local preview, `npm run build` for a production build.

## Plan

Site: Home, Work (filter Design / Leadership), a page per case study, Made gallery, a page per Made piece, and About.

Stages:
1. Setup
2. Design tokens and page frame
3. Case studies
4. Made gallery, plus the "add from phone" routine
5. About and Home
6. Accessibility and speed QA
7. Launch

Adding a Made piece from Donovan's phone: they attach photos and dictate in the Claude app. Claude resizes the photos, writes the entry, and drafts alt text for Donovan to confirm. Claude publishes only after Donovan says so. Follow `.claude/skills/add-made-piece/SKILL.md`.
