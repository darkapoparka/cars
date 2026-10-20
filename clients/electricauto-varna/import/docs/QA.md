# QA contract — Import

## Mobile control sizing

Follow [Mobile styling](MOBILE-STYLING.md) for action glyphs and control text.
Verify the icon against half the visible surface height, separately from the
native tap area: 36/18, 40/20, 44/22, 48/24 and 56/28. Preserve approved component
heights, strokes, radii and typography. Label font size comes from its role token
or approved component override, never from the half-height icon calculation.
Inspect actual BG/EN labels at 320px and 390px after fonts load, including search,
quick filters, PDP Inquire/Call, contact actions, drawers and form navigation.
Check icon centering, retained tap areas, single-line label fit at default text
size, viewport containment and usable text enlargement. For shared owners,
compare the affected desktop views as well.

Desktop Services task flow: check all four compact service segments in BG/EN at
768/1024/1440/1920px, including invalid entries, keyboard tab selection and separate
drafts. Task selection must not filter the catalogue or alter the search query;
native search must preserve the selected `service`. Check prefilled VIN/viewing
modals, initial focus on the dialog container, dismissal/restoration and actual
demo submission context. Verify VIN and manual Selling handoffs in the desktop
overlay without changing the Services URL, task or search; verify Import listing
and sourcing handoffs. Services has no country controls in either entry mode;
country choices remain inside the Import dialog/direct entry. Keep input,
inset action and panel bounds stable across tasks. The joined rail is 44px high,
uses equal segments and 16px text, and is narrower than the 52px entry. Verify helper text
and no-link/manual actions below the input and the task rail above it, including
visible validation with no overlap or reflow. Match Home/Services/Import
mobile at 320/390px and retain the existing localized Import/Selling journeys.

Home, Inventory and Services opt into the shared `MobileModeTabs` segmented appearance
and `DesktopDiscoveryPanel` compact header. Check all three 44px rails, exactly
12px above aligned fields, with equal segments, contained labels, white selection
and fill-only pointer hover. Home and Inventory keep their 24px artwork and
existing search/filter dimensions. Check native Cars/SUV/Bikes/Vans links,
query-context retention and pagination reset, Arrow/Home/End tab keys, search
dialog focus/restoration, Home filters and native task handoffs. Compare 320/390px.

Home/Services Import: verify listing and sourcing entries in BG/EN, country choices inside the dialog/direct entry,
no-link toggle, state across Home tabs, Enter/GET enhancement and retained
fields on the dialog's Back step. The desktop handoff must leave the page URL and
underlying task/search unchanged. Closing/reopening must retain the active request,
restore its actual opener and keep the footer reachable at short screen heights.
A new listing URL must not restore a
previous vehicle's draft. Keep the Home frame, panel and heading anchors stable
across modes at 768/1440px. Measure the actual field row and its inset Continue,
not just the outer panel, including no-link and invalid-entry states. Compare Home/Services/Import at 320/390px. Run the existing
Import wizard journeys, Home search/popover checks and service request checks.
Run `desktop-import-dialog.e2e.ts` for accessible dismissal, draft isolation,
failed-save retry, actual demo receipts and mobile resize. Verify the native
Import URL and no-JS GET fallback independently.

Desktop service requests: verify all three card entries plus the VIN/viewing hero
actions in BG/EN, dialog-container focus, Escape/outside dismissal and opener focus,
separate service drafts, validation on both client/server, failed-save retry and
duplicate-send prevention. Confirm demo receipts do not imply delivery or a
confirmed viewing. At 768px and short heights verify contained scrolling, focus
trapping and a visible submit action. Resize to mobile while open and check overlay
removal and unchanged native destinations. Import/Sell retain direct-page, modified-link,
mobile and no-JS fallbacks. Browse retains its page link; Compare enhances ordinary
links at desktop and phone widths while retaining its direct page. Compare matched
Services presentation at 320/390px.

Run `desktop-sell-dialog.e2e.ts` for card/VIN/manual entries, carried VIN, mode
selection, invalid-field focus, active-request restoration, different-car draft
isolation, retry and duplicate-send prevention, accessible dismissal, trapped
focus and the short-screen footer. Verify actual demo receipts and native GET,
modified-link and phone navigation. Compare matched Services and Selling at
320/390px in BG/EN and run the existing direct Selling submission journeys.

