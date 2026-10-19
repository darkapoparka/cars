# Dealer-pack pipeline

M2 applies to new `dealers/<slug>/` packs. The owner confirmed Workers Paid, authorized 400 new previews, and explicitly approved using the final slot: account capacity 500, protected baseline 100, maximum new dealers 400, reserve 0. Deployment authority covers previews only; outreach is separate and is not authorized. The three proof dealers are members of that 400-lead expansion, not additional slots.

The maintained implementation is on `astra/m2-fast-deploy`, branched from `a999878a921fb61b37bf198c43275550814f88cc`, in its own PR to `main`. PR #16 and the four `astra/batch-*` research branches are not edited by this work. Existing `clients/` workflows remain available. A malformed neighboring pack is reported and its identity reserved; it does not crash the old dealer index or unrelated builds.

## Build architecture and its limits

This release uses `fresh-native-builds-shared-dependencies`. Each dealer still receives six fresh framework builds and a fresh router build. The receipt explicitly records `compileOncePerRelease: false`; 400 dealers still mean 2,800 native targets. There is no unqualified compiled-output reuse across dealers.

The proposed runtime JSON substitution is not a safe drop-in for these templates. Business facts, stock, image references, structured data and locale copy currently enter roughly 200 generated source files and several server/client hydration boundaries. The six frameworks produce their own asset manifests and server entry points. Changing only a server-side JSON binding would leave client bundles and prerendered data with another dealer's content. A complete runtime conversion would require changing those data boundaries and qualifying each framework's hydration and rendering behavior. It is outside a zero-visual-change adapter patch. This release therefore retains each framework's native output semantics and removes repeated setup and transfers around those builds.

At most seven CI lanes run in parallel. Within a lane, dealers and their native framework compilations run serially. The lane keeps dependency installations and family workspaces, isolates source preparation in a child that exits before native compilation, and rebinds the maintained Svelte publisher to the next prepared source. A content-addressed esbuild transform cache reuses only an identical input/options transformation. Dealer-specific compiled output is never treated as a template release.

There are no per-dealer source archive artifacts and no family-to-family artifact downloads. Package-download caches bind the stable template release, exact tools, runtime, OS and architecture, rather than the research commit. Source and native intermediates remain on the lane runner and are discarded after their final bundle/report is sealed. The final bundle transport described below deduplicates identical file bytes across the lane. Build transports expire after one day; compact plans, reports and screenshots after three days. Cache and artifact actions are pinned to immutable SHAs. Artifact names contain `--` separators and omit `run_attempt`, while deployment locators still bind immutable artifact IDs and digests.

A failed pack is excluded with a reason and the remaining packs continue. Downstream reporting uses `!cancelled()` rather than an implicit success-only chain. The final CI gate remains failed if any pack was rejected or failed. Deployment can consume successful individual artifacts from such a run only after authenticating the exact source run's successful shared `contracts` job. A failure in shared guards or packaging contracts cannot be bypassed by selecting a successful dealer artifact.

## Visual policy

No template frontend or styling source is changed. Signature desktop example cards remain unchanged. V2 uses the same active-design FAB artwork as the 100 live dealers, as explicitly requested. M1 pack FABs used the dealer's mark, so that requested correction is a real, bounded visual difference from M1.

`scripts/compare-dealer-pack-screenshots.mjs` authenticates the final green M1 run `39284983471`, attempt 2, commit `a999878`, its exact reports and all 54 screenshot hashes. It compares all six designs at 320, 390 and 1280 pixels with threshold 0, no resizing, equal dimensions, and zero unexpected pixels. Only classified edge antialiasing is accepted. `--allow-fab-correction` additionally permits the exact verified fleet image inside the existing 46 by 34 CSS-pixel FAB image bounds; the surrounding button, count, shadow and page pixels remain strict. Its report explicitly distinguishes that authorized difference from global pixel identity.

```sh
node scripts/compare-dealer-pack-screenshots.mjs \
  --baseline PATH_TO_AUTHENTICATED_M1_DEALER_EVIDENCE \
  --candidate PATH_TO_M2_DEALER_OUTPUT \
  --out runtime/visual-comparison/SLUG \
  --allow-fab-correction
```

