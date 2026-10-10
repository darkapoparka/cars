# Varna dealer research and six-design batch

Canonical research: **Cars / main / leads/varna**. Dealer implementation is isolated on the **varna** branch. This is not the separate cars marketplace/platform.

## Coverage

- Mobile.bg: **166 unique profiles**, all **9** pages of the saved Varna city-filtered directory observation dated 10 October 2026.
- Google Maps: initial 20 observations plus an independently executed Playwright capture of **107 result cards**, with actual place links and visible text, scrolled to the end of the returned list. Search results are not a census.
- Consolidated working index: **189 candidate records** after excluding **41** irrelevant/out-of-city Google observations; additional alias, location and business-type qualification remains explicit. **23 records** match existing Cars client sources. The selected ten have no existing-client matches in this check.
- Existing Bulgaria list: **11** Varna records reconciled in existing-varna-reconciliation.json; historical counts and contact history were not reclassified as current facts.

Use [all-leads.csv](all-leads.csv) for the table and [all-leads.json](all-leads.json) for provenance, duplicates, exclusions and qualification state. Raw directory and browser captures are retained next to them. Rebuild the index with node scripts/collect-varna-index.mjs from the Cars root.

## Selected ten

| Dealership | Public business phone | Client slug | Source |
|---|---|---|---|
| D&M - Auto Varna | +359898286848 | dm-auto-varna | [Profile](https://dmautovarna.mobile.bg/) |
| Kolarov Cars | +359876999800 | kolarov-cars | [Profile](https://kolarovcars.mobile.bg/) |
| Dynamic Auto Varna | +359889616721 | dynamic-auto-varna | [Profile](https://dynamicautovarna.mobile.bg/) |
| CAR POINT TRADE LTD | +359883530713 | car-point-trade-varna | [Profile](https://carpointtrade.mobile.bg/) |
| PM SELECT AUTOMOTIVE | +359887083275, +359899225640 | pm-select-automotive | [Profile](https://pmselect.mobile.bg/) |
| DREAM DRIVE | +359895395980 | dream-drive-varna | [Profile](https://dreamdrive.mobile.bg/) |
| PRIME AUTO | +359878751561 | prime-auto-varna | [Profile](https://prime_auto.mobile.bg/) |
| AUTOROAD | +359899230001 | autoroad-varna | [Profile](https://autoroad.mobile.bg/) |
| Аутофест | +359897855097, +359895460139 | autofest-varna | [Profile](https://autofest.mobile.bg/) |
| Сити Карс | +359899867804 | city-cars-varna | [Profile](https://city_cars.mobile.bg/) |

Each source pack contains the same eight dated representative vehicle listings and four locally retained photos per listing, to feed every design. Across the ten: **80 records / 320 photos**. Availability and prices must be confirmed with the seller; these are not live stock feeds. Public asset reuse permission has not been independently established. Original branding and its source are retained, and refreshes must remain labeled independent proposals.

## Application contract

One dealer, one shared fact/asset pack, six real template applications: Auto Best / Modern / Import / App / Mobile / Signature (internal key karento-best), plus the shared external Admin demo. Standard mounts are /, /variant-2/cars, /variant-3/, /variant-4/, /variant-5/, /variant-6/. One public dealer origin and a shared six-design FAB; Admin is not a seventh design or a duplicated backend.

The current approved templates.lock.json lags five updated master trees. New work must record exact latest committed source locators as **candidates**, without relabeling old approvals or uncommitted App/Mobile work. Release qualification, actual compilation and hosted browser verification remain separate.

## Current evidence

Research/data collection is implemented. Branding cleanup, source personalization, application builds and Vercel publication are **not yet completed**. preflight.json is an older dry run using approved pins; it is not source-creation or latest-template evidence. verification.json is data-only, not browser/build/deployment QA. No dealership was contacted and no outreach status was changed.
