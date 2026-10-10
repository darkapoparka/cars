# Mobile cards and service banners — 30 September 2026

Local folder: `L:/CODEX/cars/templates/auto-best`, parent Cars repository on `main`. Verified against the existing Vite listener at `http://127.0.0.1:5173`.

## Changes

- `VehicleCard.svelte` uses equal two-by-two mobile badges. Mileage keeps every digit without a unit; automatic/electric have compact localized labels. Full labels remain in accessible text/title attributes. The photo still matches the complete right column height.
- `presentation.ts`, `localization/common.json` and generated locale files own compact formatting and translated banner copy.
- `ServiceLanding.svelte` replaces only the mobile process disclosure with `ServiceCallBanner.svelte`. Desktop retains its existing disclosure.
- The banner heading spans the full card width. Existing exchange and showroom promotion images from the port 3001 Cars App are selected through `leadSite.artwork.serviceBanners`. `provenance/service-banners.md` records the sources and encodings.
- Relevant browser assertions and styling/testing references follow the mobile banner contract. Existing unrelated edits remain in place.

## Verification

The suite results below cover the earlier cards, service banners and overlay implementation. They predate the final Home artwork/spacing selection and are not evidence of a new full build of that selection.

- Svelte/type check: zero errors and warnings.
- Production build, locale/source audit, architecture, assets, CSS policy, tokens and typography checks passed.
- Locale unit suite: 25 passed.
- Mobile polish: 8 passed, BG/EN at 320/390/430/1440px.
- Reflow: 78 passed, including both service routes, 200% root text, text spacing and short dialogs.
- Typography/enquiry: 7 passed, including desktop and three short mobile heights.
- Mobile localized copy/banner: 6 passed, with no unexpected writes or page errors.

Evidence is in ignored `artifacts/mobile-polish-smoke`, `artifacts/mobile-reflow-chromium`, `artifacts/typography-smoke` and `artifacts/localization/mobile-copy-browser`.

The existing `L:/CODEX/cars/.git/index.lock` prevents a scoped commit and push. It was preserved. These are local checks, not a template release or dealer deployment.

## Final Home tiles

Home now uses compact title-only tiles on solid blue, red, ice-blue and charcoal surfaces, separated by the shared 16px gap. Cars, Sell and Import retain their transparent artwork; Import keeps its car, ship and transporter. Leasing replaces the book with a transparent sedan, euro coins and restrained calculator, derived with imagegen from the exact Cars App port 3001 finance banner. `provenance/home-action-finance-v3.md` records the final asset and prompt. The older photographic prototypes remain preserved and unselected.

The final selection was inspected in the live browser at 320px and 390px, including complete loaded artwork, title visibility and spacing. No broad test suite was rerun for this visual iteration. `artifacts/home-actions-final-390.png` records the rendered result. Desktop artwork selections and presentation are unchanged.
