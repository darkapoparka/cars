# Desktop Home polish - 1 October 2026

Local review: <http://127.0.0.1:6461/bg>. The existing preview is owned by Node 22.20.0 and Vite on port 6461 in the canonical Cars template checkout.

## Changes

- `src/lib/components/home/Hero.svelte`: the desktop address uses a compact white badge and the existing location glyph, with separation from the search card.
- `src/lib/components/home/SearchBox.svelte` and `src/lib/components/listing/VehicleDiscoveryForm.svelte`: Home places vehicle type below the search bar with make, model, body style, budget, year and mileage. All seven controls have equal columns from 992px; tablet uses two rows. Inventory retains its separate toolbar type selector and URL contract.
- `src/routes/+page.svelte`: the four desktop section banners use 112px headers with left-aligned titles and right-aligned 44px actions, joined directly to the white content panels. The geometry override belongs to Home and applies from 992px.
- `src/lib/components/home/BodyTypes.svelte` and `BrandSection.svelte`: desktop tiles use defined edges and white surfaces. Visible artwork bounds align the body-type cars consistently; existing assets, labels and destinations are retained.
- `src/lib/components/home/TrustActions.svelte`: all four desktop banners use the existing artwork and measured opaque bounds. Cars fit inside the right edge, copy wraps naturally, and buttons share a baseline. The text column has enough room for single-line actions at 992px. Existing palette, artwork sources and destinations remain intact.

## Verification

- `npm run validate` passed after the final source edits: architecture, CSS policy, tokens, typography, assets, domain, locale catalog/source, Svelte diagnostics and production build. Svelte reported zero errors and zero warnings.
- `git diff --check` passed.
- `node scripts/workspace-doctor.mjs --fetch` completed from Cars. Unrelated Cars, Admin and Carwow work was preserved.
- Browser inspection and geometry checks passed for Bulgarian Home at 992, 1024, 1440 and 1920px, and English Home at 992 and 1440px. All seven facet columns are equal and type sits below search. All four section headers are 112px with 44px actions, clear title/action separation and no horizontal overflow. Tablet reflow also passed at 768 and 991px. The existing campaign artwork and palette were retained; visible Home images loaded and discovery tiles had no horizontal overflow.
- All seven Home filters submitted together: car, Audi, RS 6 Avant, Wagon, price up to 70000 EUR, year from 2024 and mileage up to 100000 km. Inventory displayed the one matching Audi and retained its separate type control. Changing make reset model; desktop search Escape discarded the draft and returned focus.
- Bulgarian and English Home reflow passed at 320 and 390px. Desktop discovery remains hidden and the page has no horizontal overflow. Mobile search opening, dismissal and focus return passed at 390px. Concurrent mobile entry-field work was preserved and remains outside this desktop change.
- All four banner images loaded and their inventory/trade-in/import/leasing destinations were retained. The Browser reported no warnings or errors during the reviewed flows.

The matched review starts from the rendered Home at `f86cce6f0`. Final local evidence is in ignored `runtime/desktop-home-review-2026-10-01/`: `before-home.jpg`, `after-home.jpg`, `before-sections.jpg`, `after-sections.jpg`, full-page captures, `browser-checks.json` and `validation.log`. Both comparison pairs use 1440 by 900px with fonts loaded. The section pair aligns the same body-type banner at 40.48px from the viewport top.

Unrelated Cars and mobile work was preserved. Only the desktop Home source changes and this report belong to the scoped commit. These checks cover the local master and focused Home/search flows; hosted, mounted-dealer and physical-device acceptance are separate.
