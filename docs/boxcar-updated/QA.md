# Boxcar Updated verification — 2 October 2026

Candidate: `L:/CODEX/cars/templates/boxcar-updated` on Cars `main`, Node 22.23.2. Local preview: [127.0.0.1:6455](http://127.0.0.1:6455/). This receipt replaces the earlier evidence for the approximate recreation in commit `d59c38bb8`.

## What changed

The ten homepages now compile the captured [Boxcar HTML preview](https://creativelayers.net/themes/boxcar-html/) DOM into separate Svelte components. They preserve source whitespace, classes, copy, SVGs, imagery and localized layout CSS. Svelte actions implement menus, tabs, search, calculator and preview forms. The original local jQuery and Slick core provide carousel behavior through a Svelte lifecycle bridge; the full vendor script set is not shipped.

The WordPress demo is a separate reference. Inventory, detail and other supporting pages still use the earlier adapted Svelte layouts. Their successful functional checks do not establish original inner-page design parity.

## Local checks

| Check | Result |
| --- | --- |
| Svelte / TypeScript | 0 errors, 0 warnings |
| Domain / asset tests | 8 / 8 pass |
| Production build | Pass; ten separately loaded homepage modules |
| Source / component provenance | 206 asset hashes and ten generated Svelte hashes verified |
| Homepage comparisons | 30 per engine: ten homes at 1440, 390 and 320 px |
| Reference interaction journeys | Eight per engine, including header search across ten homes |
| Adapted supporting pages | 59 rendered checks per engine |
| Cars workflow documentation | Pass |

Homepage comparisons render archived source HTML with its complete original demo scripts beside the Svelte page in Chrome and Playwright WebKit. Both use the localized source styles and assets. Animation and count-up states are normalized before comparison. Gates check section count, section positions/heights within one pixel, image/font loading, document width and first-viewport changed pixels below 1%. The changed-pixel threshold is a maximum RGB channel difference greater than 16. Exact measurements are in [results.json](results.json).

Full-page desktop comparisons were also recorded for Homes 01, 03, 07 and 10 through the last content section, before the footer. These measurements are recorded evidence, not a whole-site pixel-perfect acceptance gate. Small image/paint differences remain. A narrow WebKit flex-image compatibility rule keeps horizontal vehicle cards at the reference height. The fixed-pixel source typography has not been accepted at 200% text size.

The eight journeys check header search, make/model reset and inventory URLs, keyboard tabs/dropdowns, carousel movement and vehicle tabs, Mercedes/Volvo hero destinations, Back/scroll restoration, the 320 px nested mobile menu with Escape/focus return, and honest newsletter previews. Slider destination checks wait for the original transition to finish. Supporting-page checks cover nine pages at three widths plus the other 16 vehicle details at desktop and 320 px, giving 59 checks per engine.

## Header search correction

The initial DOM port toggled the original dropdown on typing, but retained four repeated placeholder cars and had no working Enter submission or outside-click dismissal. The earlier seven journeys tested the hero search, not this header interaction. Live inspection of the original HTML demo confirmed its dropdown and outside-click behavior; the older WordPress-derived template has working hero make/model controls but no equivalent header field. Its Home 2–10 entries still alias Home 1.

The header now opens on clicking or focusing an empty field, showing six vehicles, photos and prices from the shared sample catalogue. Typing filters suggestions; clearing the query restores the initial choices. Arrow keys and Enter select a vehicle; Enter without a selection and View all open inventory with the current query, or all stock when empty. Empty results, Escape, outside clicks and keyboard focus dismissal are covered. A WebKit focus change during pointer clicks is handled without hiding the link before navigation. The results panel shrinks for a short result set while retaining the original scroll limit. The original header field is hidden at 1440 px and below, including the narrow in-app preview; hero filters remain available.

After this correction, Svelte/TypeScript reports zero errors and warnings, the eight domain/asset tests pass, the production build passes, and all eight interaction journeys pass in Chrome and Playwright WebKit. The header journey now starts by clicking an empty field on all ten homes at 1920 px, checks focus opening, clearing back to six suggestions and empty-query inventory links, then covers matching images, keyboard and pointer detail destinations, filtered inventory, empty results, Escape from the footer link, Tab focus and the 1440/320 px visibility rules. The earlier typing-first checks missed the empty-field click behavior. The homepage pixel/geometry comparisons and adapted supporting-page tables above retain the earlier measurements; they were not rerun for this interaction repair.

Pointer focus now preserves the original white search panel without an outer blue outline. Tab and arrow navigation retain a neutral inset focus indicator; clicking again removes it. The View all link's keyboard indicator also stays inside the rounded panel and appears immediately. Checks cover these rendered focus states on all ten homes in both engines, alongside the existing destinations and dismissal journeys. The previous generic native focus rule incorrectly drew an external blue outline around a mouse-focused text input. The screenshots below have been refreshed with the corrected appearance.

Dealer promotion still needs one selected home, one listing/detail presentation, ordinary dealer navigation, personalized assets/content and release/generator support. The library's inventory variant labels currently alias the same adapted inventory route; they are not separate original layouts ready to offer a lead.

## Visual evidence

- [Original HTML and compiled Svelte side by side](home-1-comparison.png)
- [Header search using matching sample cars](header-search.png)
- [Clicking the empty header search](header-search-click.png)
- [Ten desktop homepages](homes-desktop.png)
- [Ten mobile homepages](homes-mobile.png)
- [Original desktop reference captures](reference-desktop.png)
- [Machine-readable results](results.json)
- [Routes, implementation and personalization notes](../../templates/boxcar-updated/TEMPLATE.md)

## Boundaries

These checks verify the local candidate with illustrative content and a 17-vehicle sample catalogue. Forms preview locally. The Home 06 map is the source's lazy external illustrative embed; its third-party availability is separate. A production bundle was built, but no hosted deployment or physical Safari/iPhone test was performed. Original inner-page and WordPress parity, owner visual acceptance and approved template release remain unfinished. The initial recreation's 200% text and whole-repository test claims are not carried forward as evidence for this replacement.
