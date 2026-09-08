# Auto Best — implemented improvements

8 September 2026 · reusable master `J:/cars/templates/auto-best` · `2026.09.08-polish-1`

[Before/after gallery](comparison.html) · [Original audit](J:/cars/audits/2026-09-08/auto-best/README.md) · [Ownership contract](J:/cars/templates/auto-best/ARCHITECTURE.md)

## Scope and source protection

This implements the owner's request to improve the audited template and show matched screenshots. It changes the J: Auto Best master, not the original M: Day & Night project or independent client copies. There is no Git repository in this master. No commit, push, deployment, message sending or CRM operation was performed.

All 89 files in the original audit manifest matched before implementation. The current source was backed up under `before-source/`, with hashes in `before-manifest.json`. Fresh “before” screenshots were captured before editing. The preview was restarted after the app restart and again after validation; it serves this template on port 6461 using Node 22.23.2. A stale Vite export during implementation caused a failed intermediate browser run; restarting the owned listener resolved it. The final reports replace that intermediate failure and are independently persisted.

## Visible and behavioral improvements

| Change | Result | Original findings |
|---|---|---|
| Vehicle contact context | Finance, inspection, detail and mobile actions include a validated record ID. Contact shows the selected vehicle and a route back. Unknown IDs do not create fake context. | M02, D02, A03 |
| Honest actions | Removed the decorative gallery counter. Contact labels describe a conversation instead of implying a message was sent. Removed fake social controls from optional sample profiles. | M04, D05 |
| List continuity | Vehicle/article Back preserves query filters and sort, and returns to the selected card anchor. Return destinations are confined to their own lists. | M03, D04 |
| Stock discovery | Home types/brands derive from the eight records; all four available brands are shown on mobile. Compact 2×2 mobile grids use the existing “All” heading links. Navigation no longer promotes Sedan/Crossover or an empty new-car collection. | M05, D06 |
| Correct editorial destinations | Home and mega-menu teasers open the relevant guide or contact page. | M06, D07 |
| Keyboard and modal access | Defined the missing focus token, added a skip link and replaced the mobile pseudo-dialog with a native modal. Background focus is isolated; Tab wraps; Escape/resize/navigation release state. | M07/M09/M12, D03/D09, A01 |
| Shorter article support | Related reading and contact remain; repeated search, categories and popular topics are removed. Index search/categories and article topic links remain available. | M11, D08 |
| Bulgarian body labels | Internal codes retain stable URLs while visible filters/details use Bulgarian labels. Record 8's contradictory category label is corrected to match its existing Coupe code. | M13, D10 |
| Optional sample sections | Demo people and unverified partner logos default off. Components and source assets remain available for deliberate template review. | M01/M10, D01 |
| Responsive asset delivery | Removed retired home media markup. Desktop side cars and mobile front artwork use media-qualified picture sources. Hidden alternate hero art no longer creates those requests. | D11, A11 |
| Error detail dock | A missing/invalid vehicle uses general navigation rather than a car-specific inspection dock. | M08 |

## Architecture and quality changes

- `listing.ts` owns facet values, body labels, URL serialization, active counts, hidden fields and dependent chip removal. Numeric parsing rejects malformed/negative/unsafe values, preserves zero, and equipment selections are deduplicated. Existing local draft interfaces remain appropriate to their separate tasks.
- `journeys.ts` owns known-vehicle context and safe return destinations. Sitemaps and legacy detail redirects derive from inventory/article records instead of separate counts.
- Inventory derives display year, mileage and href from numeric fields. Records explicitly carry sample/verified status and an evidence boundary. A domain check validates numeric records, IDs, URL/filter behavior and CSS variables.
- `MobileMenu.svelte` and `ArticleSupport.svelte` separate coherent rendering responsibilities. The header retains navigation orchestration. `overlay.ts` centralizes reversible scroll ownership and the modal Tab boundary used by the repaired flows.
- `app.css` now imports named token, native-default, navigation and responsive-composition sheets in the original cascade order. The ownership contract identifies which file owns each change. Existing component/global overlaps are documented rather than rewritten into a new styling framework.
- Typed brand/presentation configuration controls preview indexing and optional sections. Preview mode is noindex/disallowed. Published mode requires a valid public origin, verified identity/inventory, per-record evidence and disabled sample sections.
- The former 2,019-line smoke script is preserved in the source backup. The new entry delegates to route and journey suites; existing dedicated enquiry/mobile-filter/desktop-discovery suites remain. Reports persist incrementally, exceptions are recorded, and failures set a nonzero exit status. `BASE_URL` must be explicit and the installed Chrome channel is supported. `quality` now includes browser qualification.

