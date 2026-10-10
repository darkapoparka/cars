# Cars cards and Home banners — 9 October 2026

Mobile `/cars` keeps a compact photograph beside the model and price. Five facts share one evenly spaced strip beneath both columns: year, full mileage, fuel, transmission and body style. Photographs stop growing at 156px on wider phone layouts. Home uses three facts beneath its title and price: year, mileage and fuel. Prices have a distinct 24px/600 role, with an 8px separation from the model title. The narrowest listing pills use less horizontal padding so the Bulgarian Sportback record retains its full mileage.

The small View all action belongs inside the Featured cars banner, beneath its title. Its painted surface is 24px high on mobile and 28px on desktop, within a 44px target. All services follows Buying guides on mobile. Featured photographs have no additional Featured label.

The first two desktop banners retain their original left alignment and artwork. Supporting copy uses the full available text column and wraps naturally, without forced breaks after two words. Collection: “Explore our collection and find the car that suits you.” Sale/trade-in: “Get an appraisal for your car when selling or trading in.” Both have authored Bulgarian counterparts in the template catalog. Import and Financing retain their existing layout and copy.

`/cars` is the canonical localized inventory route. `/listing-grid` and the four older grid/list/map aliases redirect with HTTP 308 while preserving query values. Saved detail return URLs retain their locale, repeated filters and vehicle anchor. Navigation, forms and the sitemap use `/cars`.

## Rendered evidence

| Surface | Before | After |
| --- | --- | --- |
| Home, EN 390px | [Before](before-banner-en-390.png) | [After](after-banner-en-390.png) |
| Home, BG 320px | [Before](before-banner-bg-320.png) | [After](after-banner-bg-320.png) |
| Desktop banners, EN 1440px | [Before](before-banner-en-1440.png) | [After](after-banner-en-1440.png) |
| Desktop banners, BG 1440px | [Before](before-banner-bg-1440.png) | [After](after-banner-bg-1440.png) |
| Cars, EN 390px | [Before final spacing](before-final-grid-en-390.png) | [After](after-grid-en-390.png) |

Before screenshots use the existing development preview; final screenshots use an owned production-build preview. Desktop development-only banner controls are visible in the before capture. They are not part of the published page.

## Verification

- Svelte source check: zero errors and warnings. CSS, token and pinned Inter/Fluent checks passed; native EN/BG catalog and source audits passed.
- Production build passed with Node 22.20.0 and the retained lockfile.
- `car-cards-route-smoke.mjs`: 47 passing cases, covering EN/BG at 320, 373, 390, 430, 767, 768, 992, 1280 and 1440px, ten legacy redirects and a filtered detail/anchored-return/navigation/sitemap journey.
- `mobile-polish-smoke.mjs --cards-only`: six passing locale/width groups, including long Tesla titles, electric and petrol/LPG fixtures on Cars and Home.
- Home banner verification: ten passing EN/BG cases at 320, 390, 992, 1280 and 1440px; button containment and destination, title/button hierarchy, unchanged vehicle card sizes and preserved Import/Financing layouts.

`desktop-baseline.json` contains the original vehicle card geometry. The 768px fixture restores the original scrollbar-gutter setting in the browser to isolate card preservation from another task's shared CSS edit. Source CSS is not changed by that fixture. The checks use the shared working checkout; unrelated filter, menu and entry-control changes are preserved and excluded from this task's commit except for their canonical route references.

This is local source and browser verification. No dealer deployment or template release pin was changed.
