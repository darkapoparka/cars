# Testing reference

Inventory's desktop Filter button now opens the App-style modal from 992px.
The [9 October comparison and browser checks](desktop-filter-modal-2026-10-09/README.md)
cover its category navigation, local draft, exact GET submission, make/model
dependencies, ranges, resets, removable selections, live/zero counts, sorting,
focus and desktop geometry. The earlier full-form assertions described below
target the retained Search form and its preceding Filter entry; they do not
establish acceptance of this new modal. Quick selectors and mobile retain their
existing implementations. Check both `desktopInventorySearch` settings when
changing the entry routing.

`node scripts/desktop-model-groups-smoke.mjs` checks the shared desktop model-family editor on Home, inventory shortcuts and the full form's nested picker. It covers compact contextual headers, focused BMW families, Back/focus restoration, selection retention, direct model search, 0-stock choices, stationary frame/page/footer, short families without phantom scrolling, cancelled drafts and legacy model GET results in BG/EN at 992x600 and 1440x900. Six development-only cases test a 99-choice family with a long header path at 1024x600. Set `MODEL_ENGINE=webkit` for the installed second engine, `MODEL_CASE` for focused cases, `MODEL_MOTION=no-preference` for normal opening motion and `MODEL_EVIDENCE_DIR` for a run's output. The [navigation verification record](MODEL-NAVIGATION-2026-10-08.md) records the behavior and preserved catalogue boundaries.


Desktop brand screens on Home and inventory follow their full search surface
with adaptive card sizing (six columns at 960px). Model opens at that brand-screen
width when no single make is selected and retains its opening width during
navigation. A single selected make still opens its compact 640px model picker
directly. The identity and make-catalogue checks cover both surfaces' widths,
alignment and retained selection behaviour.

Search menus share measured anchors and an 8px gap outside the whole search box,
including collision flips above it in short windows. Focused editors retain their
field's horizontal alignment. Their header uses the same padding and 44px close
control; the full Filters form reuses that close-button renderer. The desktop
wide-filter checks cover every shortcut's gutter, header alignment and gap.

