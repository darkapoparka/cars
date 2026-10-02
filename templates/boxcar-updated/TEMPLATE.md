# Boxcar Updated

`boxcar-updated` · `2026.10.02-native-10-homes` · native Svelte 5 / Vite 8 · local preview port **6455**.

The ten homepages preserve the original DOM structure, whitespace, section copy, photographs, SVGs, local fonts and layout CSS from the [Boxcar HTML public preview](https://creativelayers.net/themes/boxcar-html/). The captured markup is compiled into Svelte components. Native actions implement menus, tabs and search. A Svelte lifecycle action retains the source's **jQuery and Slick slider core** for faithful carousel behavior. Homepage modules load separately; this is not a complete rewrite of every vendor dependency.

This is the ten-home **HTML** design reference. The existing `templates/boxcar` WordPress capture remains its own template. Inventory, vehicle details and other supporting routes retain the adapted Svelte layouts; they have not been ported to the original inner-page DOM. WordPress plugins, accounts and backend services are outside this candidate.

## Homepage choices

| Home | Composition | Entry |
| --- | --- | --- |
| 01 | Mountain photo, centred search | `/` |
| 02 | Featured vehicle, working slide controls | `/home-2/` |
| 03 | City photo, pill search and body categories | `/home-3/` |
| 04 | Luxury photo and glass specification panel | `/home-4/` |
| 05 | Pale background, search and vehicle cutout | `/home-5/` |
| 06 | Angular showroom photo and inventory count | `/home-6/` |
| 07 | Inset photo, centred header and floating search | `/home-7/` |
| 08 | Electric photo, vertical search panel | `/home-8/` |
| 09 | Lifestyle photo, upper search and lower headline | `/home-9/` |
| 10 | Touring photo, compact header and floating search | `/home-10/` |

The Home menu and native mobile drawer link to these actual routes. `index.html` and `index-2.html` through `index-10.html` also resolve locally. Visible source marketing figures and example reviews remain part of the reference design. A short footer disclosure identifies the demo content; search leads into the working 17-vehicle sample catalogue.

## Dealer presentation

This library preview keeps the original theme's demonstration navigation. A lead proposal should select **one homepage, one inventory presentation and one vehicle detail layout**, with ordinary Home / Cars / About / Contact navigation and the existing Cars design switcher. Retain the ten homepage presets in the library for internal selection; do not ask a lead to configure the whole theme before showing a complete dealer website.

The captured Inventory v1/v2, map and sidebar menu labels currently lead to the same adapted `/inventory/` page. They are not separately ported original layouts and should not be offered as implemented dealer choices. Dealer navigation cleanup, profile-driven homepage assets/content and Cars generator/release support remain prerequisites for promotion.

## Run and checks

Use Node **22.23.2** (minimum 22.18 for the native TypeScript test runner), the checked-in lockfile and an independent install:

```powershell
cd L:/CODEX/cars/templates/boxcar-updated
npm ci
npm run check
npm test
npm run build
```

Start from Cars with the existing launcher on a free port:

```powershell
./scripts/start-preview.ps1 -Template boxcar-updated -Port 6455 -NodePath C:/Users/radev/AppData/Local/nvm/v22.23.2/node.exe
```

The Vite development preview is [http://127.0.0.1:6455/](http://127.0.0.1:6455/). A production build creates `dist/`; `vercel.json` supplies SPA route fallback for an eventual deployment.

With the local preview running:

- `npm run verify` compares all ten homepages with a locally rendered fixture of the archived source HTML and vendor scripts at 1440, 390 and 320 px. It checks section geometry, first-viewport pixel differences, image/font loading and document width. The fixture executes the full original demo script set; production retains the local jQuery/Slick slider dependencies.
- `npm run verify -- --full` also records full-page comparisons for Homes 01, 03, 07 and 10 at desktop width. Pixel differences and section geometry are evidence, not a declaration of whole-site parity.
- `npm run verify:flows` exercises header suggestions across all ten homes, inventory search, keyboard tabs/dropdowns, sliders, featured destinations, Back/scroll restoration, mobile nested navigation and newsletter previews.
- `npm run verify:inner` checks nine supporting pages at three widths and all 17 vehicle details at desktop and 320 px.

Set `BOXCAR_BROWSER=webkit` to repeat with Playwright WebKit. Comparison output is ignored under Cars' `runtime/boxcar-updated-parity/`; supporting-page output is under the template's ignored `qa/<engine>/`. The original fixed-pixel typography has not been accepted for 200% text accessibility.

## Application behavior

- Homepage header search: typing displays up to six matching sample vehicles with their photos and prices. Arrow keys and Enter open the selected detail; Enter without a selection and the View all link open filtered inventory. Escape, outside clicks and moving keyboard focus outside dismiss suggestions. The original theme hides this header field at 1440 px and below; the hero make/model search remains available. Results use the shared catalogue instead of the original four repeated placeholder entries.
- `/inventory/`: URL-driven keyword, make/model, condition, body, fuel, year and price filters; sorting, pagination and grid/list views.
- `/vehicle/<slug>/`: model photos, specification overview, related cars, enquiry preview and repayment estimate. `return` keeps the browsing context; browser Back restores scroll.
- `/favorites/` and `/compare/`: native Svelte state persisted in this browser. Comparison accepts at most four cars and supports removal and clearing.
- `/calculator/`: amortized repayment estimates with zero-interest and full-deposit handling, valid-input checks and clear illustration copy.
- `/contact/`, `/contact/?intent=sell`, `/about/`, `/blog/`, `/blog/<slug>/`, `/faq/`, `/terms/`: shared supporting journeys.

Enquiry and newsletter forms show a local preview. Contact input is not persisted or delivered. There is no WordPress, account, booking, finance provider or mail service attached to this candidate.

## Personalization boundaries

`src/reference/Home1.svelte` through `Home10.svelte` own the visible homepage copy and original composition. `public/reference/css/style.css`, the source theme variables and `public/media/` own homepage appearance. `src/reference/interactions.ts` supplies native controls; `src/reference/header-search.ts` binds the original header dropdown to the shared catalogue. `src/reference/carousel.ts` loads the two local slider dependencies and destroys sliders on unmount.

`src/data/brand.ts` owns identity and contacts on the adapted inner pages, not every homepage consumer. `src/data/homes.ts` registers homepage names/routes. `src/data/vehicles.json` owns the working sample stock and detail destinations; `src/data/journal.ts` owns adapted buyer guidance. Personalizing a dealer requires updating both reference homepages and shared inner-page identity, with a review of all logo/contact consumers.

All 17 catalogue vehicles are samples. The adapted catalogue matches pictured makes/models and retains original IDs and legacy routes. Prices, years, mileage and specifications are illustrative. The five-image Volvo gallery contains model previews in different colours. Original homepage shelves, stock counts, reviews, staff and showroom copy are also illustrative reference content. Replace these inputs with verified dealer facts before use.

## Reference, ownership and acceptance

[`.template/reference.json`](.template/reference.json) records the original research captures. [`.template/port.json`](.template/port.json) records the source and generated Svelte hashes, section classes and missing optional source backgrounds. [`.template/assets.json`](.template/assets.json) records imported asset URLs, sizes, hashes and CSS transformations. Raw captures live in Cars' ignored `runtime/boxcar-updated-reference/`.

`scripts/port-reference.mjs` regenerates the ten compiled homepage sources from those archived HTML files; `--refresh-assets` refreshes original styles, fonts and pictures. It reads carousel options as syntax data without executing JavaScript at build time, and extracts the original Slick core without automatic demo initialization. CSS changes localize asset URLs, replace unused missing dependencies, and preserve label appearance for custom controls. A narrow WebKit compatibility rule fixes the flex image width in horizontal vehicle cards mounted by Svelte. Regeneration overwrites homepage personalization, so use it during template research before adapting a dealer. Production renders compiled Svelte markup, retains the local slider libraries and loads Home 06's illustrative map embed when it enters view.

Reference assets retain their existing ownership. No new ThemeForest purchase or multi-client rights determination was made. The owner must check existing entitlement and image rights before commercial reuse.

This is a **reference-content candidate** in the Cars catalogue. Owner visual acceptance, an immutable approved template release and dealer-generator support remain separate from local source/build/browser verification. See [the dated evidence](../../docs/boxcar-updated/QA.md) and [Cars QA](../../docs/QA.md).
