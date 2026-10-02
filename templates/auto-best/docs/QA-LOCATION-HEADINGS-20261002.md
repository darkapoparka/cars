# Mobile location headings — 2 October 2026

About, Contact and PDP mobile maps now use an uninterrupted map canvas, with no
title/address container above it or directions footer below it. A white rounded
“Отвори картата” / “Open map” action floats at the bottom center, leaving room for
the provider's right-side controls and bottom attribution. Its accessible label
and hover title retain the dealer's full localized address; its link opens the
configured showroom coordinates in Google Maps. General Contact's mobile
details card keeps its short address, visit and phone rows with title-aligned
arrows, and its centered entry card. Desktop keeps its existing showroom panels,
PDP heading/address and directions footer. Earlier checks below record the
preceding mobile designs.

Earlier plain-heading verification at `http://127.0.0.1:6461`, using Node 22.20.0:

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

The shorter map labels and plain Contact rows were then verified against the
same preview in twelve Chromium states and two Windows WebKit states. Coverage
includes BG/EN Contact at 390px and 320px with 200% text, Contact's 991/992px
transition, desktop at 1440px, both About translations, and PDP heading/address
retention. Row links, right-arrow containment, readable copy, focus outlines and
page overflow passed. Sequential Tab order passed in Chromium; Windows WebKit
focus states were checked directly because its native Tab behavior skips anchors
in a minimal HTML fixture too. The 390px preview confirms the live map rendered.

CSS policy, tokens, typography, deterministic locale compilation, locale source
audit and the production build passed. Svelte check reported zero errors and
warnings. Current evidence is in `runtime/contact-simple-rows-20261002/`:
`review-chromium.json`, `review-webkit.json`, `preview-390.png`, enlarged-text
screenshots, `static-checks.log`, `check.log` and `build.log`. The new map label is
owned by `localization/common.json`; its catalog and manifest were regenerated.

The mobile directions alignment was verified in eight Chromium states and two
Windows WebKit states. The checks cover Contact, About and PDP at 390px, BG/EN
Contact at 320px with 200% text, the 991/992px boundary and desktop PDP at 1440px.
Mobile text starts at the link's left padding and matches About/Contact's map
heading. Arrow and label containment, the 44px minimum target, real directions
URL, external-link attributes, focus outline and page overflow passed. Desktop
PDP retains its centered map action. CSS policy, tokens, typography, Svelte check
(zero errors/warnings) and the production build passed. Evidence is under
`runtime/map-link-alignment-20261002/`: both `review-*.json` reports,
`preview-390.png`, `static-checks.log`, `check.log` and `build.log`.

The compact details and row layout passed thirteen Chromium states and three
Windows WebKit states. BG/EN Contact covers 320/390px and 200% text at 320px,
plus the wider 991px entry card. About and PDP cover both locales at 320px.
Contact and PDP desktop checks retain the full address and existing composition.
At normal text size, each Contact description and map address occupies one line;
enlarged copy wraps without clipping. Title/arrow alignment, full-width second
rows, centered intro geometry, focus and Chromium Tab order, original telephone
and full-address/coordinate destinations, and page overflow passed.

The locale suite passed all 27 tests, including native compact-copy selection
and older dealer configurations retaining their own full localized fields.
Final CSS policy, token and typography checks passed. Svelte check reported zero
errors/warnings and the production build passed. Evidence is under
`runtime/contact-copy-layout-20261002/`: both `review-*.json` reports,
`contact-390.png`, `locales-test.log`, `static-checks-final.log`, `check.log`
and `build.log`. The authored compact copy lives in `src/lib/config/locale.ts`
and `localization/dealer.reviewed.json`; generated outputs were rebuilt.

The mobile directions footer was subsequently removed. Eight Chromium states
cover BG/EN Contact at 320px, BG Contact at 390px and 991px, About and PDP at
320px, and desktop PDP at 992px and 1440px. Mobile map cards end immediately
after the 280px iframe, without a blank footer; desktop retains its existing
directions action and destination. Page overflow and browser errors were absent.
CSS policy, tokens, typography and the production build passed; Svelte check
reported zero errors/warnings. Evidence is in `runtime/map-footer-removal-20261002/`:
`review.json`, `map-390.png`, `static-checks.log`, `check.log` and `build.log`.

The floating map action and removal of mobile heading containers passed seventeen
Chromium states and three Windows WebKit states. Coverage includes About,
Contact and PDP at 320/390px, both native locales, 200% text, the 991/992px
transition and all three desktop routes at 1440px. The action remains centered,
at least 44px tall, clear of the right control zone and bottom attribution, and
fully readable when enlarged. Real provider tiles were inspected on all three
390px mobile maps. Full-address accessibility, Hugeicons geometry, focus,
external-link attributes, showroom coordinates, page overflow and browser errors
passed. Desktop retains its existing composition and primary actions.

All 27 locale tests passed, alongside CSS policy, tokens, typography and the
production build. Svelte check reported zero errors/warnings. Evidence is under
`runtime/map-pill-20261002/`: both `review-*.json` reports, the three
`*-map-390.png` previews, `locales-test.log`, `static-checks.log`, `check.log`
and `build.log`. The compact button copy is owned by `localization/common.json`;
the generated catalog and manifest were rebuilt.