The [earlier desktop search checks](DESKTOP-MODEL-PICKER-2026-10-07.md#verification) record the original shortcut anchoring and 840/640/480px widths, loaded manufacturer logos, header search alignment, compact choices, pending counts and preserved mobile journeys.

Home checks also measure the desktop menu's visible 8px gap from the entire
search bar, including menus flipped above it in short windows. Desktop selectors
share a 120ms opacity-only opening; reduced motion retains immediate opening.

`node scripts/desktop-make-catalogue-smoke.mjs` checks the 179-brand desktop
catalogue on Home and inventory in BG/EN at 992x600 and 1440x900. It checks
stock-first ordering, accessible counts, loaded logos, Volkswagen artwork,
accent-insensitive search, a compact single result, the full checkbox keyboard
sequence, internal scrolling with a stationary footer, cancellation and applying
a zero-stock make through the canonical GET flow. Use the same `BASE_URL`,
`FILTER_EVIDENCE_DIR` and optional `FILTER_CASE` settings as the listing suite.
Two additional 992x600 BG/EN cases cover the full Filters form's compact Make
rows, catalogue, nested focus and zero-stock results with sorting retained.

`node scripts/desktop-wide-filter-smoke.mjs` checks the listing full
filter form in BG/EN at 992, 1024 (600px tall), 1280, 1440 and 1920px. It verifies
all 13 criteria together, aligned 44px fields, nested brand/model multiselect and
dependencies, cancellation, reversed price/year validation, local reset with
sorting preserved, canonical GET data, empty-result application, focus
containment/return, fixed footer geometry and horizontal overflow. All seven
hero shortcuts must still open their own anchored selector directly. Two
outside-stock cases preserve every applied criterion, including exact numeric
values. Two development-only 68-option equipment fixtures check scrolling,
footer stability and reset focus. Set `BASE_URL` to the confirmed template server
and `FILTER_EVIDENCE_DIR` to a run's evidence directory. `FILTER_CASE` accepts
names such as `bg-992`, `en-out-of-stock` and `bg-equipment-catalog`; omit it
for all 14 cases.

`desktop-discovery-smoke.mjs` checks Home/listing search and direct selectors at
1024/1440/1920px, including model inference, repeated selections, range inputs,
application/cancellation, query ownership and sticky focus. It checks the shared
form's 13 standard-height controls and aligned labels. `filter-code-smoke.mjs`
checks case-insensitive identity retention, all styled scalar menus, equipment
multiselect, canonical form data, radio-arrow browsing with Enter/Space
confirmation, nested focus and cancellation. Sorting must preserve applied
criteria and navigate only after confirmation. Set
`FILTER_ENGINE=webkit` for WebKit, or `FILTER_CASE='^.*-1440$'` for desktop
locale cases. Mobile sheets retain their existing range/multiselect/back-arrow
and responsive checks at 320/390px and short heights.

Current dropdown captures belong in `docs/dropdown-polish-2026-10-07/`;
the earlier `docs/styled-filter-selectors-2026-10-06/` records the native-to-styled migration.
The compact-header checks are saved under [current QA](dropdown-polish-2026-10-07/qa/summary.json):
Chromium/WebKit filter cases, Home opening/selection, mobile journeys and 12
built-preview desktop cases. The two development-only equipment fixtures remain
part of the full 14-case suite described above.
`docs/home-modal-restore-2026-10-06/` records the preserved modal composition.
Saved dropdown checks: [desktop form](styled-filter-selectors-2026-10-06/qa/desktop-wide.json),
[Chromium](styled-filter-selectors-2026-10-06/qa/chromium.json),
[WebKit](styled-filter-selectors-2026-10-06/qa/webkit.json) and
[mobile journeys](styled-filter-selectors-2026-10-06/qa/mobile.json).
The earlier [Home-style form](final-filter-polish-2026-10-06/before-keyword-1440.png)
is the restoration reference. The white-field experiment and tabbed listing
workspace in previous capture folders are historical comparisons, not the
current implementation. The transparent Комби artwork remains the separate
asset correction recorded in `provenance/body-wagon-2026-10-06.md`.
Set `DISCOVERY_ROUTE=/cars` to verify listing discovery independently
while Home's browsing box is being updated in another task.

Tests cover different layers: source/type checks, domain logic, runtime media, build output and real browser behavior. This document explains the available commands; it is not a claim that every suite currently passes.

The domain suite also checks the shared desktop suggestion matcher for accents,
case, punctuation, multiple terms and empty queries. Shared model transitions
infer a uniquely owned make, preserve the make when clearing or retaining a model
outside stock, and leave the source draft unchanged. The existing desktop suites
exercise those helpers through both the full filter form and direct selectors.

Mobile Cars cards keep compact photographs beside their title and price, with photo width capped so wider phone layouts retain balanced columns. Cards at most 24rem wide show year, full formatted mileage, fuel and transmission below both columns; wider mobile cards add body style. Content-sized facts retain 8px horizontal padding and 4px gaps and wrap when enlarged text needs room. Home keeps three badges below its title and price: year, mileage and fuel. Home prices use 20px/600. The inventory right column uses an 18px/600 price against a 16px/500 model: the identity sits 2px below the photo top and the price 2px above its bottom, with at least an 8px gap. Below 12rem of card width, enlarged text stacks the photo, identity/price and facts rather than wrapping the price in a narrow side column. A compact mobile View all button sits inside the Featured cars banner beneath its title; All services follows Buying guides. The first two desktop action banners use two subtle supporting rows. No specification badges overlay mobile photos; desktop retains its original overlays and specification pills. Compact localized labels retain their full accessible values. Model titles stop at two lines while accessible labels and detail views retain complete values. Sell/Import show a compact white How it works card beneath the mobile form, with a centered arrow and complete single-line supporting copy at 320px. The card opens the retained bottom drawer with preparation advice and three service steps. Their mobile form titles are visually hidden but remain accessible; the centered segmented choices use Home's compact sizing. Import uses a charcoal mobile hero while Sell keeps its red hero and both retain the brand accent on their primary actions. The lower mobile page uses a faint configured texture; desktop retains its visible title and process disclosure. `mobile-polish-smoke.mjs` checks these contracts, including long Tesla and petrol/LPG layout fixtures, pale borderless entry fields with one leading glyph and readable muted prompts, pointer/keyboard focus, balanced 20px header icons within 44px targets, guide dismissal/focus return and enquiry preservation. `service-entry-overlay-smoke.mjs` also checks card/arrow geometry and explanation copy after waiting for hydration. `mobile-reflow-smoke.mjs` includes both service routes and their guide drawers at normal/enlarged text sizes and in short viewports.

## Package commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Vite development server |
| `npm run build` | SvelteKit/Vite production build |
| `npm run preview` | Serve built output locally |
| `npm run check` | SvelteKit synchronization and Svelte/TypeScript diagnostics |
| <code>npm run check:architecture</code> | Native source architecture checks |
| <code>npm run check:css-policy</code> | Reject fragile selectors, invalid standalone-CSS <code>:global(...)</code>, and dealer artwork/palette leakage |
| `npm run check:tokens` | Validate token aliases, reference cycles, source usage, shared control-height overrides and all corner declarations; reject hard-coded corners and spacing-token radii |
| `npm run check:typography` | Reject local typography values outside the shared token owner and verify pinned Inter / Fluent sources, including the dock; preserve the archived generated trial |
| `npm run smoke:typography` | Current Sell/Import flows, entry tabs, action hierarchy and clipped controls at 320/390/768/1440px |
| `npm run smoke:phase4` | Phase 4 discovery-draft, shell/navigation, focus, return-state and breakpoint contracts |
| `npm run check:assets` | Static media and source-reference checks |
| `npm run validate` | Architecture, CSS policy, tokens, typography, assets and domain checks followed by Svelte/type check and build |
| `npm run check:dependencies` | Registry advisory audit; fail on high/critical vulnerabilities |
| `npm run quality` | Validation/build, dependency audit, then smoke on a fresh owned preview |
| `npm run smoke:preview` | Test the existing build on an automatically started/stopped loopback preview |
| `npm run smoke` | Route/journey, enquiry and discovery browser suites |
| `npm run check:domain` | Inventory, filter and journey/domain assertions |

The exact command definitions are in [package.json](../package.json). `quality` composes the existing suites and starts its own preview after the build. The operating system chooses a free loopback port; the runner checks readiness, stops on a failed suite and closes only its own server. It does not reuse `BASE_URL` or stop another preview. `smoke` still targets an explicitly supplied `BASE_URL`.

## Typical development checks

```sh
npm run check:css-policy
npm run check:tokens
npm run check
npm run check:domain
npm run check:assets
npm run build
```

`validate` combines the static/domain/build stages defined in the package. Architecture checks examine native application boundaries; CSS policy checks enforce semantic selectors and centralized dealer theme ownership; token checks verify the shared reference graph and component aliases; asset checks compare public media with references; domain checks exercise actual TypeScript domain functions rather than separately reimplementing them.

The `check` script fails on Svelte errors and warnings. TypeScript also rejects unused locals and parameters. `quality` runs validation, the registry dependency audit and browser smoke on a fresh owned preview; no `BASE_URL` is required. For manually managed previews, build first, then start/restart the preview before running `smoke`. Rebuilding beneath a running preview can invalidate its loaded output. `validate` remains usable without registry access. The HTTP smoke checks security headers on localized pages, redirects, errors and rejected writes, without submitting enquiries.

## Browser setup

Start the intended server in one terminal. In another, set `BASE_URL` and run the suite:

```powershell
$env:BASE_URL = "http://127.0.0.1:6461"
npm run smoke
```

Or in a POSIX shell:

```sh
BASE_URL=http://127.0.0.1:6461 npm run smoke
```

For the built preview, use that preview URL instead. `scripts/browser.mjs` controls the browser channel/executable and target URL. [Development](DEVELOPMENT.md) describes the environment options.

## Browser suite responsibilities

| Script | Main behavior |
| --- | --- |
| `scripts/sveltekit-smoke.mjs` | Entry point for native route and journey coverage |
| `scripts/route-smoke.mjs` | Routes/status codes, images, page errors, overflow and responsive layout |
| `scripts/journey-smoke.mjs` | Listing/article returns, full-photo dialog keyboard/close/backdrop behavior and focus/scroll restoration, vehicle contact context, discovery and menu interaction |
| `scripts/enquiry-smoke.mjs` | Enquiry entry, steps, review, local photos and sharing/copy behavior |
| `scripts/service-entry-overlay-smoke.mjs` | Mobile Sell/Import single-field entry, immediate criteria editor, full-screen geometry, shared close target, Save/Cancel/Escape, draft persistence, invalid URLs, contact/review continuation, 200% text and text spacing; white guide cards with centered arrows, compact entry tabs, accessible titles, 22px header glyphs, focus containment/return, backdrop/drag/keyboard dismissal and release at the desktop breakpoint |
| `scripts/mobile-filter-smoke.mjs` | Bulgarian returning-visitor single-pane filter draft, immediate choices, Back/Save/Close, exact GET criteria, standalone quick-picker preservation and empty results |
| `scripts/mobile-polish-smoke.mjs` | Bulgarian/English mobile actions, full-height photographs loaded when browsed, subtle make and two-line models with complete accessible labels, emphasized prices, balanced photo/detail columns and a single bottom strip with four facts on narrow Cars cards, five on wider mobile Cars cards and three on Home, long Tesla/electric/petrol-LPG layout fixtures, 48px pale borderless entry fields, inset 40px selected pills inside 44px selector frames, compact 40px action surfaces with 44px targets, and pointer/keyboard focus, 22px header glyphs, inventory search and quick filters matching Home pill size with 44px targets, inset rounded white dock with separate 44px targets and official Fluent Regular SVG geometry, destination colors, selected states and baselines across main routes, matching Sort/Filter targets and rightmost Filters, filter footer, detail touch targets, short-viewport editors and configured settings title, white service guide cards and drawer focus/dismissal |
| `scripts/mobile-reflow-smoke.mjs` | English/Bulgarian pages and dialogs at 320/390/430px, 200% root text, WCAG text-spacing overrides and short viewports; rejects clipped actions and enlarged card copy, and checks equal inventory card heights |
| `scripts/radius-smoke.mjs` | Shared 12px mobile outer cards across fourteen route states and eleven dialog states in BG/EN at 320/390/767px (150 cases). The shared `card-radius-contract.mjs` inspects every visible card, car fact badge and inset vehicle photo, including selected-vehicle Contact, banner tiles, Sell photo/review/feedback and Import summary/completion. A temporary 17px token verifies card-role propagation while badges stay 6px and photos 10px. Controls retain 12px and sheets 24px. Included in preview smoke; `CARD_RADIUS_PREVIEW=14` or `16` checks alternatives through the same token. |
| `scripts/home-browse-smoke.mjs` | Four-field Home bar in BG/EN at 768/992/1440/1920px and short desktop windows; resting/hover/open surfaces, balanced painted car heights and baseline, make/model/body drafts, Escape/focus return, dependent models, exact budgets, range validation, keyboard GET and matching results |
| `scripts/desktop-discovery-smoke.mjs` | Home browsing-bar journey and seven inventory shortcuts into focused desktop selectors; direct make/model search, stable keyboard selection, equipment multi-selection, range validation, cancellation/focus, applied URL state, dependent model reset and sticky-control behavior |
| `scripts/desktop-routes-smoke.mjs` | Localized route geometry, individual campaign artwork within a shared frame, compact search-title spacing, plain About subtitle, unified Blog search/category panel and native GET filtering, About panels, discovery-tile hover, showroom actions and desktop-only map mounting |
| `scripts/phase4-smoke.mjs` | URL/filter preservation, nested and outer draft ownership, pending desktop values, shell transitions, menu focus, duplicate IDs and 767/768/991/992 boundaries |
| `scripts/typography-smoke.mjs` | Entry/segment/CTA hierarchy, keyboard tab switching, link/VIN/description editor save and discard, stable card height, sell/import validation and review, reference edits and clearing, manual fallback, copied text, Escape/focus return, control reflow and screenshots |

Additional mobile/accessibility/resilience and visual-comparison tools exist in the newer local working source but are not package scripts in this standalone baseline. Do not assume a fresh clone includes them.

## Focused mobile polish checks

With `BASE_URL` set to the current build, run `node scripts/mobile-polish-smoke.mjs`. It covers 320, 390, 430 and 1440px in Bulgarian and English. The filter suite and this focused suite set explicit returning-visitor preferences; first-visit prompt behavior belongs to `scripts/qa-locale-preferences.mjs`. The mobile checks inspect control geometry as well as document overflow, because clipped labels and shrinking icons can occur without widening the page. Generated screenshots and results are saved under `artifacts/mobile-polish-smoke/`.

For a focused reflow rerun, `REFLOW_CASE` accepts a regular expression matching the case names printed by `scripts/mobile-reflow-smoke.mjs`. For example, `$env:REFLOW_CASE='^en 320 / reflow$'` selects the narrow English Home case. Leave it unset for the full route/dialog matrix. `REFLOW_ENGINE=webkit` selects the installed WebKit engine; the default uses Chromium.

Run `node --test scripts/radius-policy.test.mjs` for the corner-policy fixtures. They prove that the token check accepts shared roles, zero corners and one-pixel border insets while rejecting raw physical/logical corners and spacing tokens used as radii. Component-local radius variables must also alias shared radius tokens. The runtime radius suite inspects actual computed styles, so a competing responsive override cannot pass merely because it references a token.

## Phase 4 regression contract

`npm run smoke` now includes `npm run smoke:phase4`. The focused suite uses the same `BASE_URL`, browser helper and artifact reporting conventions as the existing route, journey, enquiry, mobile-filter and desktop-discovery suites.

It verifies sort and chip changes without dropping unrelated URL state; nested picker Apply/Cancel versus outer dialog Apply/Cancel; deterministic make/model reset; Home desktop pending values; filtered inventory → detail → anchored return; direct and client-side route presentation; contact-topic and menu active state; detail mobile actions; footer/mobile-dock/detail-bar transitions; focus restoration; desktop mega-menu keyboard ownership; duplicate IDs; horizontal overflow; and explicit 320, 390, 430, 767/768, 844-landscape, 991/992, 1024, 1440 and 1920 boundaries.

The domain suite exercises parser/serializer round trips for every public listing key, draft conversion, equipment-array isolation, malformed/zero/whitespace/safe-integer numbers, make/model reset and preservation, facet URL preservation, chip labels, sort behavior and safe return context using the real TypeScript modules.

Phase 4 visual qualification compares production previews of the exact parent and implementation commits with fonts loaded, reduced motion and stable scroll position. Its committed result is documented in [the architecture execution ledger](ARCHITECTURE-REFACTOR-PLAN.md#phase-4-implementation-record--15-september-2026); generated screenshots and JSON reports remain under ignored `artifacts/`.

Reports/screenshots generated by the active scripts are written under `artifacts/`. Inspect the named failure and the corresponding source. An old report is not the result of the current run; a screenshot alone does not establish that a form, redirect or keyboard flow works.

## Practical browser scenarios

`node scripts/desktop-routes-smoke.mjs` checks Home, Inventory, About, Blog and
general Contact in Bulgarian and English at 992, 1024, 1440 and 1920px, plus
320px and 390px regression passes. Set `BASE_URL` first. It verifies the shared
540px desktop hero, at least 60px below the header, and introduction/control
control anchors of 340px on Home, Inventory, Blog and service entries. Home,
Inventory and Blog omit their supplementary desktop line and place the title
28px above the search panel; compact desktop uses the 32px section role so the
title clears the side cars. Service titles retain their 200px anchor. About and
general Contact start their page labels at 200px, with a two-line headline below
and actions flowing 24px after the complete copy. About puts its
plain city/address subtitle 8px below the title, with a localized accessible
directions label, hover title and visible focus ring.
Actual header navigation in both
languages checks these positions through Home, Inventory, About, Contact and Blog;
the import, trade-in and leasing routes
use the same frame. Header, logo and navigation bounds remain unchanged through
those page transitions. Artwork framing remains identical through header
navigation while the image or car pair changes for each main destination. The initial Home
load waits for hydration before testing the hover disclosure and title click.
Home and Inventory keep the same search-panel width and top anchor. Home's
three-field bar is shorter and retains the surrounding hero clearance.
Blog uses the same panel width and alignment, containing search and category
pills together on one white surface. Its index has four columns from 1200px and
two at compact desktop widths, with no extra empty margin below the hero.
Its explicit search button and Enter key
submit the native GET form; localized title filtering, empty results, category
and query preservation, and clearing search are checked in both languages.
Below 1200px, the painted vehicle bounds must clear the search panel on Home,
Inventory and Blog, keeping the cars visible above its outer corners.
Desktop DOM order places Guides before About, including the keyboard Tab order.
It also verifies
single-line desktop card titles with complete accessible labels and compact
title-to-specifications spacing, one selected raster scene request on About and
Contact, and distinct original car pairs on Home, Inventory and Blog. Mobile
requests none of these desktop scenes. Home's four desktop section banners
use one common graphite-dot background with no object overlays; mobile does not
request this background. Home, Inventory and Advice also reuse this background behind
their original vehicle pairs, without native dots or red-curve decorations.
Check unchanged car and discovery-control geometry, the title-to-panel gap and background decoding.
Home's Import/Leasing banners use red/graphite surfaces, white copy/actions and
the matching desktop front-facing cutouts. Check equal main-car visible areas,
tyre baselines, clear separation from copy and unchanged Import/Leasing destinations.
Their desktop-only picture sources must not request the new assets on mobile.
The suite also checks
title/description/control separation, real Inter
glyph rendering (including Cyrillic), visible images, page overflow and runtime
errors. Desktop content canvases are light grey with white cards;
all heroes use white headings on dark campaign artwork. About shares the black
palette and no longer uses the warm architectural photograph.
Contact keeps its call action and keyboard-accessible directions anchor. Its
visit panel follows the hero without overlap. Its contact column is capped at
360px on both About and Contact; the framed map fills the remaining width, and both share the same top and
bottom edges inside 32px panel padding. Address and appointment values must wrap
without clipping, and the stacked phone/directions actions stay at the bottom.
Check both actions' destinations and keyboard focus. Address and visit rows use
plain labels and values without icons. About's desktop service heading shows the
configured light-surface logo with its business name as the accessible heading;
verify proportion, image decoding and the unchanged service destinations.
Home omits its desktop location badge; the header retains the business address.
About uses a plain location subtitle. About/Contact share one white visit
panel with a real map and call/directions
actions. The map mounts after desktop hydration and is absent from mobile DOM;
the suite waits for that mount. Live provider rendering needs separate visual
inspection and is not established by the iframe URL assertion.
Inventory omits the secondary count line in its desktop hero,
with applied and zero-result cases checked in BG/EN. Hero and map social controls
render only configured profiles. General Contact replaces the desktop footer's
service cards with one white Facebook, YouTube and Instagram panel below the
visit card. Its title sits above three bordered profile cards, with round brand
icons and labels underneath. Cards keep a 16px gap and equal heights;
check that it shares the visit card's width, radius and 32px spacing. Preview-only empty
profiles are labelled samples and have no link or keyboard action; published
pages omit missing profiles and omit the section if none are configured.
Check the row at 992px and 1440px, with normal and enlarged text, in BG/EN;
configured links need platform labels, keyboard focus and safe external targets.
It warms lazy images before saving full-page 1440px/390px captures under
`artifacts/desktop-routes-smoke/`. Search, filter drafts, sticky controls, keyboard
focus and article return behavior remain covered by desktop-discovery and journey
suites. See [desktop route audit](DESKTOP-ROUTE-AUDIT.md) for the styling contract.

For a focused rerun, set `DESKTOP_ROUTE_CASE` to a regular expression matching the
case names. Focused evidence is saved separately under
`artifacts/desktop-routes-smoke-focused/`; leave it unset for the complete matrix.

Use 390px and 1440px as the primary mobile/desktop pair. Add 320px and 430px for narrow mobile behavior, 768px/991px/992px for layout transitions, and a wide viewport for hero artwork. Use the same viewport, browser, loaded fonts and scroll position for visual comparisons.

| Area | Exercise |
| --- | --- |
| Home | Search, Buy/Import mode, service links, body/brand expansion and video action |
| Inventory | Query, make/model dependency, range values, equipment, sorting and zero matches |
| Filter dialogs | Open nested choices, cancel, apply, close and return focus |
| Detail | Data/description/equipment tabs, contact actions, finance and return to filtered stock |
| Sell/import | Invalid and valid input, back/edit, review, photo removal, copy/share and cancellation |
| Editorial | Search/category, article opening, related links and filtered return |
| Shell | Mobile menu, desktop mega menu, keyboard navigation and footer/dock behavior |
| HTTP | Known pages, invalid IDs, redirects, robots and sitemap |

Check that content does not disappear behind fixed mobile actions, that a closed dialog releases page scrolling, and that each important link retains its intended destination. Missing-image and provider-failure scenarios are useful for client deployment, but a mocked provider test does not verify the provider itself.

## Updating tests with components

Prefer accessible roles/names for meaningful interactions and stable component selectors for layout-specific checks. When a component is renamed or split, update its tests to exercise the same behavior. Avoid treating a stale selector as proof that the application is broken, or removing the assertion merely because it fails.

The standalone source and current working preview have different enquiry/finance implementations; select the actual component for the tested revision. [Components](COMPONENTS.md) records that distinction.

## Documentation-only changes

Check relative file links, headings, code paths and npm script names against the checkout. Ensure examples describe implemented APIs and Markdown is UTF-8. Application screenshots and a production rebuild are unnecessary when the diff changes only documentation and no build inputs.

Current cross-repository ownership, approved releases, dealer-copy workflow and standalone/mounted limits: [Cars integration](CARS-INTEGRATION.md).

## Native locale release checks

`npm run check:locales` verifies deterministic catalog output. `npm run check:locale-source` audits literal rendered/accessibility copy and static key/alias calls. `npm run test:locales` includes compiler, policy, source-audit and negative fixtures. Both catalog and source audits run before a production build.

With `BASE_URL` set to an owned built preview, `npm run smoke:locales` runs the EN/BG route, HTTP, legacy, preference, storage, race, journey and completion suites serially. `scripts/run-locale-qa.mjs` supports named output labels and explicit suite selection. Source snapshots and logs distinguish tested source from later edits; see [localization coverage](localization/COVERAGE.md).

The existing discovery/enquiry suites use `locale-smoke-fixture.mjs` to seed a returning Bulgarian visitor; first-visit behavior is independently tested by the locale suites. They retain their original behavioral assertions while accepting native localized URL prefixes and current control copy. General smoke success does not replace EN/BG or public-deployment acceptance.

## Overlay control regression checks

Mobile facet pickers use `QuickFilterSheet.svelte`: their panel fits its content on
opening. Focusing Search does not change its height. The opening list space is
measured as the sheet opens and retained while filtering, so the search field and footer stay
steady. Flex shrink and the shared visible-viewport attachment constrain the panel
when the keyboard reduces the available space; only the result list scrolls.
`MobileListingFilters.svelte` swaps the overview and criterion editor inside one
native dialog; standalone quick pickers retain their own Apply action. Both use
`dialogViewport` for the visible viewport, as does `VehicleQuickSearch.svelte` for
Home search.
Check short/long lists, empty searches, clear/reopen, Back/Save, quick-picker Apply,
backdrop dismissal and focus return at 320/390px. The result list scrolls independently;
the header and footer remain visible when the viewport shrinks. Desktop geometry
is unchanged. `scripts/check-overlay.mjs` also checks viewport resize/panning,
nested ownership, listener cleanup and the missing-API fallback. Real Android and
iPhone keyboards remain a separate device check.

Mobile pickers use the shared 20px heading role, aligned 16px gutters and compact
4px option gaps, with 48px minimum choice targets and 44px header/footer actions. Selected choices use a pale
row with a small black radio or checkbox indicator.
Mobile action glyphs delegate to the pinned Fluent Regular renderer. The white
panel animates within its stationary viewport frame; reduced motion disables it.

Matched 320x884 captures compare [idle before](mobile-picker-2026-10-05/before-idle-320.jpg)
and [idle after](mobile-picker-2026-10-05/after-idle-320.jpg), plus
[focused search before](mobile-picker-2026-10-05/before-focus-320.jpg) and
[focused search after](mobile-picker-2026-10-05/after-focus-320.jpg).

Run `node scripts/check-overlay.mjs` for scroll-lock release order, duplicate cleanup and exact scroll restoration. With `BASE_URL` set to the intended local preview, run `node scripts/overlay-controls-smoke.mjs`; run again with `OVERLAY_ENGINE=webkit` for the installed WebKit engine. Missing browsers are errors, not silent skips.

The matrix covers BG/EN at 320, 390, 430, 768 and 1440px, with short 420px viewports for form/filter controls. It checks the token-derived 44px interaction shell and 40px visible circle, SVG centering within 0.5 CSS pixels, native appearance, icon size, reachable Close/Save actions, nested dialog dismissal, focus return and discarded editor drafts. Existing route, discovery, enquiry, phase4, typography and localization suites remain separate. Desktop Chrome and Windows WebKit emulation do not replace physical iOS/Android keyboard and safe-area testing.

### Final mobile regression checks

Set `BASE_URL` to a built preview and run `node scripts/mobile-final-smoke.mjs`. It checks EN/BG at 320/390/430px: 200% text reflow, service artwork/copy separation, navigation target containment, reduced motion, menu focus return, inert hidden footer navigation, and responsive image loading/priority. Screenshots and results are saved under `artifacts/mobile-final-smoke/`. Use the existing route, enquiry, mobile-filter and overlay suites for the wider journeys; this focused suite is not a WCAG certification or a physical-device performance test.

Run `node scripts/mobile-reflow-smoke.mjs` against the same preview for nine routes and thirteen dialog views in EN/BG at 320/390/430px. It checks normal layout, 200% root text, WCAG text-spacing overrides and short dialogs. In PowerShell, set `$env:REFLOW_ENGINE = 'webkit'` to repeat with WebKit; remove that variable to use Chromium. Both engines must preserve visible card copy and actions without horizontal overflow. Reports are saved under `artifacts/mobile-reflow-<engine>/`.

### Shared entry controls

With `BASE_URL` set, run `node scripts/shared-entry-smoke.mjs`. It compares shared control roles in Home, Sell and Import in EN/BG at 320/390px, and Sell/Import at 768/1440px, while retaining each card's composition. Mobile entry fields are 48px tall. Selectors keep their 44px gray frame and inset 40px selected pill, with equal-width segments that stay stable when selection changes. Primary actions retain 44px touch targets with 40px visible surfaces. Desktop fields stay 44px. The suite checks both selected states, label fit, keyboard selection, overflow, invalid home import links and valid-link prefill. Screenshots and results go to `artifacts/shared-entry-smoke/`. Run `scripts/enquiry-smoke.mjs` for draft, validation, review, photo, sharing and focus behavior; `TYPOGRAPHY_SCOPE=services node scripts/typography-smoke.mjs` covers service typography and short viewports.

### Anchored selectors and mobile filter panes

Desktop shortcuts now open 380px anchored Popovers without a backdrop. The wide
filter suite checks attachment, viewport clearance, switching shortcuts, outside
dismissal, Escape focus return and preservation of the applied URL. Discovery
checks also cover off-screen anchor dismissal and a usable scrollable menu beside
its control in a 400px-tall desktop window.

`mobile-filter-smoke.mjs` checks twelve directly available criteria in one sheet,
one-tap single choices, selected-choice return, in-place Clear, Back/Save/Close,
dependent model reset, exact GET values without duplicate parameters and sorting
at 320/390/430px and 700x390. It also checks 48px targets, draft-only range presets,
visibility of every preset when the pane fits, direct keyword focus and search-clear focus. Every standalone quick picker opens
its own criterion and returns focus on Escape; their Apply action, search-height
stability and preservation of unrelated criteria remain covered.
For focused BG/EN text and short-screen coverage, set `REFLOW_CASE` to
`(filters|make|home-model|home-price|listing-price|listing-equipment) dialog reflow` and run
`mobile-reflow-smoke.mjs`. The 48 cases cover Home filters, make/model and budget,
plus inventory make, overview, ranges and extras at 320/390/430px in BG/EN, including
200% root text, text-spacing overrides and short viewports.
Model coverage uses Mercedes-Benz to check that the long title clears Back and
Close. Repeat with `REFLOW_ENGINE=webkit` for the installed second engine.

`overlay-proportions-smoke.mjs` checks the actual 48px filter/choice roles and
44px searches/footer actions in both languages. Inventory criteria use the same
dialog for the overview and editor, while direct quick pickers retain Apply.

[Matched mobile comparison and local verification](mobile-filter-soft-2026-10-06/README.md)
records the restored soft-grey controls and the current local boundary.

`node scripts/filter-code-smoke.mjs` covers applied brands/models with different
letter case, one checked canonical option in main/quick/desktop menus,
preservation of selected suggestions hidden by search, exact numeric GET values,
nested Escape ownership, focus return, click-away focus and switching between
open selectors. Desktop cases distinguish neutral pointer opening from keyboard
opening into search or a range input. `home-browse-smoke.mjs` covers the same
opening behavior in the Home bar. Desktop single-choice cases also cover radio-arrow browsing,
Enter/Space confirmation and closing an already selected option without changing
the pending filter or submitting the form. With `BASE_URL` set to the intended
preview, it runs BG/EN at 320, 390 and 1440px. Repeat with `FILTER_ENGINE=webkit`
for the second installed engine. Results are saved under
`artifacts/filter-code-<engine>/`. Set `FILTER_CASE=bg-1440` for a focused case.
The domain suite also checks safe numeric
normalization and a finite slider bound for empty stock.
Saved local results: [Chromium](filter-code-audit-2026-10-06/qa/chromium.json),
[WebKit](filter-code-audit-2026-10-06/qa/webkit.json),
[mobile journeys](filter-code-audit-2026-10-06/qa/mobile-journeys.json),
[desktop discovery](filter-code-audit-2026-10-06/qa/desktop-discovery.json) and
[desktop filters](filter-code-audit-2026-10-06/qa/desktop-wide.json).

[The outlined experiment](mobile-filter-final-2026-10-06/README.md) preserves the rejected treatment. The prior
[Wolt comparison](mobile-filter-wolt-2026-10-06/README.md) records the plain-row experiment.
The earlier
[App comparison](filter-reference-2026-10-06/README.md) preserves the preceding layout.
