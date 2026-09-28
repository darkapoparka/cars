# Shared showroom controls

This pass corrects inconsistencies around the approved black banners. The banner artwork, shared hero dimensions and route positions are unchanged.

- Home quick links and inventory actions now share `FilterPill`, including the existing Home filter/sort glyphs, compact 36px pill height, chevrons, charcoal icon circles and applied-state indicators. All inventory filter categories and sort choices remain available.
- Buy, Sell, Finance and Services shortcut labels and image boxes are centered. Existing imagery is retained, and card/header heights are unchanged.
- The mobile dock is white with a light active circle, 22px icons and 44px link targets. Its overall box is 188 × 50px, down from 212 × 56px. Destinations and route visibility are unchanged.
- Home promotional cards align with the section gutters. Mobile shows one complete card rather than an off-center card with a clipped right neighbor. Swipe navigation remains available, with four small page controls. Desktop shows all four promotions in two columns. The existing artwork aspect ratio remains fixed; outer corners are 20px and CTA pills use the same fully rounded treatment as the main banners.

Source comparison used the preserved reference inventory controls. The old inventory pills were 36px; the recent showroom adaptation had enlarged them to 40px and retained a separate solid funnel icon. The filter pane and its business logic are preserved.

No dealer copies, publishing configuration, fixture inventory or unrelated staged work are modified.

## Verification

- Final `npm run check` passed: ESLint, TypeScript and production build.
- Visually checked 320px, 390px, 768px and 1440px. No horizontal document overflow was observed.
- Home and inventory pills both measure 36px tall and use the same `filter`/`sort` glyphs. Their icon background is charcoal (`rgb(32,32,36)`).
- Dock measures 188 × 50px; all four links retain 44 × 44px targets.
- Home's Filter shortcut opens the inventory pane. All 13 categories remain present. Brand selection reduced the fixtures to nine Toyotas; ascending price sorting began with Yaris (31,599), Corolla (53,599), Veloz (64,699). Applied Filter, Brand and Sort indicators appeared. Budget opens the existing price pane.
- Mobile carousel dots and horizontal swiping advance complete cards and synchronize the active dot. The last card's CTA opens `/stores`. The Cars dock link returns to inventory.
- Desktop and tablet show all four promotional cards in a two-column grid. Mobile retains one-card snapping. The artwork ratio is unchanged.
- All four main hero routes still measure x=12, y=160, width=351, height=180 at 390px, matching the previous verified build. Browser error log is empty.

Evidence: Cars `runtime/app-showroom-qa/controls-polish-check.log`, `polish-hero-boxes.json`, `polish-home-before-390.png`, `polish-home-after-390.png`, `polish-cars-before-390.png`, `polish-cars-after-390.png`, `polish-carousel-before-390.png`, `polish-carousel-after-390.png`, and additional `polish-*-after-320.png` / `polish-*-after-desktop.png` captures.
