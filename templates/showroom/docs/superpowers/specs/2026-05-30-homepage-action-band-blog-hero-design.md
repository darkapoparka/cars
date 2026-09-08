# Homepage polish: action band, blog reskin, a11y/SEO, hero LCP

Date: 2026-05-30
Status: Approved (design), pending implementation plan
Scope target: **desktop-perfect** homepage (`/`, the HomeFive template)

## Goal

Finish the remaining homepage weak spots identified in the desktop audit:

1. Replace the awkward "VS" compare section with a modern CTA band.
2. Re-skin the blog ("Съвети от Bohemcars") to match the project's good look.
3. Fix the homepage accessibility + SEO gaps.
4. Cut the hero image weight (LCP) without changing how it looks.

## Design language (decided)

**Hybrid: home2 patterns, lime palette.** Adopt the modern structure/patterns from the
`home2/` experiment (action cards, contained car cutouts bleeding off the corner, bold type,
soft surfaces, pill chips, circular arrow buttons) but **re-skinned to the established homepage
palette** so the new sections sit naturally beside the existing HomeFive sections.

Canonical tokens:

- Lime brand: `#98BC2A` (primary; used boldly).
- Dark green ink: `#1A2A16`.
- Light tint surface: `#F6F7F3`.
- Soft card surface: `#F0F3EE`.

**Contrast rule (non-negotiable):** never put white text on lime (`#98BC2A`) — it is 2.2:1.
Use dark-green text on lime (≈7:1). Lime stays the star; it is just used legibly.

## A. Action band — replaces the compare section

New component: `src/lib/components/home/HomeFiveActionBand.svelte`.

- Placement: the compare slot in `HomeFiveTemplatePage.svelte` (between `HomeFiveBrowseSection`
  and `HomeFiveBudgetSection`).
- Layout: 2 equal cards, `grid-template-columns: repeat(2, 1fr)`, gap 14px, in `.container`.
  Light tint band background (`#F6F7F3`). Headless (no `<h2>`); `<section aria-label="...">`.
- Card structure (from home2 `home2-action-card`): copy block (kicker `<strong>`, body `<span>`,
  CTA `<em>` with `ArrowRight` from `@lucide/svelte`) + an absolutely-positioned car cutout
  `<img loading="lazy" alt="">` bleeding off the bottom-right corner.
- **Card 1 — "Внос от Канада"** → `/services`:
  - Fill: lime `#98BC2A`. Text/arrow: dark green `#1A2A16`.
  - Body: "Подбор, проверка, документи и доставка от Канада." CTA: "Виж процеса".
  - Image: reuse `static/assets/bohemcars/home2/home2-action-import.png`.
- **Card 2 — "Купи наличните"** → `/inventory`:
  - Fill: dark green `#1A2A16`. Body text: white. CTA/accent: lime.
  - Body: "Налични автомобили с ясен произход и оглед преди сделка." CTA: "Виж наличните".
  - Image: reuse `static/assets/bohemcars/home2/home2-action-buy.png`.
- Hover: subtle background shift only (no transform), matching home2 restraint.
- Responsive: collapse to 1 column under ~1199px (desktop is the priority but must not break).

Removal: delete `HomeFiveCompareSection` usage from `HomeFiveTemplatePage.svelte`. Verify the
component is not imported elsewhere, then delete `HomeFiveCompareSection.svelte`. **The `/compare`
route/page is untouched** — only the homepage section is removed. Drop the now-unused
`comparePairs` data wiring from the homepage page-data path if nothing else consumes it.

## B. Blog reskin — `HomeFiveNewsSection.svelte`

Data: exactly 3 posts from `src/lib/data/blog.ts`.

- Layout: 3 equal cards in a row (`grid-template-columns: repeat(3, 1fr)`, gap ~24px on desktop).
- Card: image on top (16:10, rounded top corners, `object-fit: cover`), content on a soft surface
  (`#F0F3EE`, radius 8px). Dark title, meta row (author · date), and a **category chip**:
  dark-green `#1A2A16` background with lime text (on-brand, high-contrast).
