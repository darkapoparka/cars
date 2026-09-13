# Mobile visual and interaction audit

Screenshots live under `.audit/mobile-2026-09-12/screenshots/`; tiled full-page review images are in `sheets/`. Full-page screenshots include the browser's fixed elements at capture position, and contact sheets contain padding between tiles: do not confuse those artifacts with duplicated navigation or actual page whitespace. All discovered route states were captured; manual visual review was deepest for the page families below and the tested interaction states.

## Confirmed defects that should lead the work

### V01 — P1: selected blog categories disappear

On `/blog`, select `Продажба`. The URL changes and the result set correctly drops to two articles, but the selected category text is white while its measured background is transparent over white. The default `Всички` state has the same problem. This is not a filtering failure; it is an invisible active state. Evidence: `state-blog-selected.png`, `interaction-results.json`; owner: `BlogIndexPage.svelte` active category styles. Fix the mobile token dependency and add selected/unselected/keyboard-focus screenshots at 320, 390, and 430px. Do not remove or restyle the existing desktop yellow hero as a side effect.

### V02 — P1: menu close control leaves the viewport

At 568×320, the open menu drawer is about 402px tall with its top at -82px; the close button is approximately y=-43px with height 44px. The menu's height/overflow override bypasses the shared drawer constraints. Evidence: `state-menu-568x320.png`, `interaction-results.json`; owner: `MobileBottomDock.svelte` plus `MobileDrawer.svelte`. Use an in-viewport header/close action and a scrollable body sized to the available visual viewport. At 390px portrait the menu looked usable, and Escape eventually closed it and restored scroll/focus; do not describe its outgoing transition as a permanent scroll-lock leak.

### V03 — P1: initial-render and landmark gaps

Eight sampled no-JavaScript routes have no useful visible page content. Duplicate main-target IDs occur on financing and the direct sell request, while axe reports missing main landmarks on article, FAQ, and reviews pages. These require shared shell/route fixes, not cosmetic padding patches. See C01/C02 in the codebase report and `engine-results.json`, `browser-results.json`, and `axe-summary.json`.

### V04 — P2: keyboard and feedback gaps

On the vehicle-detail tablist, pressing ArrowRight from `Инфо` leaves that tab selected; the source provides click handling but no standard tablist keyboard behavior. The fourth compare action is correctly refused, but no alert was emitted in the tested state. Provide an accessible limit explanation and a route to revise the selection, without adding action clutter back to listing cards. Evidence: `journey-results.json`; owner: `MobileDetailPage.svelte` and garage/compare feedback.

### V05 — P2: localized errors, contrast, and rating semantics

The tested sell/import service-failure states show the server's English error text in the Bulgarian UI. Both lead contact cards have 11px secondary text; axe reported a narrow contrast failure (4.49:1) for that copy. Reviews contains nine rating wrappers with an `aria-label` on a generic div and no valid role; axe flags this separately from their demo status. Use localized error mapping, a readable secondary-text token, and appropriate rating semantics. Keep the clear demo-review disclosure.

## Home — preserve the discovery hierarchy

The dark hero, Buy/Import switch, search, quick fuel filters, budget tiles, featured cars, brand grid, and lower lead entries form a recognizable mobile direction. This is a better foundation than starting again. Refine vertical rhythm, image/label alignment, and shared control states before changing content order. Keep quick pills in one deliberately scrollable row where needed; do not squash them into accidental double rows. A 3,135-line owner is a maintenance issue, not a reason to remove useful sections.
At finalization, exercise every home-to-inventory preset, search overlay, clear action, and import hand-off with realistic empty/long values. The current home SSR still contains useful text with JavaScript disabled. Prioritize page weight and component boundaries while preserving the approved desktop home.

## Inventory — preserve compact cards and URL behavior

The current cards are intentionally uncluttered: photo, status, title, price, financing note, and four compact specifications. Do not restore per-card action buttons merely to satisfy old tests. A 40-car list is long, but length alone does not justify virtualization. Introduce pagination/load-more only if measured loading or navigation needs it.
The real-browser flow applied BMW and showed eight cars, changed to descending price, opened a vehicle, and returned to the same filtered/sorted URL. A nonsense query produced an explicit zero-result state and reset action. These behaviors should be retained as tests. The canonical crawl found no document-wide horizontal overflow or broken loaded visible images in its 124 Chromium captures; intentionally horizontal rails must remain locally scrollable rather than being counted as page overflow.
`/inventory/map` settles to the mobile inventory composition, not a distinct map view. Decide whether the mobile route should redirect, provide an explicit location panel, or be removed from mobile entry points. An early WebKit development capture overflowed, but the settled production recheck in Chromium/WebKit/Firefox did not reproduce it. Do not ship a fake map or label this a confirmed persistent Safari overflow bug.

## Vehicle detail — keep the focused drawer, finish its behavior

The photo area with back/save/compare/share controls and the information/data/extras drawer provides a distinct mobile experience. The data and extras views remain readable in the tested 390px screenshots. Preserve the two intended resting positions; do not add more snap points to hide layout problems. Fix server-rendered fallback content, tab keyboard support, and compare-limit feedback first.
Test short viewport and orientation changes, long titles/prices, description/extras scrolling, the expanded drawer's relationship to top controls, and safe areas. The representative journey had no thumbnail buttons, so it did not exercise a multi-photo gallery or swipe progression. Add an explicit multi-photo fixture and verify first/last/swipe states before claiming gallery completion. Native share, clipboard permissions, telephone, and Viber hand-offs require separate browser/device confirmation; no external hand-off was triggered during this audit.

