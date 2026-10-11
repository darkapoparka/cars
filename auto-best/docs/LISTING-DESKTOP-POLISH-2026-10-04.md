# Listing desktop filters — 4 October 2026

## Current implementation

The owner rejected paired setting columns, a narrow mobile-style drilldown, and the subsequent dropdown grid. This revision uses a wide desktop dialog with a persistent category list and one options area. Make and Model are separate; changing Make clears an incompatible Model. Hero shortcuts open their category directly. The short Bulgarian label `Купе` is retained.

Options are visible buttons, equipment supports multiple selections, and budget/year/mileage use numeric inputs. Selected chips remain visible below the options and can be removed individually. Clear edits the draft; the pinned Apply action shows the matching count. Closing cancels pending changes. Category navigation supports arrow keys, Home and End.

The joined Filter/Recommended control remains sticky above results. Sorting preserves filters, and chip removal preserves sorting. The listing grid uses four columns at 1440px and five from 1600px. Desktop changes start at 992px; Home, tablet native controls and mobile filters retain their existing components.

## Verification

- Node 22.20.0; Svelte/type check: zero errors and warnings. Production build passed. CSS policy, typography and locale source checks passed during this revision.
- In-app browser: direct category entry; Audi → Model → RS Q8 → Budget; chip removal; changing Make to BMW resets Model; applying yields `?make=BMW`; invalid 100000–50000 range rejected; closing retains applied URL; arrow navigation selects the adjacent category.
- At 992×720, Apply remains visible and categories scroll within the panel. BG/EN labels inspected. No console errors recorded in the built preview.
- Mobile dialog at 320×844 is pixel-identical to the original baseline. At 390×844 the only difference is in the close-button area; fields and footer match.
- Earlier checks of the unchanged toolbar covered descending-price sorting, filter preservation, chip removal and sticky position.
- Existing discovery and route smoke scripts updated. Discovery syntax checked; CLI browser suites not executed. Browser checks above used the in-app browser.

Evidence: `L:/CODEX/cars/runtime/auto-best-listing-polish-2026-10-04/`. `before-modal-1440.jpg` is the original modal; `workspace-after-1440.jpg` is this revision. Earlier experimental screenshots are retained as history. Mobile evidence: `workspace-mobile-320.jpg`, `workspace-mobile-390.jpg`. Check logs: `workspace-build.log`, `workspace-doctor.log`.

## Scope

New components: DesktopFilterWorkspace, DesktopListingSearch, DesktopListingTools. Integrations: ListingFilters, ListingResults, VehicleSearchDialog, listing route and CSS. Testing documentation and only the listing interaction hunk in desktop-routes smoke belong to this task. Existing unrelated source, locale outputs, imagery and route-smoke edits are preserved.

This is local template source and preview work. Owner visual acceptance, immutable template promotion and dealer deployment are separate and have not been claimed.
