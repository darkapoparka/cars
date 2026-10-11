# Desktop search selectors

7 October 2026. Auto Best reusable master, `templates/auto-best`.

Every Home selector (Make, Model, Body and Budget) and all seven inventory
shortcuts (Type, Make, Model, Body, Budget, Year and Mileage) open compact panels
anchored to their own trigger. Make uses an 840px, six-column logo grid; Model is
640px wide with two choice columns; the other current shortcuts are 480px wide.
All widths are capped to the viewport. Desktop search shares the header row with
the title and close button. A single filtered choice retains its grid-cell size.
Numeric ranges and Budget presets fit the smaller panels.

Desktop menus stay detached from their controls with a visible 8px gap. Home's
offset includes the bar's 8px internal padding, so the gap is measured from the
whole bar rather than its inset button. Opening uses a shared 120ms opacity fade
without scaling, sliding or resizing. Reduced motion opens immediately. Tablet
and phone placement and motion retain their existing owners.

Make offers 179 brands: stocked makes first, familiar brands next, then the
alphabetical catalogue. Every option has an actual inventory count, including
zero-stock brands. A zero-stock selection leads to the retained empty-results
page. Outside-catalogue dealer selections remain available without duplication.

The shared artwork owner preserves the 13 existing manufacturer assets and adds
149 byte-identical local WebP files from the Cars Mobile reference (453,264 bytes).
Volkswagen uses its existing reviewed badge. Round emblems have a 40px visible
height; wide wordmarks are capped at 72px. Tiles have at least 112px of height,
with room for wrapped names, counts and selection ticks. Unsupplied artwork uses
the existing neutral car glyph. Counts are accessible descriptions, leaving the
make itself as the checkbox name. See [asset provenance](../provenance/desktop-make-catalogue-2026-10-07.md).

Pale option tiles and preset grids use the existing Inter, spacing and neutral
tokens. Multi-select controls use square checkboxes; scalar choices retain round
radios. Each Home Save button shows the pending vehicle count and retains
Save-then-Search. Headers and action footers stay visible while long lists scroll.

The layout activates from 992px. Inventory matching, make/model dependencies,
multiselect, cancellation, focus return, native GET URLs and retained choices
keep their existing owners. Models come from the actual inventory; no guessed
model families or new dependencies were added. Phones and tablets keep their
stock-derived options and layout. The all-criteria filter dialog retains its
layout and compact 380px nested Make picker, with the same catalogue and counts
in 44px-or-larger rows. Its logos use smaller optical sizes.

## Verification

- Node 22.20.0 full validation and production build passed. Final source checks
  passed with zero Svelte errors and warnings.
- Chromium Home: all 10 BG/EN cases passed, including 768/992/1440/1920px and
  a 1280px-wide, 500px-tall window. Checks cover every panel's 840/640/480px width,
  loaded make logos, tile size, header search alignment, pending counts, cancellation
  and exact/reversed Budget ranges.
- WebKit Home: all 6 BG/EN cases passed at 992/1440px and the short window.
- Desktop listing filters: all 14 cases passed, including 992/1024/1280/1440/
  1920px, outside-stock values and large equipment fixtures. The width checks
  cover all seven compact shortcuts, trigger anchoring, header search alignment,
  loaded make logos, tile size, compact choices and collision handling.
- Mobile filter journeys passed at 320, 390, 430 and 700px.
- Opening polish: 96 openings passed across Chromium and WebKit, normal and
  reduced motion, at 1440x1000 and 992x600. Frame samples cover all four Home
  selectors, all seven inventory shortcuts and the full form's nested Make
  picker. Their bounds remain stationary, opacity progresses without flashing,
  and Home keeps its 8px gap when collision handling flips a menu above the bar.
  Matched 1440x1000 captures preserve the approved make grid and show only the
  additional gap. Raw motion evidence and captures are in ignored
  `runtime/auto-best-selector-opening-2026-10-07-01a115ed/` at the Cars root.
- Catalogue: all 10 BG/EN cases passed. Home and inventory are checked at
  992x600 and 1440x900, including all 180 checkbox positions, accessible stock
  counts, loaded logos, accent-insensitive search, compact single search results,
  keyboard scrolling, stationary footers, cancellation and zero-stock GET results.
  The full form is checked in both languages at 992x600, including compact rows,
  the complete catalogue, nested focus, empty results and sorting retention.
- Browser inspection at 1440x1000 captured all four Home selectors and the
  inventory Make and Model panels. Make measures 840px, Model 640px, and Body and
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
The full-form catalogue extension initially passed a scalar-or-array summary to
an array-only selection helper. It now uses the typed make draft directly; final
validation and the full-form browser reruns passed.

Raw screenshots, source preimages, geometry JSON and logs are stored in
ignored `runtime/auto-best-make-catalogue-2026-10-07-01a115ed/` at the Cars root.
The prior logo-only iteration remains in `runtime/auto-best-make-logos-2026-10-07-01a115ed/`.
The earlier compact-selector captures remain in
`runtime/auto-best-compact-selectors-2026-10-07-01a115ed/`.
The existing development server on port 6461 is retained. This source change
does not promote a template release or deploy dealer copies.
