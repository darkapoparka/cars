# QA coverage and reproduction

Date: 12 September 2026. Source baseline: `main` at `adc16cc3e3ae430c1f53e64dd7086ce632e29e38` plus existing uncommitted application edits. App: `J:\cars\templates\auto-best`. URL: `http://127.0.0.1:6461`. Tests used Node 22.23.2 and installed Chrome/Playwright. Audit instrumentation was added under this folder; axe tooling was unpacked under `J:\cars\runtime\auto-best-audit-tools`, not added to application dependencies.

## Build and existing test results

| Check | Result | Evidence |
|---|---|---|
| `npm run validate` | FAIL: architecture passes, asset gate fails; later stages not reached by this command | `evidence/validate.log` |
| `npm run check:domain` separately | PASS | `evidence/domain.log` |
| `npm run check` separately | PASS exit code; 0 errors, 4 warnings | `evidence/svelte-check.log` |
| Warning-strict Svelte check | FAIL on four unused BodyTypes selectors | `evidence/svelte-warnings.log` |
| `npm run build` separately | PASS | `evidence/build.log` |
| `sveltekit-smoke.mjs` | PASS, including route and journey suites | `evidence/sveltekit-smoke.log` |
| `enquiry-smoke.mjs` | PASS | `evidence/enquiry-smoke.log` |
| `mobile-filter-smoke.mjs` | PASS | `evidence/mobile-filter-smoke.log` |
| `desktop-discovery-smoke.mjs` | PASS, not desktop visual approval | `evidence/desktop-discovery-smoke.log` |
| `home-hierarchy-smoke.mjs` | FAIL: three body links versus stale expectation of four; later assertions not run | `evidence/home-hierarchy-smoke.log` |
| `npm audit --json` | 3 low-severity affected package entries, one underlying cookie advisory; 0 moderate/high/critical | `evidence/dependency-audit.json` |

The dev server was stopped only for the build/validation interval and then restarted on the same port. No deployment or remote repository write was performed. Stage exit codes are in `validation-stages.json`, `smoke-stages.json`, and individual exit files.

## Route and viewport sweep

`capture.mjs` completed **156 route/viewport combinations** at widths **320, 360, 375, 390, 414, 430, 767, 768, 991, 992, 1440**. The 390px run included all eight current vehicle pages and all nine articles, plus homepage, listing, generic contact, Sell, Import, Leasing, Inspection, About, Blog, filtered/empty states, selected-vehicle contexts, and invalid paths. Other widths exercised representative route templates and critical contexts rather than every record at every width.

Observed: no page JavaScript exceptions, no broken local images, and no document-wide horizontal overflow. Invalid IDs, a noncanonical leading-zero ID, and unknown routes returned the expected 404; corresponding document console errors are expected and must not be reported as zero total console messages. All **102 discovered internal URLs** returned 200. These counts do not imply every possible query combination, external service, or user-generated value was tested.

Evidence: `browser-routes.json`, `internal-links.json`, `capture.log`; full-page PNGs under `screenshots/`; visual contact sheets `core-*`, `details-*`, `articles-*`, `narrow-*`. Full-page captures deliberately scroll to load lazy images; fixed controls in stitched screenshots are not reliable evidence of their live scroll position.

## Interaction and edge-case coverage

Existing suites exercised listing/search query preservation, list/article return links, selected-vehicle contact context, finance arithmetic, menu behavior, enquiry step transitions, local draft reopening, photo count/type/size checks, and nested filter choices. Enquiry coverage included 320/390px, short landscape, and desktop; the mobile-filter suite covered 320/390/430px and 700×390. Inspect the copied suite reports for exact assertions rather than extrapolating a pass to untested behavior.

`edge-checks.mjs` added 21 result records with no harness exceptions. It reproduced background scrolling behind homepage search, spaces-only required Sell fields, budget boundary mismatches, duplicated desktop body artwork, and lost finance down-payment/term context. It also confirmed short search-footer geometry, no-JavaScript filtered listing rendering, legacy redirect/query preservation, preview robots, and map frame navigation. The settled Contact map screenshot was visually inspected and contains rendered map tiles/pin.

