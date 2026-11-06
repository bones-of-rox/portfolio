# Donovan Preddy portfolio

**Projeks** (tagline: "Built by hand and machine by Donovan Preddy"): a site only for Donovan's projects, a gallery of 3D-printed products and furniture, shown as "3D" at /fab-lab/ (internally still the "Made" collection; old /made/ links redirect there). On 2026-11-06 Donovan chose to drop the UX case studies (Work) and About pages, and the top navigation.

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
- Look: a fixed, dark black-stained wood background (public/textures/wood-grain.webp) that the page scrolls over, fading to charcoal toward the bottom of the page. Dark grays, with an orange accent for buttons, links, and focus, and a teal highlight for small labels. Fraunces (serif) for headings, Inter (sans) for body text.
- Made gallery tiles show a chalk sketch (light lines on near-black) that fades to the real photo on hover or focus. `scripts/make-sketches.mjs` generates the sketches and runs before `dev` and `build`.
- Commands: `npm run dev` for a local preview, `npm run build` for a production build.

## Plan

Site: Home, the 3D gallery, and a page per piece.

Stages (case studies and About were dropped on 2026-11-06):
1. Setup
2. Design tokens and page frame
4. Made gallery, plus the "add from phone" routine
5. Home
6. Accessibility and speed QA
7. Launch

Adding a Made piece from Donovan's phone: they attach photos and dictate in the Claude app. Claude resizes the photos, writes the entry, and drafts alt text for Donovan to confirm. Claude publishes only after Donovan says so. Follow `.claude/skills/add-made-piece/SKILL.md`.
