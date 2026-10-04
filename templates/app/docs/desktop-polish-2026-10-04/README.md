# App desktop polish — 4 October 2026

The white desktop logo header is retained. Only its centered text navigation is removed. Wishlist and hamburger menu use visible outlined buttons on the right; a call button uses `dealer.phoneE164` when configured. This template has no phone number. Home search sits inside the existing graphite dealer banner, using the shared search component and actual inventory count. The configured location drawer remains in the banner.

Home uses four photo-first vehicle cards per desktop row. Cars uses three beside the filter sidebar at 1100–1399px and four from 1400px. Saved uses the same desktop card composition in its existing three-column grid. Cards retain the actual photos, make, title, price and two fact rows, with a circular wishlist button over the 16:9 photo. Home's View all actions have outlined pill surfaces instead of bare text. The four illustrated service shortcuts and promotional content remain in their existing order.

Changes start at the existing 1100px desktop breakpoint. Phone/tablet cards retain the photo beside the details, their original grid counts and controls. Desktop footer spacing is reduced because the dock is hidden. StyleX card variants explicitly preserve their phone/tablet property values when combined with the base styles.

## Matched desktop screenshots

Captured at 1440px with the welcome sheet dismissed and identical viewport/scroll settings:

- [Home before](home-1440-before.png) / [Home after](home-1440-corrected.png), 1440 × 1200.
- [Listings before](home-listings-1440-before.png) / [Listings after](home-listings-1440-corrected.png), 1440 × 900, inventory heading aligned at the same position.
- [Cars desktop](cars-1440-corrected.png), 1440 × 1000, four columns alongside filters.

[Turo](https://turo.com/) was reviewed as a light reference. Existing App components remain the implementation boundary.

## Validation

- Node 22.20.0; `NEXT_DIST_DIR=.next-build-check npm run check` passed lint, TypeScript and production build, with 407 generated pages. The generated `next-env.d.ts` was restored to its exact pre-build bytes.
- 24 Chromium desktop checks passed: Bulgarian/English Home at 1100, 1280, 1440 and 1920px; Cars at those four widths; eight secondary routes; menu/back navigation; location drawer Escape/focus restoration; search filtering actual inventory; and wishlist/Saved navigation. Checks cover the retained header, card density and landscape photos, View all button surfaces, hidden dock and document overflow.
- Matched 320/390px captures cover Home, Cars, Sell, Finance, Services, Menu, Saved and vehicle detail. Home and Cars were also compared at 1099px.
- 13 of the 18 phone/tablet captures are fully pixel-identical. Remaining differences are confined to vehicle photo painting, reproduced by repeat captures without source changes, and eight pixels differing by one RGB step. The comparison excludes reference-photo rectangles with a one-pixel edge allowance and records both raw and significant differences. No significant differences occur outside those photo regions. This establishes layout preservation without claiming that every photo pixel is identical.
- Detailed results are in [corrected-verification.json](corrected-verification.json) and [corrected-preservation.json](corrected-preservation.json). Matched phone/tablet captures accompany the desktop comparisons. The earlier local `after` captures are superseded by the `corrected` captures.

Source changes are limited to the App shell, discovery/banner search, opt-in desktop vehicle cards and their Home/Cars/Saved consumers. The App guidance records the owner's corrected desktop direction. This receipt establishes local implementation and rendered checks; dealer release selection and publication remain separate workflows.
