# Dealer workflow

## Ownership and completion

Cars owns canonical dealer source at `clients/<slug>/`. The four standalone template repositories own reusable improvements; Cars snapshots are approved releases selected by [templates.lock.json](../templates.lock.json). [Root instructions](../AGENTS.md) own task scope and publication authorization.

A new dealer request includes personalization, suitable QA, a scoped source commit, packaging, its private publishing repository, one Vercel project and verification of the public preview. Explicit audit-only, local-only or pause instructions narrow that scope. Outreach requires a separately authorized exact recipient/channel/message.

## New dealer

1. Resolve the business against existing client folders, registry aliases, regional research and accessible private CRM identity. Preserve stable IDs. A missing CRM connection means unknown history. Reuse existing work; do not invent a new spelling to bypass a duplicate.
2. Select three distinct designs. Standard: `auto-best,modern,carwow`. Import-based: `auto-best,import,carwow`, when requested or justified by the real offer. Preserve an existing `dealer.json` and recorded remote/domain. Additional or legacy designs require an explicit scope and compatible packaging; the automated publisher supports these two trios.
3. Run `node scripts/template-release.mjs discover` to report development heads, then `status`. The clone helper verifies every selected approved snapshot. Discovery does not approve a development head. Resolve release holds through [promotion](TEMPLATE-PROMOTION.md), without overwriting working template refinements.
4. Prepare one sourced and dated dealer fact/inventory/asset pack. [Guardrails](LEAD-BUILD-GUARDRAILS.md) govern logo inspection, local assets, claims, current/historical stock and complete identity sweeps. The pack is shared input for all three apps; edit their actual typed data/configuration boundaries.
5. Dry-run `node scripts/new-client.mjs --client <slug> --repository <owner/repo> --preset standard --dry-run` (or `--preset import`). On the authorized build, repeat without `--dry-run`. It preserves real source/lockfiles, checks copy integrity, excludes inherited secrets/instructions and writes portable guidance plus exact source pins. It does not invent business facts or connect providers.
6. Apply identity, approved media, services, stock, prices and contact destinations through each template's existing boundaries. Preserve layout, typography, spacing, cards, routes and interactions. Complete the identity scan across retained routes and offered homepages. A styling defect that needs shared work goes to the upstream template unless fixing it is necessary for this authorized demo.
7. Install from the retained lockfile and documented runtime. Use `start-preview.ps1` or `start-client.ps1` with free ports. Run focused framework checks/build and [QA](QA.md). Record actual results in variant metadata and the client brief.
8. Commit only this dealer's canonical source. Follow [publishing](LEAD-PUBLISHING.md) for deterministic packaging, mirror reconciliation, a non-force push, exact deployment identity and public browser checks.
9. Update the technical registry and generated views. Retain provider, browser and owner-review limits independently; a successful local build cannot mark a deployment verified.

## Existing dealer correction

Read its manifest, brief, variant metadata and registry before editing. Confirm which source was deployed. Preserve the current offered trio, business identity and public paths. Compare unmatched publishing changes before regenerating. Make the smallest requested correction in canonical source or the shared packaging layer, verify affected journeys and complete publication only within the request's scope.

A dealer does not receive newer template source automatically. Port a selected reusable fix when requested; a whole-template refresh is an explicit migration with preserved dealer content and route/interaction QA.

## Fact pack and records

Use existing `business-facts.json`, `stock.json`, `FACTS-AND-INVENTORY.json` and asset folders when present. No new disconnected content schema is required. Record source URLs, observation dates, unavailable facts and inventory meaning. Keep public business evidence separate from private CRM/sales material.

`dealer.json` declares actual variants, entry routes, explicit shared asset folders, repository identity and packaging version. It is consumed by packaging. Variant metadata records template SHA/digest, selected homepage, personalization and QA. The [technical registry](DEPLOYMENT-INVENTORY.json) records source/export/deployment identity and evidence. [Registry reference](REGISTRY.md) explains each state.

The original Rencar trial and other historical source families remain independent references. Their conversion/promotion procedure is retained in [the Rencar reference](reference/RENCAR-PROMOTION.md); it is not an active template backlog.
