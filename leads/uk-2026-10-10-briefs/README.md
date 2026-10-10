# UK dealer build briefs — 10 October 2026

These public preparation packs use the existing Cars business-facts.json and stock.json convention. They are inputs for the authorized build after template release acceptance, not applications, manifests, deployments or private CRM records. Original research flags are retained verbatim in each researchSnapshotFlags snapshot; source research files are unchanged.

Requested six families: **Auto Best, Modern, Import, App, Mobile, Signature**. Requested hosting: **Cloudflare**, following a qualified pilot and accepted publisher. No template pins, public origin, provider acceptance, DNS/billing change or passed application QA is inferred from elapsed polishing time.

| Rank | Public dealer facts | Locale config | Start with | Exact premises/contact state |
| --- | --- | --- | --- | --- |
| 1 | [Broadbent Car and Servicing](gb-stockport-broadbent-car-and-servicing/business-facts.json) | [Publisher locale](gb-stockport-broadbent-car-and-servicing/locale-config.json) | Modern | Public address captured; public direct-source phone captured |
| 2 | [Motors Castle](gb-motherwell-motors-castle/business-facts.json) | [Publisher locale](gb-motherwell-motors-castle/locale-config.json) | Mobile | Public address captured; public direct-source phone captured |
| 3 | [Trade Car Sales](gb-birmingham-trade-car-sales-grasmere/business-facts.json) | [Publisher locale](gb-birmingham-trade-car-sales-grasmere/locale-config.json) | App | Premises unresolved; direct phone withheld pending confirmation |
| 4 | [Square One Motors](gb-birmingham-square-one-motors/business-facts.json) | [Publisher locale](gb-birmingham-square-one-motors/locale-config.json) | Modern | Public address captured; direct phone withheld pending confirmation |
| 5 | [Car Market Yorkshire](gb-dewsbury-car-market-yorkshire/business-facts.json) | [Publisher locale](gb-dewsbury-car-market-yorkshire/locale-config.json) | App | Premises unresolved; direct phone withheld pending confirmation |
| 6 | [S A Motors](gb-nottingham-s-a-motors/business-facts.json) | [Publisher locale](gb-nottingham-s-a-motors/locale-config.json) | Import | Premises unresolved; direct phone withheld pending confirmation |
| 7 | [AS Motor Group](gb-batley-as-motor-group/business-facts.json) | [Publisher locale](gb-batley-as-motor-group/locale-config.json) | Modern | Public address captured; direct phone withheld pending confirmation |
| 8 | [Cherry Tree Cars Ltd](gb-bradford-cherry-tree-cars/business-facts.json) | [Publisher locale](gb-bradford-cherry-tree-cars/locale-config.json) | Auto Best | Premises unresolved; direct phone withheld pending confirmation |
| 9 | [Norton Grange Trade Cars](gb-stockton-norton-grange-trade-cars/business-facts.json) | [Publisher locale](gb-stockton-norton-grange-trade-cars/locale-config.json) | Mobile | Premises unresolved; direct phone withheld pending confirmation |
| 10 | [North Norfolk Car Sales](gb-north-norfolk-car-sales/business-facts.json) | [Publisher locale](gb-north-norfolk-car-sales/locale-config.json) | Modern | Public address captured; public direct-source phone captured |

Trading name, city, country GB, en-GB, GBP and miles presentation can prepare all six variants now. Legal entities, hours, staff, reviews, warranties, finance, delivery, imports and service promises remain unknown unless separately sourced and accepted. Import is a design family; selecting it does not establish that the business imports cars.

Each stock.json is empty. stockCount: 0 means populated preview samples, never that the dealer has no stock. publishedListingCount is only a dated advertisement snapshot, not a live-stock hero claim. No photo, vehicle detail, mileage or price is invented. Populate one shared sourced pack or explicitly illustrative inventory before adaptation; preserve its meaning across all six variants.

Broadbent and Motors Castle have matched Google premises/phones; North Norfolk has own-site contact. These public candidates retain dated provenance and need current ownership confirmation. Marketplace phones remain in contactCandidates instead of enabled as verified destinations. Car Market, Trade Car Sales, S A Motors, Cherry Tree and Norton require premises/contact reconciliation; exact visit pins are withheld. Square One and AS Motor Group have public platform addresses without confidently matched Google profiles.

Branding is unresearched for build in every pack: visually inspect the matching public identity and obtain suitable local raster assets through the existing guardrails. No asset harvesting or logo generation occurred here. Finance/payment/feed/CRM/form delivery remains unconfigured; demos must show honest states.

Source: [dated public lead research](../uk-2026-10-10.json). Use the existing [workflow](../../docs/WORKFLOW.md), [guardrails](../../docs/LEAD-BUILD-GUARDRAILS.md) and [hosting decision](../../docs/HOSTING-AND-RELEASE-DECISION-2026-10-04.md), applying the explicit six-variant/Cloudflare request. Reconcile registry aliases/current client folders before copying. Unknown private contact history stays unknown.

Source SHA-256: 05d34f35ad699beb6676de775a50e8659ae23771e73d0aa25c9c94a646f348b2. Preparation validation covers lead count, unique IDs, six families, GB/en-GB/GBP contracts, source URLs, empty stock and false application QA flags. This is document/data validation only.

Each locale-config.json is publisher configuration: schema version 1, dealerId equal to the facts slug, English default, complete EN/BG catalogs, dealer country GB and inventory currency GBP. The current native six-design publisher requires both catalogs. This does not claim that the dealer offers Bulgarian-speaking service. Business facts languages remain [en], and their formatting locale remains en-GB. Visitor country detection does not change the dealership country or inventory currency.

After all six final immutable template releases are approved and the qualified Cloudflare publisher is accepted, replace the placeholders and use the existing generator dry run:

```powershell
node scripts/new-client.mjs --client <dealer-slug> --dealer-id <dealer-slug> --repository <owner/repository> --design-set six --locale-config leads/uk-2026-10-10-briefs/<lead-id>/locale-config.json --dry-run
```

Use the slug stored in the selected business-facts.json for both dealer identity arguments. A passed locale input/base-manifest shape check is not final release acceptance, source creation, packaging, a build or hosted verification. This command has not been executed in brief preparation.
