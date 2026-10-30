# Asset provenance

## Fonts

`src/lib/fonts/` holds the Latin and Cyrillic subsets of Inter (variable, 300–600) and Unbounded (variable, 300–500), downloaded from Google Fonts on 30 October 2026. Both are licensed under the SIL Open Font License 1.1.

## Artwork

All three files in `static/media/` are original generated artwork already owned and used by the Day & Night App variant (`app/public/showroom/` in `darkapoparka/day-and-night-autodeal`), where the prompts are recorded. None show a real dealer car, person or brand.

| File | Source in the App variant |
| --- | --- |
| `hero-coupe.webp` | `desktop/graphite-coupe-v1.webp` (unchanged copy) |
| `collection-lineup.webp` | `black/collection-lineup-v2.webp` (unchanged copy) |
| `studio-suv.webp` | `black/home-collection-v1.png`, re-encoded as WebP quality 84 |

## Stock

`data/stock.source.json` and `static/stock/*.webp` are the Day & Night Auto Group inventory export and thumbnails already published in the dealer repository (`stock.json` and `karento-best/static/assets/daynight/inventory-current/`), observed on mobile.bg in July 2026. They are preview data and should be refreshed from the dealer's current listings before release.

No third-party template, theme or stock photography was used.
