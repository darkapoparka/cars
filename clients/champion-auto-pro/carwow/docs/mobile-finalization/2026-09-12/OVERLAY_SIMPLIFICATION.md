# Sell/import explainer simplification

## Requested correction

Remove the black illustrated overlay header and the duplicate phone shortcut. Keep the explanation compact rather than creating another landing-page hero inside the sheet.

## Implemented

- `MobileLeadInfo.svelte`: white title/close row; existing three icon rows; one full-width “Разбрах” action. Removed the image, gradient, phone action, imports, and their obsolete styles rather than hiding them.
- `lead-content.ts`: explanatory titles for sell/import; removed unused explainer artwork configuration. The page artwork and page-header phone controls are unchanged.
- `lead-info.e2e.ts`: asserts a white header, no image, no telephone link, and one footer action; keyboard wrapping now uses the remaining dismiss button.
- No changes to the base dialog implementation, task forms, desktop composition, provider delivery, or other pending application changes.

## Verification

- Eight manual Chromium viewport captures: both explainers at 320×568, 390×685, 430×932, and 568×320. Close/dismiss controls remain within the viewport; landscape content scrolls.
- Scoped Prettier and ESLint pass. Svelte/type checking: 0 errors, 0 warnings. All 49 unit tests pass. Production build passes.
- Focused browser suite against the dev server: 37 passed, 2 failed across Chromium, WebKit, and Firefox. Both failures reproduce the already-known Firefox backdrop-tap dismissal issue. The close button, dismiss button, Escape, draft preservation, and layout cases passed; this is not a claim of a completely green overlay suite.
- Rebuilt production preview restarted on port 6464. Both routes were checked there: white header, no explainer image, zero telephone links inside the sheet.

Evidence: `.audit/lead-info-light-2026-09-12/` (before copies, screenshots, logs, browser results, production smoke results).

Saved in the existing `mobile/finalization-2026-09-12` working tree. Not committed or pushed; unrelated pending work was not bundled into this correction.
