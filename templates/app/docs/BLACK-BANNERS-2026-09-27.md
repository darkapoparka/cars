# Black campaign artwork

The default showroom banner theme is now black/charcoal. Change `branding.bannerTheme` in `lib/showroom.ts` to `blue` to select the retained blue campaign family. The artwork registry and StyleX campaign tokens switch together. Client identity and the site's interactive accent colors remain separate configuration concerns.

Twelve original Drive24 assets were edited using their existing images as references: four landing heroes, four home carousel promotions, three lower campaigns and the ownership panel. Natural photo colors remain. Exact prompts and source paths are recorded in `public/showroom/black/PROMPTS.md` and `ASSETS.json`.

## Geometry contract

- Each black image has exactly the same pixel dimensions as its reference, checked from PNG headers.
- All four landing heroes are 1774 × 887 (2:1), share the same `ShowroomBanner` and frame, and keep the existing image anchor and reserved 180px mobile height.
- Home carousel art is 1672 × 941. Cards retain the existing 1212/681 rendered ratio and image-cover behavior.
- Sell and care campaigns are 1254 × 1254. Finance is 1774 × 887. Ownership is 1536 × 1024. Their existing containers and anchors are unchanged.
- Generated subjects retain the reference composition; generated photo pixels are not guaranteed identical. Actual layout stability comes from the reserved containers, absolute image positioning and explicit image dimensions.

The inventory visit promo now has a dedicated white `Plan your visit` link with a 44px target, linking to `/stores`. Its reserved mobile height is 136px to accommodate the button. This promo does not control the shared landing hero geometry.

This remains a single-dealer template candidate. It can provide the UI foundation for a later reseller platform; multi-seller identity, listing ownership, moderation and transactions require a separate product/domain implementation.

## Verification

`npm run check` passed (ESLint, TypeScript and production build). Browser QA used the rebuilt production preview at port 6473.

All four hero routes have identical measured banner/image boxes and CTA top positions at each checked width:

| Viewport | Banner x/y/width/height | Image x/y/width/height | CTA y |
| --- | --- | --- | --- |
| 320 | 12 / 160 / 281 / 180 | 12 / 160 / 281 / 180 | 266.1875 |
| 390 | 12 / 160 / 351 / 180 | 12 / 160 / 351 / 180 | 267.21875 |
| 1440 | 120.5 / 267 / 1184 / 300 | 704.5 / 267 / 600 / 300 | 452.15625 |

The desktop preview's scrollbar accounts for the 15px difference between viewport and content width. No horizontal document overflow was observed. This is a geometry comparison, not a comprehensive performance CLS benchmark.

The inventory button is 44px tall at 320 and 390 widths and successfully opens `/stores`. All four carousel scenes, the three lower campaigns and ownership panel were visually inspected. Browser error log was empty. The original nine unrelated staged files were left untouched.

Evidence is in Cars `runtime/app-showroom-qa/`: `black-banners-check.log`, `black-banner-measurements.json`, and `black-*-after-*.png`. Before/after inventory screenshots are `black-inventory-before-390.png` and `black-inventory-after-390.png`.
