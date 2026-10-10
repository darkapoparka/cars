# Varna dealer research and six-design batch

Canonical research: **Cars / main / leads/varna**. Dealer implementation remains isolated on the **varna** branch. This is not the separate cars marketplace/platform.

**11 October 2026 Sofia update: eight public Cloudflare proposals, 59/60 internal design Workers and 8/10 public routers. 192 baseline browser cases and 200 supplemental checks passed for those eight sites.** PRIME AUTO and AUTOROAD remain held; this is not a 10/10 completion claim. Read [CLOUDFLARE-DELIVERY.md](CLOUDFLARE-DELIVERY.md) for public URLs, exact source/build identities, remaining work and resume evidence, and [the deployment ledger](cloudflare-delivery-2026-10-11.json) for Worker versions and browser-report hashes.

The earlier [BUILD-STATUS.md](BUILD-STATUS.md) and [native build verification](build-verification-2026-10-10.json) retain the historical 60/60 compilation and rejected Vercel pilot. The [Vercel quota audit](vercel-quota-audit-2026-10-10.json) explains the shared-team activity: 102 of 137 deployment records in the audited 24-hour window belonged to treido-bg-shop. Those historical records are not all successful deployments.

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

Each source pack contains eight dated representative vehicle listings and four locally retained photos per listing, feeding every design for that dealer. Across the ten: **80 records / 320 photos**. Availability and prices must be confirmed with the seller; these are not live stock feeds. Public asset reuse permission has not been independently established. Original branding and its source are retained, and refreshes must remain labeled independent proposals.

## Application contract

One dealer, one shared fact/asset pack, six real template applications: Auto Best / Modern / Import / App / Mobile / Signature (internal key karento-best), plus the shared external Admin demo. Standard mounts are /, /variant-2/cars, /variant-3/, /variant-4/, /variant-5/, /variant-6/. The Cloudflare delivery preserves one public dealer origin through internal service bindings and a shared six-design FAB. Admin is not a seventh design or duplicated backend.

The original verified native source is [06fcad9c](https://github.com/darkapoparka/cars/commit/06fcad9c0a8a5ac6b4f27c1a4e0df5445a6c8f5e) on [varna](https://github.com/darkapoparka/cars/tree/varna). All ten sources were regenerated from the then-current approved template pins, including final App 4e184777. The Cloudflare build/repair commits, source trees and provider-specific receipts are recorded in the current delivery ledger. Framework compilation, hosted technical verification, owner visual acceptance, branding and outreach approval remain separate.

## Current evidence and remaining work

[GitHub Actions run 38075636982](https://github.com/darkapoparka/cars/actions/runs/38075636982) completed successfully at 18:38:51 UTC on 10 October 2026. All **60 native framework build jobs**, six per dealer, passed. Cloudflare then compiled its own provider outputs, corrected two pilot content errors and uploaded the exact compiled artifacts documented in CLOUDFLARE-DELIVERY.md.

The original dealer logos are present; the requested high-quality branding refresh is **not complete**, and Autofest's original is only 100 x 26 pixels. The ten dedicated private publishing repositories are **not created or linked yet**. Eight Cloudflare public demos have passed the bounded technical checks; PRIME AUTO lacks its public router and AUTOROAD lacks Auto Best plus its public router following tool safety blocks. Do not treat the two held dealers as live.

preflight.json is an older dry run and verification.json is data-only evidence. No dealership was contacted and no outreach status was changed. Owner review, branding and outreach acceptance remain pending.
