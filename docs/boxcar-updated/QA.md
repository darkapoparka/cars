# Boxcar Updated verification — 2 October 2026

Candidate: `L:/CODEX/cars/templates/boxcar-updated` on Cars `main`, Node 22.23.2. Local preview: [127.0.0.1:6455](http://127.0.0.1:6455/). The default `/` now opens the curated dealer homepage. The ten original HTML homes remain at `/home-1/` through `/home-10/`.

## Current curated homepage

The selected composition uses **Home 10's rounded photo hero, header and photographic body choices, Home 5's white pill search and four-icon benefits, and Home 8's centered brands, boxed vehicle shelf, dark rounded cards, journal and footer**. The primary search is now in normal flow directly below the hero title, leaving the car visible. The header has centered Home / Cars / About / Contact navigation, Saved and a solid contact action; its competing keyword field is removed. The centered sections share a bounded desktop frame. Brands and body choices have visible source-style tile borders; the stock shelf uses three larger desktop cards with compact specifications and aligned price/detail actions. The dark cards describe three buying steps rather than showing copied customer testimonials; supporting navigation also exposes buying advice, saved cars and comparison.

The composition selects the preserved original DOM, SVGs, photographs and layout CSS, then binds dealer identity, articles and the 17 sample vehicles through shared data. There are no inflated stock totals or borrowed reviews on the curated page. Supporting inventory/detail pages remain the adapted Svelte layouts. This is a new combination of source sections; the original-home pixel comparison is not a pixel-parity claim for the combined page.

| Check                        | Result                                                     |
| ---------------------------- | ---------------------------------------------------------- |
| Svelte / TypeScript          | 0 errors, 0 warnings                                       |
| Domain / asset suite         | 8 / 8 pass, rerun for this desktop revision                 |
| Production build             | Pass; curated home and ten reference homes load separately |
| Composition regeneration     | Identical curated source and provenance bytes              |
| Preserved original sources   | Ten Svelte hashes still match the original port receipt    |
| Curated browser journeys     | Nine pass in Chrome and nine in Playwright WebKit          |
| Responsive layouts           | 1440, 1024, 768, 390 and 320 px in both engines            |
| Original reference journeys  | Earlier eight per engine retained; not rerun for this correction |
| Browser / local asset errors | None in either curated run                                 |

The curated checks cover lazy images, visible desktop navigation, centered headings, readable footer copy and article badges, and document width. Default filter labels remain on one line, while every catalogue make/model combination is selected at 390 and 320 px to check longer label and arrow bounds. Source-style carousel arrows are centered, at least 44 px high and separate from View all cars. The stock shelf is finite; it does not clone Svelte save buttons. Its clipped viewport prevents WebKit's native focus scrolling from moving the slider track. Save buttons handle clicks before Slick's delegated list handler can consume them, including after switching stock tabs.

Search checks cover condition, make/model reset, restoring Any choices, price and the resulting inventory URLs/data. The placement check verifies a centered search 20–40 px below the headline at all five widths, one primary search, a compact header and the 3/2/1 visible-card counts. All four dropdowns must open as white panels within the viewport, with their first option uncovered and clickable. The search button and visible header contact action have at least 4.5:1 computed text contrast. Keyboard checks cover dropdown selection, Escape and dismissal. Stock checks cover condition tabs, slide movement, bookmark clicks, Space activation, browser storage, the correct detail destination and Back/scroll restoration; the test waits for the selected panel's visible fade and layout before clicking its save control. Each photographic body choice opens its matching inventory at desktop and 320 px; the SUV check covers both result pages. Ordinary mobile menus, buyer-step links and inventory/about/contact/article routes are checked at desktop and 320 px. The earlier curated header-suggestion journey has been replaced by the requested headline-search placement and dropdown checks; the original ten homes retain their header implementation and earlier separate evidence.

The earlier combined layout and first styling correction were visually rejected by the owner despite passing functional checks. This desktop revision moves the search into the headline's content block, replaces the scattered header layout, restores larger source-like vehicle cards and adds defined brand/body tiles. A source-specific header rule had also overridden the contact text colour; the scoped rule now gives the solid button readable white text. Phone controls remove an inherited fixed dropdown height and allow default labels to fit on one line. Earlier corrections retain Home 10's photographic body choices, Home 5's pale benefits container, balanced headings, and the Bentley photograph's corrected model label with its existing URL. The retained screenshots and machine-readable receipt describe this local candidate; owner visual acceptance remains open:

- [Curated desktop homepage](curated-desktop.png)
- [Complete desktop section flow](curated-desktop-full.png)
- [Curated mobile homepage](curated-mobile.png)
- [Search beneath the hero title with its make dropdown open](curated-hero-search.png)
- [Curated checks and source hashes](curated-results.json)
- [Composition and personalization boundaries](../../templates/boxcar-updated/TEMPLATE.md)

This completes the local curated-home build. An approved immutable release, generator/mounted-route support, locale/units, a personalized dealer pilot and hosted fleet rollout remain separate work. No dealer deployment was launched for this composition. Forms remain local previews; physical Safari/iPhone and 200% text acceptance are not established by these browser runs.

## Earlier ten-home port and header verification

The following evidence records the original DOM port and subsequent header corrections. Its geometry/pixel and 59-page supporting checks retain their earlier measurements; they were not rerun as a new whole-site acceptance for the curated composition. The port replaced the approximate recreation in commit `d59c38bb8`.

### What changed

The ten homepages now compile the captured [Boxcar HTML preview](https://creativelayers.net/themes/boxcar-html/) DOM into separate Svelte components. They preserve source whitespace, classes, copy, SVGs, imagery and localized layout CSS. Svelte actions implement menus, tabs, search, calculator and preview forms. The original local jQuery and Slick core provide carousel behavior through a Svelte lifecycle bridge; the full vendor script set is not shipped.

The WordPress demo is a separate reference. Inventory, detail and other supporting pages still use the earlier adapted Svelte layouts. Their successful functional checks do not establish original inner-page design parity.

### Local checks

| Check                          | Result                                                     |
| ------------------------------ | ---------------------------------------------------------- |
| Svelte / TypeScript            | 0 errors, 0 warnings                                       |
| Domain / asset tests           | 8 / 8 pass                                                 |
| Production build               | Pass; ten separately loaded homepage modules               |
| Source / component provenance  | 206 asset hashes and ten generated Svelte hashes verified  |
| Homepage comparisons           | 30 per engine: ten homes at 1440, 390 and 320 px           |
| Reference interaction journeys | Eight per engine, including header search across ten homes |
| Adapted supporting pages       | 59 rendered checks per engine                              |
| Cars workflow documentation    | Pass                                                       |

Homepage comparisons render archived source HTML with its complete original demo scripts beside the Svelte page in Chrome and Playwright WebKit. Both use the localized source styles and assets. Animation and count-up states are normalized before comparison. Gates check section count, section positions/heights within one pixel, image/font loading, document width and first-viewport changed pixels below 1%. The changed-pixel threshold is a maximum RGB channel difference greater than 16. Exact measurements are in [results.json](results.json).

Full-page desktop comparisons were also recorded for Homes 01, 03, 07 and 10 through the last content section, before the footer. These measurements are recorded evidence, not a whole-site pixel-perfect acceptance gate. Small image/paint differences remain. A narrow WebKit flex-image compatibility rule keeps horizontal vehicle cards at the reference height. The fixed-pixel source typography has not been accepted at 200% text size.

The eight journeys check header search, make/model reset and inventory URLs, keyboard tabs/dropdowns, carousel movement and vehicle tabs, Mercedes/Volvo hero destinations, Back/scroll restoration, the 320 px nested mobile menu with Escape/focus return, and honest newsletter previews. Slider destination checks wait for the original transition to finish. Supporting-page checks cover nine pages at three widths plus the other 16 vehicle details at desktop and 320 px, giving 59 checks per engine.

### Header search correction

The initial DOM port toggled the original dropdown on typing, but retained four repeated placeholder cars and had no working Enter submission or outside-click dismissal. The earlier seven journeys tested the hero search, not this header interaction. Live inspection of the original HTML demo confirmed its dropdown and outside-click behavior; the older WordPress-derived template has working hero make/model controls but no equivalent header field. Its Home 2–10 entries still alias Home 1.

The header now opens on clicking or focusing an empty field, showing six vehicles, photos and prices from the shared sample catalogue. Typing filters suggestions; clearing the query restores the initial choices. Arrow keys and Enter select a vehicle; Enter without a selection and View all open inventory with the current query, or all stock when empty. Empty results, Escape, outside clicks and keyboard focus dismissal are covered. A WebKit focus change during pointer clicks is handled without hiding the link before navigation. The results panel shrinks for a short result set while retaining the original scroll limit. The original header field is hidden at 1440 px and below, including the narrow in-app preview; hero filters remain available.

After this correction, Svelte/TypeScript reports zero errors and warnings, the eight domain/asset tests pass, the production build passes, and all eight interaction journeys pass in Chrome and Playwright WebKit. The header journey now starts by clicking an empty field on all ten homes at 1920 px, checks focus opening, clearing back to six suggestions and empty-query inventory links, then covers matching images, keyboard and pointer detail destinations, filtered inventory, empty results, Escape from the footer link, Tab focus and the 1440/320 px visibility rules. The earlier typing-first checks missed the empty-field click behavior. The homepage pixel/geometry comparisons and adapted supporting-page tables above retain the earlier measurements; they were not rerun for this interaction repair.

Pointer focus now preserves the original white search panel without an outer blue outline. Tab and arrow navigation retain a neutral inset focus indicator; clicking again removes it. The View all link's keyboard indicator also stays inside the rounded panel and appears immediately. Checks cover these rendered focus states on all ten homes in both engines, alongside the existing destinations and dismissal journeys. The previous generic native focus rule incorrectly drew an external blue outline around a mouse-focused text input. The screenshots below have been refreshed with the corrected appearance.

The current curated page above now selects one home composition and ordinary dealer navigation. Personalized assets/content and release/generator support remain prerequisites for dealer promotion. The preserved reference menus' inventory variant labels alias the same adapted inventory route; they are not separate original layouts ready to offer a lead.

### Earlier visual evidence

- [Original HTML and compiled Svelte side by side](home-1-comparison.png)
- [Header search using matching sample cars](header-search.png)
- [Clicking the empty header search](header-search-click.png)
- [Ten desktop homepages](homes-desktop.png)
- [Ten mobile homepages](homes-mobile.png)
- [Original desktop reference captures](reference-desktop.png)
- [Machine-readable results](results.json)
- [Routes, implementation and personalization notes](../../templates/boxcar-updated/TEMPLATE.md)

### Boundaries

These checks verify the local candidate with illustrative content and a 17-vehicle sample catalogue. Forms preview locally. The Home 06 map is the source's lazy external illustrative embed; its third-party availability is separate. A production bundle was built, but no hosted deployment or physical Safari/iPhone test was performed. Original inner-page and WordPress parity, owner visual acceptance and approved template release remain unfinished. The initial recreation's 200% text and whole-repository test claims are not carried forward as evidence for this replacement.
