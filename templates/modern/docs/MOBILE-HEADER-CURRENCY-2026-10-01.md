# Shared mobile header and currency refinement

This change belongs only to the reusable Modern master. Dealer source, template
release selection and hosted deployments are outside its scope.

Header search entry points use the shared 48px height in `mobile-form-control.ts`.
Loading placeholders reuse it. `MobileDealerChrome` follows the control's natural
height instead of imposing a second fixed height. The 44px compact header and the
search drawer retain their existing geometry. Keep one row of quick filters below
search; each opens its existing drawer for detailed choices.

The primary card currency now inherits the amount's font, weight, size and colour.
`formatMoneyParts` still determines the symbol, ordering and localized spacing;
prices and inventory currency are unchanged. The master sample inventory displays
BGN, so the screenshots show `лв.`. The same component handles EUR.

## Local verification

- Web typecheck passed.
- Marketplace UI: 85 tests passed. Marketplace locale formatting: 2 tests passed,
  including EUR symbol formatting.
- Biome check passed for the six changed source and verification files.
- Browser measurements: 48px leasing entry at 320px and 390px, with no document
  or price overflow; currency and amount both resolve to 20px, weight 600.
- Shared-header navigation passed in Chromium at 320px and 390px, and WebKit at
  320px. The first WebKit 390px run encountered a concurrent desktop stylesheet
  compile error in `dealer-desktop-toolbar.module.css`; its trace is preserved.

Matched mobile header comparison:
`../runtime/mobile-header-currency-2026-10-01/header-before-after.png`.
Browser screenshots have identical 375x812 pixel dimensions; the corresponding
layout viewport measured 390x844. The comparison shows the header change only.
