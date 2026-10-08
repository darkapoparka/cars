# PRO repository audit and polish

Date: 8 October 2026. Review branch: `pro`.

Baseline: `e39ca69f0dd3e5bc75ae632a2a26989a73e08856` on `main`, published from Cars commit `686d195c33a29554c6f31f90b48b1be7dc96a16e`, subtree `templates/import`. The inherited `.template/source.json` describes that publication, not a new approved release incorporating this branch.

## Scope and constraints

This pass inventories the entire tracked tree and route/import graph, reviews runtime boundaries, state persistence, dependencies, build/asset policy and contributor instructions, and exercises the existing automated suite. The import analysis started from 177 route/hook entry files and included TypeScript, Svelte scripts and literal dynamic imports. Suspected unused modules were checked against application, test and tooling references before deletion. This is not a claim of formal verification or that every possible user interaction was tested.

The existing appearance is preserved. No active stylesheet, design token, typography rule, touch target, page composition, vehicle data or artwork was changed. The actual shared `common/Modal.svelte`, `common/MobileSheet.svelte`, service wizards and mobile navigation remain. Retained account/admin/agent and alternative-home routes are not silently retired.

## Changes

### Browser/server separation

Inquiry and sell-submission Zod schemas now live in `src/lib/server/inquiry-validation.ts` and `src/lib/server/sell-submission.ts`. Browser receipt messages and VIN/reference helpers no longer evaluate server-only schema definitions. `InquirySubmission` is still inferred from the same schema through type-only imports; there is no duplicated hand-maintained payload interface.

API routes and server actions use the server-owned validators. Shared service-request validation remains available to the Services client, where it is genuinely used. Validation behavior was preserved and five unit tests cover valid inquiries, bounded inputs, VIN/manual entries, numeric normalization and honest receipt messaging.

### State correctness

- Garage mutations project the current in-memory favorites/comparison into compatibility markup instead of re-reading storage immediately after an optional write. A denied or full storage area can no longer make those controls contradict the current selection. Persistence cannot survive a reload when the browser refuses storage; this fix does not pretend otherwise.
- Compare loading follows the overlay's shallow-history state. Closing an in-flight request with Back invalidates the obsolete response; Forward triggers loading again rather than reopening an empty comparison. Existing focus restoration, native links, copy/share behavior and mobile presentation are retained.
- Both regressions were reproduced against the baseline production build before validating their fixes. `tests/resilience.e2e.ts` covers them.

### Reuse and asset correctness

The garage API request and desktop font preload URLs now respect SvelteKit's configured base path. The favicon no longer claims to be SVG when the configured asset is PNG. These are specific portability fixes, not a claim that this pass qualified the complete Cars-mounted packaging workflow.

### Confirmed dead weight

Removed 41 unreachable source files (46,757 bytes): unused shadcn dialog/dropdown wrappers, two unused dashboard wrappers, obsolete Auxero data/type adapters, an unused dealer fixture, an empty barrel and unused server helpers. This does **not** remove the working dialog/sheet implementations.

Removed unused `@hugeicons/svelte` and `@fontsource-variable/geist` dependencies and updated the npm lockfile. The actively used Hugeicons data and other icon/UI libraries remain.

Removed 663 duplicated files under `.template/recovery/` (100,633,807 bytes) and ignored that recovery directory going forward. The removed files remain recoverable from the baseline commit in Git history. This reduces the tracked working tree; it does not rewrite history or promise an equivalent reduction in a full-history clone.

Preserved `.template-ref`, current publisher metadata, licenses, static originals, the existing public-asset retention policy and historical QA evidence. The Cars-owned `scripts/public-asset-retention.mjs` was not modified.

### Quality and handoff

The baseline formatting gate failed on 18 files, primarily archived recovery JSON. Removing duplicate recovery material and formatting the retained publication metadata restores that gate. The quality workflow now also runs on pushes to `pro`.

The first full browser run exposed 74 failures in inherited tests. Re-running the affected original tests against the unchanged `main` build reproduced 74 failures (130 selected cases: 74 failed, 55 project-specific skips, one passed). The existing main GitHub quality run also failed its formatting and ESLint gates before reaching browser tests.

Tests now follow the actual current UI: mobile make/model pickers and manual-entry mode, the external fixed form footer, the consolidated Import filter sheet, current home editorial containers, semantic desktop choices, and scoped control-height tokens. Account seed assertions no longer assume other form journeys cannot create submissions. The approved phone treatment uses 42px controls in these scopes; this pass did not enlarge or shrink them to satisfy obsolete 44px assertions. Focus, history, filter URLs, short-viewport actions, failed-draft retention, uploads, submission payloads and no-JavaScript coverage remain exercised. No inherited test was deleted or newly skipped to hide a failure.