## Sell and import — simplify consistently, do not fill intentional space

The shared dark hero, identifier/link input, manual fallback, and contact card are coherent. Keep the same spacing and input/button relationship for the two routes. Sell does not need decorative filtering controls just because inventory has them. Import origin pills express a real request choice and can remain a single scrollable row.
Both two-step forms were exercised with dummy inputs and intercepted failure/success responses. Empty sell input produced an error; make-only input advanced despite copy asking for make and model; back editing worked. Import preserved selected Germany and request details through its tested submission. How-it-works overlays closed on Escape and restored trigger focus. At an artificially shortened 390×420 viewport the import footer remained visible; this is useful geometry evidence, not proof of physical iOS keyboard behavior.
Keep forms as focused tasks with a stable bottom action. Improve label/helper readability, error association and localization, and consistency of summaries. Share the presentation frame and tokens, not the distinct sell/import business payloads. Convert the import fallback banner's baked-in words to HTML. Do not introduce random cards to occupy the empty space in a short form.

## Favorites and comparison — working state, tighter shared card contract

The empty states provide an understandable next action. The populated favorites state survived reload. Three vehicles render in comparison with a deliberate horizontal region and a hint to reveal the third; there was no document-wide overflow. Maintain that distinction. Tighten the saved-card brand/title/price hierarchy and truncated financing note without creating another independent vehicle-data renderer.
Comparison needs a stable row alignment contract, accessible remove/change controls, sensible one/two/three-car states, an explanation at the limit, and a clear unavailable/sold-vehicle state. Persisted dynamic-catalog compatibility is a source-traced risk even though the current static fixture worked. Evidence: `journey-favorites-populated.png`, `journey-compare-three.png`, and C06.

## Contact, services, financing, and about

These pages have stronger mobile compositions than the inherited content pages, but their heading sizes, card padding, red/dark emphasis, and section spacing vary. Establish a small number of intentional families rather than forcing every route into an identical hero. Contact should prioritize its chosen task and readable contact methods. Financing needs its duplicate-main ownership fixed before cosmetic refinement. Services should retain clear service choices rather than acquire inventory-style filters without a purpose.
A blank map area in a top/full-page capture is not enough to call the map broken: the source deliberately defers its iframe until it approaches the viewport. Map loading/blocked-third-party fallback and a useful external directions link belong in the acceptance tests. Business statements such as response times, availability, or financing conditions require owner-approved copy, not invented reassuring text.

## Blog and article

Keep white content cards with a clear image/title/excerpt hierarchy. Fix the invisible selected category immediately. On mobile, prioritize search, one understandable category row, result count, and a clear/reset affordance; optional topics belong in an intentional secondary row or sheet, not a crowded collection of desktop controls. Preserve the desktop yellow hero and its separate layout contract.
Article typography is denser than terms and other information pages; unify readable body size, weight, line height, and section spacing. Related article cards need deliberate contrast and metadata treatment rather than dark small category text over an image. Add an actual main landmark. Check search/category combinations, no-result recovery, long Bulgarian headings, share actions, and images independently from the six default article renders.

## Calculator, FAQ, terms, team, reviews, and dealer profiles

Calculator is approximately 5,220px tall in the 390px full-page capture: stacked inputs/results, tall budget choices, and a long expanded FAQ push its main result far from its inputs. Keep the tested pure finance calculation. Recompose the mobile inputs/result summary and budget links compactly, keep assumptions visible, and avoid presenting sample calculations as offers. This is a visual/task-priority change, not a new finance engine.
FAQ, terms, team, and reviews use an inherited light header/breadcrumb/content arrangement. Standardize mobile heading/body spacing with the rest of the content family. FAQ and reviews require proper main landmarks; reviews also needs rating semantics. Demo team portraits and reviews are explicitly disclosed in current copy. Keep those disclosures in the reusable template, and require real approved content before a customer-facing dealer launch.
The dealer profile and team-member profile retain tall desktop-derived sections and large gaps (roughly 4,304px and 3,971px respectively in representative 390px captures). Review section purpose and remove inherited empty spacing, not valuable content. Align contact actions, image crops, and breadcrumb/title treatment with the mobile information family. The Plovdiv route slug currently describes a Sofia location; resolve canonical identity rather than guessing another address.

## Legacy, error, and administration boundaries

`/home2`, `/home3`, and their presentation versions retain English/legacy visual systems and missing skip targets. Treat them as explicit experiments, not public pages to polish as part of the chosen mobile storefront. Keep them out of customer navigation and decide whether they should be build-only previews, gated routes, redirects, or removed later. Do not delete template-generation dependencies blindly.
Representative invalid public, vehicle, article, and team URLs return 404. Login renders, and unauthenticated `/admin` redirects to login; authenticated admin screens and destructive actions were not visually exercised. They remain a separate authorized workflow audit. The mobile storefront release checklist must not incorrectly mark those workflows as tested.

## Mobile design contract to adopt

Use one owner for viewport gutters, section rhythm, field/control size, corner radii, muted text, focus style, and bottom-dock/safe-area spacing. Primary browsing/lead routes can keep their dark branded hero; content pages can use a lighter reading header; services may retain intentional emphasis. Consistent does not mean every page has identical controls or decorative pills.
Treat 44px as the project's comfortable action-target goal, not a blanket statement of the WCAG minimum. Keep normal editable mobile field text readable, test 200% text enlargement and 320px reflow, and verify all clipped-looking rails through touch and keyboard. Do not trade away meaningful content, accessible names, or focus indicators to achieve a tidy screenshot.
