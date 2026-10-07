# Desktop search selectors

7 October 2026. Auto Best reusable master, `templates/auto-best`.

Every Home selector (Make, Model, Body and Budget) and all seven inventory
shortcuts (Type, Make, Model, Body, Budget, Year and Mileage) open compact panels
anchored to their own trigger. Make uses a 720px, four-column logo grid; Model is
640px wide with two choice columns; the other current shortcuts are 480px wide.
All widths are capped to the viewport. Desktop search shares the header row with
the title and close button. A single filtered choice retains its grid-cell size.
Numeric ranges and Budget presets fit the smaller panels.

Make reuses the existing manufacturer artwork and measured visible bounds from
the Home brand catalog. Round emblems have a 40px visible height; wide wordmarks
are capped at 72px. Each 104px-tall choice has its name beneath the logo, with a
selection tick at the top right. All makes uses the same tile size. A make without
reviewed artwork retains its name and a neutral car glyph. No asset or catalogue
entry was added, and stock-backed make/model matching remains unchanged.

Pale option tiles and preset grids use the existing Inter, spacing and neutral
tokens. Multi-select controls use square checkboxes; scalar choices retain round
radios. Each Home Save button shows the pending vehicle count and retains
Save-then-Search. Headers and action footers stay visible while long lists scroll.

The layout activates from 992px. Inventory matching, make/model dependencies,
multiselect, cancellation, focus return, native GET URLs and retained choices
keep their existing owners. Models come from the actual inventory; no new
catalogue, guessed model families, assets, dependencies or mobile layout was added.
The all-criteria filter dialog retains its existing layout.

## Verification

- Node 22.20.0 full validation and production build passed. Final source checks
  passed with zero Svelte errors and warnings.
- Chromium Home: all 10 BG/EN cases passed, including 768/992/1440/1920px and
  a 1280px-wide, 500px-tall window. Checks cover every panel's 720/640/480px width,
  loaded make logos, tile size, header search alignment, pending counts, cancellation
  and exact/reversed Budget ranges.
- WebKit Home: all 6 BG/EN cases passed at 992/1440px and the short window.
- Desktop listing filters: all 14 cases passed, including 992/1024/1280/1440/
  1920px, outside-stock values and large equipment fixtures. The width checks
  cover all seven compact shortcuts, trigger anchoring, header search alignment,
  loaded make logos, tile size, compact choices and collision handling.
- Mobile filter journeys passed at 320, 390, 430 and 700px.
- Browser inspection at 1440x1000 captured all four Home selectors and the
  inventory Make and Model panels. Make measures 720px, Model 640px, and Body and
  Budget 480px. Budget presets keep their amounts on one line. Header search was used
  to select GLE Coupé and reach its one inventory result. Before/after captures
  use the same Mercedes-Benz selection and viewport.
- Mobile presentation changes remain excluded by the 992px scope and retained
  default component props. The earlier JPEG comparisons are not claimed
  pixel-identical.

The first compile for the logo grid found two redundant Make comparisons in a
branch already narrowed to other fields. Those comparisons were removed; the
failed compile log is retained, and full validation then passed.
The first Home browser runs caught logo pixels intercepting direct checkbox
clicks. Decorative media now ignores pointer events, leaving the whole tile to
the existing checkbox. Those failure logs are retained with the final reruns.

Raw screenshots, source preimages, geometry JSON and logs are stored in
ignored `runtime/auto-best-make-logos-2026-10-07-01a115ed/` at the Cars root.
The earlier compact-selector captures remain in
`runtime/auto-best-compact-selectors-2026-10-07-01a115ed/`.
The existing development server on port 6461 is retained. This source change
does not promote a template release or deploy dealer copies.
