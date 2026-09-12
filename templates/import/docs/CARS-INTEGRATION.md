# Cars integration

This repository owns reusable Import source. Open it for shared frontend/code work. Open [Cars](https://github.com/darkapoparka/cars) for dealer builds, corrections, release promotion and publication. Canonical dealer source is clients/<slug>/ in Cars; dedicated dealer repositories are publishing mirrors.

Cars snapshots use an approved immutable commit from this repository. Main is a development head, not automatic release approval. After shared polish is reviewed, use the [Cars release procedure](https://github.com/darkapoparka/cars/blob/main/docs/TEMPLATE-PROMOTION.md). New dealers consume the selected lock; existing dealers do not receive automatic updates. Cars-only refinements must be compared and ported upstream before replacing a snapshot.

## Compatibility

Standalone entry: /. Use the release-documented Node runtime and retained npm lockfile. Run npm ci, npm run check and npm run build for relevant application changes. A documentation-only workflow change needs focused link/command checks, not the whole application suite.

Mounted dealer entry: /variant-2/. Base paths, Services routing, locale/raw links, CSS/static assets, requests, redirects and the shared switcher are handled by the versioned Cars packaging layer for compatible releases. Standalone defaults stay standalone. Do not hardcode a dealer mount into this master or claim mounted QA from a standalone build. Unknown source shapes require a deliberate packaging update and tests.

## Dealer adaptation

Use Cars new-client.mjs with approved releases. Standard trio: auto-best,modern,carwow. Intentional Import trio: auto-best,import,carwow. Import replaces Modern in Design 2; it is not an automatic fourth design. Preserve existing dealer manifests and identities.

The actual content boundaries include `src/lib/data/daynight.ts`, `src/lib/data/daynight-listings.json`, `src/lib/data/vehicles.ts`, `src/lib/styles/`, `static/`. Read TEMPLATE.md and the reuse/QA references for complete technical detail. A fact-pack JSON is not an application setting unless code reads it. Source/demo identity and forms remain unverified until the dealer implementation establishes them.

## Historical documents

Source-era roadmaps, audits, execution logs, migration plans, legacy copies and dated refactor evidence retain their original context. They are not new assignments. AGENTS routes current tasks. Preserve licenses and provenance; do not rewrite old results as fresh verification.