These are bounded refactors, not a framework migration or a claim that every old selector needed rewriting. The remaining cross-surface CSS should be consolidated only by component family with visual proof. Enabled-service copy and featured media remain separate typed datasets; a future client still needs a full identity scan, not just a brand-file edit.

## Verification

Validated using supported Node 22.23.2 and installed Chrome:

- Architecture: **86** native/configuration files.
- Assets: **98** inventoried media files; **96** referenced by application source plus **2** explicitly retained source assets. No media was deleted.
- Domain checks: eight records; parsing/serialization, repeated equipment, zero bounds, dependent reset, safe returns, known-vehicle context and CSS variable ownership.
- Svelte: **0 errors, 0 warnings**; production build passed. See `evidence/validate.log`.
- Route sweep: **64** route/state checks at 390/1440, including all eight cars, all nine articles, every contact intent, empty results and invalid routes. **8** additional responsive cases each cover six routes at 320, 430, 768, 991, 992, 1024, 1920 and 844×390. No page overflow, broken visible images or JavaScript exceptions in the successful sweep.
- Journey suite: **8/8** cases, including every vehicle's finance handoff at both widths, filtered list/article return, empty recovery, focus, menu isolation and viewport-aware media.
- Dedicated suites: **4/4** mobile-filter viewport cases, **4/4** Sell/Import cases and **6/6** desktop-discovery cases. Sharing/clipboard are stubbed; **no server submissions** were made.
- Final surface check: route navigation in both directions, desktop mega-menu keyboard dismissal and the balanced mobile discovery grids at 320/390/430/991/992/1440.
- Svelte autofixer reviewed all 27 modified/new components. Manual triage: reported contact hrefs are validated external maps/import/social/tel URLs; card links already call `resolve()` inside the return helper; list return URLs are confined by the loader. Existing popover effects synchronize a native DOM API and do not derive reactive state. Literal-attribute suggestions were fixed. See `autofixer.json`.

The module split was followed by fresh rendered captures. The final small grid adjustment was checked again at mobile/tablet/desktop widths and built again. No public/provider/production result is implied by this local evidence.

## Before/after review

The gallery contains matching mobile 390×844 and desktop 1440×900 captures of Home, filtered inventory, vehicle 4, vehicle-aware leasing contact, About and article 1. Choose full page to compare section lengths. Before and after use the same route, viewport and capture settings; the selected-car query intentionally demonstrates how the old contact page discarded it.

`before/` and `after/` contain the original browser PNGs. `mobile-enquiry-comparison.png` is a labeled side-by-side composition of the two original viewport screenshots; no UI was synthesized. Full-page browser screenshots naturally place fixed navigation at its captured viewport position.

## Remaining content boundary

Source dealer identity, source hero media, editorial claims and the eight sample vehicles remain. Photos are shared by records 4/7 and 6/8, and equipment was inherited at model-family rather than VIN level. Their real-world correctness has not been established by this task. The code now identifies/gates that uncertainty; it does not invent replacement facts.

The master is improved for local template review and future personalization. A lead-ready copy still needs verified business facts and per-item inventory/media, plus real delivery only if a backend/provider integration is requested. Existing client copies were not synchronized.


### Leasing placement follow-up

Moved the selected vehicle into the leasing hero and removed its duplicate from the section below. Generic leasing links offer vehicle selection. Inspection retains its existing vehicle summary. Verified 24 route/viewport combinations at 320, 390, 430, 768, 992 and 1440 px: no overflow, overlapping vehicle card or runtime errors; selected vehicle links and keyboard focus pass. Svelte check: zero errors/warnings. Architecture check passes. Autofixer flags only existing dynamic external/telephone links in ContactIntent, which must not use internal route resolution. Updated comparison captures reflect this change.
