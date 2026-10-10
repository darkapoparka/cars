# Mobile car-card density — 10 October 2026

The 320px inventory card squeezed five facts into a row with 2px gaps and no horizontal badge padding. The centered model/price stack kept the cash price visually dominant. This focused correction changes the shared listing-card component and its compact price token.

- At card widths up to 24rem, show year, full mileage and fuel. Wider mobile cards retain transmission and body style too. The detail page retains all specifications.
- Use content-sized badges with 8px horizontal padding and 4px gaps. With enlarged text, the facts can wrap without clipping.
- Align the identity 2px below the photo top and the price 2px above the photo bottom. Inventory prices are 18px/600; models remain 16px/500, manufacturers 12px/450, and Home prices 20px/600.
- At card widths below 12rem, including 200% text on narrow phones, stack the photo, content and facts so the cash price remains on one line.
- Preserve 12px outer card, 6px badge and 10px photo corners. Desktop/tablet composition remains unchanged.

Matched captures use the existing local preview at `http://127.0.0.1:6461/bg/cars`, the same two records, font readiness and loaded photographs. The four retained images are the final comparisons; intermediate trials were retired.

| Viewport | Before | After |
| --- | --- | --- |
| 320px | [Before](before-320.png) | [After](after-320.png) |
| 390px | [Before](before-390.png) | [After](after-390.png) |

Focused validation:

- Actual inventory cards fit at 320, 360, 390 and 430px with the intended visible fact counts and unchanged radii.
- Actual card geometry and typography match the baseline at 768 and 1440px.
- Existing long Tesla/electric/petrol-LPG fixtures pass on Home and inventory in Bulgarian/English at 320 and 430px. The retained `mobile-polish-smoke.mjs` assertions now inspect visible facts and the responsive count.
- At 320px with 200% text, all seven inventory cards in both locales stack correctly, preserve the full price on one line, and keep year/mileage/fuel readable.
- Both localized card links open their existing detail route.
- Svelte compilation, token/CSS policy checks and scoped whitespace checks pass. The Svelte autofixer reports its existing `href` advisory for the localized `i18n.href(withListReturn(resolve(...)))` wrapper; the resolved destinations were verified through actual clicks.

`result.json` records the focused results. `before.json` / `after.json` retain measured comparison samples. No production build or whole-project screenshot campaign was needed for this styling correction. Source delivery does not promote a template release or deploy dealer copies.
