# Advice page mobile polish — 2 October 2026

The yellow mobile hero now uses the generated book/cap/magnifying-glass artwork.
The shared EntryCard overlaps the hero by 52px, contains the centered “Съвети” /
“Guides” title and a native GET search form, and puts the category pills below
the box. A single form preserves query/category URLs and keyboard submission.

Mobile articles use full-width text cards with category, title, summary and the
existing official Hugeicons arrow. No article thumbnails are requested below
992px. Titles remain complete: the current Bulgarian titles occupy one line at
390px and at most two at 320px. Enlarged text wraps naturally. Desktop retains
its original hero scene, search geometry, category layout and image cards.

The shared mobile map now has an icon-free, single-line compact-address pill on
the left, with ellipsis and reserved space for the right-side provider controls.
Full addresses remain available to assistive technology and as hover titles.

Local verification at `http://127.0.0.1:6461` with Node 22.20.0:

- Seventeen Chromium rendered states cover Blog at 320/390/768/991/992/1440px,
  native BG/EN, 200% text, and shared Contact/About/PDP map states. No document
  overflow, clipped titles or browser errors were observed. The 1440px Blog
  hero/title/search/categories/index/grid/card boxes match the captured baseline.
- Mobile artwork loads through responsive WebP sources. Mobile article image
  requests are absent; desktop does not request the mobile hero artwork.
- The native search/category, article return URL and hash, empty-results reset,
  focus and enlarged-text interactions passed separately in Chromium and Windows
  WebKit, in BG/EN at 320px. Evidence records
  actual map-link clicks, including Google's consent redirect when presented.
- `npm run validate` passed: architecture, CSS policy, tokens, typography, asset
  inventory, domain assertions, deterministic locale compilation, locale source
  audit, Svelte/TypeScript (zero errors/warnings), and production build.

Ignored local evidence is in `runtime/blog-map-mobile-20261002/`: `preview.json`,
`before-blog-1440.json`, mobile/desktop screenshots, `contact-map-390.png`,
interaction reports and `validate.log`. Artwork and the exact generation prompt
are recorded in `provenance/blog-advice-banner-v1.md`.

This verifies the local reusable master. Existing dealer copies and hosted
deployments have separate release/publishing steps.
