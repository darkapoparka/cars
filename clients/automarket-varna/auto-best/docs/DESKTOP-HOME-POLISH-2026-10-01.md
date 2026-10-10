# Desktop Home polish - 1 October 2026

Local review: <http://127.0.0.1:6461/bg>. The existing preview is owned by Node 22.20.0 and Vite on port 6461 in the canonical Cars template checkout.

## Changes

- `src/lib/components/home/Hero.svelte`: the desktop address uses a compact white badge and the existing location glyph, with separation from the search card.
- `src/lib/components/home/SearchBox.svelte` and `src/lib/components/listing/VehicleDiscoveryForm.svelte`: Home places vehicle type below the search bar with make, model, body style, budget, year and mileage. All seven controls have equal columns from 992px; tablet uses two rows. Inventory retains its separate toolbar type selector and URL contract.
- `src/routes/+page.svelte`: the four desktop section headers now use 208px photographic banners. Localized titles and 44px white actions sit together on the left; the artwork occupies the right. The body-type section uses the same charcoal surface as the other headers, replacing the rejected pale blue. Geometry belongs to Home and applies from 992px.
- `src/lib/components/home/SectionBannerArtwork.svelte` and `src/lib/config/lead-site.ts`: four distinct generated studio images cover featured cars, body styles, automotive detail and buying guides. A desktop-only picture source selects the artwork, with a one-pixel transparent fallback below 992px. HTML retains all copy and navigation. [Assets, final prompts and built-in imagegen mode](../provenance/home-section-banners-2026-10-01.md) record provenance.
- `src/lib/components/home/BodyTypes.svelte` and `BrandSection.svelte`: desktop tiles use defined edges and white surfaces. Visible artwork bounds align the body-type cars consistently; existing assets, labels and destinations are retained.
- `src/lib/components/home/TrustActions.svelte`: all four desktop banners use the existing artwork and measured opaque bounds. Cars fit inside the right edge, copy wraps naturally, and buttons share a baseline. The text column has enough room for single-line actions at 992px. Existing palette, artwork sources and destinations remain intact.

## Banner revision verification

- `npm run validate` passed after the final source edits: architecture, CSS policy, tokens, typography, assets, domain, locale catalog/source, Svelte diagnostics and production build. Svelte reported zero errors and zero warnings.
- Scoped `git diff --check` passed.
- `node scripts/workspace-doctor.mjs --fetch` completed from Cars. Unrelated Cars, Admin and template work was preserved.
- Bulgarian and English Home passed at 992, 1024, 1440 and 1920px. All four headers measured 208px with 44px actions, contained text/actions, clear vertical separation and no horizontal overflow. The longer Bulgarian headings wrap naturally at 992/1024px. All four generated images loaded when browsed.
- Bulgarian and English Home passed at 320 and 390px with the existing 44px compact section headings and no horizontal overflow. All four picture elements are hidden and select the transparent data URI. English mobile body-style expansion still revealed Sportback.
- The body-style banner action reached inventory, the buying-guide banner action reached Blog, and the SUV tile reached `listing-grid?body=SUV` with SUV selected and four records. Existing manufacturer, inventory and editorial paths were retained.
- The Browser reported no warnings or errors during the reviewed flows. No contact form was submitted.

Final local banner evidence is in ignored `runtime/desktop-home-artwork-2026-10-01/`: `before-inventory.jpg` / `after-inventory.jpg`, `before-sections.jpg` / `after-sections.jpg`, final Brand/Guides and full-page captures, `browser-checks.json`, `validation.log`, original PNG copies and conversion metadata. Both matched pairs use 1440 by 900px with loaded fonts and the same featured/body-type heading approximately 40px below the viewport top. Before images were captured at `00b1c8290` before this banner revision. Other tasks' mobile input/typography commits landed on main during this review and were preserved.

The earlier search/location/campaign review remains in `runtime/desktop-home-review-2026-10-01/`; its checks cover the seven-filter GET submission, dependent make/model reset and editor Escape/focus return. This revision changes section presentation, keeping those controls and their source intact.

Unrelated Cars and mobile work was preserved. The scoped change contains the four desktop section consumers, decorative artwork component, configuration, Home geometry, four optimized images, asset inventory guard, provenance and this report. These checks cover the local master and focused Home flows; hosted, mounted-dealer and owner visual acceptance remain separate.
