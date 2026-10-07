# Desktop model navigation — 8 October 2026

Model families now open a focused view inside the established dropdown. BMW → 3 Series shows only that family's choices. Back returns to the previous family or make list, restores its scroll position and keyboard focus, and retains model selections. Family and make buttons indicate selections inside them. Reopening one selected family reveals its checked choices immediately.

Search shows matching model checkboxes directly, with make/family context, across the selected makes. It is available from every level. Clearing search returns to the current browsing level. The temporary search text remains separate from the applied inventory keyword and GET filters.

The shared desktop editor serves Home, inventory shortcuts and the compact Model picker inside the full filter form. The existing widths, search/title/close row, action footer and opening motion remain in their owners. The initial scroll viewport is retained for short families and search results. Only its contents scroll; Back remains visible within long family lists.

Catalogue names, actual inventory counts, zero-stock choices and query contracts remain owned by the existing data helpers. Mobile and tablet retain their existing editor. No manufacturer catalogue, inventory, asset, dependency or dealer release was changed.

## Verification

The updated `scripts/desktop-model-groups-smoke.mjs` covers focused family navigation, stationary frame/footer/page, Back and focus restoration, selection retention across families, direct search, zero-stock application, cancellation and legacy stock URLs in BG/EN across all three surfaces. A browser-only fixture adds 80 model choices to BMW 3 Series, producing a 99-choice family without changing source data. It checks the last model, scrolling, sticky Back, retained selection and exact search.

- Node 22 full validation and production build passed, with 0 Svelte errors and 0 warnings. Architecture, CSS policy, tokens, typography, assets, domain, enquiry-resource and overlay checks passed.
- Final focused browser suite: 18 Chromium cases with normal motion and 18 WebKit cases with reduced motion. Each engine covered BG/EN, Home/inventory/nested pickers, 992×600 and 1440×900 navigation, two-choice families and six 99-choice fixtures at 1024×600.
- Existing Home regression: 10 BG/EN viewport cases including tablet and short desktop windows.
- Existing full-filter regression: 14 cases including outside-stock values and the large equipment fixture.
- Existing filter-code regression: 6 Chromium BG/EN cases at 320, 390 and 1440px; the final run checked immediate restoration of selected desktop models.

The first stress run caught Back scrolling out of the inventory viewport; the root grid now uses natural content height. The existing identity suite then caught hidden checked models on reopening; one selected family is now restored immediately. These were fixed before the final focused suites and validation. The fixture names are confined to browser interception and are absent from production data.

Local evidence belongs in ignored `artifacts/desktop-model-navigation-*` and `runtime/auto-best-model-navigation-2026-10-08-01a115ed/`. Matched 1440px before/after captures document the BMW 3 Series view. The [earlier grouping record](MODEL-GROUPS-2026-10-07.md) describes the preserved catalogue and filter boundaries. No dealer deployment or release-lock change is included.
