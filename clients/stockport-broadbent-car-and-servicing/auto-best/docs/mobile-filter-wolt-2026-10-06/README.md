# Mobile inventory filters — 6 October 2026

The older twelve-row mobile overview was quicker to scan than the intermediate
Main/More/Extras version. The latter added navigation and left a large empty area.
The current version keeps all twelve criteria visible in one plain list and uses
Treido Wolt's single-sheet navigation pattern.

The live Treido reference was inspected at
`http://127.0.0.1:6414/search/?browse=1&scope=products`, with its listener confirmed
against `L:/PLATFORMS/treido-bg-wolt`. Its overview uses simple rows on white;
choices replace the overview and return immediately. The reference checkout was
read only. No source, assets or hosting changes were made there.

## Result

- One white sheet that fits its content; short screens scroll the overview.
- Twelve plain 48px rows without card backgrounds, dividers or category tabs.
- One pale keyword field, a plain Clear action and a black result action.
- A facet replaces the overview inside the same native dialog.
- Single choices update the local draft in one tap, including an already selected choice.
- Ranges and extras retain Save; Back discards an unfinished pane.
- Closing the sheet discards the entire draft. The final action applies canonical GET criteria.
- Suggestion search retains its opening list space. Keyboard Escape, focus return,
  make/model dependencies and scroll ownership are preserved.

`ListingFacetEditor.svelte` now provides the common search, choices and numeric
controls for `QuickFilterSheet.svelte` and `MobileListingFilters.svelte`.
Standalone quick pickers retain direct URL application and their Apply action.
`VehicleSearchDialog.svelte` delegates phone filters to the mobile owner, leaving
desktop anchored menus and the desktop full filter form in their existing owners.
Existing Inter v4.1, Fluent Regular icons, localization and shared tokens remain.

## Matched captures

All screenshots use the in-app Chromium browser, Bulgarian locale, an empty
applied filter state and the same viewport for each before/after pair.

| State | Before | After |
| --- | --- | --- |
| Overview, 390×844 | [Tabbed overview](before-overview-390.jpg) | [Plain list](after-overview-390.jpg) |
| Make, 390×844 | [Second dialog and Apply](before-make-390.jpg) | [One pane and immediate choice](after-make-390.jpg) |
| Overview, 320×677 | [Tabbed overview](before-overview-320.jpg) | [Scrollable list](after-overview-320.jpg) |

[Older twelve-card overview](../filter-reference-2026-10-06/before-main-390.jpg)
preserves the left-hand layout discussed by the owner.
[Selected Audi draft](after-selected-390.jpg) shows the immediate summary/count update.
[Treido overview](reference-overview-390.jpg) and
[Treido category choice](reference-choice-390.jpg) record the inspected reference.

## Verification

80 focused browser cases passed against the owned development server on port 6461:

| Suite | Cases | Coverage |
| --- | ---: | --- |
| Mobile filter journey | 4 | 320×677, 390×844, 430×932, 700×390; all twelve panes, immediate choices, Back/Save/Close, exact and unique GET values, sorting and standalone quick-picker preservation |
| Chromium reflow | 36 | BG/EN, 320/390/430px; Home filters, Home/listing make, listing overview, budget and extras; normal, 200% root text, text spacing and 420px height |
| WebKit reflow | 24 | BG/EN, 320/390/430px; listing make, overview, budget and extras under the same reflow conditions |
| Overlay controls | 10 | BG/EN at 320/390/430/768/1440px; shared mobile header, icon alignment, same-dialog Back, clear search, close and focus return |
| Desktop discovery | 6 | Home/listing at 1024/1440/1920px; anchored menus, search, ranges, drafts, sticky controls and focus |

Architecture, CSS policy, tokens, pinned typography/icons, inventory/domain and
26 scroll/viewport helper assertions passed. `npm run check` reported zero errors
and zero warnings. The production build and its locale audits passed using Node
22.20.0. The overlay suite was adapted to the existing Bits desktop workspace
instead of looking for the superseded native desktop dialog classes.

Logs and preimages are retained in
`runtime/mobile-filter-wolt-2026-10-06/`. Changes are uncommitted on `main`, based
on `08c89d63f9e11939acd5b135ece4278252b80f43`. Unrelated working-tree changes were
preserved. No template promotion, dealer publication or deployment was performed.
Browser emulation does not establish physical Android/iPhone keyboard or safe-area acceptance.
