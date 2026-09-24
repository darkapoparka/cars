# Frontend and template audit — 23 September 2026

Baseline: `0227d22`, saved master checkout on `main`, local Vite server at `127.0.0.1:5174`. This audit preserves the existing dealer configuration, imagery, layouts and interaction contracts.

## Findings fixed

| Finding | Change | Evidence |
| --- | --- | --- |
| Make labels competed with model names despite their muted color | Regular-weight metadata, darker neutral ink and a 2px identity gap | Matching desktop and mobile screenshots |
| Blog metadata had competing weights and cramped desktop copy | Regular metadata, 20px desktop padding, clearer card-heading role | Article-grid before/after screenshots |
| Shared discovery/article hover shadows were excessively large | Reduced the shared shadow from 30px/60px to 8px/20px | Shared token used by body, brand and editorial cards |
| Article and body-type keyboard rings used a faint translucent accent | Focus-color rings; article outlines render over media; brand focus uses the same role | Component review; keyboard navigation verified |
| Reduced-motion styling missed homepage article-title transitions | Include article titles in the existing reduced-motion rule | Source review |
| Desktop sorting labels were clipped by the 178px control | A 280px desktop control shows full labels; hover now changes an actual surface instead of a nonexistent border | BG long label visible; BMW price sort verified |
| Inventory exposed two page headings on desktop | Keep the result heading available only when the mobile hero is omitted | Desktop and mobile accessibility trees checked |
| Full down payment displayed “price on request” for zero balances | Calculator uses ordinary currency formatting, including zero; whole-euro down payments pass native step validity | 68,804 EUR down payment → 0 EUR principal / 0 EUR per month; 8,804 EUR down payment over 60 months → 60,000 EUR / 1,000 EUR |
| Styling reference still described old fixed-height, single-line mobile cards | Updated the card guidance to the current make/model structure | Scoped documentation changes |

## Verification

- `npm run validate`: architecture, CSS policy, tokens, typography, assets, domain checks, Svelte diagnostics and production build passed.
- `npm run test:locales`: 25 tests passed, zero failures.
- Final calculator/focus adjustments: `npm run check` and `npm run build` passed again, with zero Svelte errors or warnings.
- BG at 320px: Home, inventory, blog, About, Contact, import, trade-in, vehicle detail and article detail. No horizontal page overflow or completed broken images observed.
- EN at 1024px: Home, inventory, blog, About, Contact, vehicle detail and article detail. Correct document language, no horizontal overflow or completed broken images observed.
- BG desktop review at 1440px: hero routes, inventory, article grid, About, Contact/workflows, vehicle detail and article detail. Matching screenshots cover visual changes.
- BG at 390px: inventory, filter dialog and import editor. Filter Tab focus remained inside the dialog; Escape closed it and returned focus to Filters. Import editor cancellation kept the original entry value.
- BMW filtering produced two records. Ascending sorting retained the make parameter. Opening a vehicle and returning preserved `make=BMW&sort=price-asc#vehicle-4`.
- Desktop vehicle navigation opened using ArrowDown and moved focus into the menu. Escape dismissed it.
- No browser console errors were reported in the checked session.

## Evidence and boundaries

Local evidence is in `artifacts/polish-audit/`: a comparison gallery, eight screenshots and `route-checks.json`. The screenshot pairs use matching viewport dimensions and scroll positions. Desktop cards were recaptured using the pre-audit card/results source so all photos could finish loading before capture; the reviewed final source was then restored byte-for-byte.

This is local template QA on the working checkout, which includes preserved pre-existing edits. It is not exact-commit release evidence for a deployed or mounted dealer site. The existing browser smoke CLI suites were not run; interactions listed above were exercised through the in-app browser. Real enquiry delivery, external maps/social services and production deployment were outside this pass. No leads were contacted and no dealer was deployed.

Only the audited component changes, one shared shadow token, the relevant styling paragraphs and this report belong to this task. Existing unrelated localization, overlay, mobile-control and style changes remain unstaged.
