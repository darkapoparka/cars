# Mobile verification — 29 September 2026

Local storefront review of `http://127.0.0.1:6463/en`, with production-build checks on port 6464. The requested in-app browser remains at 390 × 844. This verifies the combined working tree, including pre-existing owner changes; it is not an immutable template release, dealer deployment or owner visual approval of the pending frontend refactor.

## Corrections

- Translate home budget options and service descriptions; search translated service descriptions. Keep explicit English blog navigation when the saved language differs.
- Restore the Viber label to its actual destination.
- Correct contrast in selected categories, menu items, import field labels and inventory filter counts.
- Give the menu a separate grid row for language preferences so navigation cannot cover it in short landscape viewports.
- Return keyboard focus to the recreated video play button after closing the player.
- Match accessible control names to visible text in inventory search/cards, the all-brands link and video controls.
- Load the first featured car, initially visible inventory images and the detail hero with appropriate eager/high priority.

## Verification

Node 24.21.0; Chromium 148 and Playwright WebKit 26.4. The maintained regression suite is `tests/mobile-acceptance.e2e.ts`.

| Check | Result |
| --- | --- |
| Svelte/type check | 0 errors, 0 warnings |
| Production build | Passed |
| Unit tests | 22 files, 184 tests passed; bounded to one worker |
| Tooling tests | 11 passed |
| Localization, typography and backend-secret boundary | Passed |
| Focused ESLint and formatting | Passed for task-owned changes |
| Production interactions | 14/14 Chromium and 14/14 WebKit passed |
| Automated route/accessibility crawl | 102 cases across 66 English routes at 320/390/430px; zero violations, overflow, broken images, undersized text inputs or runtime/HTTP errors |
| Open overlays | 19 states; zero axe violations, overflow or undersized text inputs |
| Rendering smoke checks | 6 phone no-JavaScript routes and 12 desktop cases at 1280/1920px; HTTP 200, one main, one visible h1 and no overflow |

Interactions cover search, budget/make selection and clearing, all six quick-filter sheets, sorting, detail tabs, save/compare persistence, blog navigation/search, all four service drawers, calculator updates, FAQ accordions, menu/preferences, video open/close/focus, and import/sell validation, retained drafts and honest demo refusal. Widths include 320, 390, 430 and 568 pixels, with short 390 × 420 and landscape 568 × 320 views. Editable text is at least 16px; pinch zoom is not disabled. This checks conditions that prevent iOS focus zoom, not physical iOS behavior.

The axe 4.13.0 scan includes WCAG 2 A/AA, 2.1 A/AA and 2.2 AA tags. It also records horizontal overflow, broken media, runtime/HTTP errors, landmarks and small inputs. Automated checks cannot establish full WCAG conformance. Phone no-JavaScript rendering and affected desktop routes receive separate smoke checks.

## Loading: not accepted

Lighthouse 13.5.0, production build, default simulated mobile network/CPU, cold navigation:

| Route | Performance | Accessibility | LCP | Total blocking time | CLS |
| --- | ---: | ---: | ---: | ---: | ---: |
| `/en` | 64 | 100 | 8.7 s | 0 ms | 0.0002 |
| `/en/inventory` | 66 | 100 | 6.2 s | 0 ms | 0 |
| Example vehicle detail | 71 | 100 | 4.9 s | 0 ms | 0.0001 |

The home LCP was 9.2s before image-priority corrections. These single-run local results are noisy and do not establish a statistically measured improvement. Raw HTTP inspection confirms gzip is enabled; an earlier inference from a decompressed HTTP-client response was incorrect. A separate gzip proxy fixture produced similar results and does not excuse the slow loading. Main-thread blocking and layout shift were low, but the page load gate fails. Remaining work is reducing initial CSS/JavaScript/image transfer and request competition, then repeating throttled and hosted measurements. No claim of “perfect loading” or zero lag is made.

## Preserved work and limits

Baseline: Cars `main` at `2cb6e6e6e809106f4e62f889fedd4858b7336ffc`. `workspace-doctor.mjs --fetch` found no Cars remote divergence. Before saving, main had advanced to `0acaa3d952f195e6e3fb8e0d49cc7e98ea449087` through other template work, with no intervening Carwow changes and no remote divergence. Parent repository staged changes, dealer work and the pending template edits are preserved. Only this task's hunks in the already-dirty inventory top/CSS files belong to this correction.

`check:architecture` still reports the pre-existing unused `MobileLeadManualCard.svelte`. The older full E2E/localization interaction suites contain assumptions about the former locale prompt, labels and layout; their attempted runs were not green and are not represented as passing. New focused tests cover the current English mobile flow. No committed visual baselines were replaced.

The local runtime uses demo inventory without a configured database. Form tests confirm the public 403 demo refusal, not enquiry delivery. Video tests intercept the iframe and verify player controls/focus, not third-party playback. Phone, Viber and external links were inspected rather than placing calls or contacting anyone. Authenticated administration, physical-device keyboards/browser chrome, VoiceOver/TalkBack, hosted behavior and field performance remain unverified.

Local evidence is retained under `.audit/mobile-final-complete/`, `.audit/mobile-final-overlays/`, `.audit/mobile-final-performance/` and `.audit/mobile-final-results/`. It is ignored evidence, not published client content.
