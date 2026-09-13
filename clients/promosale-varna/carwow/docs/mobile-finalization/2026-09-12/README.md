# Mobile finalization audit — 12 September 2026

## Verdict

The mobile storefront has a usable direction and several working journeys. It is **not ready for final sign-off**. Finish it through small corrective batches, not another template rewrite. Preserve the current home, compact inventory cards, vehicle-detail drawer, and two-step sell/import direction. Desktop redesign stays deferred; shared-code changes still require desktop smoke checks.

## Working tree and deliverables

Repository: `J:\template-repos\cars-template-carwow`, branch `main`, starting commit `d769bb0`. Existing uncommitted work was present and was preserved. This audit added reports and audit evidence; it did not change application source, commit, push, deploy, or send real customer leads.
Dev server: `http://127.0.0.1:6463`. Production-build preview used for verification: `http://127.0.0.1:6464`.
Read [CODEBASE_AUDIT.md](CODEBASE_AUDIT.md), [MOBILE_VISUAL_AUDIT.md](MOBILE_VISUAL_AUDIT.md), [FINALIZATION_PLAN.md](FINALIZATION_PLAN.md), and [COVERAGE.md](COVERAGE.md). Evidence is under `.audit/mobile-2026-09-12/` at repository root. Screenshot references in the reports are relative to that evidence directory.

## What was actually checked

All 528 `src` files were inventoried and scanned, with a TypeScript import-graph survey and targeted manual review of shared shells, mobile pages, styles, state, loaders, forms, intake APIs, schemas, authentication guards, and tests. That is a full-tree survey, not a claim that every line received the same depth of manual review.
The Chromium crawl covered 124 route/width cases across 80 distinct route states: every discovered vehicle detail (40), every published article (6), canonical public routes, aliases, experimental pages, login, and representative invalid URLs. All 80 received 390px captures; 22 canonical cases also received 320px and 430px captures. Full-page visual inspection concentrated on every main page family and important overlay/form/garage states.
Additional runs covered 20 routes each in WebKit, Firefox, and JavaScript-disabled Chromium; 12 production-preview checks across three engines; 18 route accessibility scans plus the initial home scan; existing automated tests; and real-browser filter, navigation, save/compare, and mocked lead journeys. Coverage and caveats are recorded separately.

## Quality gates

| Gate                                                               | Observed result                                                                                                      |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| Svelte/type checks; production build; server-secret boundary check | Pass; Svelte reports 0 errors and 0 warnings                                                                         |
| Unit tests                                                         | 23 passed across 5 files                                                                                             |
| Existing browser tests                                             | 20 passed, 5 failed; failures include stale/contradictory card expectations                                          |
| ESLint; formatting                                                 | 7 errors; 54 files fail formatting                                                                                   |
| Logo asset budget                                                  | Fail: approximately 720 KB against the repository's 450 KB budget                                                    |
| Production page-weight budget, iPhone user agent                   | 6 of 8 measured routes exceed their existing budgets; decoded response bodies, not compressed transfer or Web Vitals |

## Boundaries of this audit

No production data writes or live delivery tests were performed. Sell/import success and failure were tested using intercepted responses. Authenticated admin workflows, actual provider delivery, physical iOS/Android keyboards and browser chrome, VoiceOver/TalkBack, and production field-performance measurements remain explicit release gates. Development-only WebKit map overflow and Firefox module-loading errors did not reproduce in the settled production recheck and are not reported as established production defects.
