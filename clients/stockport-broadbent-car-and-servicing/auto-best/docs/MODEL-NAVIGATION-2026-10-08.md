# Desktop model navigation — 8 October 2026

Model families now open a focused view inside the established dropdown. BMW → 3 Series shows only that family's choices. Back returns to the previous family or make list, restores its scroll position and keyboard focus, and retains model selections. Family and make buttons indicate selections inside them. Reopening one selected family reveals its checked choices immediately.

Search shows matching model checkboxes directly, with make/family context, across the selected makes. It is available from every level. Clearing search returns to the current browsing level. The temporary search text remains separate from the applied inventory keyword and GET filters.

The shared desktop editor serves Home, inventory shortcuts and the compact Model picker inside the full filter form. The existing widths, search/title/close row, action footer and opening motion remain in their owners. The initial scroll viewport is retained for short families and search results. Only its contents scroll; Back remains visible within long family lists.

Catalogue names, actual inventory counts, zero-stock choices and query contracts remain owned by the existing data helpers. Mobile and tablet retain their existing editor. No manufacturer catalogue, inventory, asset, dependency or dealer release was changed.

## Compact header follow-up

The desktop header now shows the current make or a clickable `← Audi / A1` path in place of the generic Model title. Back, search and close share that row on Home, inventory shortcuts and the compact full-form picker. The separate Back/breadcrumb row is removed, so model choices begin directly below the header. Back retains the existing selection, scroll and keyboard-focus behavior.

Short paths stay fully visible. Long paths truncate within the header while retaining their full tooltip and accessible Back label; the compact search retains at least 100px of input width. The search query still opens direct matching choices and clearing it restores the browsing path. Mobile/tablet and the approved desktop widths, footer, frame and motion are preserved.

The retained model viewport now follows the scroll pane through a ResizeObserver after popover placement. This prevents a two-choice family retaining an oversized initial measurement and an unnecessary scrollbar. The observer disconnects when its editor unmounts.

The header follow-up passed all 18 Chromium cases with normal motion and 18 WebKit cases with reduced motion, including BG/EN, all three picker surfaces, short desktop windows, short paths and six long-name/99-choice fixtures per engine. The existing Home suite passed 10 cases; filter-code checks passed six cases at 320, 390 and 1440px. Full Node 22 validation and the production build passed with 0 Svelte errors and 0 warnings. Svelte CLI analysis reported no issues in the six edited components.

Iteration checks caught short-path clipping, limited compact-header space and the oversized initial viewport measurement; these were fixed before the final suites. One early WebKit run did not open its initial Make menu and reported no JavaScript errors; a focused repeat and the final full run passed. Failed/intermediate evidence remains in the ignored artifact folders. Native browser captures show Audi/A1 and a matched BMW 3 Series before/after, with the separate navigation row removed. Follow-up evidence is in `artifacts/desktop-model-header-*` and `runtime/auto-best-model-header-2026-10-08-01a115ed/`.

## Root choice and grid follow-up

`All models` now appears once at the editor's root: the brand list, or the family list when one make is already selected. Entering a brand from the brand list starts directly with its groups. The reset no longer repeats inside each brand, where its global inventory count could be mistaken for that brand's stock. Family views and search retain their direct model choices. The outer Model field still means that no specific model filter has been chosen; browsing a group does not apply a selection.

The reset and first actual brand/family now share the same two-column grid row, with equal card widths and the existing 8px gap. Removing the separate family grid eliminates the empty cell beside the half-width reset. The compact nested editor keeps its single column. The established widths, header, footer, opening motion, catalogue and mobile editor are unchanged.

The updated focused suite checks root placement and stock counts, reset absence after brand/family drilldown and during search, and clearing pending selections across brands. All 18 Chromium and 18 WebKit cases passed, including the 99-choice fixtures. The six filter-code cases and final ten Home cases passed. The initial Home run stopped at its open-field background assertion in EN/1440; that focused case and the final complete run passed without source changes. Root and BMW captures plus run records are saved in `runtime/auto-best-model-grid-2026-10-08-01a115ed/`; model screenshots remain in `artifacts/desktop-model-grid-*`.

## Verification

The updated `scripts/desktop-model-groups-smoke.mjs` covers focused family navigation, stationary frame/footer/page, Back and focus restoration, selection retention across families, direct search, zero-stock application, cancellation and legacy stock URLs in BG/EN across all three surfaces. A browser-only fixture adds 80 model choices to BMW 3 Series, producing a 99-choice family without changing source data. It checks the last model, scrolling, sticky Back, retained selection and exact search.

- Node 22 full validation and production build passed, with 0 Svelte errors and 0 warnings. Architecture, CSS policy, tokens, typography, assets, domain, enquiry-resource and overlay checks passed.
- Final focused browser suite: 18 Chromium cases with normal motion and 18 WebKit cases with reduced motion. Each engine covered BG/EN, Home/inventory/nested pickers, 992×600 and 1440×900 navigation, two-choice families and six 99-choice fixtures at 1024×600.
- Existing Home regression: 10 BG/EN viewport cases including tablet and short desktop windows.
- Existing full-filter regression: 14 cases including outside-stock values and the large equipment fixture.
- Existing filter-code regression: 6 Chromium BG/EN cases at 320, 390 and 1440px; the final run checked immediate restoration of selected desktop models.

The first stress run caught Back scrolling out of the inventory viewport; the root grid now uses natural content height. The existing identity suite then caught hidden checked models on reopening; one selected family is now restored immediately. These were fixed before the final focused suites and validation. The fixture names are confined to browser interception and are absent from production data.

Local evidence belongs in ignored `artifacts/desktop-model-navigation-*` and `runtime/auto-best-model-navigation-2026-10-08-01a115ed/`. Matched 1440px before/after captures document the BMW 3 Series view. The [earlier grouping record](MODEL-GROUPS-2026-10-07.md) describes the preserved catalogue and filter boundaries. No dealer deployment or release-lock change is included.
