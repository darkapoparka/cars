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
- The service-directory follow-up keeps clean white cards. Six descriptions are
  shortened, with make/model, direct-sale and vehicle search aliases retained.
  The top-right cue uses darker text and a small 12px chevron. Heading padding
  aligns the cue to the first title line when a title wraps. Desktop pairs use
  stretched cards with their content at the top; pressed cards have a neutral
  surface response. No generated service banners or images were added. Real
  dealer photography can support a later showroom or import-story section.
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
- Bottom navigation now uses original 24px Phosphor glyphs: front-facing car
  with headlights, wrench and conversation bubble. Regular inactive and filled
  active glyphs use the same source family and current color. The six paths are
  copied unchanged from official core commit
  `2b75f3ad12b420c9504ef05df8d2564a28f8500e`, with its MIT license and source
  receipt under `src/components/icons/phosphor/`. Retained reference assets are
  untouched. The glyphs were inspected in a standalone reference sheet at 24px
  and 48px; this is asset review, not a screenshot of the running application.
- Home's Sort action moves into the quick-pill row, retaining its modal, selected
  ordering, URL state and focus return. Clear moves to the row's end when filters
  are active. The visible count/sort toolbar is removed; result announcements
  remain available to screen readers. Inventory starts 12px below the controls.
- Home and Services share a compact 44px search trigger. Cars search opens the
  existing full-screen editor on a new Search tab, with input, matching vehicle
  suggestions and the shared Show cars footer. Search criteria combine with
  Make & model, Price, Year, Fuel, Condition and More in one draft. Close, Escape
  and browser Back cancel edits; Show cars or Enter applies them.
- Services search opens a focused full-screen overlay with matching offerings
  and a Show services footer. Applying searches across All; cancelling retains
  the original tab, country and topic. Both overlays use the contained desktop
  dialog and native focus/scroll handling. Search fields retain 16px text and
  a 44px Clear target.
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
- Home and Services search suppress duplicate browser search adornments and use a
  Search keyboard action. Enter applies the draft; IME composition is preserved.
  Cars focuses the input on initial search opening without stealing focus when
  navigating the underline tabs. Keyboard focus rings use the showroom accent
  inside pill/tab/navigation targets, and toast positioning accounts for the
  bottom safe area. These are source changes awaiting rendered acceptance.

## Verification

Using `L:/Toolchains/Node/22.20.0/node.exe` in `templates/mobile`:

These checks cover the search overlays, navigation glyphs and latest PDP source,
together with the preceding card, starter-entry, focus and service-directory
refinements. The PDP build receipt is recorded in its follow-up below.

- ESLint over `src`, with zero warnings: passed.
- TypeScript `--noEmit`: passed.
- Domain tests: all 81 passed, including query/price draft isolation, country
  filtering, sale type, optional VIN validation, immutable context seeding and
  legacy draft recovery.
- Prettier for the thirteen changed code/test files and the icon-source README:
  passed.
- `node --check scripts/qa-showroom.mjs`: passed. The script includes search
  opening, cancellation, application and new navigation-glyph assertions.
- The earlier standard `.next-review` production check stopped at its disk-space guard
  before invoking the build because C: had less than 1 GiB free. The search/navigation production
  build passed using `NEXT_DIST_DIR=.next-overlay-card-tabs-20261002` and
  `NEXT_WEBPACK_CACHE_DIR=L:/CODEX/cars/runtime/mobile-services-hierarchy-20261002/webpack-production-card-tabs`,
  with `node scripts/review-preview.mjs build`: 50 static pages, build ID
  `L8mUb_e5bwWCsxEs2q9pl`. This includes the search overlays, Phosphor navigation
  glyphs and service-directory refinement,
  compact 16:10 cards, outline Save controls,
  single-clear search, keyboard behavior, starter summaries and focus/safe-area
  refinements, together with the previous Home, Services and Contact changes.
- `node scripts/workspace-doctor.mjs --fetch`: completed. Cars was zero ahead and
  zero behind at the check. A subsequent fetch confirmed local `main` and
  `origin/main` matched at `b9c6ac23807b74b369a258ec8c1aa7c5a4ae78d6` during the
  follow-up. Intervening commits did not overlap Mobile or this report.
  Other dirty template work and Admin's four-ahead/four-behind state were
  preserved; this inspection does not claim the entire workspace is clean.
- After the latest build and preview restart, status-only HTTP HEAD requests on
  `http://127.0.0.1:6474` all returned 200 for nine routes: Home; Search; Search
  with BMW X6; combined query/Price; Services; service Search; Germany Import
  with Search; buyout query with Search; and Contact. No response body was
  inspected. Earlier passes also checked Sell, Financing, Parts, other filter
  URLs, Canada Import, the direct Sell overlay, BMW X6 detail and Car park.