Run `compare-overlay.e2e.ts` for the [Compare overlay](compare-overlay-focus-2026-10-08/README.md) and [selection/table UX](compare-ux-2026-10-08/README.md): BG/EN entry, selecting several cars without losing search or jumping to the table, minimum two/maximum four, stable column order, selected chips, removal/clear, stored selection, Only differences, actual clipboard sharing and denied-clipboard page fallback, load failure/retry, Back/Forward and dismissal, focus trapping/restoration, modified links and no-JS navigation. Check 768px short-height scrolling, two fully visible columns at 320/390px and 320x540px, sticky vehicle headings and full-screen containment. Run `form-opening-focus.e2e.ts` on desktop and touch-emulated phone projects: opening Import and vehicle enquiry must produce no editable-field focus before a tap. Keep invalid-field focus after a deliberate submission and existing search focus. Match direct Compare, Services, Import and Selling phone presentation before/after. Browser focus evidence does not establish real-device keyboard acceptance.

For the [Import hero entry](desktop-import-hero-entry-2026-10-06/README.md), verify
the first step is inside the shared hero panel in both modes, with no clipping
or overlapping artwork at 768/1024/1440/1920px. Check invalid input, country
selection, state retained across forward/back navigation, focus after moving
between hero and below-hero steps, draft restoration and both demo submissions.
Retain matched 320/390px mobile captures and mobile wizard journeys. Other page
compositions remain unchanged.

For the [final desktop cohesion pass](desktop-final-cohesion-2026-10-06/README.md),
verify the shared 52px search, 36px magnifier, unchanged main-page outer panels
and artwork anchors, complete vehicle titles/specs, contained cutout images,
covered photographs, aligned card prices/actions and primary Enquiry/secondary Call roles.
Import, Sell and Financing use compact 240px headers (260px at 768–900px) with
the same title anchor; their first fields should appear at least 140px sooner.
Check forms, modes, search, native destinations, keyboard focus and neutral
fill-only hovers in BG/EN at 768/1024/1440/1920px. Compare all affected routes at
320/390px against matched mobile captures and computed presentation. External
map pixels may be masked consistently; retain their frame checks.

Passing a build is necessary but not sufficient. A lead variant must also be inspected as a dealership experience.

## Install/run

- Install: `npm ci`
- Preview: `npm run dev -- --host 127.0.0.1 --port 6790 --strictPort`

## Framework checks

- `npm run verify`
- `npm run build`
- `npm run test:e2e`

## Current desktop discovery checks

About pairs black Разгледай автомобили/Browse our cars with grey Виж услугите/View services from the [About action refinement](desktop-about-actions-2026-10-06/README.md). Check localized native inventory/services destinations, equal button dimensions, canonical filled monochrome brand marks centered below, fill-only pointer hovers and matched 320/390px mobile preservation. Existing mobile and team contact links remain unchanged. Contact's [paired actions](desktop-contact-paired-actions-2026-10-06/README.md) use black Call and grey Запитване/Enquiry buttons, with plain monochrome social icons centered below. Check equal-width 48px buttons, configured social destinations, safe new-tab relationships and 48px icon targets. The address is an inline Maps link in the existing 24px caption row; a real email appears only for a configured `mailto:` destination. The sample enquiry-page URL must not display as email. Directions remains at the map, with no separate Directions/Viber hero button. Verify fill-only hover without border/shadow changes, keyboard focus, enquiry fragment and native form validation. Hero/panel/artwork and vertical action anchors remain stable for the current data; Call retains its normal button dimensions while joining the left column. Verify BG/EN desktop states, About's unchanged composition and matched mobile at 320/390px.

The [Services pill refinement](desktop-service-pills-2026-10-06/README.md) uses five compact pills above the shared search: All, Check/VIN, Selling, Import and Viewing. Check immediate query filtering, Arrow/Home/End navigation, the selected tab's labelled panel, contextual native CTA destinations and GET/SSR query preservation. The visible result count is integrated into the full-width search placeholder, initially Търси услуга (6)/Search services (6). Its accessible label stays stable and a visually hidden live status announces filtered counts. Check placeholder/status updates for 6, 1 and 0 results, clearing and native GET/SSR. The contextual CTA is the sole visible item below search and stays centered on the full panel. Check that the CTA stays centered for all five categories. Preserve Home/Cars/Services frame and artwork bounds, fill-only pointer hovers and matched BG/EN mobile views at 320/390px.

The [Cars/Home box alignment](desktop-inventory-homebox-2026-10-05/README.md) is the latest Inventory composition: reuse Home's illustrated choices header above search, with Cars, SUVs, Bikes and Vans. Preserve the existing full-width quick-filter row and All filters. Verify native category links, preserved search/sort/view/locale and repeated context parameters, pagination reset, correct empty results for categories without stock, stable Home/Cars box bounds and matched 320/390px mobile preservation. Earlier receipts describe their historical category-row states.

