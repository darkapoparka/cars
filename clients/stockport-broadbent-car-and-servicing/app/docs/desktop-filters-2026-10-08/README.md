# Desktop filter audit and local preview — 8 October 2026

Scope: the App master's desktop Buy and Cars filters at `http://127.0.0.1:6483`, in Bulgarian and English. Changes remain in the existing Cars `main` checkout. This preview does not update the approved template lock or hosted dealer copies.

## Findings and changes

| Before | Local preview |
| --- | --- |
| Buy put stock search above a second make/model search. | Keyword search has its own category. Each active pane shows at most one search field. |
| Buy used an 860px dialog; Cars used a full-screen overlay. | Both use the same contained 980px desktop dialog, with a 210px category rail and persistent actions. |
| Make/model quick pickers were 380px wide. | Make/model pickers are 620px wide and stay within the desktop shell. |
| Makes were text-only, including reference makes without stock. | Stocked makes use the existing manufacturer emblems and actual catalogue counts in two columns. Existing selected reference makes remain removable. All 19 stocked makes have emblems. |
| Models were an undifferentiated list with repeated make names. | Models are grouped by make, with its emblem. The existing selected-make narrowing and selection behavior are reused. |
| Desktop Budget, Year and Engine used older vertical sliders. | They reuse `CompactRange`, the existing mobile component, with editable bounds and horizontal sliders. Phone and tablet retain their previous layouts. |

Changed source: `components/InventoryClient.tsx`, `components/NativeFilterPane.tsx`, `components/DesktopInventoryFilters.tsx`. Manufacturer assets and their existing provenance in `public/brands/emblems/SOURCES.md` were reused.

## Browser evidence

- All 16 desktop sections were inspected on Buy and Cars in both languages at 1440px. Make, Model, Budget and Engine were also checked on Cars at 1100px and 1920px: 72 recorded states. Dialogs stayed within the viewport, actions remained visible, and no dialog had horizontal overflow or competing search fields. See `desktop-after-audit.json`.
- Twenty before/after filter layouts at 320, 390, 768 and 1099px matched exactly in the measured visible control geometry, with no document overflow. Categories: Make, Model, Budget, Year and Mileage. See `mobile-before.json` and `mobile-after.json`.
- Make selection: 48 cars → BMW 3 → BMW X3 1. The selected model and one-car result survived reload.
- Keyword Toyota: 9 cars. Maximum budget €50,000: 16 cars. Minimum year 2024: 20 cars. Reset restored all 48.
- Make search handles both an available make and an unavailable reference make. Escape restores focus to the opening control; Tab from the last modal action wraps to Close filters.

Matched captures: `home-filters-before-1440.jpg` / `home-filters-after-1440.jpg`, `cars-filters-before-1440.jpg` / `cars-filters-after-1440.jpg`, `make-quick-before-1440.jpg` / `make-quick-after-1440.jpg`, and `budget-before-1440.jpg` / `budget-after-1440.jpg`. The selected-make Model preview is `model-quick-after-1440.jpg`.

## Source validation

`npm run check` passed under Node 22.20.0: lint, TypeScript, 68 tests, and the production build with 431 generated pages. Build output was isolated in `.next-build-check-desktop-filters-20261008` so the active dev preview stayed separate. Final log: `runtime/desktop-filters-20261008/check-final.log`.

Generated changes to `next-env.d.ts` and `tsconfig.json` were restored to their exact starting bytes. Scoped `git diff --check` passed. Existing dirty work was preserved; no commit, push or deployment was performed for this preview request.

## Follow-up: selected body type images

The retained PNG artwork has an opaque white canvas that showed as a rectangle on the gray selected card. `NativeFilterPane` now blends the canvas into the card with `mix-blend-mode: multiply`. Original artwork, layout, selection state and filtering logic are retained. This small correction applies to the shared picker at every viewport, including the Browser panel's natural 319px width.

