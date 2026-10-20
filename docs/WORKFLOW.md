# Dealer workflow

For execution roles, optional Astra GitHub implementation and main/integration-branch collaboration, follow [AGENTS.md](../AGENTS.md) and [COORDINATION.md](COORDINATION.md). [tasks.md](../tasks.md) is the active queue. This document retains the legacy clients/<slug> operation; the new compact dealers/<slug> expansion follows the selected revision of the [current pipeline](https://github.com/darkapoparka/cars/blob/main/docs/PIPELINE.md).

The owner's [six-design fleet contract](FLEET-ROLLOUT-2026-10-11.md) defines current delivery: **Auto Best, Modern, Import, App, Mobile and Signature (`karento-best`) through one Cloudflare Worker per dealer**, including all applications/assets, the design FAB and shared public Admin demo. Carwow and old trio/five-design workflows remain history. Marketplace platforms are separate.

## Ownership and completion

Cars owns shared templates, public research, dealer source and publishing tools. Canonical dealer source is `clients/<slug>/`, except recorded independent repositories such as Al Reef. Agency OS owns private operations and CRM. [Root instructions](../AGENTS.md) define the task's authorized scope; [coordination](COORDINATION.md) protects concurrent work.

A requested new dealer includes personalization, suitable QA, scoped source publication, its private publishing repository and a verified hosted proposal unless the owner explicitly narrows scope. Existing Vercel IDs and aliases remain preserved during Cloudflare work. Billing, DNS and destructive provider cleanup require separate scope. Publication does not authorize outreach; outreach needs an exact recipient, channel and message scope.

## New dealer

1. Resolve the business against canonical folders, registry aliases, public research and accessible private CRM. Reuse stable identity and existing work; unknown history is not permission to invent another slug or assume nobody contacted the dealer.
2. Offer all six designs exactly once. Preserve an existing Modern/Import at /variant-2 and mount the other at /variant-3; App stays /variant-4, Mobile /variant-5 and Signature /variant-6. New dealers default to Modern then Import. Read existing manifests before changing routes or ownership.
3. Use the maintained checkout and existing preparation/creator tools. Coordinate source drift and one serialized Git checkpoint; do not reset concurrent work or make a repository/dependency copy per lead. Select exact reviewed immutable sources through [TEMPLATE-PROMOTION](TEMPLATE-PROMOTION.md). A working edit changes neither the selected release nor existing dealers. Qualify newer finished sources before calling them the latest approved release.
4. Freeze one dated sourced business/inventory/media pack shared by all six apps. Apply [LEAD-BUILD-GUARDRAILS](LEAD-BUILD-GUARDRAILS.md): actual identity, concise factual copy, real contact destination, location and usable sourced stock or clearly disclosed demo listings. Preserve source prices/currency, years, mileage/units and missing facts; never fill unknown values with plausible facts to satisfy a schema.
5. Prepare the transparent raster logo pack under [LEAD-BRANDING](LEAD-BRANDING.md), retaining visual identity research, actual Image Gen/source metadata and versioned on-light/on-dark/on-accent assets. Keep the selected template's hero/banner/button/accent palette and composition. A generated refresh is a proposal, not an official adopted logo.
6. Read current CLI help and use explicit six-design arguments. For direct creator planning:

```powershell
node scripts/new-client.mjs --client <slug> --repository <owner/repo> --design-set six --locale-config <en-bg-locale.json> --dry-run
```

Continue the authorized creation with the maintained preparation manifest and existing creator; the direct creator's omitted-design default is a legacy trio. The creator validates canonical identity, committed workflow/release inputs, duplicates and source integrity before staging all selected apps together. It creates source only, not live provider or CRM success. Never bypass an unexplained hold or substitute loose dirty files for a pinned source.

7. Personalize the actual typed data/configuration boundaries across all six apps. Preserve native layout, typography, cards, hero behavior and useful routes. Remove inherited dealer phones, staff, testimonials, social channels and unsupported claims. Shared defects belong in the template/adapter boundary when appropriate, rather than repeated client-only workarounds. For App retain its first dealer banner, discovery/filter order and stocked-make rules in [APP-VARIANT](APP-VARIANT.md).
8. Reuse retained dependencies, documented runtimes and free preview ports. Run change-sized [QA](QA.md). At the integration checkpoint build the exact selected source once and verify the combined mounted six-design output. Check logo/header/footer/hero/menu/sticky surfaces, mobile/desktop crop and copy fit, stock detail/return routes, noindex, FAB/Admin and safe demo actions. No mock enquiry, purchase or finance action may pretend a real successful transaction.
9. Scope source publication and use the accepted [publisher](LEAD-PUBLISHING.md) for deterministic exports, private-repository reconciliation and non-force updates. Refresh actual account capacity and effective paid plan, verify the provider/version and unauthenticated hosted behavior, then update the technical registry. Source commit, built archive, active provider version, public alias, hosted checks and owner acceptance remain separate facts.

## Retry and storage discipline

Reuse one bounded generated output per active owner. Retain versioned source/inputs and compact receipts; do not keep hundreds of permanent dependency/build trees or duplicate the whole portfolio into an export. Check physical free space before bulky work and place job TEMP/TMP on the checked generated-output drive. Retire only inactive owned intermediates after consumer checks; source, sessions, databases, recovery evidence, licenses and provenance remain protected.

Use the existing source-preparation resume contract when available and reviewed. It binds owner, exact source/order/code/input hashes, phases and candidate identity. Partial writes, foreign locks, changed inputs or uncertain ownership remain held for reconciliation; do not delete a failed candidate or start another copy to bypass the hold. A test-qualified resume helper is not proof of an actual successful dealer/CI retry.

## Existing dealer correction

Read the actual manifest, brief, metadata and registry, then compare the publishing repository before regenerating. Preserve factual content, stock/media provenance, stable routes, accepted custom work, independent ownership and existing provider identities. A source audit does not authorize a fleet refresh. A whole-template refresh uses the reviewed updater and selected qualified release while preserving old adopted pins until explicit adoption. Repeat the affected branding and route checks; old source or deployment evidence cannot certify later changes.

## Fact packs and records

Reuse existing `business-facts.json`, `stock.json`, `FACTS-AND-INVENTORY.json` and asset boundaries; do not add a disconnected content schema. Record source URLs, observation dates, unavailable facts and current/historical/demo inventory meaning.

`dealer.json` declares actual variants, entry routes, shared assets, repository and packaging version. Variant metadata records source SHA/digest, homepage and real QA. [DEPLOYMENT-INVENTORY](DEPLOYMENT-INVENTORY.json) is the technical map; [REGISTRY](REGISTRY.md) defines its states. Keep private suppression and sales history in Agency OS/Airtable.

The [Rencar reference](reference/RENCAR-PROMOTION.md), preserved publishing mirrors and old Carwow/trio/Vercel procedures remain recovery references. They do not define new six-design delivery.