The retained M1 cold/warm repeatability check passed 54/54 views: 50 were pixel-identical, and four had three edge-antialiasing pixels each. This establishes the comparator's baseline; it is not a substitute for the actual M2-versus-M1 comparison.

## Compact source packs and migration from M1

The four research branches were created from `a999878`. Each batch owner first incorporates the maintained M2 tooling into their own branch, then migrates the existing packs mechanically. The migration does not fetch new research, generate replacement artwork, change the selected template trees, or deploy. It retains the lead ID, facts, dated stock, source evidence, original artwork and sourced photos. If a directory must be shortened, it changes only structural dealer bindings and internal pack paths; the research identity and business prose stay intact.

Use the pipeline's Node 26.10.0 runtime. The deterministic logo recipe uses Sharp 0.35.5 and records the exact Sharp/libvips dependency versions and every derived byte hash. Install the source tool once if it is absent:

```sh
npm install --prefix runtime/dealer-pack-tools --ignore-scripts --no-audit --no-fund --save-exact sharp@0.35.5
```

For batch 1, inspect the mechanical migration and then apply it:

```sh
node scripts/dealer-pack.mjs migrate --batch 1
node scripts/dealer-pack.mjs migrate --batch 1 --write
```

The first command writes no pack files. The second upgrades each present pack independently, records `migration-report.json`, and runs the automated input review. A malformed or failed pack receives an individual reason; the other assigned packs continue. The command returns a failed aggregate exit status after reporting all failures. Migration only processes packs actually present for that batch. The later batch plan separately reports any missing members of the full 100-lead assignment.

An individual pack can be migrated with an explicit batch guard:

```sh
node scripts/dealer-pack.mjs migrate --slug ready-pack --batch 1 --write
```

Migration is a source change. Commit its reviewed results before creating a build intended for deployment. Running migration or input review again can update mechanical review timestamps and therefore the exact pack digest; rebuild after such a source change. Existing build receipts continue to identify their original bytes.

### What v2 stores

`dealer.json` records `pack.schemaVersion: 2`, the batch assignment and the canonical hosting identity. Original transparent rasters, original refinements with their actual provenance, and retained vehicle photos remain source files. `branding/logo-contract.json` records which logo belongs on each existing surface. `branding/logo-recipe.json` records the deterministic transform, exact toolchain, source/contract hashes, and each generated PNG, WebP and favicon hash.

The pack does not need to commit deterministic generated logo exports. Loading a ready v2 pack regenerates those bytes in memory, verifies every output hash, and hands the hydrated assets to the existing six-template assembly. It leaves the committed source directory untouched. `sourceFiles`, `packDigest`, source file count and source byte count continue to describe the compact committed input; the hydrated Map has separate counts. If a retained derived file differs from its exact recipe, preparation or migration refuses it. It never deletes an original artwork path to meet a size target.

The three M1 proof migrations removed 17 reproducible logo exports each. Their retained originals already exceed 500 KiB, so all three correctly remain above the requested approximate size target:

| Pack | M1 source bytes | V2 source bytes including migration/input-review metadata | V2 source files |
| --- | ---: | ---: | ---: |
| `za-motors` | 3,077,753 | 2,138,644 | 22 |
| `wadishee-used-cars` | 4,416,804 | 2,608,881 | 23 |
| `granada-auto-sales` | 4,317,081 | 3,115,878 | 23 |

Each migration report includes a SHA-256 inventory of the byte-identical originals and sourced content it preserved. No original artwork or vehicle photo was recompressed. A smaller original source image can produce a pack below 500 KiB; the tooling does not manufacture that result by discarding the reviewed source.

### Stable release binding

V2 qualifications bind `releaseId` rather than the raw file hashes of the two mutable lock JSON files and source-review JSON. The release ID includes the exact six repository/revision/path/tree/digest descriptors, six-template packaging policy, and `dealer-pack-data-v2` data-adapter version. An immutable template change or adapter-version change changes the release ID. Formatting, review timestamps and explanatory metadata do not.

