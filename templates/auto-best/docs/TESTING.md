# Testing reference

Tests cover different layers: source/type checks, domain logic, runtime media, build output and real browser behavior. This document explains the available commands; it is not a claim that every suite currently passes.

Mobile listing badges use four equal cells and compact localized labels on one text line; carousel specifications share one badge row. Model titles stop at two lines while accessible labels and detail views retain complete values. Sell/Import show a compact white How it works card beneath the mobile form, with a centered arrow and complete single-line supporting copy at 320px. The card opens the retained bottom drawer with preparation advice and three service steps. Their mobile form titles are visually hidden but remain accessible; the centered segmented choices use Home's compact sizing. Import uses a charcoal mobile hero while Sell keeps its red hero and both retain the brand accent on their primary actions. The lower mobile page uses a faint configured texture; desktop retains its visible title and process disclosure. `mobile-polish-smoke.mjs` checks these contracts, including long Tesla and petrol/LPG layout fixtures, pale borderless entry fields with one leading glyph and readable muted prompts, pointer/keyboard focus, balanced 22px header icons within 44px targets, guide dismissal/focus return and enquiry preservation. `service-entry-overlay-smoke.mjs` also checks card/arrow geometry and explanation copy after waiting for hydration. `mobile-reflow-smoke.mjs` includes both service routes and their guide drawers at normal/enlarged text sizes and in short viewports.

## Package commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Vite development server |
| `npm run build` | SvelteKit/Vite production build |
| `npm run preview` | Serve built output locally |
| `npm run check` | SvelteKit synchronization and Svelte/TypeScript diagnostics |
| <code>npm run check:architecture</code> | Native source architecture checks |
| <code>npm run check:css-policy</code> | Reject fragile selectors, invalid standalone-CSS <code>:global(...)</code>, and dealer artwork/palette leakage |
| `npm run check:tokens` | Validate token aliases, reference cycles, source usage and shared control-height overrides |
| `npm run check:typography` | Reject local typography values outside the shared token owner and verify pinned Inter / Fluent sources, including the dock; preserve the archived generated trial |
| `npm run smoke:typography` | Current Sell/Import flows, entry tabs, action hierarchy and clipped controls at 320/390/768/1440px |
| `npm run smoke:phase4` | Phase 4 discovery-draft, shell/navigation, focus, return-state and breakpoint contracts |
| `npm run check:assets` | Static media and source-reference checks |
| `npm run validate` | Architecture, CSS policy, tokens, typography, assets and domain checks followed by Svelte/type check and build |
| `npm run quality` | Combined validation and browser suite chain |
| `npm run smoke` | Route/journey, enquiry and discovery browser suites |
| `npm run check:domain` | Inventory, filter and journey/domain assertions |

The exact command definitions are in [package.json](../package.json). `quality` composes existing scripts rather than starting the application server itself.

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

The standalone `check` script currently uses `--threshold error`; warnings are not automatically equivalent to a failed warning-free check. To inspect stricter diagnostics explicitly, run `npx svelte-check --tsconfig ./tsconfig.json --fail-on-warnings` after synchronization. Its `quality` chain is validation followed by smoke.

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
| `scripts/service-entry-overlay-smoke.mjs` | Mobile Sell/Import single-field entry, immediate criteria editor, full-screen geometry, shared close target, Save/Cancel/Escape, draft persistence, invalid URLs, contact/review continuation, 200% text and text spacing; white guide cards with centered arrows, compact entry tabs, accessible titles, 26px header glyphs, focus containment/return, backdrop/drag/keyboard dismissal and release at the desktop breakpoint |
| `scripts/mobile-filter-smoke.mjs` | Bulgarian returning-visitor filter draft, nested choices, application, empty results and result-label containment |
| `scripts/mobile-polish-smoke.mjs` | Bulgarian/English mobile actions, full-height photographs loaded when browsed, subtle make and two-line models with complete accessible labels, plain price hierarchy, equal card heights and right-column two-by-two badges with one text line, long Tesla/electric/petrol-LPG layout fixtures, 52px pale borderless entry fields and pointer/keyboard focus, 22px header glyphs, inventory search and quick filters matching Home pill size with 44px targets, flat white dock with official Fluent Regular SVG geometry, destination colors, selected states and baselines across main routes, matching Sort/Filter targets and rightmost Filters, filter footer, detail touch targets, short-viewport editors and configured settings title, white service guide cards and drawer focus/dismissal |
| `scripts/mobile-reflow-smoke.mjs` | English/Bulgarian pages and dialogs at 320/390/430px, 200% root text, WCAG text-spacing overrides and short viewports; rejects clipped actions and enlarged card copy, and checks equal inventory card heights |
| `scripts/desktop-discovery-smoke.mjs` | Seven single-line native filters with field-name placeholders and permanent accessible labels on Home and inventory, applied URL state, dependent model reset and sticky-control behavior |
| `scripts/desktop-routes-smoke.mjs` | Localized route geometry, individual campaign artwork within a shared frame, compact search-title spacing, plain About subtitle, unified Blog search/category panel and native GET filtering, About panels, discovery-tile hover, showroom actions and desktop-only map mounting |
| `scripts/phase4-smoke.mjs` | URL/filter preservation, nested and outer draft ownership, pending desktop values, shell transitions, menu focus, duplicate IDs and 767/768/991/992 boundaries |
| `scripts/typography-smoke.mjs` | Entry/segment/CTA hierarchy, keyboard tab switching, link/VIN/description editor save and discard, stable card height, sell/import validation and review, reference edits and clearing, manual fallback, copied text, Escape/focus return, control reflow and screenshots |

