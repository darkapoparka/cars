# Mobile search and overlay controls — 8 October 2026

Local Auto Best source on `main`, based on `dd0b1d25d68ec5452da3d89d40da4a2aa154c617`. No commit, release selection or publication was performed.

## Behavior

- Home search opens as a full-height editor and focuses its keyword field after the user taps Search.
- Inventory's main filter editor starts at the top. Its keyword field stays above the scrolling criteria.
- Searchable and numeric quick filters fill the visible viewport. Short choice-only controls, including Sort and Type, retain their bottom sheets.
- Mobile header Close/Back controls use 24px Fluent Regular glyphs, transparent backgrounds and existing 44px hit targets. Keyboard focus and pressed feedback remain available.
- Home and inventory reset actions show localized Clear text. Clear remains disabled until a draft has something to clear.
- Search/filter editors follow the existing VisualViewport attachment. Content scrolls within the reduced viewport, while Apply/Show results stays reachable above the keyboard.
- Mobile Sell, Import, finance and locale close actions use the same Fluent family. Desktop renderers retain their previous icons.

The earlier Sell/Import field-editor change remains: fields and Save/Cancel share one scroll container, with actions following the final field. Its record is `docs/MOBILE-SERVICE-EDITOR-ACTIONS-2026-10-08.md`.

## Source

`src/lib/components/home/VehicleQuickSearch.svelte`, `src/lib/components/listing/MobileListingFilters.svelte`, `src/lib/components/listing/QuickFilterSheet.svelte`, `src/lib/styles/base.css`, `src/lib/styles/tokens.css`, `src/lib/components/company/TradeInEnquiry.svelte`, `src/lib/components/company/VehicleEnquiry.svelte`, `src/lib/locale/LocalePreferences.svelte`, and `src/routes/listing-detail-v1/[id]/+page.svelte`.

Existing concurrent HomeBrowseBox/DesktopVehicleSearch work and the prior VehicleQuickSearch checkbox alignment were preserved. No branch, index or dependency changes were made.

## Screenshots

Matched mobile pairs use Bulgarian, the same empty draft and a 390 × 844 browser viewport. Original JPEG captures are in `docs/mobile-search-overlays-2026-10-08/`:

| View | Before | After |
| --- | --- | --- |
| Home search | `before-home-390.jpg` | `after-home-390.jpg` |
| Main inventory filters | `before-filters-390.jpg` | `after-filters-390.jpg` |
| Make quick filter | `before-make-390.jpg` | `after-make-390.jpg` |
| Desktop inventory | `before-desktop-listing-1440.jpg` | `after-desktop-listing-1440.jpg` |
| Desktop filters | `before-desktop-filters-1440.jpg` | `after-desktop-filters-1440.jpg` |

`after-home-en-320.jpg` also records the smallest phone layout with the field focused. Desktop filter modal interior and inventory header regions compare pixel-identically; the full JPEGs have differences in the vehicle-photo background.

## Verification

Node 22.20.0; owned local audit server at `http://127.0.0.1:6465`.

| Check | Result |
| --- | --- |
| `npm run check` | 0 errors, 0 warnings |
| CSS policy, tokens and typography | Passed; pinned Inter/Fluent preserved |
| `npm run build`, including locale/source checks | Passed |
| Svelte autofixer review of seven edited components | Reviewed; existing unrelated href/effect/bind/key recommendations were retained |
| `mobile-search-viewport-smoke.mjs`, Chromium | 12/12 passed |
| Same viewport suite, `SEARCH_ENGINE=webkit` | 12/12 passed |
| `mobile-filter-smoke.mjs` | 4/4 complete filter journeys passed, including 320 × 677 and 700 × 390 |
| `mobile-reflow-smoke.mjs`, selected Home/filter/Make/price editors | 24/24 passed across BG/EN and 320/390/430px, including 200% root text, text spacing and short viewport |
| `overlay-controls-smoke.mjs`, Home/Sell/Import/finance/preferences cases | 42/42 passed, including applicable 768/1440px desktop controls |

Viewport tests simulate a 360px visible area panned by 32px while retaining the tall layout viewport. They verify frame position/height, input focus, scroll behavior and action reachability. Test reports remain under their named `artifacts/` suite directories.

Mobile text entry retains 16px or larger type. No viewport zoom restrictions were added. These are local browser and simulated-keyboard checks; physical iPhone keyboard/zoom behavior and hosted release acceptance remain unverified.
