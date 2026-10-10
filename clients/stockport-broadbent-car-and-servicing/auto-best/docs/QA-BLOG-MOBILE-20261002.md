# Advice page mobile polish — 2 October 2026

The yellow mobile hero now uses the generated book/cap/magnifying-glass artwork.
The shared EntryCard overlaps the hero by 52px, contains the centered “Съвети” /
“Guides” title and a mobile search opener, and puts the category pills below the
box. Desktop and the no-JavaScript fallback keep their native GET search form.

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

The mobile opener subsequently gained a native full-screen search dialog with
instant local article results, category filters, a clear action and one bottom
result action. It reuses BlogCard with unique dialog IDs. A modal article click
loads the filtered list and replaces its history entry before opening the
article; browser Back and the article's return link both retain query/category
and article hash. Modifier clicks preserve the native article link.

Nine Chromium cases and three Windows WebKit cases passed, covering BG/EN,
320/390/991px, 200% text, a reduced 480px viewport, live matching, category/empty
states, clearing, trimmed GET submission, duplicate-ID absence, complete card
contents, native modality, Tab containment, Escape/close focus and scroll
restoration, dismissed drafts, both return paths, and desktop resize cleanup.
The 1440px desktop geometry matches the earlier baseline. BG/EN no-JavaScript
search also preserves the selected category. No browser errors were observed.

The final validation and production build passed with zero Svelte errors and
warnings. The first validation attempt encountered ENOSPC in the L: npm cache;
a per-process temporary cache on C: allowed the same command to finish without
changing repository or global npm configuration. No filesystem cleanup was
performed. Current evidence is in `runtime/blog-search-overlay-20261002/`:
`review-chromium.json`, `review-webkit.json`, overlay screenshots, `probe.json`
and `validate-c-cache.log`. Reduced-viewport checks exercise the existing
VisualViewport attachment; they do not represent a physical phone keyboard run.

This verifies the local reusable master. Existing dealer copies and hosted
deployments have separate release/publishing steps.
