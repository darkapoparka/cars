# Desktop hero and inventory search correction

Shared template work in the canonical `L:/CODEX/cars/templates/carwow` checkout on `main`, using Node 24.21.0 and the retained npm lockfile. This corrects desktop geometry and search hierarchy. Mobile compositions, dealer content, template releases and deployments are outside this change.

## Cause and correction

Home, the shared route hero and Inventory had independent minimum heights and vertical padding. Inventory removed the shared minimum entirely. The main desktop heroes now consume one geometry contract in `desktop-controls.css`; the conflicting Inventory and compact-hero spacing rules are removed.

Measured at 1440px:

| Composition         | Previous hero height | Current hero height | Previous title top offset | Current offset |
| ------------------- | -------------------: | ------------------: | ------------------------: | -------------: |
| Home                |                400px |               400px |                      36px |           36px |
| Inventory           |                351px |               400px |                      30px |           36px |
| Standard route hero |                390px |               400px |                      54px |           36px |
| Compact route hero  |                390px |               400px |                      40px |           36px |

Inventory previously placed six filter buttons and thirteen presets inside its search panel. The panel now has a search row and one row of Make, Model, Price, Mileage and More filters. The full dialog retains fuel, transmission, availability and extras. Five compact car-type shortcuts sit below the results count/sort toolbar: All, SUV, Sedan, Coupe and Van. Other selections remain visible as removable tags. Price and mileage tags use the option labels supplied by the page, including their existing translations.

The shared content frame, car-card density, single-line titles, specification badges, Home mode drafts, saved/compare state and retained presentation variants remain intact.

WebKit exposed a pre-existing 992px boundary failure on Sell: the selected desktop composition and its hero were hidden by the mobile CSS query as a native scrollbar reduced the layout width. The old scrollbar rule covered only six route shells. The document rule now follows `.site-chrome[data-daynight-site-chrome]` in the globally loaded desktop control stylesheet, covering all storefront routes. The duplicated six-shell rule is removed from `desktop-page-frame.css`. The class qualification excludes the mobile dock, which shares the data attribute. Native scrolling remains available.

## Verification

- Svelte checks, scoped ESLint/Prettier and the typography gate passed during implementation; the unit suite passed all 187 tests.
- The first production build passed 56 Chromium browser cases across hero consistency, search/filter focus and state, route geometry, service/blog navigation, car cards, Home modes, CSS loading and mobile composition boundaries.
- The final production build passed nine focused Chromium cases covering EN/BG selected-filter labels/removal, route resizing, Home's scrollbar boundary, retained variants and mobile composition/image requests.
- The final WebKit hero suite passed all ten cases in separate EN/BG runs (five each, both with clean exits). These compare all 18 standard routes against Home at 992, 1280, 1440 and 1920px and resize Sell, Contact, Reviews and Terms across 991/992px. Heights and title offsets match, typography matches, content fits and pages do not overflow horizontally.
- Fresh signatures from the final production build match the original nine main mobile routes at both 320px and 390px: 18 comparisons, zero differences.
- SHA-256 checks match for all 125 protected mobile, shared-data, asset and base-style files.

The geometry tests query and measure the current DOM in one browser call; an earlier element-handle read observed a replaced SSR element. A combined WebKit run passed all ten case assertions but hit its deadline during Windows worker/report teardown. Splitting the same cases by locale completed normally in about 51 seconds each. Earlier failures and the timeout logs remain in the audit folder.

The final production build passed with the narrowed desktop-header selector. Native browser inspection confirmed the five-control row and the full More filters dialog. `after-scoped/inventory-ready.png` shows the final inventory with its visible images loaded.

Local screenshots, measured hero geometry, paired mobile signatures, protected-file hashes and logs are in `.audit/desktop-hero-search-2026-10-02/`. Larger browser-test artifacts are stored in the fresh temporary directories recorded by the audit logs. The preview runs at `http://127.0.0.1:6464/en/inventory`; local verification does not promote a release or verify a hosted dealer.