Browser verification covered the Cars dialog and Buy quick picker at 1440px. All 14 body images use the blend mode; SUV and Sedan selection were visually checked, and applying SUV still returned 33 cars. At 320px and 390px, selected-card and image geometry matched the starting measurements exactly. Before/after captures are `type-selected-before-1440.jpg` / `type-selected-after-1440.jpg`, with mobile captures at 320px and 390px and measurements in `type-image-mobile-check.json`. `type-quick-after-1440.jpg` shows the Buy picker.

The final `npm run check` passed under Node 22.20.0: lint, TypeScript, all 68 tests, and the production build with 431 generated pages. Log: `runtime/type-image-20261008/check-final.log`. The first build attempt hit a transient Windows lock on `next-env.d.ts`; the retry passed. Output was isolated in `.next-build-check-type-image-20261008`. Generated config files were restored to their exact starting bytes, verified by SHA-256, and scoped diff checks passed.

## Follow-up: compact overlay actions

The category pills stay: they provide a clear active state across many categories. A segmented control would crowd the category rail, while underline tabs would save little height with the existing comfortable targets. Footer padding is reduced; actions keep a 44px minimum height and mobile safe-area padding.

Browser measurements on Model: footer height 64 to 56px at 320/390px, 96 to 68px at 768px, and 80 to 64px at 1440px. That restores 8, 28 and 16px of visible filter content respectively, without horizontal overflow. The desktop quick picker footer is 56px with 44px controls. Matched captures: footer-before/after-{320,390,768,1440}.jpg; measurements: footer-before.json and footer-after.json.

Publication scope is the three reviewed filter components, based on the existing deployed publishing baseline f08f679ff091e446ca0b57eec9c3710baaec7ef9. Other unpublished App work remains in the canonical checkout. The existing deployed architecture is reconciled into the Cars source snapshot; template pins and dealer copies are unchanged. The local full check passed lint, types and 68 tests but ran out of disk during the production build after Git auto-maintenance. Release validation uses an immutable export on C:; its outcome is recorded separately.

## Published verification

Production is READY at https://cars-template-app.vercel.app/bg/cars?filters=1 for publishing commit e2504af29c9e6e86911f3a1e5b61e1b4e1894674. Cars source commit: 1f80d598b690059e7a5d6fce9361aaf1b8032866. The shared checkout HEAD and index were preserved during both non-force pushes.

The exact runtime snapshot passed npm run check on Node 22.20.0: lint, TypeScript, 58 tests, and 431 generated pages. The deployment snapshot contains the three reviewed filter components over the existing f08f679 publishing baseline. Unpublished mobile, search and services drafts were not included. The already deployed architecture was reconciled into Cars source; 1399 older reference files were preserved byte-for-byte in .template/recovery/41cbcf7fb30366e849660607190bb4c925009587/, excluded by the existing lint/type/build export boundaries. This does not promote template pins or refresh dealers.

The first isolated build shared dependencies from L: and hit a Windows cross-drive module-resolution error. A physical dependency copy on C: passed the complete check. Logs: C:/Users/radev/.codex/tmp/cars-app-filters-20261008/release-check-physical.log. Scope and push records remain in runtime/filter-footer-20261008.

Browser verification on the exact built preview covered Model, Budget and Body type at 320px, 390px and 1440px; BMW selected 3 cars, X3 selected 1, and that result restored after reload and hydration. Keyword Toyota returned 9; reset restored 48. Buy Make/Model pickers were 620px wide with 56px footers and 44px actions.

Hosted checks covered Bulgarian Cars at 320px, 390px, 768px and 1440px; English Cars keyword, Model and selected type; and English Buy Make/Model selectors. Footer heights were 56px on phone, 68px on tablet and 64px on desktop. All actions were 44px high, there was no positive horizontal overflow, and panes contained at most one visible search field. The last action's Tab wrapped to Close filters. All 14 original body assets loaded and blended correctly; one was still loading in the immediate first snapshot and then completed. No console errors were recorded.

Evidence: hosted-checks.json, release-built-checks.json, hosted-footer-{320,390,768,1440}.jpg, hosted-type-{320,390,1440}.jpg and hosted-model-quick-1440.jpg.
