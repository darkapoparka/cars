# Mobile location headings — 2 October 2026

About and general Contact use a plain, left aligned “Карта” / “Map” heading with
a muted compact street/number/city address below it. PDP keeps “Местоположение” / “Location”
and the same compact mobile address. The mobile
heading and address have no location icon. General Contact's mobile details card
uses plain address, visit and phone rows with right arrows; the leading red icons
are hidden. Each arrow aligns with its title, and the short description spans
the full row below. The Contact entry title and introduction are centered,
including their width-capped blocks on wider mobile screens. Mobile maps end at
the map canvas, with no directions footer or empty action space. About/Contact's
map title and address share the same left inset. Desktop keeps its existing map
composition, directions footer and PDP address icon.

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
