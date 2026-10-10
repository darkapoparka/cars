# Restore original front-facing heroes — 4 October 2026

The silver service-card implementation extended into mobile heroes without the owner's request. The owner rejected that extension. Home now uses the original front-facing pair; Sell and Import share the original front-facing car. Their original source dimensions, crops, side props and layout remain intact. The vehicle-artwork data file exactly matches the source before the silver-card commit 84c178196.

The brighter silver service-card updates remain in Home, About, service menus and call banners. Hero artwork is independently owned by the existing hero registry; a service-card request does not authorize changes to it. The unused letterboxing helper was removed. The generated standalone silver estate remains generation history.

## Native browser comparisons

Actual Codex in-app browser screenshots, BG at 390 × 844 and scroll zero. Before is the rejected silver hero substitution; after is the restored original front-facing composition. [Source and frame observations](browser-audit.json) record the loaded responsive assets. No console errors or warnings were observed.

| Hero | Before | Restored |
| --- | --- | --- |
| Home | [Before](home-before-bg-390.png) | [After](home-after-bg-390.png) |
| Sell | [Before](trade-in-before-bg-390.png) | [After](trade-in-after-bg-390.png) |
| Import | [Before](import-before-bg-390.png) | [After](import-after-bg-390.png) |

## Verification

Node 22.20.0: npm run check passed with zero Svelte errors and zero warnings; npm run build passed. [Hero composition](hero-report.json) passed all eight BG/EN viewport cases at 320, 390, 430 and 1440px, each covering Home, Sell and Import. The checks verify original mobile sources, centering, clipping, identical Sell/Import car pixels/crops/geometry, and the existing desktop composition. Local verification includes pre-existing desktop/content drafts that remain outside this scoped change. No dealer deployment or template promotion is included.
