# Carwow mobile audit and requested visual polish — 30 September 2026

The requested menu, import control and card/banner improvements are implemented and locally verified. General mobile readiness is **not flawless**: 200% text resizing still breaks the home budget tiles, home hero, detail heading/financing area and detail tabs. Production performance and physical-device acceptance remain unverified for this revision.

## Source and runtime

- Repository: `L:/CODEX/cars`, remote `https://github.com/darkapoparka/cars.git`.
- Working folder: `L:/CODEX/cars/templates/carwow`, branch `main`, HEAD `807e2d6ee76aaa26fc08ffab64221faece3a2fdb`.
- Mounted site: `http://127.0.0.1:6464/en`, Vite development server, listener PID 17192. Checks/build used Node 24.21.0.
- Parent workspace doctor was fetched/inspected before edits; unrelated template/dealer work and the nine pre-existing staged paths were preserved.
- No template release, dealer refresh, deployment or outreach was performed.

## Requested changes

- Removed the import-only slider/filter button. It called `onManual()` and duplicated the link control rather than filtering anything. The link field and VIN validation remain available.
- Re-composed the existing menu showroom artwork with a dark logo area and a right-side crop. Location text wraps at narrow widths; the short-height menu keeps its compact banner.
- Menu close control now has a light grey circular background, grey icon and a 44 × 44 CSS-pixel target. Close and Escape restore focus to the menu opener.
- Home/import car cards now use white badges for mileage, year, fuel and transmission. Prices are prominent plain text. Small statistic groups omit icons to keep values legible without wrapping at ordinary text size.
- Replaced the home sell/trade-in and sell contact artwork with a realistic key-handoff commerce composition based on the user's port-3001 references. Localized headings and actions remain HTML. New WebP: 960 × 480, 25,296 bytes. Provenance: `docs/asset-provenance/sell-key-handoff-commerce-v2.json`.

## Verification

| Check                                         | Result                                                                                                                                                                                                                                                                                                                             |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Broad mobile crawl before the requested edits | 104 route/viewport cases covering 66 English routes at 320/390/430px. Two hydration wait timeouts passed targeted rechecks. Completed/rechecked cases had no page overflow, broken images, axe violations, small editable inputs, runtime errors or HTTP errors.                                                                   |
| Additional initial states                     | Menu/search/location, all six inventory filters, sort, import/sell explainers, form validation/contact steps, service drawers, fresh welcome and text-resize states were inspected. Ordinary overlay states passed automated accessibility/reflow checks. Text-resize screenshots exposed visual failures that axe did not detect. |
| Final English mobile acceptance suite         | 17/17 Chromium tests passed after the requested edits.                                                                                                                                                                                                                                                                             |
| Initial WebKit acceptance suite               | All 17 test assertions passed; the worker failed to exit during teardown. This was not a clean successful suite run.                                                                                                                                                                                                               |
| Requested edits, English and Bulgarian        | 32 mobile states at 320/390/430px, plus 390×420 and 568×320 menus: no overflow, broken images, axe WCAG 2.0/2.1/2.2 violations or runtime/HTTP errors. Import link form, invalid VIN, menu dismissal/focus and short-screen actions verified.                                                                                      |
| Final statistics and grey menu control        | Six card states in Chromium and six in WebKit passed. Four badges per vehicle, no ordinary-size statistic wrapping, correct grey close colours, 44px target and focus return verified in both engines.                                                                                                                             |
| Svelte/TypeScript                             | `npm run check`: 0 errors, 0 warnings.                                                                                                                                                                                                                                                                                             |
| Changed source lint                           | Scoped ESLint passed after an initial host-memory failure.                                                                                                                                                                                                                                                                         |
| Formatting and typography                     | Changed-file Prettier check passed; typography check passed across 295 source files.                                                                                                                                                                                                                                               |
| Production build                              | `npm run build` passed, including localization catalog verification and Vercel adapter output.                                                                                                                                                                                                                                     |

The build result is separate from mounted production acceptance. Port 6464 remains a development server.

## Remaining acceptance issues

1. **320px, 200% text resizing:** home hero/search and budget labels clip; detail model/title collapses into a narrow column, the financing caption overlaps the brand, and detail tab labels clip. Current post-edit screenshots confirm these remain.
2. **Performance:** two throttled development home samples measured LCP 3.70s and 4.06s. These are development diagnostics, not production Lighthouse acceptance. No production performance verdict is claimed.
3. **Gallery fixtures:** current seeded detail galleries contain one photo per car, so multi-photo gallery interaction could not be tested with this dataset.
4. **Desktop checks:** the unchanged desktop home has contrast findings on empty body-category counts; import/sell desktop pages have a small back-to-top target. These were discovered by the extra desktop checks and were not changed in this mobile polish scope.

## Evidence and ownership handoff

Ignored local evidence is in `.audit/mobile-final-2026-09-30/` and `.audit/mobile-design-2026-09-30/`. Relevant files include `crawl-results.json`, `recheck-results.json`, `extra-results.json`, `verify-design-results.json`, `final-styles-results.json`, `chromium.log`, `check-final.log`, `eslint-final.log`, `build.log` and the corresponding screenshots. Final menu screenshot: `.audit/mobile-design-2026-09-30/final-menu-chromium-390.png`.

Task-owned existing-file changes:

- `src/lib/components/home/mobile/MobileBottomDock.svelte`
- `src/lib/components/shared/mobile/MobileLeadHero.svelte`
- `src/lib/components/home/mobile/MobileHomeDiscovery.svelte`
- `src/lib/components/contact/MobileImportExamples.svelte`
- `src/lib/components/home/mobile/MobileHomeServices.svelte`
- `src/lib/components/sell/MobileSellYourCarPage.svelte`

Task-owned additions:

- `src/lib/components/shared/mobile/MobileVehicleStats.svelte`
- `static/assets/images/home-promos/sell-key-handoff-commerce-v2.webp`
- `docs/asset-provenance/sell-key-handoff-commerce-v2.json`
- This report.

The changed components already had unrelated edits except `MobileHomeServices.svelte`; pre-edit snapshots and diffs are retained in `.audit/mobile-design-2026-09-30/before/`, `preexisting.patch` and `staged-before.patch`. Do not stage the combined component diffs blindly.

Commit/push is blocked by the pre-existing shared Git index lock at `L:/CODEX/cars/.git/index.lock` (zero bytes, timestamp 2026-09-30 07:24:30 Europe/Sofia). The lock was left intact. No task commit was created. Once its owner has finished, recheck HEAD and staged state, review only this task's delta against the saved before snapshots, create a scoped commit on `main`, then push without force. Owner visual acceptance and template promotion remain separate decisions.
