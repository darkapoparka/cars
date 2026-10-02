# Mobile showroom hierarchy, 2 October 2026

The editable source is `L:/CODEX/cars/templates/mobile` on Cars `main`.
This change builds on `8bc1c01796c0a15258c2f5db95512a3dba13bf8d` and preserves
unrelated Cars and dealer work. Mobile remains a local template candidate;
this is not a template release or dealer deployment.

## Implemented behavior

- Services keeps its header, search and underline tabs, with a secondary,
  horizontally scrolling pill row immediately below the tabs. General service
  pills only include available offerings and retain search/topic URL state.
  The tab labels are All / Import / Sell.
- Import offers All countries, Germany, Canada and USA. Country choices filter
  the example gallery and persist in the URL. A compact “Import a vehicle”
  white starter card has a thin border and a small globe beside its 18px heading.
  The neutral entry area opens the existing three-step overlay and focuses the
  optional VIN field.
- Example import cards use retained sample photos, country badges and readable
  metadata. The gallery uses one larger card per row below 700px and two above
  it. These origins are illustrative template data, not a dealer's completed imports.
- Sell offers Direct sale and Part exchange, plus the same white starter
  pattern. Its URL-backed choice seeds the enquiry's sale preference.
- Each service overview card is a single native link, including its title and
  description. A smaller 28px View/Enquire cue sits at top right, while the
  description takes the full row below. The All quick pill contains the matching
  service count: All (8) initially. A separate visible count row is removed.
- Detail CTAs use their natural width, with rounded 36px painted faces inside
  44px link targets. Starter entries keep 48px native button
  targets and use smaller 32px Start faces; enquiry step controls are retained.
- Optional VIN, country and sale preference values survive draft storage and
  appear in the review/message draft. Existing v1 drafts remain readable.
  Reopening an enquiry preserves a preference edited inside the overlay;
  selecting a different outer context seeds that new preference.
- VIN entry accepts a 17-character alphanumeric value and does not decode it.
  Make/model and the existing required fields still need completion. Forms
  prepare local drafts; they do not transmit an enquiry or return a valuation.
- Home and service pills use lighter 32px outlined faces inside 48px native
  button targets, with neutral filled selection, a stronger selected border and
  14px labels. The Make/Model
  selectors retain their 36px faces. Underline tabs keep 52px targets and 16px
  text labels, with a wider 3px active rail inset only 2px from the tab edges.
  Home and filter-editor tabs use their own widths and horizontal scrolling.
  Services instead uses three equal-width All / Import / Sell tabs across the
  viewport, allowing labels to wrap at larger text sizes. Arrow-key navigation
  and automatic reveal of the selected tab remain intact.
- The retained mobile.de 10.26 reference in `reference/android/02-search-cars.png`
  and imported `SearchScreen.tsx` informed the wider indicator. Horizontal
  scrolling and the lighter pill row are intentional showroom adaptations.
- Inventory cards have two single-line subtext paragraphs: variant, then year /
  mileage / fuel / transmission. Automatic is displayed as Auto in the compact
  facts. Full values remain in the tooltip and detail page; long rows truncate
  instead of wrapping to a third line.
- Bottom navigation uses one 24px outline icon family with 1.8px strokes:
  simple side-profile car, service grid and phone. Retained icon assets remain untouched.
- Home's Sort action moves into the quick-pill row, retaining its modal, selected
  ordering, URL state and focus return. Clear moves to the row's end when filters
  are active. The visible count/sort toolbar is removed; result announcements
  remain available to screen readers. Inventory starts 12px below the controls.
- Home and Services share a smaller 44px search field, 16px input text and a
  44px Clear search target. Text search remains inline; the existing pills open
  the tabbed filter editor.
- Contact replaces the grey title area with a white action strip below the logo:
  rounded grey Call us / Visit us buttons keep 48px targets with 44px faces.
  The enquiry form sits in a centered white card on the grey section below,
  within 620px on wider screens. Its submit button uses the same compact
  36px face and 44px target as service actions.
- Phone and directions are not configured in the default template, so Call/Visit
  are inactive preview placeholders with an availability note. Verified values
  enable native phone/directions links; email is offered only when configured.
  Existing vehicle/service context, native message validation and local draft
  storage remain intact. No enquiry is transmitted.
- The final card spacing pass uses 16:10 photo frames and 12px body padding for
  inventory and import examples, with 16px corners. Inventory still has exactly
  two single-line subtext paragraphs; long vehicle names wrap within the card.
  Card Save actions use outline hearts from the same family as the header, with
  36px faces inside 48px buttons, native pressed state and orange saved state.
- Import and Sell use the same 18px starter headings and compact single-line
  entry summaries. Full summary values remain available through an accessible
  description and tooltip. Country selection, local drafts and overlay steps
  are retained.
- Home and Services search suppress duplicate browser search adornments, use a
  Search keyboard action and dismiss the keyboard on Enter after inline filtering.
  IME composition is preserved. Keyboard focus rings use the showroom accent
  inside pill/tab/navigation targets, and toast positioning accounts for the
  bottom safe area. These are source changes awaiting rendered acceptance.

## Verification

Using `L:/Toolchains/Node/22.20.0/node.exe` in `templates/mobile`:

These checks cover the final compact card, search, starter-entry and focus pass.

- ESLint over `src`, with zero warnings: passed.
- TypeScript `--noEmit`: passed.
- Domain tests: all 80 passed, including country filtering, sale type,
  optional VIN validation, immutable context seeding and legacy draft recovery.
