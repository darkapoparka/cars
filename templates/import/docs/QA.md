# QA contract — Import

Passing a build is necessary but not sufficient. A lead variant must also be inspected as a dealership experience.

## Install/run

- Install: `npm ci`
- Preview: `npm run dev -- --host 127.0.0.1 --port 6790 --strictPort`

## Framework checks

- `npm run verify`
- `npm run build`
- `npm run test:e2e`

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

- Correct dealer logo and favicon; no stretched or low-quality placeholder identity.
- No inherited dealer name, phone, address, domain, map, social account, testimonial, watermark or metadata.
- Inventory photos/titles/specs/prices/statuses agree with the sourced fact pack.
- No missing images, broken links, horizontal overflow, clipped controls or unreadable contrast.
- Mobile and desktop preserve the template's intended composition rather than collapsing into a generic rewrite.
- Currency, units, language and finance wording match the dealer's market.

## Runtime truthfulness

Check console/page errors. Forms, chat widgets and calculators may be demo interactions; record that clearly unless real delivery/integration is configured and tested. A localhost 200 response is not a deploy verification.

## Final identity search

Search the full lead copy for: `Day Night Auto Group|DAY NIGHT AUTO GROUP|Day & Night|daynight|day-night|0877 733 110|Атанас Манчев|kristiankirilov` plus the old domain/social/logo filenames. Provenance/history files can retain source names if clearly historical; active UI/data/metadata cannot.

## Done gate

Do not mark ready until checks pass or each failure is explicitly documented with impact. Report exactly which commands, routes and widths were tested.

Current cross-repository ownership, approved releases, dealer-copy workflow and standalone/mounted limits: [Cars integration](CARS-INTEGRATION.md).

Production-preview testing must use a frozen source copy when another preview owns the current build output. Do not treat mutable-dev-server results, previous commits, or unit-only brand fixtures as full release evidence. See [Architecture](ARCHITECTURE.md).

The full public desktop pass additionally covers Home's four modes, selected/empty/sidebar Inventory, several PDPs, service destinations, About/Contact, conversion forms, calculators, empty/populated Garage states, reviews, FAQs, articles, locale/policies and 404 recovery in BG/EN at 768/1024/1440/1920px. Preserve and compare mobile at 320/390px. See [Desktop styling](DESKTOP-STYLING.md) and [the implementation receipt](desktop-editorial-2026-10-02/README.md). Hero checks enforce the shared minimum frame and title anchor while allowing less than one pixel of content-driven font rounding. Services checks enforce two columns at 768px and four from 1024px. About's desktop hero places configured social links below its action panel; Contact's adds the configured address, directions and message shortcuts. Footer and mobile socials retain their existing composition. Search-frame checks target `DesktopDiscoveryPanel`, which owns its surface.

The [final desktop polish receipt](desktop-hero-content-2026-10-02/final-polish-2026-10-03/README.md) verifies About's server-rendered glass social glyphs, 48px targets and unchanged photo files; Contact's direct hero-to-location/form layout, retained anchors and configured actions; and exact mobile presentation preservation. The existing typography/contact suite checks these current owners. External Google Maps rendering remains separate from the configured map frame and directions destination checks.