The [5 October control correction](desktop-discovery-controls-2026-10-05/README.md) keeps Home's full-width search and four equal quick filters. Verify the illustrated grey selected mode without an underline, Arrow/Home/End navigation, filter drafts and dialog focus. Home/Inventory/Services search actions are round black icon controls with accessible labels. Inventory has no extra vehicle-type tab row; selecting and clearing Body through All filters must preserve keyword, other filters and display settings. Services now uses the category row described above. Shared frame/panel and About/Contact CTA bounds stay stable. Check BG/EN desktop states and matched 320/390px mobile preservation with the existing search, Home popover and page-pattern suites.

The [inventory row refinement](desktop-inventory-row-2026-10-05/README.md) keeps a
44px action target around the smaller 36px search circle. Check the five equal
Inventory fields and trailing All filters at wide desktop, the three-column grid
at 768–1023px, compact maximum-price/mileage summaries and keyboard focus without
horizontal overflow. Long ranges retain their full summary in the trigger title.

## Incremental desktop polish

The [desktop continuation receipt](desktop-continuation-2026-10-04/README.md) covers Inventory Sort/View keyboard dismissal and GET preservation, sidebar disclosure/selection states, PDP gallery/payment/enquiry behavior and 768–1023px reflow, Import/Sell modes and validation, paired Financing controls, Compare removal and FAQ disclosures. Check BG/EN at 768/1024/1440/1920px for clipped controls and horizontal overflow. For mobile preservation, load the actual Latin/Cyrillic fonts before matched 320/390px captures, compare complete-page computed presentation, and record exclusions for external images/maps separately.

The owner requested useful implementation before lengthy verification after the small 4 October typography follow-up. Continue from the current source and [desktop styling contract](DESKTOP-STYLING.md), keeping mobile independent. Scale evidence to the actual changes rather than repeating the entire historical audit for each adjustment.

1. Capture matched before views for a meaningful group of affected desktop routes/states. Inspect existing owners and fix the highest-value inconsistencies first.
2. While iterating, use the live preview, focused keyboard/action checks and scoped format/lint where useful. Compare BG/EN and the widths affected by the change. Reuse valid installed dependencies; a small CSS edit does not require another fresh install.
3. At the group's closeout, capture matched after views and mobile preservation at 320/390px for affected consumers. Include About when shared theme or shell owners change. Exercise selection, focus, dismissals, native destinations and URL/history behavior where relevant.
4. Run the relevant existing browser suites and one grouped Svelte, scoped format/lint, architecture/assets and production build check. Run existing units for changed rules, content contracts or behavior. Use isolated frozen QA output when the live preview owns the checkout's output. Broaden or repeat checks only for new changes, failures or unresolved concerns.
5. Record actual results, remaining defects and the scoped main commit/push. Documentation-only updates require formatting, diff and referenced-file checks; they do not require a new application build.

Keep the full matrix below for full audits and release qualification. Existing unrelated failures remain explicit: the 4 October typography receipt records formatting issues in `public-assets.policy.json`, `scripts/public-asset-retention.mjs` and `svelte.config.js`; verify their current state before reporting them again.

## Browser matrix

Automated Chromium projects cover **390px** and **1440px**. The inventory reflow contract additionally checks **768px**, **1024px** and **1920px**. Browser/real-device visual acceptance remains separate. Minimum route set:

- `/`
- `/inventory`
- `/contact`
- `/sell-your-car`
- `/financing`
- `/import`

On the tested routes, exercise navigation, mobile menu/open-close behavior, one search/filter path, one vehicle-detail transition and return path, phone/contact CTA, map/contact link, and the main sell/finance/import/enquiry path that the lead actually offers.

## Visual/content checks

For [desktop title hierarchy](desktop-title-hierarchy-2026-10-04/README.md), verify full-width Sofia Sans hero/article titles at 40–52px/700 and section headings at 32–36px/700 with 1.2 leading. Check BG/EN at 768/1440/1920px, including existing hero anchors, control spacing, title clipping and horizontal overflow. Compare settled mobile Home/About type, copy and geometry at 320/390px after hydration and responsive-label selection. The existing public-action test recognizes the approved compact team-card CTA role (16px text, 36px target); ordinary actions keep their existing size/weight checks.