The source review is still checked semantically against the exact selected and retained previous template fingerprints. The older native qualification validators still run through an in-memory compatibility context; migration does not grant native, hosted or global template approval. The fast workspace adds the maintained tool-code digest and exact Node/platform architecture to its own cache identity. Immutable package downloads can be shared within a release without sharing compiled dealer output.

### Review flags and contact checks

Drafts begin with `reviewed: false`. Only `dealer-pack review` or the review phase of migration can transition the input review to passed after the structural/source/hash checks succeed:

```sh
node scripts/dealer-pack.mjs review --slug ready-pack --batch 1
node scripts/dealer-pack.mjs check --slug ready-pack --batch 1
node scripts/check-dealer-pack-inputs.mjs --slug ready-pack --batch 1
```

The review explicitly says `kind: "automated"`, `humanReview: false`, and `dealerApproval: false`. It checks exact identity, public-fact shape, prices/private-field exclusion, batch membership, stock/media bindings, companion-copy source rows, template qualification, artwork provenance and logo regeneration. It does not claim a human visual review, language-expert review, dealer permission or translation approval. The strict legacy companion-copy JSON remains compatible; `input-review.json` states the automated scope associated with its review flag.

The contact screen flags individual-looking mailboxes, unbranded personal-email-provider addresses, and explicit personal-role markers. It does not treat a mobile telephone as personal merely because it is mobile. A flagged value must be omitted or accompanied by exact public-business evidence in `contact-review.json`: the flagged field and value hash, a dated public source URL, `classification: "public-business"`, and `reviewKind: "source-evidence"`. A heuristic pass is not proof that a contact cannot be personal. No contact is sent by migration, input checks, build, transport or hosted QA.

### Batch and hosting identity

`leads/expansion-2026-10-18/batches-2026-10-19.json` contains exactly 400 retained manifest lead IDs. It preserves their original relative order within all `gb-*` first, then `us-*`, then `ae-*`, split into four groups of 100. Batch membership is based on the retained lead ID, not the preview slug. Tools compare the recorded binding, explicit `--batch`, `CARS_DEALER_PACK_BATCH`, and a detected `astra/batch-N` branch; a conflicting claim is refused.

Slugs longer than 43 characters receive a deterministic shortened prefix plus a research-ID-bound hash suffix. The original requested slug and exact lead ID remain in the identity mapping. An occupied canonical destination is refused before a source directory can be overwritten. The three proof slugs remain unchanged. Every normal pack requires exactly `cars-<slug>` and `https://<slug>.webpreviews.site`. Existing registry names, origins and nested hosting identities are protected independently of their registry slug.

## Plan and build one batch

After committing migrated inputs, run **Dealer pack pipeline** with `batch: "1"`. It resolves all 100 assigned research identities, validates each present pack independently, reports rejected or missing entries, and distributes valid entries across at most seven persistent build lanes. Alternatively, supply one to 100 explicit slugs. An explicit slug list can be combined with the workflow's batch field to constrain that subset to one batch. PR runs select only the changed existing `dealers/<slug>/` directories from the exact PR base/head diff; a PR with no changed pack inputs skips dealer builds.

The provider-free planner can also be used locally:

```sh
node scripts/plan-dealer-pack-ci.mjs plan --batch 1 --report runtime/batch-1-plan.json
node scripts/plan-dealer-pack-ci.mjs plan --slugs '["ready-pack","another-pack"]' --report runtime/selected-plan.json
```

The planner emits `requested`, `valid`, `rejected`, `releaseIds`, and `lanes.include`, where each lane contains its number, ordered slugs and any benchmark-clone descriptors. A rejected pack is not included in a build lane. The plan process returns a report so the valid lanes can run; CI's final gate fails honestly if there were any rejection or lane failures. For an explicit local subset plus a batch, use `check-dealer-pack-inputs --batch N` on that subset and pass `--batch N` to the fast builder, or use the workflow's combined fields.

Each lane keeps its package installations and source workspace across its assigned packs, compiles every dealer's six frameworks and router freshly, and retains exact output/build/QA receipts. It never moves a source or native build archive between jobs. Framework jobs use the original pinned Node executables recorded in a `node-paths` JSON map. The direct local fast-batch command accepts that map and a fresh output directory:

