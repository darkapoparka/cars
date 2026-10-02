# Boxcar Updated

`boxcar-updated` · `2026.10.02-curated` · native Svelte 5 / Vite 8 · local preview port **6455**.

The default `/` homepage is the curated dealer composition: **Home 10's rounded touring hero, header and photographic body types, Home 5's white pill search and pastel service cards, Home 8's brand row, boxed vehicle cards, journal and footer, and Home 2's photographic viewing banner**. The primary search is centered horizontally and vertically in the desktop photograph, with the hero title directly above. The compact header has centered Home / Cars / About / Contact navigation, Saved and a visible contact action. Sections follow a centered flow within a consistent desktop frame. Four service CTA cards open browsing, selling, comparison and the repayment calculator; the final photo banner opens a viewing enquiry.

The curated page reuses the preserved source DOM, SVGs, photography and layout CSS. Scoped responsive rules fit its combined sections, including a compact two-column search form on phones. `App.svelte` renders one shared `Header.svelte` on the curated homepage and every supporting dealer page. It preserves Home 10's centered navigation, dark logo, Saved link, solid contact action and two-line mobile menu icon. Component-scoped styles and a separately named face for the original DM Sans font keep its geometry identical when the page stylesheets change. The ten original reference homes retain their captured headers. Its vehicle shelf, search suggestions and detail links share the real 17-vehicle **sample** catalogue. Homepage and footer logos use `src/data/brand.ts`; journal cards use `src/data/journal.ts`. There are no copied dealer testimonials, invented review totals or inflated stock counts on this composition.

The hero search uses the source magnifier SVG at 22 px, aligned with its text label; source diagonal detail arrows use 20 px boxes. Latest stock uses a static grid of four compact cards across and two rows at desktop width, followed by one solid blue View all cars button without an icon. The grid has three columns at smaller desktop widths, two on tablets, and shows four single-column cards on phones. There are no curated carousel controls or cloned cards; save buttons use ordinary Svelte click handlers. The service section adapts Home 5's actual buy/sell card DOM, original SVG artwork and blue/pink backgrounds into four centered cards with aligned CTA buttons. The next-car section adapts Home 2's original photograph and CTA DOM. Body choices use the original Home 10 side-on photographs for four populated catalogue categories; the compact-car illustration is labelled Hatchback. Sample listing `4690` is labelled Bentley Bentayga — Silver to match its photograph; its existing `mercedes-glc` URL remains for reference-link compatibility.