For [the light canvas and direct header](light-canvas-header-2026-10-04/README.md), verify near-white page/header surfaces against grey fields, white cards and the retained tinted hero. Header navigation must have five localized native links with active underlines, no dropdown controls or empty arrow slots, and no overlap at 768/1024/1200/1280/1440/1920px. Exercise Enter on BG/EN destinations and compare mobile Home/About at 320/390px. The existing header tests in `style-parity.e2e.ts` and `storefront-controls.e2e.ts` own this updated behavior.

For [desktop Home artwork tabs](desktop-home-3d-tabs-2026-10-04/README.md), [the graphite family](home-mode-graphite-2026-10-04/README.md) and [corrected optical sizing](home-mode-sizing-2026-10-04/README.md), check all four modes in BG/EN at 768/1024/1440/1920px. Confirm equal targets large enough for the 48px-high artwork, decoded transparent images, fully contained artwork/label groups, one selected underline following its content, visible neutral hover and keyboard focus. The car reserves 64×48px and the other images 48×48px; the visible car and percent symbol should have similar heights. Check all three WebP density candidates and ensure Leasing's optical size is balanced without a CSS scale exception. Exercise Arrow keys, Home/End, selected panel labels and finance/import/sell destinations. Check decoded artwork and the native Buy fallback without JavaScript. Match Home/Sell/Import/About at 320/390px against before screenshots and complete-page presentation, and confirm no new artwork requests below 768px. Article cards remain single native links with text-and-arrow cues.

For [desktop testimonial labels](desktop-review-labels-2026-10-04/README.md), verify Home and Reviews in BG/EN at 768/1024/1440/1920px. Every role beneath a name must be one fully visible line, use its typed category and render without JavaScript. Keep original mobile role text and Home's compact labels; compare matched Home/Reviews/About screenshots and complete-page presentation at 320/390px, including the About trial.

- Correct dealer logo and favicon; no stretched or low-quality placeholder identity.
- No inherited dealer name, phone, address, domain, map, social account, testimonial, watermark or metadata.
- Inventory photos/titles/specs/prices/statuses agree with the sourced fact pack.
- No missing images, broken links, horizontal overflow, clipped controls or unreadable contrast.
- Mobile and desktop preserve the template's intended composition rather than collapsing into a generic rewrite.
- Currency, units, language and finance wording match the dealer's market.

## Runtime truthfulness

For the [4 October tinted hero follow-up](tinted-heroes-2026-10-04/README.md), verify the actual desktop hero frame on all `PageIntro` routes and the article header. About and Contact must contain their primary and secondary destinations inside `DesktopDiscoveryPanel`. Check the tinted hero against the grey header/body and white panels, long BG/EN labels, shared heading anchors, artwork clearance and native links at 768/1024/1440/1920px. Compare matched mobile captures and visible presentation at 320/390px; mobile stays independent. An HTTP error page or a Vite overlay is a failed capture, even when its console is silent. Keep before/after production output separate from mutable development output.

Check console/page errors. Forms, chat widgets and calculators may be demo interactions; record that clearly unless real delivery/integration is configured and tested. A localhost 200 response is not a deploy verification.

## Final identity search

Search the full lead copy for: `Day Night Auto Group|DAY NIGHT AUTO GROUP|Day & Night|daynight|day-night|0877 733 110|Атанас Манчев|kristiankirilov` plus the old domain/social/logo filenames. Provenance/history files can retain source names if clearly historical; active UI/data/metadata cannot.

## Done gate

Do not mark ready until checks pass or each failure is explicitly documented with impact. Report exactly which commands, routes and widths were tested.

Current cross-repository ownership, approved releases, dealer-copy workflow and standalone/mounted limits: [Cars integration](CARS-INTEGRATION.md).

Production-preview testing must use a frozen source copy when another preview owns the current build output. Do not treat mutable-dev-server results, previous commits, or unit-only brand fixtures as full release evidence. See [Architecture](ARCHITECTURE.md).

The full public desktop pass additionally covers Home's four modes, selected/empty/sidebar Inventory, several PDPs, service destinations, About/Contact, conversion forms, calculators, empty/populated Garage states, reviews, FAQs, articles, locale/policies and 404 recovery in BG/EN at 768/1024/1440/1920px. Preserve and compare mobile at 320/390px. See [Desktop styling](DESKTOP-STYLING.md) and [the implementation receipt](desktop-editorial-2026-10-02/README.md). Hero checks enforce the shared minimum frame and title anchor while allowing less than one pixel of content-driven font rounding. Services checks enforce two columns at 768px and four from 1024px. About's desktop hero places configured social links below its action panel; Contact's adds the configured address, directions and message shortcuts. Footer and mobile socials retain their existing composition. Search-frame checks target `DesktopDiscoveryPanel`, which owns its surface.