The video lifecycle test stubbed the external YouTube iframe: 0→1→0 iframe instances and correct focus restoration passed, but actual external playback was not verified. Sharing/clipboard in existing tests may be mocked; no enquiry was sent, call placed, photo uploaded to a service, or real recipient contacted.

## Accessibility results and exclusions

Axe-core 4.13.0 completed **26 base-page scans**. The listing has one failing contrast node; each of the eight PDPs has the same 11 failing contrast nodes. Other completed base-page scans did not report a violation under the selected WCAG A/AA tags. Automated incomplete checks are not manual passes. See `accessibility.json` and the exact selectors/ratios summarized in C07.

The supplementary overlay sweep is **not complete open-state accessibility coverage**. Initial `networkidle` waits timed out on some pages; a subsequent DOM-ready run finished the base routes but raced hydration when opening some overlays, so screenshots labelled `menu-*` or `listing-filters-*` can show the underlying page. Nested controls then timed out because their parent dialog was closed. A later `final-menu-open.png` likewise captured the underlying page after a command invocation failure. Exclude these captures and modal-labelled scan records from open-dialog pass claims. Keep them as diagnostic evidence, not approved baselines. Final open-state axe must assert `dialog[open]` and hydration readiness before scanning. Existing dedicated interaction-suite passes remain separate, valid results.

The audit identifies contrast defects and accessibility risks; it is not a WCAG conformance certificate. It does not include a real screen-reader session, real iPhone Safari, native keyboard resizing, or final text enlargement/reflow verification.

## Performance measurement

A fresh Chromium context at 390×844 with cache disabled loaded **12,203,050 bytes of `/assets/` image resources before scrolling**, then **12,894,356 bytes after full scrolling**. The six large service/menu PNGs dominate this result. This excludes scripts/fonts, uses a local dev server, and is not a Lighthouse score, field metric, or measured production LCP/INP/CLS. The baseline is reproducible in `edge-checks.mjs` and recorded as `cold-home-media` in `edge-checks.json`.

## Reproduce without changing the app

From the template directory, use Node 22.23.2. Start preview with `J:\cars\scripts\start-preview.ps1 -Template auto-best -Port 6461`. Run `node docs/audits/2026-09-12-mobile-finalization/capture.mjs` and `node docs/audits/2026-09-12-mobile-finalization/edge-checks.mjs` against that server. Existing smoke scripts use `BASE_URL=http://127.0.0.1:6461`. Stop only this template's dev process before `npm run build` or the build-containing validation command; restart and verify the same URL afterward. Do not blindly kill all Node processes.

The supplementary `accessibility.mjs` requires the external audit-tool path and still needs reliable open-dialog assertions; it is not yet suitable as a release-gate script. Save reruns in a new dated folder rather than overwriting this baseline. `scan.mjs` records source hashes; do not overwrite the original hash inventory when verifying that changes were preserved.

## Required final sign-off still outstanding

Real iPhone Safari and Android Chrome; actual virtual keyboard and landscape safe areas; native file/share/clipboard cancellation and denial; manual keyboard and screen-reader walkthrough; 200% text and long content; slow/offline/failed image behavior; production performance/header verification; compatible dependency remediation; real stock/brand/domain approval. WebKit and Firefox browser executables were not installed in this environment (`browser-availability.json`). Desktop received breakpoint guardrails, not final design approval.

## Final verification at 02:00 EEST

All 92 `src` file SHA-256 values still match `source-inventory.json`; no audited application source changed during this pass. `package.json` and `package-lock.json` have no working-tree changes. All six report files exist and their relative Markdown links resolve. There are 268 evidence files, including diagnostic/failed-attempt captures that must not be mistaken for approved states.

The actual open-menu, Sell review, and populated filter-dialog captures from the passing suites were visually inspected: `journey-smoke/mobile-menu.png`, `enquiry-smoke/sell-review-390.png`, and `mobile-filter-smoke/draft-390.png`. These are valid open-state visual evidence, separate from the supplementary axe limitations above. The Sell review is currently white, with truthful unsent-draft/share status; the proposed dark workflow treatment is not implemented.

Dev remained listening at `127.0.0.1:6461`, owned by PID 33656 running the template Vite command under Node 22.23.2. The final browser error query returned no page errors. The audit folder is untracked; nothing was committed, pushed, or deployed.
