# Desktop discovery details — 2026-10-02

The Home inventory preview retained its left-aligned heading and heading CTA. Its shortcut links only occupied part of the content frame. Inventory and Services used greedy wrapping, which left a single link on the final row. The header-search dialog retained an underline-only field and important header utility overrides. Global element typography also prevented nested labels and the YouTube logo wrapper from inheriting their component fonts. The logo's padded source canvas made its visible mark smaller and more distant from the heading than its CSS dimensions suggested.

## Changed behavior

- Newest cars: centered heading, nine full-width shortcut links, and a final inventory-browse card. Four-column desktop previews contain seven vehicles plus that card; five-column previews contain nine vehicles plus that card. Vehicle titles, badges, pricing and actions retain their existing hierarchy.
- Inventory: two full-width shortcut groups, keeping all 13 filters, URL behavior, selected/remove states and keyboard focus. Content-aware grid tracks preserve readable labels.
- Services: the six hero shortcuts form two compact rows of three. The service catalogue retains five cards per desktop row and existing request preselection.
- Header search: a complete 54px rounded field frame with a 44px trailing action. The adapter lives inside the existing desktop-only media boundary in `desktop-controls.css`. Search markup, query submission and modal lifecycle are unchanged.
- YouTube: proportional desktop CSS clips the retained logo's surrounding canvas padding. The source asset, three equal thumbnails, accessible titles and activation-only players remain intact.

No mobile component, shared data, branding asset or base token was edited. Local evidence is in `.audit/desktop-discovery-details-2026-10-02/`.

## Verification

- Node 24.21.0 and the retained npm lockfile.
- Svelte checks: zero errors and warnings.
- Scoped ESLint and typography checks: passed.
- Unit tests: all 187 tests across 22 files passed.
- Protected source comparison: 125 files, zero changes.
- Production build: passed, using the existing Vercel adapter. The final preview runs on port 6464 with Node 24.21.0; Home, Inventory and Services returned HTTP 200.
- Chromium verification: all 42 current cases verified across the final suite and focused rerun. These cover EN/BG discovery, 992/1280/1440/1920px desktop geometry, header-search border and keyboard submission, card hierarchy, navigation, modal focus, services preselection, blog filtering, composition boundaries, JavaScript-disabled desktop styling and mobile image requests.
- Mobile comparisons: Home, Inventory and Services at 320px and 390px matched the baseline exactly across all six geometry/style signatures.
- Native in-app browser: inspected the rebuilt search overlay, inventory pill groups, service shortcuts and loaded cards, and YouTube heading with three equal thumbnails.
- Scoped formatting and `git diff --check`: passed.

The first browser run exposed the remaining header utility override; the desktop adapter now wins that cascade without changing shared search markup. The final suite passed 32 of 35 cases. One eight-viewport filter journey exceeded its aggregate time limit, while two screenshot writes failed with `ENOSPC` as L: ran out of space. The filter journey now has separate locale/viewport cases with the same assertions. All ten affected/restructured cases then passed with raw runner output at `C:/Users/radev/AppData/Local/Temp/cars-carwow-desktop-discovery-2026-10-02-01a0f54d/`. Its log is copied to the project audit directory. No failure evidence was deleted.

The completed baseline is in `before-ready/` and final captures are in `after-final/`. `services-settled.png` waits for all six images to decode. Earlier capture attempts stopped when the sticky header hid its top-row search trigger; their partial screenshots and logs are retained. The completed capture scrolls back to the top before opening search.

This task changes reusable template source on main. It does not promote a template release, refresh dealer copies or verify hosted pages.
