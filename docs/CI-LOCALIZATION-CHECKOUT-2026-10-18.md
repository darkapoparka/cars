# Localization validation checkout and format repair — 18 October 2026

The previous workflow automatically fed every lock change into an exactly three-design localization generator. Current dealers can have four or six designs. A successful checkout could therefore never establish current fleet acceptance, and weakening that generator would risk dropping families.

Pushes still run meaningful automatic validation, including changes to `templates.lock.json`. The bounded contract job checks all six actual immutable source tuples with the maintained pin selector, exercises six-family mount/packaging contracts, and runs the existing six-source qualification/lock/seal rejection cases. This is source-contract validation; it does not claim that historical source bytes were exported, applications compiled, native journeys passed or a hosted dealer was accepted.

Historical packaging now has the explicit `legacy-three-design-v1` contract and runs only through manual dispatch. Before fetching Cars ancestry, it verifies the private dealer identity, packaging version 1/2, the complete three-family set and its preserved mounts. Four- and six-design manifests fail with the maintained pipeline path. The old generator, release pins and source/adoption acceptance guards remain intact.

## Bounded checkout and read access

The contract job checks out only scripts, its workflow and the lock. The matrix job hydrates only the deployment registry. Each legacy package job checks out one private dealer commit and, only after its format fits, Cars tooling, the lock, release JSON receipts and the four historical template families. It excludes unrelated dealers and evidence images. `actions/checkout@v4` requests `blob:none` when sparse checkout is supplied. Full commit ancestry remains available because exact release validation uses `merge-base --is-ancestor`.

Private dealer checkout requires `DEALER_REPOSITORIES_READ_TOKEN` with Contents read access to the selected private repositories and does not persist its credential. No Actions secrets were configured when the parent task checked the repository. A missing token stops the manual package job with a configuration error before either source checkout. No token was created or copied.

Cars historical blob reads retain the current-repository checkout credential until sealing finishes; an always-run step removes that read header before artifact upload. Checkout post-cleanup remains enabled. This preserves authenticated immutable source reads without retaining read access in the package or reports.

## Current six-design route and canary limits

Current source preparation remains in `existing-fleet-source.yml`, triggered by a reviewed versioned `source-request.json`. Current compilation/composition remains in `existing-fleet-cloudflare.yml`, triggered by a reviewed versioned `build-request.json`. Its maintained validator requires all six families and the exact reviewed lock/native seal; its matrix has six applications plus the router, and delivery verifies one composed Worker. This repair does not dispatch or modify that pipeline.

The local `isauto-varna` and `navara-car` manifests observed on 18 October are version 3/four designs. The private remote manifest read was blocked by the GitHub account API rate limit; local facts must not be presented as current remote facts. Therefore no packaging/build canary is ready on those observations.

After publishing the reviewed workflow, a normal main push can validate contracts without private repository access. If legacy packaging is still required, first confirm a selected remote manifest really fits the historical contract and configure the private read token. Then dispatch a single fitting cohort member:

```sh
gh workflow run validate-fleet-localization-rollout.yml --repo darkapoparka/cars --ref main -f dealer=CONFIRMED_LEGACY_SLUG -f package_format=legacy-three-design-v1
```

The selector accepts one member of the fixed historical 25-dealer cohort, or `all`. Review runner disk usage, source provenance and the report from one fitting dealer before considering a batch. A missing-token stop or format rejection is a useful configuration/compatibility result, not packaging acceptance.

## Local validation

All 26 focused checks pass: 21 workflow/source/mount checks and five maintained six-family source-acceptance cases. They cover automatic lock validation, actual six-family source pins, bounded checkout paths, immutable ancestry/authentication, manual version selection, both historical middle-family choices, four/six-design rejection, identity/mount failures, and missing/invalid matrix records. Existing cases preserve immutable historical export, output protection and six-family qualification/lock/seal guards. YAML parsing, scoped whitespace checks and the canonical-path workflow documentation check also pass. The root task owns the broader workflow integration checkpoint.

The maintained workflow CLIs now compare physical entrypoint paths through the shared `scripts/lib/cli-entrypoint.mjs` helper. Both `node L:/CODEX/cars/scripts/check-workflow.mjs` and invocation through the supported `J:/cars` junction execute the validation. The focused `scripts/cli-entrypoint.test.mjs` regression creates one temporary directory alias, runs real CLI help/validation/error cases through it and verifies that imports remain quiet; it does not copy the checkout or alter the actual `J:/cars` junction.

No Git download, clone, dependency installation, application build, Actions dispatch, commit, push or provider operation was run for this repair. Hosted checkout size, private access, exact source export and current six-design release acceptance remain separate, unverified stages.

