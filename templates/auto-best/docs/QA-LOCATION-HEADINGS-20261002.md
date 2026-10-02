# Mobile location headings — 2 October 2026

PDP keeps its location title left aligned, with the official Hugeicons pin beside
the title and a plain address below it. About and general Contact use the same
compact title and a single muted address line inside their mobile map cards.
Desktop keeps its existing map composition and PDP address icon.

Verified at `http://127.0.0.1:6461` using Node 22.20.0:

- 21 Chromium cases: all three routes at 320, 390, 991, 992 and 1440px in
  Bulgarian, plus English at 320px and Bulgarian at 320px with 200% text.
- Six WebKit cases: all three routes at 390px and 320px with 200% text.
- Heading alignment, icon size and first-line alignment, address position,
  desktop visibility, page overflow, unique IDs, directions targets and route
  status passed; no browser errors were observed.
- Three additional 390px checks confirmed that the real Google map renders below
  each heading. Coordinates and the directions destination are unchanged.
- Architecture, CSS policy, token and typography checks passed. Svelte check
  reported zero errors and warnings; the production build passed.

Routes: `/bg/listing-detail-v1/1`, `/bg/about-us`, `/bg/contact`, and their English
equivalents. Ignored local evidence is in `runtime/location-heading-20261002/`:
`results-chromium.json`, `results-webkit.json`, map-ready screenshots, `check.log`
and `build.log`. This verifies the local reusable template; no dealer refresh or
deployment was performed.

## Muted address follow-up

The shared mobile map header now shows the localized dealer address below
“Местоположение” / “Location”, using the muted 14px metadata role and the same
left edge as the title. The address has no icon or appointment paragraph.

- Ten Chromium checks cover About and general Contact at 320/390px in Bulgarian,
  320px with 200% text, 320px in English and 1440px desktop visibility.
- Two WebKit checks cover both pages at 320px with 200% text. Address wrapping,
  spacing, containment, muted type, fixed map height and route status passed;
  both real maps also rendered at 390px.
- CSS policy, tokens, typography and Svelte check passed; Svelte reported zero
  errors and warnings. The shared-checkout production build completed after this
  component edit; its emitted map markup and stylesheet contain the address row.
- Evidence: `runtime/location-subtitle-20261002/`. Its build log was copied from
  `runtime/home-banner-inward-20261002/build.log` to preserve the single build
  writer in this checkout.
