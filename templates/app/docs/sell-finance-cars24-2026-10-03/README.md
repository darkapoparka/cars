# Sell and Finance card polish — 3 October 2026

The separate Request a valuation button duplicated the selling cards. Sell now goes straight from its static banner to two whole-card actions. Their 18px headings, three icon rows, white circular arrows and softly masked original artwork follow the compact hierarchy visible in the Cars24 reference. The guide image and caption now share one rounded pale card.

Finance now places View all / Виж всички beside Cars to finance / Коли на лизинг. This replaces both the standalone Choose your car launcher and the repeated full-width action below the inventory. Three priced examples, their assumptions and the calculator remain; payment actions use neutral surfaces.

## Reference inspected

- `L:/inspiration/cars24/components/FeatureLanding.tsx`
- `L:/inspiration/cars24/components/FeatureContent.tsx`
- `L:/inspiration/cars24/reference/2026-09-26-parity/android-sell-427.png`
- `L:/inspiration/cars24/reference/2026-09-26-parity/android-finance-427.png`
- `L:/inspiration/cars24/public/reference-assets/continuation/sell-sell-to-us-your-way.png`

These informed hierarchy, icon sizing, whole-card actions and spacing. Existing neutral Drive24 artwork and dealer configuration are retained. No proprietary Cars24 imagery or transaction claims were imported. This is local browser verification, not a native parity or hosted client release claim.

## Browser verification

The maintained preview at `http://127.0.0.1:6483` was inspected through the Codex in-app browser.

| Locale | Viewport | Result |
| --- | --- | --- |
| BG | 320 × 740 | Both cards and finance heading/action fit; document width and scroll width both 305px, with no broken visible images. |
| BG | 390 × 844 | Selling cards, guides and finance inventory inspected and captured. |
| BG | 768 × 1024 | Sell remains stacked; Finance uses two columns. Document width and scroll width both 753px. |
| BG | 1440 × 1000 | Sell uses two columns; Finance uses three. Finance document width and scroll width both 1425px. Both routes visually inspected. |
| EN | 320 × 740 | Selling and finance copy fit without document overflow; width and scroll width both 305px, with no broken visible images. |

Focused interactions verified:

- Sale card opens the Sale form. Entering Toyota, Corolla and 2020 produces the matching local editable draft. Browser Back returns to the populated car form; Escape closes it and restores focus to the card.
- Exchange card opens Exchange and retains the entered car details. Its whole-card keyboard focus outline is visible inside the rounded card at 320px.
- A selling guide opens its information sheet and closes normally.
- Finance View all opens the actual 42-car picker. Searching Attrage returns two cars; selecting the 2023 example opens the calculator at €24,799 with the initial €393 estimate.
- Changing interest from 7% to 8% updates the estimate to €402. Browser Back closes the calculator and restores focus; reopening through the banner retains the selected car and 8% rate.
- No browser errors or warnings were captured during the final locale inspection.

## Screenshots

- [Sell, BG 320px](sell-bg-320.jpg)
- [Sell, BG 390px](sell-bg-390.jpg)
- [Sell, BG desktop](sell-bg-desktop.jpg)
- [Finance, BG 320px](finance-bg-320.jpg)
- [Finance, BG 390px](finance-bg-390.jpg)
- [Finance, BG desktop](finance-bg-desktop.jpg)

## Source validation

`npm run check` passed: lint, TypeScript and the production webpack build, including all 407 static pages. It used Node 22.20.0, the retained npm lockfile, two build workers and a separate `.next-build-check` output to preserve the active preview. The generated `next-env.d.ts` imports were restored to their original preview paths after the check. `git diff --check -- .` passed for the App scope.

The check log is retained at `L:/CODEX/cars/runtime/app-sell-finance-polish-2026-10-03/check.log`. `node scripts/workspace-doctor.mjs --fetch` also completed; Cars main was current with fetched origin at that point. Unrelated work in other Cars templates, clients and the independent admin checkout was preserved.
