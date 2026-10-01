# Desktop Home polish - 1 October 2026

Local review: <http://127.0.0.1:6461/bg>. The existing preview is owned by Node 22.20.0 and Vite on port 6461 in the canonical Cars template checkout.

## Changes

- `src/lib/components/home/Hero.svelte`: the desktop address uses a compact white badge and the existing location glyph, with separation from the search card.
- `src/lib/components/home/SearchBox.svelte` and `src/lib/components/listing/VehicleDiscoveryForm.svelte`: Home opts into an integrated vehicle-type selector inside the search bar. Make, model, body style, budget, year and mileage retain their six equal columns. Inventory retains its existing presentation and URL contract.
- `src/lib/components/home/TrustActions.svelte`: all four desktop banners use the existing artwork and measured opaque bounds. Cars fit inside the right edge, copy wraps naturally, and buttons share a baseline. The text column has enough room for single-line actions at 992px. Existing palette, artwork sources and destinations remain intact.

## Verification

- `npm run validate` passed after the final source edits: architecture, CSS policy, tokens, typography, assets, domain, locale catalog/source, Svelte diagnostics and production build. Svelte reported zero errors and zero warnings.
- `git diff --check` passed.
- `node scripts/workspace-doctor.mjs --fetch` completed from Cars. Unrelated Cars, Admin and Carwow work was preserved.
- Browser inspection and geometry checks passed for Bulgarian Home at 992, 1024, 1280, 1440 and 1920px, and English Home at 992, 1024 and 1440px. The form stays 152px high, its six facet columns are equal, location/search separation remains visible, and the four banners are 234px high with 44px actions and no copy/artwork overlap or cropped opaque vehicle bounds.
- All seven Home filters submitted together: car, Audi, RS 6 Avant, Wagon, price up to 70000 EUR, year from 2024 and mileage up to 100000 km. Inventory displayed the one matching Audi and retained its separate type control. Changing make reset model; desktop search Escape discarded the draft and returned focus.
- Bulgarian and English Home reflow passed at 320 and 390px. The existing mobile search/actions stay separate, the desktop location remains hidden, and the page has no horizontal overflow. Mobile search opening, dismissal and focus return passed at 390px.
- All four banner images loaded and their inventory/trade-in/import/leasing destinations were retained. The Browser reported no warnings or errors during the reviewed flows.

Final local evidence is in ignored `runtime/desktop-home-2026-10-01/`: `after-home.jpg`, `after-home-full.jpg`, `home-1024.jpg`, `home-mobile-390.jpg`, `browser-checks.json` and `validation.log`.

The pre-existing mobile styling changes in `docs/STYLING.md`, `ListingFilters.svelte`, `base.css` and `tokens.css` were preserved. These checks cover the local master and focused Home/search flows; hosted, mounted-dealer and physical-device acceptance are separate.