```sh
node scripts/dealer-pack.mjs fast-batch \
  --slugs '["ready-pack","another-pack"]' \
  --batch 1 \
  --node-paths runtime/dealer-pack-node-paths.json \
  --out runtime/batch-1-local
```

Use the CI-produced exact bundles for queued deployment. The guarded deployment sequence below authenticates each bundle's exact source commit and report bindings.

## Bounded final bundle transport

Final bundle transport includes only the sealed Worker/assets, bound successful build/QA reports, and the 18 screenshot evidence files required by deployment inspection. Invalid bundles are rejected individually. Native build directories, source archives and caches are excluded.

```sh
node scripts/transport-dealer-pack-bundles.mjs pack \
  --root runtime/batch-1-local/dealers \
  --out runtime/batch-1-transport
```

The manifest maps each original output path to its content SHA-256 and shard. Identical bytes across the lane are stored once in `shard-0/blobs/<sha256>` through `shard-7/blobs/<sha256>`. Each shard has at most 350 MiB of raw data; if the unique data cannot fit eight shards, the command refuses and requests a smaller lane instead of omitting files. CI uploads the manifest and existing shard directories as separate artifacts. Artifact names are stable across run attempts; immutable artifact IDs, digest and source run/commit still need authentication when downloaded for the deploy queue.

Reconstruct one queued dealer at a time to keep disk usage bounded:

```sh
node scripts/transport-dealer-pack-bundles.mjs restore \
  --input runtime/batch-1-transport \
  --out runtime/batch-1-restored/dealers \
  --slugs '["ready-pack"]' \
  --manifest-sha256 EXACT_DOWNLOADED_MANIFEST_SHA256
```

Restoration requires a fresh destination. It verifies the complete transport manifest, all shard/blob paths and hashes, and the reconstructed dealer's exact original bundle envelope, build/QA binding and screenshot bytes. Links, missing or extra blobs, altered paths, benchmark bundles and source/private files are refused. Even when materializing one dealer, it validates unselected transport blobs. The SHA above is the exact manifest-file digest retained by authenticated CI artifact metadata/transport inspection; it is not the manifest's separate internal content digest.

## Provider-free benchmark scope

`--benchmark25` plans exactly seven ZA, one Granada and 17 Wadi source replicas under deterministic temporary `m2-bench-XX-<source>` names. Planning validates the three real source packs but creates no clones. Each lane bootstrap creates only its own retained descriptors and verifies the exact source pack digest before doing so. A matching owned temporary clone can be reused; an unrelated existing directory is preserved and refused. Each clone keeps the source dealer's research identity, facts, artwork and photographs, and records `benchmarkOnly: true` and `neverDeploy: true`.

Benchmark loading/building needs the explicit benchmark capability. Ordinary loaders, final transport and deployment reject benchmark packs. The measured workflow retains reports and screenshots, not deployment transports. The benchmark's business-source distribution is fixed, while native build and QA times are measured from the actual temporary outputs.

## Guarded account deployment

The command is `scripts/dispatch-dealer-pack-queue.mjs`; the workflow is **Dealer pack deploy queue**. A ready pack does not need a prior `main` inventory entry or a rebuild triggered by a `main` push. It does need its exact published source commit, a successful bound build and browser QA, and immutable authenticated artifacts. Never replace this path with `wrangler deploy`.

The queue lives in `queue.json` on the dedicated `cars-deploy-queue` branch of `darkapoparka/cars`. It was initialized once from complete live Workers, routes and custom-domain inventories and the owner's capacity policy. Do not reinitialize it or replace it with a new empty file. This state branch does not contain research packs. Each request has a deterministic identity, an ordered durable status history, and per-dealer receipts. Four batches append with compare-and-swap; conflicting writers reread and retry. CI uses a normal fast-forward Git push from the exact fetched queue head, while the connector uses the Contents API's current-blob SHA compare-and-swap.