- Prettier for the changed source, tests and browser script: passed.
- `node --check scripts/qa-showroom.mjs`: passed.
- The earlier standard `.next-review` production check stopped at its disk-space guard
  before invoking the build because C: had less than 1 GiB free. The latest production
  build passed using `NEXT_DIST_DIR=.next-overlay-card-tabs-20261002` and
  `NEXT_WEBPACK_CACHE_DIR=L:/CODEX/cars/runtime/mobile-services-hierarchy-20261002/webpack-production-card-tabs`,
  with `node scripts/review-preview.mjs build`: 50 static pages, build ID
  `kLEyPcy86w-cwVc2b3Zvv`. This includes compact 16:10 cards, outline Save controls,
  single-clear search, keyboard behavior, starter summaries and focus/safe-area
  refinements, together with the previous Home, Services and Contact changes.
- `node scripts/workspace-doctor.mjs --fetch`: completed. Cars was zero ahead and
  zero behind at the final pre-commit check; local `main` and fetched `origin/main`
  matched. Other dirty template work and Admin's four-ahead/four-behind state
  were preserved; this inspection does not claim the entire workspace is clean.
- After the latest build and preview restart, status-only HTTP HEAD requests on
  `http://127.0.0.1:6474` all returned 200 for 12 routes: Home, Make and Year filter
  URLs, Services, Import, Germany and Canada import URLs, Sell, the direct Sell
  overlay URL, Contact, BMW X6 detail and Car park. No response body was inspected.

The existing browser suite now includes the new country and sale entry flows,
draft resume behavior and pill geometry contracts. It was syntax checked only:
browser URL policy blocked rendered verification. Fresh 320px, 390px, 1440px,
short-screen, large-text, touch/focus and screenshot acceptance remain pending.
HTTP health checks are separate from this visual acceptance.

Earlier source-drive ENOSPC and cold compilation interruptions were resolved;
the compact-layout pass's warmed health checks passed. During the card/tab pass,
C: became too full for the standard production check. This task used fresh,
ignored L: build output and caches without deleting or moving files or junctions.
The previous owned preview listener was stopped after verifying its executable,
command and port. The owned preview was restarted through
`scripts/review-preview.mjs` with `.next-preview-6474` and the L: cache at
`runtime/mobile-services-hierarchy-20261002/webpack-dev-card-tabs`. The listener
was PID 25700 after the final card/search refinement and remains running.

The alternate build's generated TypeScript paths were removed after verifying
they were the only additions, and the original `tsconfig.json` bytes were restored.
Its SHA-256 matches the pre-build recovery file:
`1F57C8C1BAA9DE8727B711D09D7A04E5AA8D051840DEF2622A5F948D9BA6C12A`.
After the build, `next-env.d.ts` restoration was verified against
HEAD blob `ba37dd810ca0b3486aaf915dd337aa33adcc6cf8`, after confirming its changes
were generated import paths. While active, the preview can regenerate these two
imports to `.next-preview-6474/dev/types`; generated path changes remain outside
this task's staged scope. Neither generated config belongs to the staged scope.
The recovery copies remain at
`templates/mobile/.qa/tsconfig-before-card-tabs-20261002.json` and
`templates/mobile/.qa/next-env-before-card-tabs-20261002.txt`.

The pre-Contact source recovery file remains at
`runtime/mobile-services-hierarchy-20261002/ShowroomPages-before-contact-20261002-180311.tsx`.
The final workspace fetch log is
`runtime/mobile-services-hierarchy-20261002/workspace-doctor-final-polish.txt`.

## Source handoff

The earlier zero-byte index lock cleared externally during the final checks.
This task did not remove it, stop unrelated Git processes or set an alternate index.
At the final pre-commit check, Cars was on `main` at
`6be4023c510b04212f8c86f667e2b619a20c7899`; fetched `origin/main` matched, zero
ahead and zero behind. Intervening App, Import and Carwow commits did not alter
Mobile source or this report.

There were 132 unrelated staged paths under `templates/import`, with no Mobile
paths staged. The delivery procedure uses `git commit --only` for the 18 paths
below and compares the unrelated staged file IDs before and after. The two new
Mobile paths are registered with intent-to-add; unrelated staged source is kept
intact. Final tool output records the scoped commit and non-force push result.

This task owns these changed paths:

```text
docs/mobile-services-hierarchy-20261002.md
templates/mobile/TEMPLATE.md
templates/mobile/scripts/qa-showroom.mjs
templates/mobile/src/components/AppShell.tsx
templates/mobile/src/components/MakePicker.tsx
templates/mobile/src/components/ShowroomImportExamples.tsx
templates/mobile/src/components/ShowroomInventoryScreen.tsx
templates/mobile/src/components/ShowroomNavIcon.tsx
templates/mobile/src/components/ShowroomPages.tsx
templates/mobile/src/components/ShowroomQuickPills.tsx
templates/mobile/src/components/ShowroomSearch.tsx
templates/mobile/src/components/ShowroomServiceRequest.tsx
templates/mobile/src/components/ShowroomTabs.tsx
templates/mobile/src/components/ShowroomVehicleCard.tsx
templates/mobile/src/components/make-picker.stylex.ts
templates/mobile/src/lib/service-requests.ts
templates/mobile/src/lib/showroom-services.ts
templates/mobile/tests/domain.test.mjs
```

The source commit message is `Refine Mobile showroom controls and enquiry layouts`.
Verify its exact path scope and preservation of unrelated staged file IDs before
non-force pushing `main`; verify the resulting commit on `origin/main` afterwards.
Rendered acceptance remains a separate outstanding check. Mobile remains a local
candidate: this pass does not promote a template release or deploy dealer copies.