The [charcoal discovery receipt](desktop-hero-content-2026-10-02/charcoal-2026-10-03/README.md) records the subsequent desktop frame and Home segmented-tab change. Verify all four Home modes, selected Inventory filters, Services search, About/Contact actions, arrow/Home/End tab keys, focus restoration and contrast on the frozen production preview. Match mobile at 320/390px; the new tab appearance is an explicit Home desktop opt-in.

The [final desktop polish receipt](desktop-hero-content-2026-10-02/final-polish-2026-10-03/README.md) verifies About's server-rendered glass social glyphs, 48px targets and unchanged photo files; Contact's direct hero-to-location/form layout, retained anchors and configured actions; and exact mobile presentation preservation. The existing typography/contact suite checks these current owners. External Google Maps rendering remains separate from the configured map frame and directions destination checks.

The [Home entry receipt](desktop-home-entry-2026-10-03/README.md) records removal of the redundant desktop hero quick links, the explicit panel-tab treatment and the shared 56px desktop title anchor. Check all four Home modes for a stationary title, red selected indicator, 48px targets and keyboard navigation; compare the other native automotive heroes for the same anchor and frame. Keep the Newest vehicles section and compare mobile at 320/390px, including the About trial.

The [cool off-white implementation receipt](desktop-cool-off-white-2026-10-03/README.md) supersedes the charcoal palette for public desktop. Verify actual source-rendered pages, the shared light header/hero, quiet search/filter controls, plain About/Contact actions, dark secondary actions, social glyphs, selected/empty/populated states and portalled dialogs. Check artwork clearance at wide desktop widths and the shared 56px heading anchor. Compare matching BG/EN mobile states at 320/390px against the pre-change screenshots and computed presentation; exclude external map pixels consistently and record that boundary. Browser-only colour studies are historical comparisons, not implementation evidence.

The [continuous off-white receipt](desktop-continuous-light-2026-10-03/README.md) records the shared header, hero and content canvas. Check their actual computed background colours, retain the distinct white card and discovery-panel surfaces, and inspect complete pages for spacing and contrast. Compare matching mobile captures and presentation at 320/390px, including About. The previous grey and black screenshots remain comparisons; the after screenshots must come from the source-rendered production build without injected styles.

The [white-panel receipt](desktop-white-panels-2026-10-03/README.md) records pure-white discovery frames and cards, consistent lightly inset Home/Inventory controls and restrained panel shadows. Verify hover and red keyboard focus on the white Home panel, Arrow/Home/End tab behavior, selected filters, dialogs and native search submission. Production screenshots must wait for visible images to load and decode. Compare matched BG/EN mobile at 320/390px, including About.

The [final Home receipt](desktop-home-final-2026-10-03/README.md) records browse cards inside the stock, reviews and guide grids, replacing their separate View all buttons. Verify three stock previews plus an inventory card, all three review/guide previews plus their end card, equal grid heights at 768/1024/1440/1920px, keyboard focus, native Enter/Back navigation and BG/EN destinations with JavaScript disabled. Preserve the mobile rail items and geometry. The All filters regression checks its accessible button, minimum 48px desktop height, dialog opening and Escape focus restoration rather than a historical color-variant class.

For shared overlays, verify 20px portal titles, square 48px close/back targets, 48px footer actions with 18px text and the existing radius role. Check distinct neutral hover, red selected tint, visible keyboard focus, nested dialog dismissal, scroll locking/restoration and native query submission. Compare 320/390px mobile screenshots and computed presentation; document any full-page responsive-image paint difference separately from geometry or copy changes.

The [standard browse-card receipt](desktop-browse-standard-2026-10-03/README.md) extends Home's common white browse-card component to makes and body types. Check that each of the five desktop grids has one visible native end card, with the same surface, border, radius, typography, arrow, hover and keyboard focus. Make/type/review/guide end cards contain no decorative image. The taller inventory card uses the opt-in recorded in [the inventory-artwork receipt](desktop-inventory-browse-artwork-2026-10-03/README.md): three illustrated cars, one native link and unchanged arrow/label treatment. Wait for its desktop picture source to decode, verify source activation from 768px and the transparent fallback below it, and retain the established equal grid heights. Retain meaningful category photos/logos and individual counts. Exercise all five destinations in BG/EN with and without JavaScript; use accessible link names rather than a legacy make-tile class. Compare Home/About at 320/390px against the before viewport screenshots and complete-page computed presentation.
