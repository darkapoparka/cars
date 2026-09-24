# Cars preview architecture decision

Decision date: 19 September 2026. This is the delivery direction, not a claim that a multi-tenant runtime has been implemented. The existing workspace and publishing commands remain authoritative.

## Decision: shared source, hybrid delivery

Keep the 24 existing dealer projects, repositories, domains and three-design routes. Keep Cars Admin as one shared public demo. Do not migrate existing prospects just to reduce the project count.

For new high-volume, configuration-only prospects, prove shared template rendering in a small pilot before making it the default. Dedicated projects remain appropriate for custom code, independent release/rollback requirements and paid clients needing infrastructure isolation. Shared configuration does not require exactly one Vercel project.

A source repository, a local folder, a Vercel project and a deployment are different boundaries. One source repository can feed multiple projects. Conversely, copying twenty full applications into one project does not remove duplication or necessarily reduce storage.

## Source ownership and folder contract

Use the paths in [WORKSPACE](WORKSPACE.md) and workspace.json. Cars owns four editable template masters, exact release selections, client manifests, public research and publishing. Former standalone folders are retained recovery/history holdings. Cars Admin remains separate. Agency OS stays private.

New work uses the existing main checkout, never another session clone or a branch per dealer. Generated packages, scratch scripts and captures go in ignored runtime. A retained recovery copy is not an editable master. Preserve unique drafts before removing any old folder. Do not relocate running template repositories.

The existing clone-to-dealer workflow is supported now: approved immutable template source, factual dealer adaptation, scoped source commit, reviewed publishing export, one Git-triggered release, hosted verification. Shared hosting is not required to make that workflow reliable.

## Reusable content contract

Build on dealer.json, business facts, inventory data, per-variant provenance and the existing approved logo contract rather than creating a competing dealer registry. Normalize a public dealer profile at the adapter boundary, with stable dealer ID, locale, factual contact details, accent tokens, inventory provenance, approved contextual raster assets and selected template releases.

Keep template structure out of the dealer profile: hero composition, banners, typography, spacing, section order, category cards and responsive behavior belong to the template. Preserve the approved PNG originals and the actual committed PNG/WebP display assets. Shared UI fixes are promoted from the template, not patched independently in every lead.

The current SvelteKit and Next.js templates still need framework-specific adapters. Do not pretend that adding a tenant query parameter converts their module-level dealer data into request-scoped multi-tenant rendering. Neither runtime tenant resolution nor shared hosting is implemented by this document.

## Pilot topology, not a forced single deployment

Start with one routing entry point and reusable rendering boundaries for each template/runtime. Compare a combined Services project against independently deployed renderers only after measuring the real build outputs and testing routes. Avoid introducing microfrontend infrastructure solely for organizational neatness.

Each prospect receives a stable public path or an owned, verified custom subdomain. Existing dealername.vercel.app URLs stay on their existing projects during the pilot; do not assume a shared project can arbitrarily claim them. Admin remains a separate demo link.

A shared deployment also shares release risk: one bad renderer release can affect many prospects. An individual tenant rollback cannot be promised merely by pinning a string in JSON; the runtime must actually support the old renderer or the tenant must be served by a dedicated deployment.

## Pilot acceptance before wider rollout

Prove at least two distinct dealers and both the Modern and Import trios, without moving current production aliases. At 320, 390 and 1440 pixels verify home, inventory, details, contact destinations, deep links, all three design choices and the actual Admin new tab. Compare contextual logo hashes and template-owned composition with the approved release. No live enquiries are sent.

Test unknown tenants as 404, approved host resolution, removal of spoofed tenant headers, tenant-and-release-specific cache keys, route/asset isolation and absence of another dealer's identity after navigation. Dealer IDs and query strings are not authentication. No private agency data or real customer records enter the public demo.

Record build duration, output bytes, stored function bundles, repeated asset copies and retained-deployment usage before and after. Test rollback and a failed release. Expand only after visual/functional parity and measured operational benefit; no unsupported percentage savings or universal lead-count threshold.

## Storage and commercial operation

Project count is not the storage bill. Retained deployment count, output size and retention duration drive Deployment Storage; function bundles also depend on deployment regions. Keep existing production aliases and deliberate rollback copies. Do not bulk-delete projects, change retention or upgrade billing as a side effect of this architecture work.

Use one deployment trigger per reviewed release. Avoid duplicate Git plus CLI uploads. Hosting-plan suitability and actual team usage are separate checks, not solved by a folder rename.

## Agency OS integration boundary

Later integration exchanges a stable lead ID, vertical, template release, preview URL and delivery state through an authenticated service. Outreach, customer records, sales notes and credentials stay private. Clinics and restaurants can reuse that integration contract without duplicating the automotive application or exposing Agency OS. A live dealer admin requires real authentication, authorization and tenant-scoped data access.

## Official references checked on the decision date

- Vercel architecture choices: https://vercel.com/docs/platforms
- Multiple projects from one repository: https://vercel.com/docs/monorepos
- Multiple runtime services: https://vercel.com/docs/services
- Storage drivers: https://vercel.com/docs/deployment-storage

See [WORKSPACE](WORKSPACE.md), [publishing](LEAD-PUBLISHING.md), and the [local reconciliation receipt](workspace/2026-09-19/RECONCILIATION.md).