The README no longer points agents to a missing root `AGENTS.md`. README, reuse and integration notes distinguish current publication metadata from earlier ownership instructions. This branch is for owner/Codex review; it is not automatically merged, promoted or copied into an existing dealer.

## Measurements

Cold Chromium contexts used the production preview build on the same machine, at 390 × 844 and 1440 × 1000. Locale preferences were seeded, reduced motion enabled, and screenshots taken after hydration, fonts and visible images were ready. Nine route/locale combinations were checked at each width.

The figures below sum **decoded JavaScript response-body bytes**, not compressed wire transfer, an LCP score, or a percentage improvement in real-world loading time.

| Route                                        |      Before |     After | Reduction |
| -------------------------------------------- | ----------: | --------: | --------: |
| Home (`/bg`, `/en`)                          | 1,070,740 B | 972,771 B |     9.15% |
| Inventory (`/bg/inventory`, `/en/inventory`) | 1,002,587 B | 904,618 B |     9.77% |
| Import                                       |   955,587 B | 857,618 B |    10.25% |
| Sell your car                                |   948,695 B | 850,726 B |    10.33% |
| About                                        |   942,596 B | 844,627 B |    10.39% |
| Contact                                      |   948,509 B | 850,540 B |    10.33% |
| Services                                     |   964,108 B | 963,020 B |     0.11% |

Results were the same at both viewport widths. Services still needs its shared validation library; it is deliberately not credited with the approximately 98 KB saving on the other measured routes.

All 18 captures returned HTTP 200, with no page JavaScript errors, broken visible images or horizontal overflow. Document heights were unchanged. Nine screenshot pairs were pixel-identical; the others differed in 5–153 pixels, at most 0.018% of a capture. Representative desktop/mobile captures were inspected; there is no intentional visual redesign. These are viewport captures, not exhaustive full-page or real-device visual certification.

Detailed byte counts, layout checks and rendered-pixel hashes are in [measurement evidence](pro-audit-metrics.json). Full before/after screenshots remain in the isolated review checkout's ignored `.audit/before/` and `.audit/after/` folders rather than adding another large screenshot archive to the template.

## Verification

- `npm run verify`: passed; Svelte check reported zero errors and warnings, formatting/ESLint and architecture/asset gates passed, and all 167 unit tests in 25 files passed.
- `npm run build`: passed, including the Vercel adapter and public-asset retention step.
- Full local Playwright matrix: 752 cases, 492 passed, 259 existing viewport/project-specific skips and one browser-environment failure. The retained trace shows Chromium `ERR_NO_BUFFER_SPACE` while fetching the application entry module, followed by a hydration timeout. That unchanged Contact case passed three consecutive one-worker reruns. Thus all 493 exercised cases have passed, but the full local run was not a clean single-pass run. No timeout was relaxed and no application assertion was removed to conceal that failure.
- `npm audit --omit=dev`: zero reported vulnerabilities at the time of this run.
- Full dependency audit: four moderate findings in the retained development-only Drizzle Kit/esbuild chain; no high or critical findings. The suggested force fix is a semver-major downgrade of the retained migration tooling, so it was not applied blindly.

The run used Node 24.21.0, npm 11.19.0 and the lockfile-installed toolchain. Browser tests use an isolated preview-mode production server, synthetic storage and no database/AI credentials. They do not send real dealer requests.

## Remaining boundaries

The template is not a verified production dealership backend. Durable authentication/session lifecycle, production upload storage/scanning, dealer notifications, rate limiting/abuse controls and dealer-specific content/legal approval remain separate release work as documented by the existing architecture and QA guides. Sample inventory and identity are not verified business facts.

The shared client shell still has substantial JavaScript. More aggressive lazy-loading or removal of retained route families would need a separate, interaction-tested decision; this pass does not trade the polished desktop dialogs or mobile behavior for a speculative rewrite. No Lighthouse/Core Web Vitals improvement, cross-browser certification, real iOS keyboard qualification or complete mounted-dealer qualification is claimed here.

## Local Codex handoff

Review checkout: `L:\CODEX\cars-template-import-pro`, branch `pro`. The separate `L:\CODEX\cars` checkout and its uncommitted work were not changed. Use this isolated checkout for visual review; the preview is served at `http://127.0.0.1:6791/bg` while the review server is running.

Review the state fixes, new validation boundaries and removed-file list. Keep `main` untouched until the owner accepts the changes. Before a subsequent Cars publication, reconcile approved changes into the editable `templates/import` source identified by `.template/source.json`; otherwise a fresh export can overwrite standalone-only improvements. Do not blindly apply the recovery-directory deletions or standalone publication metadata to the Cars monorepo.

For a fresh checkout, use `npm ci`, `npm run verify`, `npm run build` and `npm run test:e2e`. Promotion of an approved immutable release and deployment to a dealer remain separate owner-authorized operations.
