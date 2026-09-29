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
