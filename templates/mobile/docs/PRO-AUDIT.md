# PRO architecture audit

## Status: review branch, not release approval

This refactor preserves the frontend polishing captured in commit `23ba02bb7e610d0eeb935c1eeeb2add7c29ceebe`, whose parent is `2eec07ee655baf0cbcf7d789b7e7e69b082f67e7`. Work is isolated on `PRO` in `C:\Users\radev\cars-mobile-PRO`; the original checkout remains on `main`. Later concurrent edits in the original checkout are not part of this snapshot.

**Do not merge or publish this branch as a finalized template while the six filter-boundary regressions below remain unresolved.** They were reproduced against the unmodified baseline before refactoring. The test runner intentionally reports them as failures rather than skipping or suppressing them.

## Implemented changes

- Split `ShowroomPages.tsx` into `SavedCarsScreen`, `ShowroomServicesScreen`, and `ShowroomContactScreen`, with direct route imports. Existing StyleX declarations live in `showroom-pages.stylex.ts`; screen markup and styling were retained.
- Consolidated six repeated media-query subscription implementations into `useMediaQuery`, preserving the 699/1024-pixel breakpoints, false server snapshots, and listener cleanup.
- Moved inventory return/scroll behavior into `inventory-navigation.ts`, separate from showroom configuration and filter URL helpers.
- Separated service-draft storage access from React subscriptions and form rendering. `service-draft-storage.ts` guards denied storage getters and quota failures; `use-service-draft.ts` filters notifications by request kind, configured key, and storage area. The existing versioned data format and local-only enquiry behavior remain unchanged.
- Removed 14 route-unreachable source modules with no maintained tooling consumer, including the superseded home/search UI and duplicate taxonomy data. Retained `filter-fields.ts` because native capture/import tooling still reads it.
- Removed five obsolete one-shot/source-rewriting scripts. Retained usable capture tools, asset provenance, licences, and committed assets.
- Removed duplicate execution of gallery/listing test suites, made lint warnings fail, pointed `qa:browser` at the maintained architecture suite, and removed two dated generated-type paths from TypeScript configuration.
- Updated the desktop browser assertion to verify the new sidebar and current-car enquiry link. The baseline polishing intentionally replaced the mobile dock on desktop; no UI was changed to satisfy the old assertion.

The route dependency inventory changed from 180 TypeScript/TSX files and 33,029 lines to 173 files and 30,613 lines. Line counts include formatting and data modules; they are not bundle-size or performance measurements. No visual assets, global styles, design tokens, dependency versions, release locks, or frozen source manifests were changed by the architecture refactor.

## Unresolved baseline defects

`tests/filter-boundaries.test.mjs` contains six executable failures:

1. Unknown sort values matching inherited object names do not safely fall back to the recommended comparator.
2. Unknown makes matching inherited object names can return a non-array model catalog.
3. Unknown truck categories matching inherited object names can select an invalid make catalog.
4. Inherited attribute names in detail filters can reach a non-string value and crash matching.
5. Overlong dictionary keys can be truncated into an existing make key and replace another selection.
6. Overlong nested make/model keys can similarly alias an existing variant selection.

Affected implementation files are `search.ts`, `native-taxonomy.ts`, and `filters.ts`. These are malformed-input reliability/boundary findings, not evidence of server compromise. A tool safety check blocked the attempted defensive patch; that patch was not applied or retried through another path. The failures are retained for explicit review, not presented as fixed.

## Verification completed before final browser comparison

- Node: `22.20.0`; framework production build uses the existing webpack/StyleX configuration.
- Original baseline `npm run check`: passed lint, typechecking, 152 test executions, and production build. Eleven executions were duplicate suite imports, leaving 141 unique original tests.
- Refactored source: formatting passed, lint passed with zero warnings, and TypeScript passed.
- Refactored unit tests: **153 total, 147 passed, 6 failed, 0 skipped, 0 TODO**. All 141 original unique tests and all six new service-draft storage tests pass. The only failures are the six newly added baseline defects above.
- Baseline browser suite with the updated desktop contract: **852 checks, zero errors**, across Chromium and WebKit, both languages, and widths 320, 390, 768, 1024, 1280, 1366, 1440, and 1920.
- Baseline screenshots: **108 successful captures**, with no page errors, horizontal overflow, or broken image loads in the tested states.

## Dependency audit

The live npm production audit reported zero advisories. The full audit reported seven high-severity development dependency entries caused by the `braces` chain (GHSA-vfj7-8cjw-p6xm). The upstream advisory lists affected versions through 3.0.3 with no patched version. Incompatible downgrade suggestions were not applied. This is not a claim that the application or all dependencies are vulnerability-free.

## Evidence and reproduction

Machine-local evidence is outside the template source at `C:\Users\radev\cars-mobile-PRO\runtime\mobile-PRO`. It includes the snapshot receipt, baseline/new source inventories, validation logs, dependency audit results, browser reports, and screenshots. Raw QA output is not committed into the reusable template.

Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` separately to inspect each gate: `npm run check` stops at the known failing regression tests. For the browser suite, set `QA_URL` to a production preview of this worktree and run `npm run qa:browser`. This does not send enquiries; the suite checks local draft behavior.

The screenshot matrix covers nine states (inventory, services, import, sale, contact, saved cars, vehicle details, photos, and features), three widths (320, 390, 1440), Bulgarian/English, and Chromium/WebKit. Each capture uses fresh browser contexts, stable locale/saved-car fixtures, loaded fonts/images, and reduced motion. The third-party map iframe is stubbed only in the screenshot harness for deterministic comparisons; those captures do not verify the external map service.

Architecture decisions were checked against Next.js Server/Client Component guidance, React's `useSyncExternalStore` guidance through Context7, and StyleX's cross-file style composition model. No framework migration or new application-state library was introduced.

## Final production and visual results

The refactored production build passed on Node 22.20.0. The full updated browser suite passed **852 checks with zero errors**, matching the baseline count. Both baseline and refactored screenshot runs completed all **108 states**, with no page errors, horizontal overflow, or broken image loads reported by that harness.

Raw pixel comparison found **95 of 108 pairs identical**. All 108 pairs have matching dimensions. The remaining **13 pairs are not pixel-identical**: differences are confined to the existing mobile vehicle-header state (top 66 pixels, with one smaller title-only difference) and small Chromium control text/border rendering regions. The header implementation was not changed by this refactor. The captures exercise scroll/observer-dependent UI; inspection alone does not prove that every difference is capture timing rather than behavior. **Complete pixel parity is not established.** Keep this limitation visible during review instead of treating the screenshot comparison as entirely green.

`visual-comparison.json` records every pair, and `visual-differences.json` records the changed bounds. The `differences` directory contains before/after crops for the 13 differing pairs. Representative mobile-services and desktop-vehicle comparison sheets are retained beside them. No screenshot masking was used to make differences disappear.

The branch is therefore suitable for architectural review, not a claim of flawless or deployment-ready completion. The remaining acceptance work is to resolve the six failing input-boundary tests, establish deterministic parity for the 13 differing screenshot states, and reassess the upstream development-tool advisory before release.
