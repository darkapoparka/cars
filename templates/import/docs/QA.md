# QA contract — Import

Passing a build is necessary but not sufficient. A lead variant must also be inspected as a dealership experience.

## Install/run

- Install: `npm ci`
- Preview: `npm run dev -- --host 127.0.0.1 --port 6790 --strictPort`

## Framework checks

- `npm run verify`
- `npm run build`
- `npm run test:e2e`

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

For [desktop Home artwork tabs](desktop-home-3d-tabs-2026-10-04/README.md), check all four modes in BG/EN at 768/1024/1440/1920px. Confirm equal targets large enough for the 48px artwork, decoded transparent images, fully contained artwork/label groups, one selected underline following its content, visible neutral hover and red keyboard focus. Exercise Arrow keys, Home/End, selected panel labels and finance/import/sell destinations. Check decoded artwork and the native Buy fallback without JavaScript. Match Home/Sell/Import/About at 320/390px against before screenshots and complete-page presentation, and confirm no new artwork requests below 768px. Article cards remain single native links with text-and-arrow cues.

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
