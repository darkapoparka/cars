# Mobile location headings — 2 October 2026

About and general Contact use a plain, left aligned “Карта” / “Map” heading with
a muted address below it. PDP keeps “Местоположение” / “Location”. The mobile
heading and address have no location icon. General Contact's mobile details card
uses plain address, visit and phone rows with right arrows; the leading red icons
are hidden. Mobile map directions are left aligned, with the arrow beside the
label. About/Contact's map title, address and directions share the same left
inset. Desktop keeps its existing map composition and PDP address icon.

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
