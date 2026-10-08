# Homepage promotional carousel restoration

Replaced the plain icon cards under “Your showroom, your way” with four original image-led campaign cards. Preserved the original OfferCarousel proportions (1212:681), rounded corners, manual horizontal scrolling and centered scroll snapping. Images fill the entire card; editable headings, supporting copy and action labels sit over the artwork.

Campaigns cover the showroom collection, finance, part-exchange and a showroom visit. Copy, image paths and destinations are configuration-driven in `lib/showroom.ts`. No inherited Cars24 warranty, return guarantee or advertised interest-rate claims are used.

Four versioned original generated images are in `public/showroom/`. Exact prompts and generated source paths are recorded in `public/showroom/HOME-CAROUSEL-PROMPTS.md`. The reference images remain preserved.

Changes are limited to `components/ShowroomHighlights.tsx`, the showroom highlights configuration, generated assets and documentation. No publication or release selection. Existing unrelated staged changes were preserved.

## Verification

- `npm run check` passed (lint, typecheck, production build), exit 0. Log: `L:/CODEX/cars/runtime/app-showroom-qa/home-carousel-check.log`.
- Inspected all four cards at 320px, 390px and 1440px. Original aspect ratio is reserved before image loading. At 320px each card is 233 × 130.906px; at 390px each is 303 × 170.25px. No text-content overflow or document overflow.
- Horizontal scrolling and snap alignment work across the full four-card rail.
- Clicked each action: Browse cars → `/cars`; Explore finance → `/finance`; Value your car → `/sell`; Plan your visit → `/stores`. Browser back returns to the homepage carousel. No form submitted.
- Browser error log was empty. Preview remains at port 6473, temporary viewport reset and QA tab closed.

Screenshots in `L:/CODEX/cars/runtime/app-showroom-qa/`: `home-carousel-before-390.png`, `home-carousel-after-390.png`, `home-carousel-after-320.png`, `home-carousel-after-desktop.png`, `home-finance-card-390.png`, `home-visit-card-390.png`.