Additional mobile/accessibility/resilience and visual-comparison tools exist in the newer local working source but are not package scripts in this standalone baseline. Do not assume a fresh clone includes them.

## Focused mobile polish checks

With `BASE_URL` set to the current build, run `node scripts/mobile-polish-smoke.mjs`. It covers 320, 390, 430 and 1440px in Bulgarian and English. The filter suite and this focused suite set explicit returning-visitor preferences; first-visit prompt behavior belongs to `scripts/qa-locale-preferences.mjs`. The mobile checks inspect control geometry as well as document overflow, because clipped labels and shrinking icons can occur without widening the page. Generated screenshots and results are saved under `artifacts/mobile-polish-smoke/`.

For a focused reflow rerun, `REFLOW_CASE` accepts a regular expression matching the case names printed by `scripts/mobile-reflow-smoke.mjs`. For example, `$env:REFLOW_CASE='^en 320 / reflow$'` selects the narrow English Home case. Leave it unset for the full route/dialog matrix. `REFLOW_ENGINE=webkit` selects the installed WebKit engine; the default uses Chromium.

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
Home and Inventory keep identical search-panel bounds.
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

Run `node scripts/check-overlay.mjs` for scroll-lock release order, duplicate cleanup and exact scroll restoration. With `BASE_URL` set to the intended local preview, run `node scripts/overlay-controls-smoke.mjs`; run again with `OVERLAY_ENGINE=webkit` for the installed WebKit engine. Missing browsers are errors, not silent skips.

The matrix covers BG/EN at 320, 390, 430, 768 and 1440px, with short 420px viewports for form/filter controls. It checks the token-derived 44px interaction shell and 40px visible circle, SVG centering within 0.5 CSS pixels, native appearance, icon size, reachable Close/Save actions, nested dialog dismissal, focus return and discarded editor drafts. Existing route, discovery, enquiry, phase4, typography and localization suites remain separate. Desktop Chrome and Windows WebKit emulation do not replace physical iOS/Android keyboard and safe-area testing.

### Final mobile regression checks

Set `BASE_URL` to a built preview and run `node scripts/mobile-final-smoke.mjs`. It checks EN/BG at 320/390/430px: 200% text reflow, service artwork/copy separation, navigation target containment, reduced motion, menu focus return, inert hidden footer navigation, and responsive image loading/priority. Screenshots and results are saved under `artifacts/mobile-final-smoke/`. Use the existing route, enquiry, mobile-filter and overlay suites for the wider journeys; this focused suite is not a WCAG certification or a physical-device performance test.

Run `node scripts/mobile-reflow-smoke.mjs` against the same preview for seven pages and four dialogs in EN/BG at 320/390/430px. It checks normal layout, 200% root text, WCAG text-spacing overrides and short dialogs. In PowerShell, set `$env:REFLOW_ENGINE = 'webkit'` to repeat with WebKit; remove that variable to use Chromium. Both engines must preserve visible card copy and actions without horizontal overflow. Reports are saved under `artifacts/mobile-reflow-<engine>/`.

### Shared entry controls

With `BASE_URL` set, run `node scripts/shared-entry-smoke.mjs`. It compares Home, Sell and Import card and control styles in EN/BG at 320/390px, and Sell/Import at 768/1440px. It checks 44px segment, input and action targets, keyboard selection, overflow, invalid home import links and valid-link prefill. Screenshots and results go to `artifacts/shared-entry-smoke/`. Run `scripts/enquiry-smoke.mjs` for draft, validation, review, photo, sharing and focus behavior; `TYPOGRAPHY_SCOPE=services node scripts/typography-smoke.mjs` covers service typography and short viewports.
