# Collection campaign artwork — 2 October 2026

The mobile Home collection banner now uses purpose-made artwork in the existing graphite campaign style instead of enlarging an arbitrary inventory photograph. The final generation directly references `public/showroom/black/home-collection-v1.png` and `home-finance-v1.png`: silver vehicles, halftone texture, light arcs and chrome platform. A neutral showroom-photo draft was rejected and is not used.

Runtime asset is a 72,432-byte WebP; generation prompt and provenance are in `public/showroom/COLLECTION-ARTWORK.md`. Copy stays localized HTML, image alt stays empty/decorative, and the banner retains its 156px height and `/cars` destination. Reduced the lower gradient so it protects the heading without dulling the silver cars. Desktop retains its existing real-listing collection cards.

The View all link above the Home feed is retained. The original `L:/cars-app/app/page.tsx` uses View all cars at the bottom rather than above its primary feed; the current top link provides direct access to the full searchable catalogue.

Browser: inspected the final artwork at 320px and 390px; title and arrow fit and the image loads. No document overflow. At 1440px the mobile banner stays hidden and desktop listing cards remain visible. Clicking the collection banner opens `/bg/cars` with 48 results. Temporary viewport overrides reset. Screenshot: `mobile-390.jpg`.

Validation: npm run check passed on the final revision (lint, typecheck and production build with 407 pages), using Node 22.20.0 and NEXT_DIST_DIR=.next-build-check.