- Remove the white-text-over-photo featured overlay (the old `post-style-2`) — image and text are
  now separate, so the contrast risk is gone.
- Keep the section heading "Съвети от Bohemcars" + the section "Виж всички" CTA (now
  contrast-correct per C).
- Responsive: 3 → 1 column on small screens.

## C. Homepage a11y + SEO

- **`<main>` landmark:** wrap Hero→News in `<main>` inside `HomeFiveTemplatePage.svelte`
  (header = banner, footer = contentinfo, modals outside). Fixes Lighthouse `landmark-one-main`.
- **Single `<h1>`:** in `HomeFiveHero.svelte`, the first hero text-slide renders `<h1>`; the other
  two slide titles render `<p>` with the same visual class. Result: exactly one `<h1>` on the page.
- **Meta description + title:** add a Bulgarian meta description and a clean `<title>` for `/`.
  Injection point TBD during planning (auxero `pageDocument.headHtml` vs route `<svelte:head>`).
- **Contrast fixes (white-on-lime → dark-green-on-lime):**
  - `HomeSectionCta` ("Виж всички") — currently white on lime via `btn-primary-3`.
  - Hero search-submit button `.search-cars__search`.
  - Vehicle card "нов внос" badge `.bg-primary-2`.
  - Finance link `.bohemcars-card-price__finance-link` — darken from `#9FA1A4`.
  - Scope each override narrowly so shared template buttons elsewhere are not disturbed.
  - Verify every fixed element ≥ 4.5:1 with the DevTools contrast snippet.

## D. Hero LCP

Validated spike (sharp, q90 WebP, see tmp/): smooth gradient, no banding, visually identical.

| Slide                     | PNG     | WebP q90 |
| ------------------------- | ------- | -------- |
| available-inventory (LCP) | 1430 KB | 78 KB    |
| import-canada             | 1645 KB | 102 KB   |
| sell-car                  | 1497 KB | 62 KB    |

- Convert the 3 hero PNGs to **WebP q90** and write them next to the PNGs in
  `static/assets/bohemcars/hero/`. WebP is universally supported (2026), so no `<picture>`
  fallback needed for the CSS background.
- Repoint `homeHeroSlides` in `src/lib/data/bohemcars.ts:210-212` to the `.webp` files.
- **Preload slide 1** with `<link rel="preload" as="image" fetchpriority="high" href="…available-inventory-wow.webp" type="image/webp">` in the homepage head (fixes the failed
  `fetchpriority`/discovery check; shrinks load + render delay).
- **Drop** the earlier "lazy-load slides 2–3" idea — all three slides total 242 KB, not worth the
  slider-stability risk.
- Conversion tooling: one-off `sharp` script (`tmp/webp-spike.mjs` is the prototype). Decide in the
  plan whether to add a committed `scripts/` helper + `sharp` devDep or keep it ephemeral.

### Carousel a11y (part of the hero work)

- Prev/next `<p class="swiper-btn">` → `<button type="button">` with existing aria-labels (keyboard
  operable).
- Add a **pause/play** toggle for the autoplay (WCAG 2.2.2 Pause, Stop, Hide).
- **Respect `prefers-reduced-motion: reduce`** — do not auto-advance when reduce is set.

## Out of scope (separate passes)

- Mobile-specific polish beyond "must not break."
- Site-wide contrast audit beyond the homepage elements listed in C.
- `focus.bg` hotlinked inventory images / ORB-blocked photos (self-hosting) — flagged, deferred.

## Verification

- `npm run lint`, `npm run check`, `npm run test:unit -- --run`, `npx playwright test src/routes/project1.e2e.ts`.
- Update/extend home fidelity tests that reference the compare section so they reflect the action band.
- Re-run Lighthouse (desktop): target **A11y 100, SEO 100**.
- Re-run the LCP performance trace: confirm load-delay and render-delay shrink; CLS stays 0.
- Run the contrast snippet on every element changed in C (expect ≥ 4.5:1).
- Desktop before/after screenshots of: action band (vs old compare), blog, hero network weight.
