# Boxcar Updated

`boxcar-updated` · `2026.10.02-curated` · native Svelte 5 / Vite 8 · local preview port **6455**.

The default `/` homepage is the curated dealer composition: **Home 10's rounded touring hero, header and photographic body types, Home 5's white pill search and pastel service cards, Home 8's brand row, boxed vehicle shelf, journal and footer, and Home 2's photographic viewing banner**. The primary search sits directly beneath the hero title in the same content block. The compact header has centered Home / Cars / About / Contact navigation, Saved and a visible contact action. Sections follow a centered flow within a consistent desktop frame. Four service CTA cards open browsing, selling, comparison and the repayment calculator; the final photo banner opens a viewing enquiry.

The curated page reuses the preserved source DOM, SVGs, photography and layout CSS. Scoped responsive rules fit its combined sections, including a compact two-column search form on phones. Its vehicle shelf, search suggestions and detail links share the real 17-vehicle **sample** catalogue. Homepage and footer logos use `src/data/brand.ts`; journal cards use `src/data/journal.ts`. There are no copied dealer testimonials, invented review totals or inflated stock counts on this composition.

The hero search uses the source magnifier SVG at 22 px, aligned with its text label; source diagonal arrows use 20 px boxes. Carousel arrows have centered 24 px SVGs inside 48 px buttons. The service section adapts Home 5's actual buy/sell card DOM, original SVG artwork and blue/pink backgrounds into four centered cards with aligned CTA buttons. The next-car section adapts Home 2's original photograph and CTA DOM. Body choices use the original Home 10 side-on photographs for four populated catalogue categories; the compact-car illustration is labelled Hatchback. Curated save buttons handle clicks in capture before Slick's delegated click handler; the carousel remains finite. Sample listing `4690` is labelled Bentley Bentayga — Silver to match its photograph; its existing `mercedes-glc` URL remains for reference-link compatibility.