Requests are persisted after authenticating their small manifest/source metadata, before the account executor downloads large shards. The winning executor drains requests from all batches through one non-expiring account claim. There is no GitHub Actions concurrency group to replace pending runs. Manual and 15-minute scheduled drains can service retained work. A missing provider credential or another active executor leaves requests retained. Before merge, scheduled and `workflow_run` execution cannot use this new workflow on `main`; use a manual run of the reviewed M2 branch or the connector pilot. After merge, scheduled and automatic drains execute maintained `main` code, with exact pack-source commits mounted separately. Scripts from research pack branches are never executed by the deployer.

Immediately before every create, the claim owner obtains a new paginated live inventory through the modern Workers API, including reserved Worker records. It checks the full protected baseline, canonical name/origin, current routes/domains, saved ownership receipts, and remaining capacity. A cached listing or a local-file lock is insufficient. The baseline inventory contained exactly 100 Workers, all mapped to protected dealers, and no non-dealer Workers: all 400 slots fit at that observation. Any new unrelated account Worker reduces the available expansion count and is reported before a create.

The only create is modern `POST /accounts/{account_id}/workers/workers` with exactly `cars-<slug>`. It fails on an existing name. Subsequent version uploads address the returned immutable Worker ID, set `deploy:false`, and are activated only through the guarded owned-version deployment call. The route is exactly `<slug>.webpreviews.site/*`. Every consequential provider write has a durable preceding intent. The 100 baseline Workers, their identities and routes are never candidates for create, overwrite, route reassignment, update or rollback.

An earlier deploy is reusable only when the dedicated queue's own receipt binds the same dealer, canonical identity, immutable Worker ID and provider ownership tags. A same-name Worker without that evidence remains a collision. Rollback selects a previously recorded version belonging to that same pack; it does not compile or import another dealer's version.

### Exact batch go-live sequence

Each batch owner incorporates the reviewed M2 tooling into their own branch. The coordinator does not edit the four research branches. The following sequence uses batch 1; use its own assignment number for another batch. Run the commands with Node 26.10.0 and the documented tool dependencies. `GITHUB_TOKEN` needs access to read Actions artifacts and write the dedicated queue branch. The provider token scopes are below.

1. **Migrate and commit the source.**

   ```sh
   node scripts/dealer-pack.mjs migrate --batch 1
   node scripts/dealer-pack.mjs migrate --batch 1 --write
   node scripts/plan-dealer-pack-ci.mjs plan --batch 1 --report runtime/batch-1-plan.json
   ```

   Review each failure and commit the mechanically migrated `dealers/` inputs on that batch owner's branch. The full assignment plan reports missing or invalid leads; it does not silently turn 100 into a smaller complete batch.

2. **Build the exact committed batch.** Run **Dealer pack pipeline** on that branch with `batch: "1"`, leaving `slugs` empty. Retain its completed run ID. For a deliberately selected ready subset, supply the explicit slugs and `batch: "1"` together. The workflow validates each pack, builds valid entries across seven lanes, and retains qualified bundles independently.

3. **Deploy dry-run.** Use **Dealer pack deploy queue** with `action: inspect`, that `source_run_id`, and `batch: "1"`. Leave `artifact_prefix` empty to inspect every lane. With credentials on an authorized executor, the identical CLI is:

   ```sh
   node scripts/dispatch-dealer-pack-queue.mjs inspect \
     --run BUILD_RUN_ID --batch 1 --live \
     --report runtime/batch-1-deploy-inspection.json
   ```

   This authenticates all sealed bytes and source bindings and performs fresh live identity/capacity reads. It writes no Cloudflare resources. Omitting `--live` is an offline provider-free inspection and is not reported as a live preflight.

4. **Enqueue and deploy write through the account claim.** Run the same workflow with `action: enqueue-and-deploy`, the same run ID and batch. The two explicit CLI operations are:

   ```sh
   node scripts/dispatch-dealer-pack-queue.mjs enqueue \
     --run BUILD_RUN_ID --batch 1 \
     --report runtime/batch-1-enqueue.json
   node scripts/dispatch-dealer-pack-queue.mjs drain \
     --owner github:DEPLOY_RUN_ID --write --max 400 \
     --report runtime/batch-1-drain.json
   ```

   Enqueue is durable and does not deploy. Drain uses the shared account claim and may also service requests already retained from the other batches. A losing executor exits with a retained-queue result, not a dropped request. Use the actual running GitHub workflow ID for the owner so stopped-run recovery can be authenticated. Automatic post-build intake uses the same path once the maintained deploy workflow is on `main`.