The ten homepages preserve the original DOM structure, whitespace, section copy, photographs, SVGs, local fonts and layout CSS from the [Boxcar HTML public preview](https://creativelayers.net/themes/boxcar-html/). The captured markup is compiled into Svelte components. Native actions implement menus, tabs and search. A Svelte lifecycle action retains the source's **jQuery and Slick slider core** for faithful carousel behavior. Homepage modules load separately; this is not a complete rewrite of every vendor dependency.

The ten original **HTML** homes remain separate design references. The existing `templates/boxcar` WordPress capture remains its own template. About uses one centered page title and a short introduction above the original five-image gallery and illustrated benefits; Contact adapts its title, form boxes and bordered contact column. Five original About photographs and four original SVG illustrations are local assets. These pages use scoped source-derived layout rules and dealer copy; they do not reproduce the source's invented statistics, staff identities or reviews. Contact uses a showroom photograph instead of the unrelated source map. Inventory keeps its working Svelte filters, with source card typography, the original specification icon font, proper grid/list icons and larger detail arrows. Vehicle details and the remaining supporting bodies keep their existing adapted layouts. WordPress plugins, accounts and backend services are outside this candidate.

About's four benefits sit in one centered row on desktop, two columns on tablets and one column on phones. Concise, balanced descriptions wrap naturally to two lines at the checked 320–1440 px widths; text is not clamped. Phones keep the original illustrations alongside the text. The About contact CTA opens the dedicated Contact page.

Contact is the home for the full map, directions, phone and social links. Personalize `src/data/brand.ts`: set `showroomMap` to `{ address, embedUrl, directionsUrl }` using the dealer's verified address and provider iframe/directions URLs; set `phone` and the actual `contactEmail`; populate `socialLinks` with `{ platform, url }` entries. Supported platforms are Facebook, Instagram, YouTube, TikTok and LinkedIn, using the original local Boxcar brand-icon font and visible labels. The map replaces the sample showroom photograph. Empty map/phone/social fields stay hidden, and the example email is not a mail link. This generic candidate has no verified address or social profiles; no donor business location or placeholder social destination is presented as a real dealer connection.

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
- `npm run verify:curated` checks the new default at 1440, 1024, 768, 390 and 320 px; lazy image loading, hero make/model/condition/price filters, keyboard dropdowns, vehicle tabs, saved state, detail/Back context and ordinary dealer navigation. It checks the 4/3/2/1 stock columns, eight desktop or four phone cards, absence of carousel controls, aligned card footers and the centered solid browse button. The search must be vertically centered in the photograph at desktop/tablet widths and 20–40 px below its headline. Additional geometry checks at those widths and 304 px verify button/icon alignment, four service cards in 4/2/1 columns, centered artwork and aligned CTAs. The stock button, each service and the viewing action are clicked at desktop and 320 px. The ten preserved homepage sources must retain their recorded hashes.
  Long selected make/model labels are checked at both phone widths. Bookmark clicks and Space activation are both checked after switching condition tabs. A twelfth journey compares the header geometry and contact styling across Home, Cars, About and Contact navigation at all five widths, plus direct loads of eleven supporting routes at desktop and 320 px. The mobile drawer must dismiss with Escape, return focus and close after navigation.
- `npm run verify:inner` checks nine supporting pages at three widths and all 17 vehicle details at desktop and 320 px.

Set `BOXCAR_BROWSER=webkit` to repeat with Playwright WebKit. Comparison output is ignored under Cars' `runtime/boxcar-updated-parity/`; supporting-page output is under the template's ignored `qa/<engine>/`. The original fixed-pixel typography has not been accepted for 200% text accessibility.

## Application behavior

- Shared dealer header: Home / Cars / About us / Contact, Saved and the same blue Contact us action on every dealer page. The active page is marked in the navigation; the same mobile drawer serves the homepage, inventory and supporting pages. It closes on route changes and native Escape dismissal restores the opener's focus.
- Curated homepage search: one white source-style search panel beneath the headline, with condition, make, model and maximum-price dropdowns. Its horizontal desktop/tablet pill is centered vertically in the hero photograph; phones use two rows of fields in normal flow beneath the title. Selecting a make resets the model choices; Search opens matching URL-driven inventory. Its header has no competing keyword field; keyword search remains available in inventory.
- Preserved homepage header search: clicking or focusing the empty field displays six sample vehicles with their photos and prices. Typing filters those suggestions; clearing the query restores the initial choices. Arrow keys and Enter open the selected detail; Enter without a selection and the View all link open inventory with the current query, or all stock when empty. Escape, outside clicks and moving keyboard focus outside dismiss suggestions. The preserved original homes hide the header field at 1440 px and below. Results use the shared catalogue instead of repeated placeholder entries.
- Header search focus follows the input method: mouse clicks preserve the source panel appearance; Tab and arrow navigation show a neutral inset indicator. The View all keyboard indicator remains inside the rounded results panel.
- `/inventory/`: URL-driven keyword, make/model, condition, body, fuel, year and price filters; sorting, pagination and grid/list views.
- Curated stock: All / New / Used tabs and source Boxcar cards with year/body/engine summaries, compact specifications, price, details and native save actions. Eight cards form two rows of four on desktop; the responsive grid uses three or two columns at intermediate widths and four single-column cards on phones. One solid View all cars button opens inventory. This section has no carousel or chevrons.
- `/vehicle/<slug>/`: model photos, specification overview, related cars, enquiry preview and repayment estimate. `return` keeps the browsing context; browser Back restores scroll.
- `/favorites/` and `/compare/`: native Svelte state persisted in this browser. Comparison accepts at most four cars and supports removal and clearing.
- `/calculator/`: amortized repayment estimates with zero-interest and full-deposit handling, valid-input checks and clear illustration copy.
- `/contact/`, `/contact/?intent=sell`, `/about/`, `/blog/`, `/blog/<slug>/`, `/faq/`, `/terms/`: shared supporting journeys.

The contact form preselects the selling/viewing subject from its entry URL. Required fields prevent empty previews; changing an input clears the feedback. Contact details stay illustrative and the form does not send or store a visitor's message. Inventory card destinations react to query changes, so filters, sorting, pagination and the selected grid/list view remain in the return URL even when the same card stays on screen.

Enquiry and newsletter forms show a local preview. Contact input is not persisted or delivered. There is no WordPress, account, booking, finance provider or mail service attached to this candidate.

## Personalization boundaries

`src/reference/CuratedHome.svelte`, `CuratedStock.svelte` and `CuratedCarCard.svelte` own the dealer homepage. `public/reference/curated.css` scopes its composition and responsive adjustments. `scripts/compose-curated.mjs` reproducibly selects the recorded source chunks, with the curated copy and bindings; it writes only the curated homepage and its provenance receipt. Update the composition script when changing generated homepage copy, then regenerate. Stock/card components remain directly editable.

`src/components/Header.svelte` owns the shared dealer header and drawer; `src/App.svelte` mounts it outside the changing page content. `src/app.css` names the source font separately so the reference and adapted page font declarations cannot change header metrics. The composition generator does not emit a second header.

`src/pages/About.svelte` and `Contact.svelte` own the dealer inner-page composition. `src/inner-pages.css` scopes their source-derived typography, gallery, illustrations and form geometry, plus the inventory polish. The boxed variant of `EnquiryForm.svelte` retains local preview behavior. `VehicleCard.svelte` binds its detail/return URL to the live route. [`.template/inner-pages.json`](.template/inner-pages.json) records the original HTML/CSS hashes, selected asset hashes, adaptations and final browser evidence.

`src/reference/Home1.svelte` through `Home10.svelte` retain the original compositions. `public/reference/css/style.css`, the source theme variables and `public/media/` own their appearance. `src/reference/interactions.ts` supplies native controls; `src/reference/header-search.ts` binds the source-shaped header dropdown to the shared catalogue. `src/reference/carousel.ts` loads the two local slider dependencies and destroys sliders on unmount. Offscreen lazy images no longer delay slider initialization or Back restoration.

`src/data/brand.ts` owns identity and contacts on the curated home and adapted inner pages. `src/data/homes.ts` registers internal reference names/routes and recognizes the curated root for navigation restoration. `src/data/vehicles.json` owns the working sample stock and detail destinations; `src/data/journal.ts` owns buyer guidance. The ten preserved reference pages retain their source identity; they are internal references, not ten personalized dealer options. Review every public logo/contact consumer when adapting the curated design.

All 17 catalogue vehicles are samples. The adapted catalogue matches pictured makes/models and retains original IDs and legacy routes. Prices, years, mileage and specifications are illustrative. The five-image Volvo gallery contains model previews in different colours. Original homepage shelves, stock counts, reviews, staff and showroom copy are also illustrative reference content. Replace these inputs with verified dealer facts before use.

## Reference, ownership and acceptance

[`.template/curated.json`](.template/curated.json) records the selected source homes and their hashes, composition choices and retained reference routes. [`.template/reference.json`](.template/reference.json) records the original research captures. [`.template/port.json`](.template/port.json) records the source and generated Svelte hashes, section classes and missing optional source backgrounds. [`.template/assets.json`](.template/assets.json) records imported asset URLs, sizes, hashes and CSS transformations. Raw captures live in Cars' ignored `runtime/boxcar-updated-reference/`.

`scripts/port-reference.mjs` regenerates the ten compiled homepage sources from those archived HTML files; `--refresh-assets` refreshes original styles, fonts and pictures. It reads carousel options as syntax data without executing JavaScript at build time, and extracts the original Slick core without automatic demo initialization. CSS changes localize asset URLs, replace unused missing dependencies, and preserve label appearance for custom controls. A narrow WebKit compatibility rule fixes the flex image width in horizontal vehicle cards mounted by Svelte. Regeneration overwrites homepage personalization, so use it during template research before adapting a dealer. Production renders compiled Svelte markup, retains the local slider libraries and loads Home 06's illustrative map embed when it enters view.

Reference assets retain their existing ownership. No new ThemeForest purchase or multi-client rights determination was made. The owner must check existing entitlement and image rights before commercial reuse.

This is a **curated candidate** in the Cars catalogue. Owner visual acceptance, an immutable approved template release and dealer-generator support remain separate from local source/build/browser verification. See [the dated evidence](../../docs/boxcar-updated/QA.md) and [Cars QA](../../docs/QA.md).
