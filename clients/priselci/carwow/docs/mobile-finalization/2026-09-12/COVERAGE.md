# Executed coverage and remaining gates

This is the coverage ledger for the audited working tree, not a claim that every feature is complete. Source survey: 528 files / 103,357 newline-counted lines / 329 Svelte components. Every source file was scanned; targeted high-risk owners received deeper manual review. Raw artifacts are under `.audit/mobile-2026-09-12/`.

## Route capture matrix

The main crawl used Chromium with an iPhone user agent, touch enabled, and 844px viewport height. Every listed route state received a 390px top/full-page capture. Additional widths are shown explicitly. HTTP status is the final response after redirects. “No overflow” describes document width, not every overlay or transient state.

| Requested route                                  | Widths checked | Final status | Notes                                             |
| ------------------------------------------------ | -------------- | ------------ | ------------------------------------------------- |
| `/`                                              | 320, 390, 430  | 200          | Captured; see screenshots and per-family findings |
| `/inventory`                                     | 320, 390, 430  | 200          | Captured; see screenshots and per-family findings |
| `/inventory/map`                                 | 320, 390, 430  | 200          | Captured; see screenshots and per-family findings |
| `/services`                                      | 320, 390, 430  | 200          | Captured; see screenshots and per-family findings |
| `/sell-your-car`                                 | 320, 390, 430  | 200          | Captured; see screenshots and per-family findings |
| `/sell-your-car/request`                         | 320, 390, 430  | 200          | main-target count 2                               |
| `/about`                                         | 320, 390, 430  | 200          | Captured; see screenshots and per-family findings |
| `/about/daynight-auto-plovdiv`                   | 339, 390, 430  | 200          | Captured; see screenshots and per-family findings |
| `/contact`                                       | 320, 390, 430  | 200          | Captured; see screenshots and per-family findings |
| `/financing`                                     | 320, 390, 430  | 200          | main-target count 2                               |
| `/reviews`                                       | 320, 390, 430  | 200          | Captured; see screenshots and per-family findings |
| `/team`                                          | 320, 390, 430  | 200          | Captured; see screenshots and per-family findings |
| `/team/prodazhbi-showroom`                       | 363, 390, 430  | 200          | Captured; see screenshots and per-family findings |
| `/blog`                                          | 320, 390, 430  | 200          | Captured; see screenshots and per-family findings |
| `/faq`                                           | 320, 390, 430  | 200          | Captured; see screenshots and per-family findings |
| `/terms`                                         | 320, 390, 430  | 200          | Captured; see screenshots and per-family findings |
| `/inventory/mercedes-benz-gla-45-amg-405323`     | 320, 390, 430  | 200          | Captured; see screenshots and per-family findings |
| `/inventory/mercedes-benz-s-63-amg-841845`       | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/mercedes-benz-s-400-563618`          | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/mercedes-benz-gls-400-650416`        | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/mercedes-benz-gle-53-4matic-383846`  | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/mercedes-benz-gle-400-237038`        | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/mercedes-benz-gl-63-amg-636300`      | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/mercedes-benz-g-350-344162`          | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/mercedes-benz-e-63-amg-515038`       | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/mercedes-benz-e-400-668074`          | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/mercedes-benz-e-350-764829`          | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/mercedes-benz-cls-53-amg-807146`     | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/mercedes-benz-cls-400-635636`        | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/mercedes-benz-amg-gt-562014`         | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/land-rover-range-rover-sport-012835` | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/bmw-x7-166128`                       | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/bmw-x6-263153`                       | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/bmw-x6-685588`                       | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/bmw-x6-876978`                       | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/bmw-x6-781136`                       | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/bmw-m5-167628`                       | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/bmw-430-171119`                      | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/audi-rs6-224394`                     | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/audi-q8-707096`                      | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/audi-q7-196509`                      | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/audi-q7-983332`                      | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/audi-a8-574112`                      | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/mercedes-benz-gls-400-273938`        | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/mercedes-benz-e-350-336917`          | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/mercedes-benz-amg-gt-s-698048`       | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/lamborghini-urus-775312`             | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/bmw-x5-022942`                       | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/audi-a8-697521`                      | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/mercedes-benz-s-580-689775`          | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/mercedes-benz-v-300-610297`          | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/mercedes-benz-v-300-140338`          | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/mercedes-benz-e-400-169037`          | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/audi-rs7-702102`                     | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/mercedes-benz-g-63-amg-906066`       | 390            | 200          | Captured; see screenshots and per-family findings |
| `/inventory/mercedes-benz-s-500-711568`          | 390            | 200          | Captured; see screenshots and per-family findings |
| `/blog/kak-da-kupim-upotrebyavan-avtomobil`      | 320, 390, 430  | 200          | Captured; see screenshots and per-family findings |
| `/blog/vaprosi-predi-ogled`                      | 390            | 200          | Captured; see screenshots and per-family findings |
| `/blog/sravnyavane-na-avtomobilni-obyavi`        | 390            | 200          | Captured; see screenshots and per-family findings |
| `/blog/testovo-shofirane-kakvo-da-proverite`     | 390            | 200          | Captured; see screenshots and per-family findings |
| `/blog/kak-da-podgotvim-avtomobil-za-prodazhba`  | 390            | 200          | Captured; see screenshots and per-family findings |
| `/blog/snimki-na-avtomobil-za-obyava`            | 390            | 200          | Captured; see screenshots and per-family findings |
| `/sell-car`                                      | 390            | 404          | declared alias returns 404                        |
| `/sell-car/request`                              | 390            | 404          | declared alias returns 404                        |
| `/calculator`                                    | 320, 390, 430  | 200          | Captured; see screenshots and per-family findings |
| `/compare`                                       | 320, 390, 430  | 200          | Captured; see screenshots and per-family findings |
| `/favorites`                                     | 320, 390, 430  | 200          | Captured; see screenshots and per-family findings |
| `/contact?intent=import`                         | 320, 390, 430  | 200          | Captured; see screenshots and per-family findings |
| `/home1`                                         | 390            | 200          | Captured; see screenshots and per-family findings |
| `/home1-box`                                     | 390            | 200          | Captured; see screenshots and per-family findings |
| `/home2`                                         | 390            | 200          | ends at /presentation/home2; main-target count 0  |
| `/home3`                                         | 390            | 200          | ends at /presentation/home3; main-target count 0  |
| `/presentation/home2`                            | 390            | 200          | main-target count 0                               |
| `/presentation/home3`                            | 390            | 200          | main-target count 0                               |
| `/not-a-real-route`                              | 390            | 404          | Captured; see screenshots and per-family findings |
| `/inventory/not-a-real-car`                      | 390            | 404          | Captured; see screenshots and per-family findings |
| `/blog/not-a-real-post`                          | 390            | 404          | Captured; see screenshots and per-family findings |
| `/team/not-a-real-person`                        | 390            | 404          | Captured; see screenshots and per-family findings |
| `/admin/login`                                   | 390            | 200          | main-target count 0                               |
| `/admin`                                         | 390            | 200          | ends at /admin/login; main-target count 0         |

## Engine and resilience matrix

Twenty routes were visited in each of WebKit, Firefox, and JavaScript-disabled Chromium. The early WebKit map overflow and Firefox compare development-module error did not reproduce in 12 settled production-preview checks across Chromium/WebKit/Firefox. Those observations are retained in the raw logs rather than promoted to confirmed production defects.

| Route                                        | WebKit development observation           | Firefox development observation            | JS-disabled visible text                             |
| -------------------------------------------- | ---------------------------------------- | ------------------------------------------ | ---------------------------------------------------- |
| `/`                                          | Rendered in sampled state                | Rendered in sampled state                  | Useful text present; not proof all interactions work |
| `/inventory`                                 | Rendered in sampled state                | Rendered in sampled state                  | Useful text present; not proof all interactions work |
| `/inventory/mercedes-benz-gla-45-amg-405323` | Rendered in sampled state                | Rendered in sampled state                  | Only skip link; no useful page content               |
| `/sell-your-car`                             | Rendered in sampled state                | Rendered in sampled state                  | Useful text present; not proof all interactions work |
| `/sell-your-car/request`                     | Rendered in sampled state                | Rendered in sampled state                  | Useful text present; not proof all interactions work |
| `/contact?intent=import`                     | Rendered in sampled state                | Rendered in sampled state                  | Only skip link; no useful page content               |
| `/contact`                                   | Rendered in sampled state                | Rendered in sampled state                  | Only skip link; no useful page content               |
| `/services`                                  | Rendered in sampled state                | Rendered in sampled state                  | Only skip link; no useful page content               |
| `/about`                                     | Rendered in sampled state                | Rendered in sampled state                  | Only skip link; no useful page content               |
| `/financing`                                 | Rendered in sampled state                | Rendered in sampled state                  | Only skip link; no useful page content               |
| `/blog`                                      | Rendered in sampled state                | Rendered in sampled state                  | Useful text present; not proof all interactions work |
| `/blog/kak-da-kupim-upotrebyavan-avtomobil`  | Rendered in sampled state                | Rendered in sampled state                  | Useful text present; not proof all interactions work |
| `/favorites`                                 | Rendered in sampled state                | Rendered in sampled state                  | Only skip link; no useful page content               |
| `/compare`                                   | Rendered in sampled state                | Dev module error; production recheck clear | Only skip link; no useful page content               |
| `/calculator`                                | Rendered in sampled state                | Rendered in sampled state                  | Useful text present; not proof all interactions work |
| `/faq`                                       | Rendered in sampled state                | Rendered in sampled state                  | Useful text present; not proof all interactions work |
| `/terms`                                     | Rendered in sampled state                | Rendered in sampled state                  | Useful text present; not proof all interactions work |
| `/team`                                      | Rendered in sampled state                | Rendered in sampled state                  | Useful text present; not proof all interactions work |
| `/reviews`                                   | Rendered in sampled state                | Rendered in sampled state                  | Useful text present; not proof all interactions work |
| `/inventory/map`                             | Early overflow; production recheck clear | Rendered in sampled state                  | Useful text present; not proof all interactions work |

## Journey and accessibility evidence

All five corrected journey groups completed. The initial harness clicked some server-rendered controls before hydration; its failed sell/favorites attempts are retained in `journey-initial-harness.json` and are not classified as broken settled flows. The corrected harness waits for page readiness.

- sell manual validation, back, mocked failure and success: completed; inspect recorded findings, not a blanket feature pass.
- sell how it works, Escape and focus restoration: completed; inspect recorded findings, not a blanket feature pass.
- import origin, manual request, editing, mocked response states: completed; inspect recorded findings, not a blanket feature pass.
- import how it works: completed; inspect recorded findings, not a blanket feature pass.
- PDP tabs, favorites persistence and compare limit through real mobile controls: completed; inspect recorded findings, not a blanket feature pass.

The API interception recorded **zero real submissions**. Sell/import success and failure responses were synthetic. Tested dummy contact values are not customer data. The PDP fixture had no thumbnail buttons, so multi-photo swiping was not exercised. Fourth compare selection was refused; no alert was emitted. ArrowRight did not switch the selected PDP tab.

Accessibility: 18 route scans plus the initial homepage scan. The route batch reported 9 rule occurrences across 5 routes. Axe “incomplete” items require manual review; zero reported violations does not certify accessibility. See axe JSON for selectors and evidence.

## Commands and outputs

- `npm run check`: exit 0; log `svelte-check.log`.
- `npm run test:unit -- --run`: exit 0; log `unit-tests.log`.
- `node node_modules/eslint/bin/eslint.js src tests scripts`: exit 1; log `eslint.log`.
- `node node_modules/prettier/bin/prettier.cjs --check src tests package.json`: exit 1; log `prettier.log`.
- `npm run build`: exit 0; log `production-build.log`.
- `npm run check:backend-secrets`: exit 0; log `secret-boundary.log`.
- `npm run audit:assets`: exit 1; log `asset-budget.log`.

Existing Playwright suite: 25 tests, 20 passed, 5 failed. Production weight: original viewport-only script and an iPhone-UA variant were both run against port 6464; keep their decoded-body measurements distinct from compressed transfer or field Web Vitals. See `production-weight.log` and `production-weight-iphone.log`.

Production recheck: 12 engine/route cases, with no recorded page errors or document overflow after settling. The dev server remains a separate process on port 6463.

## Still required before release

Physical iOS/Android keyboard, safe-area, address-bar, rotation, touch and native hand-offs; VoiceOver/TalkBack; full 200% text-resize and keyboard coverage; gallery fixtures with multiple images; authenticated admin tasks and cross-dealer authorization; provider delivery and staging persistence; deployed field/trace performance; owner-approved dealer content and final screenshots. No database seeding, live submissions, deployment, or visual-baseline acceptance was performed in this audit.

## Supplemental contact checks

The contact form was also exercised against the production preview with all API writes intercepted. Empty submission identified three invalid fields; the mocked 503 response showed the English service error; a mocked 201 replaced the form with the Bulgarian success state. No real lead was sent. See `interaction-results.json` and `screenshots/state-contact-mocked-success.png`. An initial harness attempt waited for the form after success, but the form is intentionally replaced; that selector timeout is not an application failure.
The deferred contact-map iframe received its configured Google Maps source after scrolling into view. This confirms lazy attachment, not third-party tile availability under every network or privacy setting. See `screenshots/state-contact-map-visible.png` and the corresponding interaction record.