5. **Hosted verify.** Every successful activation is immediately checked by the drainer before it records a passing deployment receipt. The check visits all six homes and sourced contact journeys at 390 pixels, requires HTTP 200, visible own name/logo, a sourced phone or its explicit absence policy, six correct FAB choices and usable open/Escape interaction, exact logo asset hashes, no overflow or page errors, and no known other dealer identity. It scans all checked-out pack facts plus the live registry. Requests are anonymous GET/HEAD; forms and enquiries are not submitted. Inspect the retained `dealer-pack-deploy-reports--DEPLOY_RUN_ID` artifact and per-dealer queue receipts. For an explicit repeat with retained exact inputs:

   ```sh
   node scripts/verify-hosted-dealer-pack.mjs \
     --request EXACT_REQUEST.json \
     --bundle EXACT_RESTORED_DEALER_DIRECTORY/bundle \
     --receipt EXACT_OWNED_RECEIPT.json \
     --report runtime/hosted/SLUG/report.json \
     --screenshots runtime/hosted/SLUG/screenshots
   ```

   Use the exact pack source commit associated with the receipt; the verifier refuses a changed pack digest. A hosted failure is retained as a failure, with its owned Worker identity recorded for a guarded retry. It does not become a passing inventory entry.

## Recovering an interrupted initial creation

The account claim does not expire. A failed or cancelled executor that may have written to Cloudflare retains its claim until the outcome is positively reconciled. An ordinary later drain reports the retained claim and leaves the remaining requests in the queue.

For a prior GitHub executor, use the exact 64-character request ID from queue status. `GITHUB_TOKEN` must be able to read the old Actions run and update the dedicated queue branch; `CLOUDFLARE_API_TOKEN` provides the same account and zone reads as the normal guarded provider. The recovery command performs no Cloudflare writes.

```sh
node scripts/reconcile-dealer-pack-claim.mjs inspect \
  --request-id REQUEST_SHA256 \
  --report runtime/dealer-pack-dispatch/recovery-inspection.json

node scripts/reconcile-dealer-pack-claim.mjs resume \
  --request-id REQUEST_SHA256 \
  --write \
  --report runtime/dealer-pack-dispatch/recovery-resume.json

node scripts/dispatch-dealer-pack-queue.mjs drain \
  --owner github:CURRENT_EXECUTOR_RUN_ID \
  --write --max 400 \
  --report runtime/dealer-pack-dispatch/recovered-drain.json
```

Run the drain as a genuine current GitHub executor or through the maintained connector bridge; do not invent a run ID. `inspect` leaves the queue unchanged. `resume --write` repeats the stopped-owner and provider reads, then uses the queue CAS to requeue the exact existing request. It cannot authorize another pack, origin, Worker name, or action. The normal drainer then skips the already acknowledged create, rechecks the immutable Worker ID, version, tags and route before upload, and completes the normal six-design hosted verification. At a live count of 500 this continuation consumes no additional Worker slot.

Automatic continuation requires all of the following:

- The authenticated GitHub API reports the exact old executor run completed, or the maintained connector verifier proves that its saved process identity stopped. An operator-authored assertion or PID alone is insufficient.
- The queue contains the successful create acknowledgement with the exact immutable Worker ID and complete queue, lead and request tags. The live Worker still matches those values.
- A new, complete Cloudflare account, route and domain snapshot satisfies the normal protected-fleet and hosting-identity guards.
- A never-deployed Worker has no activation intent that could still complete. Any unacknowledged version upload must explicitly have used `deploy: false`.
- An active version matches a saved exact upload and activation intent. Any existing route matches this request's canonical route creation and immutable owned Worker; a missing route cannot resolve a possibly outstanding route create.

