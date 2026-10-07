# Desktop search selectors

7 October 2026. Auto Best reusable master, `templates/auto-best`.

Every Home selector (Make, Model, Body and Budget) and all seven inventory
shortcuts (Type, Make, Model, Body, Budget, Year and Mileage) open panels aligned
with their search form. Search and numeric ranges are centered; pale option
tiles and preset grids use the existing Inter, spacing and neutral tokens.
All models and All makes use ordinary compact tiles. Empty grid columns remain
reserved so a single search result does not expand across the panel. Multi-select
controls use square checkboxes; scalar choices retain round radios. Each Home
Save button shows the pending vehicle count and retains Save-then-Search.

The layout activates from 992px. Inventory matching, make/model dependencies,
multiselect, cancellation, focus return, native GET URLs and retained choices
keep their existing owners. Models come from the actual inventory; no new
catalogue, guessed model families, assets, dependencies or mobile layout was added.
The all-criteria filter dialog retains its existing layout.

## Verification

- Node 22.20.0 full validation and production build passed. Final source checks
  passed with zero Svelte errors and warnings.
- Chromium Home: all 10 BG/EN cases passed, including 768/992/1440/1920px and
  a 1280px-wide, 500px-tall window. Checks cover every panel's width, compact
  choice tiles, pending counts, cancellation and exact/reversed Budget ranges.
- WebKit Home: all 6 BG/EN cases passed at 992/1440px and the short window.
- Desktop listing filters: all 14 cases passed, including 992/1024/1280/1440/
  1920px, outside-stock values and large equipment fixtures. The width checks
  cover all seven full-width shortcuts, compact choices and collision handling.
- Mobile filter journeys passed at 320, 390, 430 and 700px.
- Browser inspection at 1440x1000 captured all four Home selectors and the
  inventory Model panel. Home All models measures 225.5px inside its 960px panel.
  Before/after captures use the same Mercedes-Benz selection and viewport.
- Mobile presentation changes remain excluded by the 992px scope and retained
  default component props. The earlier JPEG comparisons are not claimed
  pixel-identical.

The initial expanded-scope Home run found an outdated exact Save-button locator
after counts were added to every selector. The assertion now targets the Save
control and continues to check disabled submission for a reversed Budget range.
The failed first run remains in the log; the complete reruns above passed.

Raw screenshots, source preimages, comparison JSON and logs are stored in
ignored `runtime/auto-best-search-box-2026-10-07-01a115ed/` at the Cars root.
The existing development server on port 6461 is retained. This source change
does not promote a template release or deploy dealer copies.
