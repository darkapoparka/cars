# Mobile card radius audit — 9 October 2026

The saved mobile rule is **12px outer cards, 6px vehicle fact badges and 10px inset vehicle photos**. Desktop and tablet retain their existing geometry. This final pass audits the Auto Best master; the preceding [12px implementation](../mobile-card-radius-12-2026-10-09/README.md) owns the shared card-family wiring.

Every CSS radius declaration in the template was inventoried: **172 source files**, including 99 Svelte components and 11 stylesheets, with 464 corner declarations before this pass and 471 afterward. The additional declarations are mobile overrides in four components. Source hashes confirm the other runtime files stayed unchanged during this pass.

| Missed state | Mobile before | Mobile after | Existing desktop value |
| --- | --- | --- | --- |
| Banner-picker tiles | 16px | 12px card role | 16px |
| Sell review next-step notice | 13px | 12px card role | 13px |
| Sell and Import feedback panels | 10px | 12px card role | 10px |
| Contact and Sell review thumbnails | 8px | 10px photo role | 8px |
| Selected-vehicle hero, selected-link, summary and completion cards | 12px control role | 12px card role | 12px |

The retained selling branch in VehicleEnquiry also receives the mobile 10px review-photo override. Current Sell routes use TradeInEnquiry, so this retained branch was inspected in source and compiled rather than reported as a mounted route check.

## Verification

**334 rendered states passed** in Bulgarian and English: Home, Inventory and its empty state, About, Blog and its empty state, article detail, Contact, selected-vehicle Inspection and Leasing, Sell, Import, locale preferences, vehicle detail and the error route. Overlay states include the banner picker, Sell/Import guides, enquiry details, uploaded photos, review, copy feedback, completion and finance results.

- 156 mobile states at 320, 390 and 767px verify every rendered card, car fact badge and inset vehicle photo selected by the shared role contract.
- A temporary 17px mobile card token proves those cards actually subscribe to the shared role. Fact badges remain 6px and inset photos remain 10px during the probe; the probe is removed afterward.
- 178 desktop/tablet states at 768, 992, 1440 and 1920px match the unchanged baseline for every visible element's dimensions, font, padding, border widths, colors and four corner values.
- The expanded persistent radius smoke suite passes 150 cases, covering fourteen route states and eleven dialog states at all three mobile widths in both locales.
- Svelte check: 0 errors, 0 warnings. Production build, token, CSS-policy, architecture and typography checks passed; all three radius-policy tests passed.

The audit measures outer surfaces. Edge-to-edge images and joined PDP sections follow their enclosing card edge. Controls, status pills, icon/artwork frames, fullscreen overlays and 24px drawers retain their separate roles. A map inside the Contact visit card has square internal edges because the enclosing 12px card clips it. These are deliberate composed surfaces, rather than extra freestanding cards.

The browser checks use fresh local production previews. Copy and share are stubbed inside test contexts. All three owned audit previews were closed afterward. Existing shared dev processes and the comparison gallery remain running. No source publication, commit or dealer deployment was performed.

## Matched screenshots

| State | Before | After |
| --- | --- | --- |
| Banner picker, 390px | [Before](before-banner-picker-390.png) | [After](after-banner-picker-390.png) |
| Sell review and photo, 320px | [Before](before-sell-feedback-320.png) | [After](after-sell-feedback-320.png) |
| Import feedback, 390px | [Before](before-import-feedback-390.png) | [After](after-import-feedback-390.png) |
| Selected-vehicle photo, 390px | [Before](before-leasing-390.png) | [After](after-leasing-390.png) |
| Desktop Import review, 1440px | [Before](before-import-feedback-1440.png) | [After](after-import-feedback-1440.png) |

All screenshot pairs use matching locale, content, viewport and interaction state. The main car-card [12/14/16 comparison](../mobile-card-radius-three-way-2026-10-09/README.md) remains available; 12px is the selected default.

Source and computed evidence: [inventory before](source-inventory.json), [inventory after](source-inventory-after.json), [before states](before.json), [after states](after.json), [persistent regressions](regression.json), [summary](summary.json) and [correction hashes](corrections.json).
