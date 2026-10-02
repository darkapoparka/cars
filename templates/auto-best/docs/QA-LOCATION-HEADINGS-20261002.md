# Mobile location headings — 2 October 2026

PDP, About and general Contact use a plain, left aligned “Местоположение” heading
with a muted address below it. The mobile heading and address have no location
icon. Desktop keeps its existing map composition and PDP address icon.

Verified at `http://127.0.0.1:6461` using Node 22.20.0:

- Nine Chromium rendered states cover all three routes at 390px, 320px with 200%
  text, and 1440px desktop.
- The checks cover plain headings, matching title/address left edges, address
  spacing and visibility, mobile icon removal, desktop address icon retention,
  document overflow and route status; no browser errors were observed.
- CSS policy, token and typography checks passed. Svelte check
  reported zero errors and warnings; the production build passed.

Routes: `/bg/listing-detail-v1/1`, `/bg/about-us`, `/bg/contact`. Ignored local
evidence is in `runtime/location-no-pin-20261002/`: `review.json`, header
screenshots, `check.log` and `build.log`. Earlier map/address integration evidence
remains in `runtime/location-heading-20261002/` and
`runtime/location-subtitle-20261002/`.

Coordinates, map loading and directions links are unchanged. This verifies the
local reusable template; no dealer refresh or deployment was performed.