The existing browser suite now includes the country and sale entry flows,
draft resume behavior, pill geometry, search transactions and navigation-glyph
contracts. It was syntax checked only:
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
was PID 41544 after the search/navigation refinement. The latest PDP restart and
build receipt are recorded below.

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
The latest workspace fetch log is
`runtime/mobile-services-hierarchy-20261002/workspace-doctor-search-icons.txt`.

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

The preceding change was committed as
`ea30a060be3b77fa23c9db45ca42281303ca8141`,
`Refine Mobile showroom controls and enquiry layouts`. Its 18-path scope and
preservation of the unrelated staged file IDs were verified, followed by a
non-force push and remote-main verification.

The service-directory follow-up is based on the fetched
`3f891e7e59edc607cad0c90d63063252c996a976`. It owns only these four paths:

```text
docs/mobile-services-hierarchy-20261002.md
templates/mobile/TEMPLATE.md
templates/mobile/src/components/ShowroomPages.tsx
templates/mobile/src/lib/showroom-services.ts
```

No paths were staged at the follow-up integration check. Use the native scoped
`git commit --only` procedure and preserve any subsequently staged foreign work.
Final tool output records the resulting commit and non-force push verification.
The preview's generated `next-env.d.ts` path changes remain outside the source
commit. Rendered acceptance remains a separate outstanding check. Mobile remains
a local candidate: this pass does not promote a release or deploy dealer copies.

## Search and navigation follow-up

The latest follow-up builds on `b9c6ac23807b74b369a258ec8c1aa7c5a4ae78d6` on
Cars `main`. It owns only these fifteen paths:

```text
docs/mobile-services-hierarchy-20261002.md
templates/mobile/TEMPLATE.md
templates/mobile/scripts/qa-showroom.mjs
templates/mobile/src/components/AppShell.tsx
templates/mobile/src/components/ShowroomFilterSheet.tsx
templates/mobile/src/components/ShowroomInventoryScreen.tsx
templates/mobile/src/components/ShowroomNavIcon.tsx
templates/mobile/src/components/ShowroomPages.tsx
templates/mobile/src/components/ShowroomSearch.tsx
templates/mobile/src/components/ShowroomServiceSearchSheet.tsx
templates/mobile/src/components/icons/phosphor/LICENSE
templates/mobile/src/components/icons/phosphor/README.md
templates/mobile/src/components/icons/phosphor/navigation.ts
templates/mobile/src/lib/showroom-filter-editor.ts
templates/mobile/tests/domain.test.mjs
```

The source glyph family was researched from the official Phosphor core and
React repositories. The library exposes the original regular and filled weights;
the reviewed source is pinned rather than introducing a new package or icon font.
The standalone icon reference sheet is retained at
`runtime/mobile-services-hierarchy-20261002/phosphor-navigation-reference.png`.
It is not a before/after screenshot of the application.

Source integration was pending at that follow-up. Native `git add --intent-to-add` for the four new
paths failed with `Unable to create L:/CODEX/cars/.git/index.lock: File exists`.
The existing lock was retained, and cached file IDs matched before and after
that failed operation. No alternate index, lock removal or unrelated Git-process
termination was used. Local and fetched main remained
`b9c6ac23807b74b369a258ec8c1aa7c5a4ae78d6` at the final check.

The existing lock subsequently cleared externally. This task did not remove it
or stop a foreign Git process. The intended integration includes these fifteen
owned paths and the three PDP paths below, using native intent-to-add for the four
new files, `git commit --only`, foreign staged-ID comparison and a non-force push
to main. A new shared index lock reappeared during the PDP checks and later
cleared externally; the latest source checkpoint is below. Generated preview paths stay excluded. Rendered
acceptance remains outstanding under the browser URL-policy restriction.

## PDP follow-up

The owner requested a slight detail-page polish while retaining the rounded
stats/drawer composition. The three additional source paths are
`DetailScreen.tsx`, `VehicleSections.tsx` and `VehicleCard.tsx`, under
`templates/mobile/src/components/`.

- Vehicle title and price use 24px text. The full trim description uses quieter
  14px text and wraps. Price stays left and the price-rating control sits right;
  its detail-only bars are slimmer and its target is at least 44px. Discounted
  vehicles retain their previous price and saving in a small rounded chip.
- The financing entry uses a neutral rounded row with its amount and a shorter
  Financing cue. Contact is a secondary outlined action and Enquire is primary;
  both use 15px medium text and at least 48px targets. Narrow/large-text content
  can wrap instead of relying on fixed widths. Gallery swipe, Save, enquiry
  vehicle context, existing prices and local finance behavior are retained.
- Stats stay in the same rounded white cards. Compact summary facts use a
  semantic description list, 24px icons and medium values. First registered and
  Owners labels shorten only the summary; full technical data remains. All
  specifications and All features controls open the retained dialogs, now with
  explicit accessible names. Their mobile panel footers use at least 48px
  targets. The Buying/Leasing selector uses native pressed buttons and the lease
  entry accurately says Leasing details for its captured-terms dialog.
