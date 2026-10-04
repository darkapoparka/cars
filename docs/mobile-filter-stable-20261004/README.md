# Mobile desktop filter stability — 4 October 2026

The previous desktop `fit-content` dialog was 614px high on Make & model but
398px on Price at 1440×900. Centering moved its top by 108px between those tabs.
The editor also reused phone Make/Model view toggles instead of showing both
desktop panels together.

The desktop editor now has a stable 820px-wide, 680px-high frame, bounded by
24px viewport gutters. Header, seven tabs and apply footer keep their positions
as content changes. Separate brand/model panes have independent searches.
Native brand checkboxes select and deselect directly; an edit action opens an
existing selection and Remove clears that brand's model/exclusion criteria.
The parent filter draft remains the only filter state; the existing taxonomy,
model options and domain helpers still perform selection updates.

The model list scrolls independently from More options, which remains reachable
below it. In short desktop windows, the panes use less vertical padding and
expanded options may use the available content height. The existing 8px blurred
backdrop remains. Below 700px the native phone picker is still used.

## Verification

- Node 22.20.0; ESLint and TypeScript passed. All 92 domain/localization tests
  passed, including a scoped-clear regression that retains price/fuel criteria
  and round-trips without orphan model or exclusion data.
- Production builds passed using the template's existing webpack preview
  launcher. The final output is `.next-filter-stable-final-20261004`, serving
  `http://127.0.0.1:6474/`. Pre-existing generated config files were restored with
  a guard that rejects concurrent edits.
- In-app browser: 76 exact dialog/header/tab/footer rectangle comparisons across
  the candidate and final builds; 41 comparisons used the final build. Inspected
  BG 700×500, 1024×768, 1440×900 and 1920×1080, plus EN 1440×900. Tab changes,
  model search, family expansion, selection, variants, exclusions, removal and
  reset kept the frame fixed. The short viewport could reach and edit a variant.
- Apply after removing BMW retained `minPrice=20000` without make/model criteria.
  Escape and browser Back discarded unapplied make changes; Escape returned
  focus to the make quick filter. Recorded browser console errors: none.
- At BG 320×844 and 390×844, make/model selector, search, model-row, tab, footer
  and dialog rectangles match the baseline exactly. Phone controls were also
  exercised by selecting BMW and resetting the editor.
- The copied showroom QA suite now checks desktop frame stability and the
  separate checkbox flow. Its full route suite was not rerun; the affected
  interaction cases were exercised through the in-app browser above.

## Evidence and scope

`desktop-comparison.jpg` compares the same unselected Make & model state.
`desktop-after-selected.jpg` shows the new BMW panels; `desktop-en-after.jpg`
shows X6/variant controls. The short-window screenshot shows a focused variant
inside its scrolling options area. Browser and phone rectangles are retained
as JSON alongside the matched phone captures.

Phone pixels differ because the parallel Mobile font/card task changed the
phone typography from Manrope to Inter in source commit `225339c7f`; that change
is outside this filter patch. Exact geometry preservation is established by
the recorded rectangles, rather than claiming identical phone pixels.

Only the filter implementation, domain clear helper, its regression, copied QA
checks, template notes and this evidence belong to this change. Other template
work and generated configuration stay separate. The approved release lock and
dealer fleet are unchanged; this is local/source verification, not hosted
dealer acceptance.