The ten homepages preserve the original DOM structure, whitespace, section copy, photographs, SVGs, local fonts and layout CSS from the [Boxcar HTML public preview](https://creativelayers.net/themes/boxcar-html/). The captured markup is compiled into Svelte components. Native actions implement menus, tabs and search. A Svelte lifecycle action retains the source's **jQuery and Slick slider core** for faithful carousel behavior. Homepage modules load separately; this is not a complete rewrite of every vendor dependency.

The ten original **HTML** homes remain separate design references. The existing `templates/boxcar` WordPress capture remains its own template. Inventory, vehicle details and other supporting routes retain the adapted Svelte layouts; they have not been ported to the original inner-page DOM. WordPress plugins, accounts and backend services are outside this candidate.

## Internal homepage references

| Home | Composition                                       | Entry       |
| ---- | ------------------------------------------------- | ----------- |
| 01   | Mountain photo, centred search                    | `/home-1/`  |
| 02   | Featured vehicle, working slide controls          | `/home-2/`  |
| 03   | City photo, pill search and body categories       | `/home-3/`  |
| 04   | Luxury photo and glass specification panel        | `/home-4/`  |
| 05   | Pale background, search and vehicle cutout        | `/home-5/`  |
| 06   | Angular showroom photo and inventory count        | `/home-6/`  |
| 07   | Inset photo, centred header and floating search   | `/home-7/`  |
| 08   | Electric photo, vertical search panel             | `/home-8/`  |
| 09   | Lifestyle photo, upper search and lower headline  | `/home-9/`  |
| 10   | Touring photo, compact header and floating search | `/home-10/` |

The original demonstration menus remain inside those reference pages. `/` and `index.html` open the curated dealer home; `index-2.html` through `index-10.html` resolve to their original homes. Source marketing figures and example reviews remain inside the preserved references, with a short fixture disclosure. The curated dealer navigation does not expose a ten-home configuration menu.

## Dealer presentation

The curated default now selects **one homepage, one inventory presentation and one vehicle detail layout**, with ordinary dealer navigation. The ten homepage presets remain in the library for internal reference. A lead receives a complete dealer presentation, rather than a theme configuration exercise.

The captured Inventory v1/v2, map and sidebar menu labels inside the references currently lead to the same adapted `/inventory/` page. They are not separately ported original layouts. Per-dealer content/assets, locale and units, mounted routes, the existing Cars design switcher, generator/release support and a verified dealer pilot remain prerequisites for fleet promotion.

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
- `npm run verify:curated` checks the new default at 1440, 1024, 768, 390 and 320 px; lazy image loading, hero make/model/condition/price filters, keyboard dropdowns, vehicle tabs/sliders, saved state, detail/Back context and ordinary dealer navigation. Additional geometry checks at those widths and 304 px verify button/icon alignment, four service cards in 4/2/1 columns, centered artwork and aligned CTAs. Each service and viewing action is clicked at desktop and 320 px. The ten preserved homepage sources must retain their recorded hashes.
  Long selected make/model labels are checked at both phone widths. Carousel controls must remain centered, at least 44 px tall and clear of the stock link. The dealer shelf stays finite so Slick does not clone stateful Svelte buttons; bookmark clicks and Space activation are both checked.
- `npm run verify:inner` checks nine supporting pages at three widths and all 17 vehicle details at desktop and 320 px.

Set `BOXCAR_BROWSER=webkit` to repeat with Playwright WebKit. Comparison output is ignored under Cars' `runtime/boxcar-updated-parity/`; supporting-page output is under the template's ignored `qa/<engine>/`. The original fixed-pixel typography has not been accepted for 200% text accessibility.

## Application behavior

- Curated homepage search: one white source-style search panel beneath the headline, with condition, make, model and maximum-price dropdowns. It uses a horizontal pill on desktop and two rows of fields on phones. Selecting a make resets the model choices; Search opens matching URL-driven inventory. Its header has no competing keyword field; keyword search remains available in inventory.
- Preserved homepage header search: clicking or focusing the empty field displays six sample vehicles with their photos and prices. Typing filters those suggestions; clearing the query restores the initial choices. Arrow keys and Enter open the selected detail; Enter without a selection and the View all link open inventory with the current query, or all stock when empty. Escape, outside clicks and moving keyboard focus outside dismiss suggestions. The preserved original homes hide the header field at 1440 px and below. Results use the shared catalogue instead of repeated placeholder entries.
- Header search focus follows the input method: mouse clicks preserve the source panel appearance; Tab and arrow navigation show a neutral inset indicator. The View all keyboard indicator remains inside the rounded results panel.
- `/inventory/`: URL-driven keyword, make/model, condition, body, fuel, year and price filters; sorting, pagination and grid/list views.
- Curated stock: All / New / Used tabs, three large cards on desktop, two on tablets and one on phones, with year/body/engine summaries, compact specifications, price and detail actions. The finite source-style carousel has working save buttons. Its clipped viewport prevents native WebKit focus scrolling from shifting the track; slider arrows and touch gestures still control the visible cards.
- `/vehicle/<slug>/`: model photos, specification overview, related cars, enquiry preview and repayment estimate. `return` keeps the browsing context; browser Back restores scroll.
- `/favorites/` and `/compare/`: native Svelte state persisted in this browser. Comparison accepts at most four cars and supports removal and clearing.
- `/calculator/`: amortized repayment estimates with zero-interest and full-deposit handling, valid-input checks and clear illustration copy.
- `/contact/`, `/contact/?intent=sell`, `/about/`, `/blog/`, `/blog/<slug>/`, `/faq/`, `/terms/`: shared supporting journeys.

Enquiry and newsletter forms show a local preview. Contact input is not persisted or delivered. There is no WordPress, account, booking, finance provider or mail service attached to this candidate.

## Personalization boundaries

`src/reference/CuratedHome.svelte`, `CuratedStock.svelte` and `CuratedCarCard.svelte` own the dealer homepage. `public/reference/curated.css` scopes its composition and responsive adjustments. `scripts/compose-curated.mjs` reproducibly selects the recorded source chunks, with the curated copy and bindings; it writes only the curated homepage and its provenance receipt. Update the composition script when changing generated homepage copy, then regenerate. Stock/card components remain directly editable.

`src/reference/Home1.svelte` through `Home10.svelte` retain the original compositions. `public/reference/css/style.css`, the source theme variables and `public/media/` own their appearance. `src/reference/interactions.ts` supplies native controls; `src/reference/header-search.ts` binds the source-shaped header dropdown to the shared catalogue. `src/reference/carousel.ts` loads the two local slider dependencies and destroys sliders on unmount. Offscreen lazy images no longer delay slider initialization or Back restoration.

`src/data/brand.ts` owns identity and contacts on the curated home and adapted inner pages. `src/data/homes.ts` registers internal reference names/routes and recognizes the curated root for navigation restoration. `src/data/vehicles.json` owns the working sample stock and detail destinations; `src/data/journal.ts` owns buyer guidance. The ten preserved reference pages retain their source identity; they are internal references, not ten personalized dealer options. Review every public logo/contact consumer when adapting the curated design.

All 17 catalogue vehicles are samples. The adapted catalogue matches pictured makes/models and retains original IDs and legacy routes. Prices, years, mileage and specifications are illustrative. The five-image Volvo gallery contains model previews in different colours. Original homepage shelves, stock counts, reviews, staff and showroom copy are also illustrative reference content. Replace these inputs with verified dealer facts before use.

## Reference, ownership and acceptance

[`.template/curated.json`](.template/curated.json) records the selected source homes and their hashes, composition choices and retained reference routes. [`.template/reference.json`](.template/reference.json) records the original research captures. [`.template/port.json`](.template/port.json) records the source and generated Svelte hashes, section classes and missing optional source backgrounds. [`.template/assets.json`](.template/assets.json) records imported asset URLs, sizes, hashes and CSS transformations. Raw captures live in Cars' ignored `runtime/boxcar-updated-reference/`.

`scripts/port-reference.mjs` regenerates the ten compiled homepage sources from those archived HTML files; `--refresh-assets` refreshes original styles, fonts and pictures. It reads carousel options as syntax data without executing JavaScript at build time, and extracts the original Slick core without automatic demo initialization. CSS changes localize asset URLs, replace unused missing dependencies, and preserve label appearance for custom controls. A narrow WebKit compatibility rule fixes the flex image width in horizontal vehicle cards mounted by Svelte. Regeneration overwrites homepage personalization, so use it during template research before adapting a dealer. Production renders compiled Svelte markup, retains the local slider libraries and loads Home 06's illustrative map embed when it enters view.

Reference assets retain their existing ownership. No new ThemeForest purchase or multi-client rights determination was made. The owner must check existing entitlement and image rights before commercial reuse.

This is a **curated candidate** in the Cars catalogue. Owner visual acceptance, an immutable approved template release and dealer-generator support remain separate from local source/build/browser verification. See [the dated evidence](../../docs/boxcar-updated/QA.md) and [Cars QA](../../docs/QA.md).
