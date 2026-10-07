# Desktop model picker

7 October 2026. Auto Best reusable master, `templates/auto-best`.

Home and inventory model shortcuts now open a wider panel attached to their
search form. A centered search field, pale option tiles, square checkboxes and
an adaptive grid use the existing Inter, spacing and neutral surface tokens.
All models occupies its own row. The Home Save button includes a live count of
vehicles matching the pending draft, while retaining the Save-then-Search flow.

The layout activates from 992px. Inventory matching, make/model dependencies,
multiselect, cancellation, focus return, native GET URLs and retained choices
keep their existing owners. Models come from the actual inventory; no new
catalogue, guessed model families, assets, dependencies or mobile layout was added.

## Verification

- Node 22.20.0 full validation and production build passed. Final source checks
  passed with zero Svelte errors and warnings.
- Chromium Home: all 10 BG/EN cases passed, including 768/992/1440/1920px and
  a 1280px-wide, 500px-tall window. Added checks cover panel width and live count.
- WebKit Home: all 6 BG/EN cases passed at 992/1440px and the short window.
- Desktop listing filters: all 14 cases passed, including 992/1024/1280/1440/
  1920px, outside-stock values and large equipment fixtures. The width checks
  now distinguish Model from the other shortcuts.
- Mobile filter journeys passed at 320, 390, 430 and 700px.
- Browser inspection at 1440x1000 confirmed both new panels. GLE Coupe selection
  was retained after reopening and reached its one matching car.
- Home/listing mobile captures at 320/390px preserve the composition. Raw JPEG
  comparisons contain rendering differences and are not claimed pixel-identical.
  Mobile presentation changes are excluded by the 992px scope and retained
  default component props.

One exploratory Chromium rerun timed out opening Budget while SvelteKit sync
was also running. It is retained in the raw log; it is not counted as a pass.
The completed Chromium suite and subsequent WebKit suite are recorded above.

Raw screenshots, source preimages, comparison JSON and logs are stored in
ignored `runtime/auto-best-model-picker-2026-10-07-01a115ed/` at the Cars root.
The existing development server on port 6461 is retained. This source change
does not promote a template release or deploy dealer copies.
