# Mobile showroom overlay editors — 2 October 2026

## Behavior

Home retains its branded header, search, vehicle categories and grey quick pills.
The standalone Filters icon/button is removed. Make & model, Price, Year, Fuel and
More each open **one** editor at the corresponding underlined tab. The editor uses
the existing Home/Services tab rail, including its underline, divider, horizontal
scrolling and arrow/Home/End keyboard behavior. Its sections are Make & model,
Price, Year, Fuel, Condition and More; More holds mileage, transmission and body.

The editor fills the mobile viewport. At 700px and wider it is a contained 640px
dialog. Options scroll between a fixed header/tab rail and a fixed, rounded red
Show N cars action. Reset changes only the draft. Selections survive switching
sections; the applied inventory, URL and stored filters change when Show cars is
pressed. Close, Escape and browser Back discard unapplied changes. Direct editor
URLs close in place. The make/model tree, search, variants, exclusion and non-car
make controls are reused inside the editor, with no nested picker dialog or OK
step. The native standalone pickers retain their original mode on reference routes.

Import and Sell tabs now show a short overview and a rounded Start enquiry button.
They open a sheet with **Car → Details → Review** progress:

- Import: make/model; budget and optional minimum year/listing; optional contact
  details and a car summary.
- Sell: make/model/year; mileage and optional price/condition; optional contact
  details and a car summary.

Continue validates the current step. Final save validates everything and returns
to the earliest invalid step if necessary. Back retains values. Closing, browser
Back and reload retain independent, bounded, versioned Import/Sell drafts when
browser storage is available. Final save prepares the matching Contact message;
it does not send an enquiry. Storage failure retains values in memory and displays
an error, without showing a successful save. The sample Import gallery remains
outside the sheet and is still identified as examples.

Native dialog infrastructure handles modal focus containment, Escape, background
scroll locking and opener focus restoration. The service step heading receives
focus after navigation; invalid fields receive focus on validation. Direct overlay
links and owned overlay history entries have separate dismissal behavior. These
are implementation facts; rendered browser acceptance remains pending below.

## Tap target refinement

The follow-up tap comfort change increases Home's quick pills from 44px to a
48px minimum height, with 16px labels, 16px side padding and 10px between pills.
The shared underlined tabs have a 52px minimum height. Text tabs in Filters and
Services use 16px labels and 16px side padding instead of 4px. The icon category
tabs keep their native 40px artwork inside the larger button target. Filter Reset
also has a 48px minimum height. Pills and tabs show a background while pressed.
The entire padded button remains clickable; horizontal scrolling, the underline,
keyboard navigation and selection semantics are preserved.

These are source dimensions. Actual tap geometry, small-screen rendering and touch
acceptance remain pending under the browser restriction recorded below.
The follow-up passed lint, typecheck, all 72 existing domain tests and a new
50-page production build (`Z0NHmv7SGxEPCakrw2T8q`). Home, Make/Price editor URLs
and Services/Import/Sell returned HTTP 200. Formatting and the scoped diff passed.
An existing `L:/CODEX/cars/.git/index.lock` blocked the initial tap-target commit.
Its modification time advanced during inspection, so it was preserved. The lock
cleared before the filter-control follow-up; the earlier tap changes are included
in that scoped delivery. No alternate index or lock-removal workaround was used.

## Filter control refinement

Reset now uses the shared 48px icon button, matching Close around the centered
Filters heading. Make & model remains one top-level section. Inside the car picker,
separate labelled Make and Model selector buttons show the current editing context.
Model is disabled until a make is chosen. Changing between the two option lists
retains that make's model selection. Selecting a make moves keyboard focus to the
Model selector. Selected make cards show model summaries and a remove action;
remaining in-stock makes appear once, without the duplicate Top Makes/alphabet
groups. The embedded list uses native scrolling instead of the copied custom rail.
Exclusion keeps its existing behavior, with a 48px switch target in the model list.

Price, Year and Mileage have persistent From/To labels and Any placeholders.
Their slider, numeric-entry constraints and filter semantics are retained. The
standalone native make picker and range controls keep their original presentation.
The showroom browser contract now also checks the initial disabled Model selector
and retained X6 selection after changing Make/Model views. That browser contract
has only been syntax checked; rendered acceptance is still pending below.

## Validation

Passed with Node 22.20.0:

- ESLint with zero warnings and TypeScript `--noEmit`.
- All 72 domain tests. Added coverage checks per-step validation, earliest error
  routing, unfinished draft recovery, filter URL sections, immutable draft changes
  across sections and Reset without changing the applied category.
- Production build, 50 static pages; final build ID `PcHJJmN5VmjmVJoyagqzh`.
- Syntax checks for the updated showroom browser suite and preview launcher.
- Latest HTTP 200 checks covered Cars, Make/Price/Year/More editor URLs, Services
  and Contact. The original overlay checks also covered the remaining filter and
  service deep links, retained Financing/Parts URLs and matching Contact contexts.
- `workspace-doctor.mjs --fetch`; root main was current with fetched origin/main.

The browser suite was updated for the new functional contract: one filter editor,
Apply versus cancellation, retained draft values between tabs, make/model/category
context, direct links, focus containment/return, service step validation and failed
storage. It also schedules every section/step at 320/390/1440px, 320x480px and 200%
text, with viewport, field, scroll-area and footer geometry assertions and captures.
It was **not executed** because the earlier local-URL browser policy block remains
in force. No alternative browser surface was used. Fresh screenshots, rendered
mobile/desktop acceptance and physical keyboard behavior remain unverified.

## Preview recovery

L: reached zero free bytes during development. The owned, ignored `.next` output
was moved to the existing Cars cache area on C:, preserving generated files and
source. The resulting output junction caused Services/Contact to return 404 even
though compilation succeeded. A fresh physical `.next-preview-6474` output on L:
restored all checked routes to HTTP 200. Large webpack caches now write to C: via
`NEXT_WEBPACK_CACHE_DIR`; `next.config.js` supports that optional override.

The launcher preserves its cross-drive dependency flags, automatically selects
the physical fallback when `.next` is a Windows junction, and supplies an external
dev cache for dependencies on another drive. Production output remains separate.
Next added the fallback dev type directory to `tsconfig.json`.
The current listener was started with the physical fallback and an explicit C:
webpack cache; the automatic launcher branch was reviewed and syntax checked.

Automatic approval review rejected removal of the unused `.next` junction with a
filesystem policy block. It and its generated C: target were preserved. The
launcher selects the working folder without requiring that removal. No user data,
source, Git history or unrelated cache was deleted. The listener remains on 6474.

Only the Mobile master and these local notes changed. Dealer copies, template
release selection, public projects and aliases were not updated. This remains a
local template candidate; source/build checks do not establish visual acceptance.