- ESLint with zero warnings, TypeScript `--noEmit`, all 81 domain tests and
  formatting for the combined changed source/test scope passed. The browser
  script was syntax checked only. No new tests mirror the styling changes.

Cars `main` and fetched `origin/main` matched
`04568c0ee531e4b1fd3ac3215e9af1a4093a96d6` before the PDP build. Intervening
Modern, App, Auto Best, Import and Boxcar commits did not overlap Mobile or this
report. `workspace-doctor.mjs --fetch` completed with Cars zero ahead/behind,
905 changed paths and Admin four ahead/four behind; unrelated work was retained.
The current inspection log is
`runtime/mobile-services-hierarchy-20261002/workspace-doctor-pdp.txt`.

The latest production build passed with the same physical L: output/cache and
`node scripts/review-preview.mjs build`: 50 static pages, build ID
`PCUOVkRIe733bhSV97L8w`. This includes all search/navigation and PDP changes.
The owned listener PID 41544 was stopped only after revalidating its port,
executable and command. After the build, only the two generated include paths
were removed in memory and the complete remaining TypeScript config was compared
with its pre-build recovery copy before restoring the original bytes. The
generated `next-env.d.ts` imports were likewise normalized and compared before
restoration against the unchanged HEAD blob. Both files matched tracked source
before restart; the TypeScript config hash is still
`1F57C8C1BAA9DE8727B711D09D7A04E5AA8D051840DEF2622A5F948D9BA6C12A`.
The maintained dev preview restarted with `.next-preview-6474`, the L: cache and
listener PID 17912; its Node 22 executable and project command were verified.
Home, Services search and vehicle-context Contact returned 200, but the first
six detail/gallery/checklist HEAD requests timed out, then the server recorded
500 responses. A syntax-only scan of the fifteen generated JSON files found one
invalid `dev/prerender-manifest.json`: 670 bytes with non-JSON trailing data after
position 656. Source and production output were valid.

The owned listener 17912 was stopped after revalidating executable, command and
port. Its invalid generated manifest was preserved at
`runtime/mobile-services-hierarchy-20261002/prerender-manifest-corrupt-pdp-20261002.json`
(SHA-256 `b71fd272f3dce160d230f0385a8cc42f1933ad1de88f91411af143432a70fda4`).
Only the parseable complete prefix was retained, after validating manifest version
4 and its expected schema. The repaired 657-byte JSON parsed successfully;
no source, cache directory, junction or unrelated runtime was removed. The
preview restarted with the same output/cache as listener 18312.
Active preview imports remain generated-only changes excluded from integration.

After repair, status-only HEAD requests returned 200 for all nine affected
routes: the four vehicle detail pages, BMW X6 gallery/checklist, vehicle-context
Contact, Home and Services search. No response body was inspected. The dev
preview remains running on port 6474 as verified listener 18312. These health
results do not establish rendered mobile/desktop acceptance.

An earlier source inspection found Cars `main` at
`04568c0ee531e4b1fd3ac3215e9af1a4093a96d6`, matching fetched `origin/main`,
with no staged paths but an existing zero-byte
`L:/CODEX/cars/.git/index.lock`, created/modified at 2026-10-02 20:04:45 UTC.
No lock was removed or bypassed and no unrelated Git process was terminated.
The lock cleared externally before integration. A fresh workspace-doctor fetch
then confirmed local/fetched `main` at
`5623419ae374cbc18811f0cef61694638afbb8d4`, zero ahead/behind, with no staged
paths or index lock. The intervening Import commit did not overlap Mobile or
this report. Cars had 936 dirty paths and Admin remained four ahead/four behind;
other work is preserved. The fresh inspection receipt is
`runtime/mobile-services-hierarchy-20261002/workspace-doctor-pdp-integration.txt`.

Native integration uses the eighteen owned paths (the fifteen search/navigation
paths plus the three PDP components), intent-to-add for the four new files and
`git commit --only`. Foreign staged file IDs are compared before/after, then main
is pushed without force. Final tool output records the actual commit/push result.
`next-env.d.ts` stays outside that scope. This source integration does not select
a template release, refresh dealers or deploy a site.

The four new files were registered with native intent-to-add. The first scoped
commit collided with a shared index lock while another task's App commit landed.
Foreign cached file IDs still matched the pre-operation snapshot. The lock then
cleared externally; `7a7535b0ebd7556811fa98cb1aca1c863c441d1f` only changed
`templates/app`, leaving this Mobile scope intact. The native scoped commit is
retried on that inspected main, preserving other work and the four intent entries.

Automatic approval review rejected localhost browser access under the Browser
URL policy. This follow-up does not retry browser/CDP inspection or substitute
source composition for app screenshots. Fresh mobile/desktop geometry, drawer
interactions, large-text and visual acceptance remain pending. Status-only HEAD
health checks and source/build checks are recorded separately.
