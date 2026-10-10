# Filter reference comparison — 6 October 2026

Auto Best local source refinement on `main`, based on the App template at
`http://127.0.0.1:6483/bg/2` and its mobile inventory. App was inspected only.
Auto Best preview: `http://127.0.0.1:6461/bg/listing-grid`.

The useful reference differences were anchored desktop selectors without a page
backdrop, a more compact title/search/footer rhythm, and plain mobile option rows.
The existing Auto Best full form keeps its three categories and range controls.

## Matched captures

| View | Before | After |
| --- | --- | --- |
| Desktop Brand, 1440×900 | [Centered modal](before-brand-1440.jpg) | [Anchored menu](after-brand-1440.jpg) |
| Mobile full filters, 390×844 | [Twelve cards](before-main-390.jpg) | [Grouped plain rows](after-main-390.jpg) |
| Mobile Brand, 390×844 | [Black selected row](before-brand-390.jpg) | [Pale row and small indicator](after-brand-390.jpg) |
| Narrow full filters, 320×677 | [Before](before-main-320.jpg) | [After](after-main-320.jpg) |

Additional captures: [retained desktop full form](after-main-1440.jpg),
[short-window menu](after-model-1440-short.jpg),
[App desktop Brand reference](reference-brand-1440.jpg), and
[App mobile reference](reference-main-390.jpg).

## Changes

- `DesktopVehicleSearch.svelte`: one shared form inside a Bits UI Popover for
  shortcuts or Dialog for full filters. Compact menus are 380px wide, with no
  overlay or page scroll lock. Bits owns collision placement; short windows use
  a side placement. Off-screen anchors dismiss their menu. Outside dismissal
  preserves the outside interaction; Escape and Close return to the opener.
- `VehicleSearchDialog.svelte`: mobile Main/More/Extras groups, plain summary rows,
  a black primary action and in-place draft reset. Main and nested filters use the
  existing Fluent Regular mobile action icons.
- `QuickFilterSheet.svelte`: pale selected rows, small black selection indicators,
  a lighter backdrop, and the shared suggestion matcher.
- `listing-draft.ts` and `DesktopAllFilters.svelte`: shared category definitions
  and active-filter counts. Removed the unused hardcoded mobile labels.

Existing GET parameters, make/model dependency, draft cancellation, sorting,
range validation and equipment selection remain covered by the filter suites.

## Local verification

| Check | Result |
| --- | --- |
| Desktop wide filters | 14 BG/EN cases passed, including all shortcuts, switching, outside dismissal, range/draft validation and 68-option equipment fixtures |
| Home/listing desktop discovery | 6 cases passed, including the 400px-tall menu, search and sticky behavior |
| Mobile filter journeys | 4 cases passed: 320×677, 390×844, 430×932 and 700×390 |
| Focused mobile reflow | 18 BG/EN cases passed at 320/390/430px, with enlarged text, text-spacing and short-screen checks |
| Svelte/TypeScript | 0 errors, 0 warnings |
| Production build and locale audits | Passed |
| Domain, architecture, CSS, tokens and visual-system pins | Passed |

Logs, task preimages and the reviewed delta are preserved under
`runtime/filter-reference-2026-10-06/`. Other shared-checkout changes were retained.
This is uncommitted local template work. No template promotion, dealer deployment
or hosted verification was performed. Mobile evidence is browser emulation;
physical phone keyboards and safe areas were not verified in this pass.