An unacknowledged create without a saved immutable ID remains blocked, even when the name and tags look plausible. A still-running owner, changed Worker ID/version/tags/bindings, stale read, or negative observation of a possibly in-flight activation/route also remains blocked. There is no TTL, arbitrary adoption, delete, or force-unlock option. The connector branch of the programmatic recovery API requires its maintained stopped-process callback; the standalone CLI does not accept a fake proof file.

The focused regression suite covers asset/version interruption, positive activation and route recovery, repeated interruptions, the final 500th slot, stopped-owner checks, stale observations, a changed CAS claim, and cross-identity refusals. The command only recovers an incomplete initial creation. An uncertain later update or rollback still needs a positive reconciliation of its exact prior and requested versions; this command does not infer that outcome.

## Queue receipt size and evidence retention

Full per-dealer hosted reports and screenshots remain separate artifacts. A queue receipt contains the six accepted design gate rows, the exact pack/output/version and origin, the 390-pixel width, language, completion time, and public identity coverage counts. Coverage arrays are represented by their counts and a digest. `receipt.hosted.sha256` binds the unchanged full report; `receipt.hosted.summarySha256` binds the compact `receipt.hosted.report`. The report scope explicitly says `compact-acceptance-summary`.

A conservative synthetic scale test uses 400 exact request envelopes, 43-character slugs, complete source proofs, eight immutable shard artifact locators per request, successful create event histories, and accepted six-design hosted summaries. Its pretty-printed queue is **8,239,129 bytes**, leaving **8,538,087 bytes** under the existing **16,777,216-byte** queue cap. The fixture's full hosted reports include 400 pack identities each and are deliberately kept outside queue state. This is a serialized-state capacity test, not a hosted deployment timing or runtime measurement. CPU and memory are not inferred from receipt size.


### Provider credentials and connector fallback

The repository secret is exactly `CLOUDFLARE_API_TOKEN`. Minimum deployment scopes are **Account / Workers Scripts / Edit**, scoped to account `cb0007f242077bd759331f096eb75531`, and **Zone / Workers Routes / Edit**, scoped to the `webpreviews.site` zone `006e99b27c99b7ee85bc0642fa91fa14`. Add **Account / Account Analytics / Read** for the CPU/memory evidence. Fixed account and zone IDs mean no DNS Edit or zone-discovery permission is needed. The owner confirmation of Workers Paid is retained; the connector does not pretend to read a subscription it cannot inspect.

When the secret is absent, the workflow reports that fact without exposing credentials and leaves authenticated requests durable. `scripts/dealer-pack-connector-bridge.mjs` exposes the same inspect/enqueue/drain/rollback core through private request/response files for the connected GitHub and Cloudflare transports. It is not an alternate unguarded uploader. Asset-session JWTs are short-lived, scoped upload credentials; request and response files are mode 0600 and deleted after consumption. Never commit them, print them into logs, or place them in public receipts.

### Receipts, metrics and integration

Each immutable receipt is appended under its dealer in the state branch, with request/source/pack/release/output digests, immutable Worker and version IDs, route identity, fresh counts, runtime startup evidence and hosted status. No batch modifies a shared inventory during deployment. Merge successful latest receipts later in one coordinator change:

```sh
node scripts/merge-dealer-pack-receipts.mjs \
  --out runtime/DEPLOYMENT-INVENTORY.proposed.json
```

The command reads the authenticated queue, keeps the existing 100 rows byte-equivalent, and produces a reviewable proposed inventory. `--queue-state FILE` is available for an explicitly offline proposal, labelled unauthenticated. The command does not overwrite the tracked inventory or write Cloudflare resources.

The provider's version upload returns startup time. `read-dealer-pack-metrics.mjs` queries observed Workers CPU and V8 isolate-memory quantiles, requests, errors and statuses for an explicit time window. CPU quantiles are converted from microseconds; memory is isolate usage, not process RSS. Empty or delayed analytics remain `awaiting-ingestion`, never fabricated zero usage. Retain the measured interval and sample scope when making a capacity claim.

```sh
node scripts/read-dealer-pack-metrics.mjs \
  --slug SLUG --start START_ISO --end END_ISO \
  --startup-ms OBSERVED_STARTUP_MS \
  --report runtime/metrics/SLUG.json
```

