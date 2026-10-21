# Dealer-pack pipeline

M2 applies to new `dealers/<slug>/` packs. The owner confirmed Workers Paid, authorized 400 new previews, and explicitly approved using the final slot: account capacity 500, protected baseline 100, maximum new dealers 400, reserve 0. Deployment authority covers previews only; outreach is separate and is not authorized. The three proof dealers are members of that 400-lead expansion, not additional slots.

The M2 implementation was integrated into `main` by PR #17. Existing research branches retain their independent pack work; intake selected dealer directories by exact source revision while preserving the shared lock and batch identities. Existing `clients/` workflows remain available. A malformed neighboring pack is reported and its identity reserved; it does not crash the old dealer index or unrelated builds.

## Build architecture and its limits

This release uses `fresh-native-builds-shared-dependencies`. Each dealer still receives six fresh framework builds and a fresh router build. The receipt explicitly records `compileOncePerRelease: false`; 400 dealers still mean 2,800 native targets. There is no unqualified compiled-output reuse across dealers.

The proposed runtime JSON substitution is not a safe drop-in for these templates. Business facts, stock, image references, structured data and locale copy currently enter roughly 200 generated source files and several server/client hydration boundaries. The six frameworks produce their own asset manifests and server entry points. Changing only a server-side JSON binding would leave client bundles and prerendered data with another dealer's content. A complete runtime conversion would require changing those data boundaries and qualifying each framework's hydration and rendering behavior. It is outside a zero-visual-change adapter patch. This release therefore retains each framework's native output semantics and removes repeated setup and transfers around those builds.

Normal plans use up to fourteen CI lanes, subject to available Actions runners; the planner accepts explicit lower caps from one to fourteen. The benchmark25 default remains seven lanes. Shared contracts run once per source run. Within a lane, dealers and their native framework compilations run serially. The lane keeps dependency installations and family workspaces, isolates source preparation in a child that exits before native compilation, and rebinds the maintained Svelte publisher to the next prepared source. A content-addressed esbuild transform cache reuses only an identical input/options transformation. Dealer-specific compiled output is never treated as a template release.

There are no per-dealer source archive artifacts and no family-to-family artifact downloads. Package-download caches bind the stable template release, exact tools, runtime, OS and architecture, rather than the research commit. Every lane now restores the same physical `runtime/dealer-pack-download-cache/` path; the measured benchmark predates that path normalization and uploaded seven separate cache versions. Source and native intermediates remain on the lane runner and are discarded after their final bundle/report is sealed. The final bundle transport described below deduplicates identical file bytes across the lane. Build transports expire after seven days to cover serial deployment and retry margin; compact plans, reports and screenshots after three days. Cache and artifact actions are pinned to immutable SHAs. Artifact names contain `--` separators and omit `run_attempt`, while deployment locators still bind immutable artifact IDs and digests.

A failed pack is excluded with a reason and the remaining packs continue. Downstream reporting uses `!cancelled()` rather than an implicit success-only chain. The final CI gate remains failed if any pack was rejected or failed. Deployment can consume successful individual artifacts from such a run only after authenticating the exact source run's successful shared `contracts` job. A failure in shared guards or packaging contracts cannot be bypassed by selecting a successful dealer artifact.

For a tooling or workflow checkpoint that needs shared contracts without new native builds, dispatch the maintained pipeline with `contracts_only=true`:

```sh
gh workflow run dealer-pack-pipeline.yml --ref main -f contracts_only=true
```

This runs the shared Node 26/document and Node 22 publisher checks, skips planning/native lanes, and requires successful contracts at the final gate. Normal explicit-slug and batch runs keep their existing behavior. A contracts-only run has no bundle transports and cannot be used as a deployment `source_run_id`; automatic transport inspection reports its missing manifests without queue/provider writes. It does not qualify artifacts from an older failed source run.

## Visual policy

The three proof builds at `26b626c979d2cfd653b3015d94ff8fe2df724a93` passed all 54 comparisons against the final M1 bundles: **zero unexpected pixels** across 81,340,510 pixels on each side. The only changes were 29,691 pixels inside the explicitly requested FAB artwork correction and nine antialiasing pixels. See [the visual evidence and exact comparison method](m2/VISUAL-EQUIVALENCE-2026-10-19.md) and [all screenshot/report digests](m2/visual-equivalence-2026-10-19.json). This is visual equivalence with that named artwork exception, not a claim of complete pixel identity.

The continuation also authenticated the newer three proof bundles at `19feec837524c04f88f3c3ccbd0586e0771574c3`, [run 39319236637](https://github.com/darkapoparka/cars/actions/runs/39319236637). All 54 views match the previously compared M2 output: 51 PNGs are byte-identical; the other three contain nine classified antialiasing pixels in total and zero unexpected pixels. The [carry-forward receipt](m2/visual-carry-forward-19feec8.json) binds the exact archive, build, QA and screenshot hashes.

After the HEAD correction, fresh native builds at `599adb6c101219eecbe8b4117e62189f7f168f16`, [run 39341160417](https://github.com/darkapoparka/cars/actions/runs/39341160417), passed all three builds and browser QA, and all shared contracts. A new direct comparison against the final M1 attempt passes **54/54 views**: every pixel outside the named FAB artwork is identical, with **zero antialiasing pixels and zero unexpected differences**. The 29,691 changed artwork pixels remain the same explicit exception; complete pixel identity is not claimed. The [fresh comparison receipt](m2/visual-equivalence-599adb6.json) binds the exact source, terminal CI jobs, six downloaded archives, build/QA reports and all 108 baseline/candidate PNG hashes. The subsequent inspection request and workflow sequencing change do not alter pack inputs, template sources or Worker output code.

The qualified M2 proof release changed no template frontend or styling source. Later shared template work on main is maintained separately and does not update the selected immutable release. Signature desktop example cards in that proof release remain unchanged. V2 uses the same active-design FAB artwork as the 100 live dealers, as explicitly requested. M1 pack FABs used the dealer's mark, so that requested correction is a real, bounded visual difference from M1.

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

The research branches were created from `a999878`. In the maintained checkout, selected dealer directories can be integrated from an exact research commit while preserving the current shared lock and assignments. Alternatively, a batch owner can incorporate the maintained M2 tooling into their existing branch. Migrate the existing packs mechanically in the chosen source location. The migration does not fetch new research, generate replacement artwork, change the selected template trees, or deploy. It retains the lead ID, facts, dated stock, source evidence, original artwork and sourced photos. If a directory must be shortened, it changes only structural dealer bindings and internal pack paths; the research identity and business prose stay intact.

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

After committing migrated inputs, run **Dealer pack pipeline** with `batch: "1"`. It resolves all 100 assigned research identities, validates each present pack independently, reports rejected or missing entries, and distributes valid entries across at most fourteen persistent build lanes. Alternatively, supply one to 100 explicit slugs. An explicit slug list can be combined with the workflow's batch field to constrain that subset to one batch. PR runs select only the changed existing `dealers/<slug>/` directories from the exact PR base/head diff; a PR with no changed pack inputs skips dealer builds.

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

## M2 benchmark and capacity forecast

The authenticated [25-pack benchmark, run 39310711918](https://github.com/darkapoparka/cars/actions/runs/39310711918), used `dedb9c0565c7d39da1c1cb12c3958f03e45464f6` and seven concurrent lanes. Each lane built its packs serially with seven serial native component builds per pack. The 25 temporary, never-deployed clones were 7 ZA Motors, 1 Granada Auto Sales and 17 Wadishee Used Cars. All 25 passed: 350 QA gates, 1,050 route observations, 450 screenshot hashes, and zero provider writes. Wall time was **37m37s**, including plan and final gate; all seven build lanes had finished at **37m30s**. Summed lane runner execution was **3h36m07s**, while pack work summed to **3h03m18s**.

| Measure | Actual result |
|---|---:|
| Cold pack mean / range, 7 observations | 9m34s / 8m03s–10m27s |
| Warm pack mean / range, 18 observations | 6m28s / 4m49s–7m28s |
| Mean source assembly | 26.89s |
| Mean provider preparation/source sync | 7.52s |
| Mean seven native build-driver elapsed time | 237.85s |
| Mean composition/dry-run | 14.61s |
| Mean local browser QA | 150.81s |
| Report/log/screenshot ZIP artifacts | 268,639,656 bytes; three-day retention |
| Source/native archives transferred | 0 / 0 |
| Actual dependency-cache uploads | 8,421,557,456 bytes across seven lanes |

This fallback **still compiles each native app for every dealer**. It reuses checked dependency installations and source workspaces; it does not claim compile-once runtime loading. The 25-pack run executed 150 app compiles and 25 router bundles. The 400-dealer forecast remains **2,400 app compiles + 400 router bundles = 2,800 build operations**.

Using each observed lane's own cold time, warm mean and setup/finish overhead, **100 ready packs forecast about 1h53m** on seven concurrent lanes. The supported four sequential 100-pack runs at the same seven-runner budget forecast **about 7h31m for 400**. Favorable/unfavorable observed runner-speed scenarios are about **1h20m–2h02m per 100**; that range is not a statistical confidence interval. Keeping seven lanes continuously warm across all 400 would model about 7h08m, but workflow inputs are capped at 100. Four overlapping 100-pack workflows would require up to 28 concurrent lane runners; that capacity was not verified. Final bundle sealing/transport, extra report upload time, live asset upload, account-serialized deployment and hosted checks are additional.

The owner's prior **36-hour M1 model** for 400 forecast 2,800 native builds, 3,616 jobs, 1.1 TB artifacts and 765 GB caches. That was a model, not a completed 400-dealer measurement. The new 400 figure is also a projection, based on the actual 25-pack execution.

The benchmark used a stable release cache key but lane-specific cache paths. All seven cache saves therefore uploaded about 1.203 GB each. The subsequent fixed cache path is a storage correction; no unmeasured speed gain is attributed to it. Final bundle transport was skipped for temporary benchmark packs, so the 268.64 MB artifact total measures only reports, logs and screenshots. The preparation subprocess peak was 3.84–4.11 GiB; this is build memory, not Worker runtime memory. Peak disk, hosted CPU, startup and runtime memory were not measured in this benchmark.

The original benchmark workflow is **red overall** because Node 22 rejected `--test-isolation=none` at a shared Svelte-test invocation after the main tests passed. The aggregate gate correctly preserved that failure while all seven build lanes completed. The [corrected contracts run 39312845364](https://github.com/darkapoparka/cars/actions/runs/39312845364) is green: 537 main tests passed, one Windows-only test skipped on Linux, and all 20 separate Svelte tests passed. It does not replace or rerun the 25 benchmark timings. M1 visual comparison is separate evidence.

The committed measurement, lane timings, authenticated CI metadata and complete interpretation are in [the 25-pack report](m2/BENCHMARK-25.md), [machine-readable measurements](m2/benchmark-25.json), [all dealer timings](m2/benchmark-25-timings.csv) and [CI artifact evidence](m2/benchmark-25-api-evidence.json).

## Guarded account deployment

The command is `scripts/dispatch-dealer-pack-queue.mjs`; the workflow is **Dealer pack deploy queue**. A ready pack does not need a prior `main` inventory entry or a rebuild triggered by a `main` push. It does need its exact published source commit, a successful bound build and browser QA, and immutable authenticated artifacts. Never replace this path with `wrangler deploy`.

The queue lives in `queue.json` on the dedicated `cars-deploy-queue` branch of `darkapoparka/cars`. It was initialized once from complete live Workers, routes and custom-domain inventories and the owner's capacity policy. Do not reinitialize it or replace it with a new empty file. This state branch does not contain research packs. Each request has a deterministic identity, an ordered durable status history, and per-dealer receipts. Four batches append with compare-and-swap; conflicting writers reread and retry. CI uses a normal fast-forward Git push from the exact fetched queue head, while the connector uses the Contents API's current-blob SHA compare-and-swap.

An explicit `enqueue-and-deploy` invocation persists requests after authenticating their small manifest/source metadata, before the account executor downloads large shards. The owner's 400-preview authorization also permits automatic intake of qualified manually selected `main` builds. A completed same-repository `main`/`workflow_dispatch` source run enters intake and drain automatically; other branches, PRs, forks and cancelled source runs do not. Scheduled runs inspect up to four active manual `main` producers before draining the retained queue. A missing provider credential or another active executor leaves requests retained. Manual `inspect` remains read-only.

The winning executor drains all batches through one non-expiring account claim. There is no GitHub Actions concurrency group to replace pending runs. Full compiled-bundle, QA, screenshot and source verification plus a fresh provider identity/capacity preflight remain mandatory before provider writes, including requests admitted automatically. Maintained `main` executor code mounts exact pack-source commits separately; research-branch scripts are never executed by the deployer.

### Independent producer readiness

Future native lanes have explicit producer identities. While their source run is active, a lane is admissible only after its latest-attempt producing job has completed successfully and the exact source's shared contracts passed. Successful build, seal, manifest and every declared shard-upload step are required. Authenticated job logs must bind each exact artifact ID, name, byte count and SHA-256 within that producing job's time interval. Queue restoration rechecks current source attempt, contracts, producer completion, immutable artifact identities and expiry before using cached bytes. A pending lane contributes no requests; a failed or inconsistent proof stays held. Completed source runs preserve existing independently qualified partial-survivor behavior.

An explicit normal cohort of at most fourteen packs produces one pack per lane, so each finished pack can advance while siblings continue building. Larger cohorts advance per completed lane. Existing runs retain their pinned lane counts and producer behavior; old producer names remain terminal-only. This does not claim that an unfinished lane or a completed logo alone is deployable.

The existing fifteen-minute schedule discovers ready active producers through `scripts/intake-ready-dealer-pack-runs.mjs`; `workflow_run` also admits completed manually dispatched sources when GitHub delivers that event. Token-triggered source cohorts explicitly dispatch the deployment workflow from their result job because [GitHub suppresses recursive token-triggered events](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow). The completion callback authenticates its exact original main run, reserved nonce and source, then makes one `enqueue-and-deploy` dispatch with `automatic_intake: true`. A failed sibling does not suppress this callback; each successful producer still needs its own existing contract/artifact/QA proof. Cancelled, benchmark, fork, PR and rerun contexts cannot dispatch. A retained intent prevents retrying an ambiguous POST.

All these paths use the same strict automatic queue admission. Inside the queue compare-and-swap, semantic duplicates do not redeploy when artifact IDs change, and previously retained dealers remain held for their separately guarded manual update/retry path. This preserves failed Worker/version ownership even across source/artifact reruns. The pre-merge three-proof trigger below remains historical read-only inspection.

### Register all 400 preparation targets once

Dispatch **Dealer pack deploy queue** on `main` with `action: queue-all` and `batch: auto`. This registers the exact committed 400 assignments in `source-campaign.json` on the existing `cars-deploy-queue` branch. It preserves `queue.json`, the protected baseline and every retained deployment request. Registration is idempotent; registration itself is not native qualification or a deployment.

The maintained `scripts/schedule-dealer-pack-source.mjs` inspects reviewed source packs and persists a cohort of at most 14 before issuing one native workflow dispatch. Existing deployment identities are excluded, including failures requiring their guarded recovery. Packs without reviewed facts, branding or other required inputs stay waiting in the same campaign. A source reservation binds the exact published main revision, pack digests, shared build material and a public tracking nonce. Ambiguous dispatch responses retain that reservation for reconciliation; the scheduler never repeats its POST. A completed native attempt cannot rebuild unchanged material automatically.

The existing schedule, authenticated native completion events and relevant `main` source pushes continue a registered campaign. Unknown active native producers defer new source work. Observed older producers remain durably tracked until maintained automatic terminal intake has positively inspected their exact outputs; failed members retain their pinned failed material. Native output still enters `queue.json` through the existing authenticated qualification path. Provider draining retains its account claim, per-create capacity checks and per-dealer hosted verification. The `queue-all` action and source pushes perform no provider writes; normal scheduled/qualified intake and continuation service deployment requests.

The scheduler also completes maintained automatic intake for its own finished source cohort and rereads the qualified queue before releasing that reservation or choosing another cohort. Failed or unbound intake keeps the reservation held. Advancing main or shared build material therefore cannot make a successful but not yet intaken sibling eligible for another build. An additive immutable `ownedIntakes` acknowledgement preserves the original reservation and records retained queue identities or exact failed material for every selected member. Historical completed cohorts without an acknowledgement are reconciled once; acknowledged failures do not force later rereads of expired artifacts or block unrelated ready packs.

For a direct Actions invocation, use `node scripts/schedule-dealer-pack-source.mjs --register-all --report runtime/dealer-pack-dispatch/source-rollout.json`. Omit `--register-all` for ordinary continuation; an absent campaign then reports that it has not been registered. Use the actual Actions run ID and repository token supplied by the workflow. Do not fabricate an executor identity or turn waiting inputs into qualified requests.

Immediately before every create, the claim owner obtains a new paginated live inventory through the modern Workers API, including reserved Worker records. It checks the full protected baseline, canonical name/origin, current routes/domains, saved ownership receipts, and remaining capacity. A cached listing or a local-file lock is insufficient. The baseline inventory contained exactly 100 Workers, all mapped to protected dealers, and no non-dealer Workers: all 400 slots fit at that observation. Any new unrelated account Worker reduces the available expansion count and is reported before a create.

The only create is modern `POST /accounts/{account_id}/workers/workers` with exactly `cars-<slug>`. It fails on an existing name. Subsequent version uploads address the returned immutable Worker ID, set `deploy:false`, and are activated only through the guarded owned-version deployment call. The route is exactly `<slug>.webpreviews.site/*`. Every consequential provider write has a durable preceding intent. The 100 baseline Workers, their identities and routes are never candidates for create, overwrite, route reassignment, update or rollback.

An earlier deploy is reusable only when the dedicated queue's own receipt binds the same dealer, canonical identity, immutable Worker ID and provider ownership tags. A same-name Worker without that evidence remains a collision. Rollback selects a previously recorded version belonging to that same pack; it does not compile or import another dealer's version.

### Pre-merge three-proof dry run

The workflow has one branch push trigger, limited to changes to `docs/m2/pilot-inspection-request.json` on `astra/m2-fast-deploy`. The file must contain `schemaVersion: 1`, `action: "inspect"`, the exact completed `sourceRunId`, its full `sourceCommit`, and exactly `za-motors`, `wadishee-used-cars` and `granada-auto-sales` in `slugs`. The helper verifies the run/commit before downloading any bundles, then calls the ordinary `inspect` dispatcher. It rejects extra fields, other slugs and any write action.

The `inspect-pilot` job has only `contents: read` and `actions: read`, and runs only for its historical Astra-branch inspection trigger. Relevant `main` pushes instead service authenticated intake and the registered preparation campaign; they do not authorize provider draining. A present provider token adds the pilot's normal live provider reads; an absent token produces an authenticated offline bundle inspection and an explicit `blocked-missing-provider-token` report. Both pilot outcomes have zero queue writes, zero provider writes and zero deployments. The artifact is `dealer-pack-pilot-inspection--RUN_ID`; it does not qualify a live preview.

The same bounded helper on an authorized executor is:

```sh
node scripts/inspect-dealer-pack-pilot.mjs \
  --request docs/m2/pilot-inspection-request.json \
  --report runtime/dealer-pack-dispatch/pilot-summary.json
```

### Exact batch go-live sequence

Use the maintained checkout on `main` or a suitable existing batch branch containing the reviewed M2 tooling. When integrating research into `main`, select exact dealer directories from the pinned research commit and preserve its original facts/artwork/photos; do not replace the maintained shared tooling or lock with stale research copies. The following full-batch example uses batch 1; use its own assignment number for another batch. Run the commands with Node 26.10.0 and the documented tool dependencies. `GITHUB_TOKEN` needs access to read Actions artifacts and write the dedicated queue branch. The provider token scopes are below.

For selected packs on `main`, migrate/review/check each explicit slug, commit those inputs, and build only that selected subset:

```sh
node scripts/dealer-pack.mjs migrate --slug ready-pack --batch 1
node scripts/dealer-pack.mjs migrate --slug ready-pack --batch 1 --write
node scripts/dealer-pack.mjs check --slug ready-pack
gh workflow run dealer-pack-pipeline.yml --repo darkapoparka/cars \
  --ref main -f slugs=ready-pack -f batch=1
```

For a selected subset spanning assignments, omit the build's optional `batch` input; each pack still has to match its recorded assignment. Preserve explicit slugs through artifact inspection and queue intake. A successful subset does not mean the whole 100-lead assignment is complete.

1. **Migrate and commit the source.**

   ```sh
   node scripts/dealer-pack.mjs migrate --batch 1
   node scripts/dealer-pack.mjs migrate --batch 1 --write
   node scripts/plan-dealer-pack-ci.mjs plan --batch 1 --report runtime/batch-1-plan.json
   ```

   Review each failure and commit the mechanically migrated `dealers/` inputs on that batch owner's branch. The full assignment plan reports missing or invalid leads; it does not silently turn 100 into a smaller complete batch.

2. **Build the exact committed batch.** Run **Dealer pack pipeline** on that branch with `batch: "1"`, leaving `slugs` empty. Retain its completed run ID. For a deliberately selected ready subset, supply the explicit slugs and `batch: "1"` together. The workflow validates each pack, builds valid entries across up to fourteen lanes, and retains qualified bundles independently.

   Once the reviewed workflows are available on `main`, the exact GitHub CLI invocation is:

   ```sh
   gh workflow run dealer-pack-pipeline.yml --repo darkapoparka/cars \
     --ref astra/batch-1 -f batch=1
   gh run list --repo darkapoparka/cars --workflow dealer-pack-pipeline.yml \
     --branch astra/batch-1 --limit 5 \
     --json databaseId,headSha,status,conclusion,url
   gh run watch BUILD_RUN_ID --repo darkapoparka/cars --exit-status
   ```

   Bind `BUILD_RUN_ID` to the exact committed batch SHA in that listing. A failed shared contracts job blocks all its artifacts; an unrelated pack failure does not erase independently qualified results.

3. **Deploy dry-run.** Use **Dealer pack deploy queue** with `action: inspect`, that `source_run_id`, and `batch: "1"`. Leave `artifact_prefix` empty to inspect every lane:

   ```sh
   gh workflow run dealer-pack-deploy.yml --repo darkapoparka/cars \
     --ref main -f action=inspect -f source_run_id=BUILD_RUN_ID -f batch=1
   gh run list --repo darkapoparka/cars --workflow dealer-pack-deploy.yml \
     --event workflow_dispatch --branch main --limit 5 \
     --json databaseId,headSha,status,conclusion,url
   gh run watch INSPECTION_RUN_ID --repo darkapoparka/cars --exit-status
   gh run download INSPECTION_RUN_ID --repo darkapoparka/cars \
     --name dealer-pack-deploy-reports--INSPECTION_RUN_ID \
     --dir runtime/batch-1-inspection-evidence
   ```

   Match the run to this invocation and check its retained `inspection.json`: `success`, `bundleVerified` and `liveProviderVerified` must all be `true`, with `providerWrites: 0`, the exact `sourceCommit` and every intended dealer represented. A green offline inspection does not satisfy live preflight. The automatic post-build inspection is also read-only and may supply this evidence when it covers the exact intended source and batch. With credentials on an authorized executor, the identical inspection CLI is:

   ```sh
   node scripts/dispatch-dealer-pack-queue.mjs inspect \
     --run BUILD_RUN_ID --batch 1 --live \
     --report runtime/batch-1-deploy-inspection.json
   ```

   This authenticates all sealed bytes and source bindings and performs fresh live identity/capacity reads. It writes no Cloudflare resources. Omitting `--live` is an offline provider-free inspection and is not reported as a live preflight.

4. **Enqueue and deploy write through the account claim.** After inspecting the dry-run evidence, run the same workflow with `action: enqueue-and-deploy`, the same build run ID and batch:

   ```sh
   gh workflow run dealer-pack-deploy.yml --repo darkapoparka/cars \
     --ref main -f action=enqueue-and-deploy \
     -f source_run_id=BUILD_RUN_ID -f batch=1
   gh run list --repo darkapoparka/cars --workflow dealer-pack-deploy.yml \
     --event workflow_dispatch --branch main --limit 5 \
     --json databaseId,headSha,status,conclusion,url
   gh run watch DEPLOY_RUN_ID --repo darkapoparka/cars --exit-status
   gh run download DEPLOY_RUN_ID --repo darkapoparka/cars \
     --name dealer-pack-deploy-reports--DEPLOY_RUN_ID \
     --dir runtime/batch-1-deploy-evidence
   ```

   These workflow steps perform the following explicit CLI operations:

   ```sh
   node scripts/dispatch-dealer-pack-queue.mjs enqueue \
     --run BUILD_RUN_ID --batch 1 \
     --report runtime/batch-1-enqueue.json
   node scripts/dispatch-dealer-pack-queue.mjs drain \
     --owner github:DEPLOY_RUN_ID --write --max 400 \
     --report runtime/batch-1-drain.json
   ```

   Enqueue is durable and does not deploy. Drain uses the shared account claim and may also service requests already retained from the other batches. Each hosted workflow invocation services at most ten requests within its 350-minute job; the existing fifteen-minute schedule services the durable remainder. The overall owner-authorized cap remains 400 new dealers. This count bound does not expire an in-flight claim or infer its outcome. A losing executor exits with a retained-queue result, not a dropped request. Use the actual running GitHub workflow ID for the owner so stopped-run recovery can be authenticated. Scheduled or qualified automatic intake/drain may win the claim after an explicit enqueue; follow the durable request to its actual executor and receipt instead of assuming this run created it. Existing failed requests require their separately guarded recovery/retry path.

5. **Hosted verify.** Every successful activation is immediately checked by the drainer before it records a passing deployment receipt. The check visits all six homes and sourced contact journeys at 390 pixels, requires HTTP 200 for both GET and bodyless HEAD, visible own name/logo, a sourced phone or its explicit absence policy, six correct FAB choices and usable open/Escape interaction, exact logo asset hashes, no overflow or page errors, and no known other dealer identity. HEAD follows only bounded same-origin redirects and retains their status evidence. Every design's compact receipt must contain passing HEAD evidence; a GET-only report cannot qualify. It scans all checked-out pack facts plus the live registry. Requests are anonymous GET/HEAD; forms and enquiries are not submitted. Inspect the retained `dealer-pack-deploy-reports--DEPLOY_RUN_ID` artifact and per-dealer queue receipts. For an explicit repeat with retained exact inputs:

   ```sh
   node scripts/verify-hosted-dealer-pack.mjs \
     --request EXACT_REQUEST.json \
     --bundle EXACT_RESTORED_DEALER_DIRECTORY/bundle \
     --receipt EXACT_OWNED_RECEIPT.json \
     --report runtime/hosted/SLUG/report.json \
     --screenshots runtime/hosted/SLUG/screenshots
   ```

   Use the exact pack source commit associated with the receipt; the verifier refuses a changed pack digest. A hosted failure is retained as a failure, with its owned Worker identity recorded for a guarded retry. It does not become a passing inventory entry.

6. **Retain receipts and integrate accepted inventory.** Retain the exact build run, immutable transport artifact IDs and digests, inspection report, queue request IDs, drain artifact and hosted/metrics reports. Full bundle transport artifacts expire after seven days; build and deploy reports expire after three days. The seven-day transport window covers the approximately 60 hours needed for 400 serial deployments plus retry margin. Complete deployment and download acceptance evidence within each artifact's actual expiry; previously created artifacts keep their original retention. Expired queued artifact locators are refused; rebuild and inspect fresh authenticated artifacts instead of treating a saved ZIP as an authorized replacement. The queue preserves fresh per-create counts and each owned Worker/version.

   Full batch acceptance requires passing hosted receipts for every selected dealer and retained `metrics.json` with `complete: true` and every report's `withinLimits: true`. Missing or delayed metrics require a read-only retry; no Worker redeployment is needed. Such a retry writes a per-dealer report, not a replacement aggregate: retain each needed retry against the same receipt and explicit measurement window, requiring `status: "observed-without-errors"` and `withinLimits: true` for every selected dealer before declaring acceptance. The inventory integration command does not ingest metrics reports, so its success alone does not certify CPU or memory acceptance. Propose the inventory change:

   ```sh
   node scripts/merge-dealer-pack-receipts.mjs \
     --out runtime/DEPLOYMENT-INVENTORY.proposed.json
   node scripts/merge-dealer-pack-receipts.mjs --write
   ```

   Review and commit the resulting coordinator inventory change. These commands do not deploy or push. A recorded Worker whose hosted check failed remains `deployed-unverified`, preserving ownership evidence without becoming a passing preview. A batch with any such row or incomplete runtime evidence remains incomplete.

### HEAD compatibility for new bundles

Existing live Workers were reported to return `HEAD /` as HTTP 500 while `GET /` was HTTP 200, including `kolarov-cars`, `centralauto-varna` and `batley-as-motor-group`. This release does not redeploy those dealers. Newly composed Workers handle HEAD through the same native GET representation, preserve its status and headers, cancel the unused response stream and return a bodyless response. Native redirects, conditional responses and genuine errors keep their status. Ordinary GET and write-method behavior and all template frontend files are unchanged.

A later read-only check on October 19 at 21:38–21:40 UTC did not reproduce that earlier 500. Preserving HEAD through every redirect, Kolarov and CentralAuto returned 307 to `/bg` then 200; Batley returned 302 to `/en` then 200, all bodyless. A second check completed HEAD with a unique query before sending its matching GET and obtained the same results. These are current observations through the available proxy, not evidence that the old Workers were fixed or that the prior failure cannot recur. No cache purge or deployment occurred. See [the exact per-hop observations](m2/existing-head-observations-2026-10-19.json).

## Recovering an interrupted initial creation

The account claim does not expire. A failed or cancelled executor that may have written to Cloudflare retains its claim until the outcome is positively reconciled. An ordinary later drain reports the retained claim and leaves the remaining requests in the queue.

The maintained deployment workflow exposes this recovery without a local provider credential. Dispatch `recover-inspect` first, using the exact queued request ID, and inspect its retained report. Dispatch `recover-and-drain` for that same ID after inspection establishes that it can resume:

```sh
gh workflow run dealer-pack-deploy.yml --ref main \
  -f action=recover-inspect -f request_id=REQUEST_SHA256

gh workflow run dealer-pack-deploy.yml --ref main \
  -f action=recover-and-drain -f request_id=REQUEST_SHA256
```

Both actions use the existing repository credentials and repeat the maintained recovery guards. Inspection leaves the queue unchanged. `recover-and-drain` drains only after reconciliation succeeds; a missing credential, malformed ID or refused recovery fails the run before draining. Recovery does not intake a new build or authorize another Worker creation.

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

A conservative synthetic scale test uses 400 exact request envelopes, 43-character slugs, complete source proofs, eight immutable shard artifact locators per request, successful create event histories, accepted six-design GET/HEAD summaries and explicit runtime-limit evidence. Its pretty-printed queue is **8,756,729 bytes**, leaving **8,020,487 bytes** under the existing **16,777,216-byte** queue cap. The fixture's full hosted reports include 400 pack identities each and are deliberately kept outside queue state. This is a serialized-state capacity test, not a hosted deployment timing or runtime measurement. CPU and memory are not inferred from receipt size.


### Provider credentials and connector fallback

The repository secret is exactly `CLOUDFLARE_API_TOKEN`. Minimum deployment scopes are **Account / Workers Scripts / Edit**, scoped to account `cb0007f242077bd759331f096eb75531`, and **Zone / Workers Routes / Edit**, scoped to the `webpreviews.site` zone `006e99b27c99b7ee85bc0642fa91fa14`. Add **Account / Account Analytics / Read** for the CPU/memory evidence. Fixed account and zone IDs mean no DNS Edit or zone-discovery permission is needed. The owner confirmation of Workers Paid is retained; the connector does not pretend to read a subscription it cannot inspect.

When the secret is absent, the workflow reports that fact without exposing credentials and leaves any already authenticated queue requests durable. An explicit inspection does not enqueue requests. `scripts/dealer-pack-connector-bridge.mjs` exposes the same inspect/enqueue/drain/rollback core through private request/response files for the connected GitHub and Cloudflare transports. It is not an alternate unguarded uploader. Asset-session JWTs are short-lived, scoped upload credentials; request and response files are mode 0600 and deleted after consumption. Never commit them, print them into logs, or place them in public receipts.

For these proof bundles, the retained authenticated ZA upload audit found 747 module files totaling 33,343,749 bytes (largest module 7,672,531 bytes). The current version-upload endpoint requires every module's complete `content_base64` in one JSON request. The connected execute tool has no supported file or streaming input for that payload. The bridge therefore is not a qualified upload transport for this bundle size; use the GitHub executor's guarded uploader. Do not create a placeholder Worker while upload capability or the repository secret remains unresolved, and do not run Wrangler by hand. The missing secret blocks the live pilot, hosted identity checks and observed startup/CPU evidence; an offline dry run does not satisfy those live checks.

### Receipts, metrics and integration

Each immutable receipt is appended under its dealer in the state branch, with request/source/pack/release/output digests, immutable Worker and version IDs, route identity, fresh counts, runtime startup evidence and hosted status. No batch modifies a shared inventory during deployment. Merge successful latest receipts later in one coordinator change:

```sh
node scripts/merge-dealer-pack-receipts.mjs \
  --out runtime/DEPLOYMENT-INVENTORY.proposed.json

node scripts/merge-dealer-pack-receipts.mjs --write
```

The default command reads the authenticated queue and produces a reviewable proposal. Explicit `--write` integrates the receipts locally into `docs/DEPLOYMENT-INVENTORY.json` and regenerates `docs/DEPLOYMENTS.md`, `clients/README.md` and `clients/index.json`. Each published pack is authenticated against the receipt's immutable source commit, exact Git tree/blob inventory and complete pack digest; edited working-tree business facts cannot rename an already published dealer. The existing 100 live dealer records retain their data. `--queue-state FILE` is available for an explicitly offline proposal, labelled unauthenticated, and cannot be combined with `--write`. Neither mode changes Cloudflare resources or pushes the resulting inventory commit.

Legacy registry inconsistencies are preserved and reported only when the complete old record is unchanged; new or changed records must pass current validation. The initial integration audit found one existing inconsistency: Al Reef records six variants with a packaging-version-3 label. This PR does not alter that dealer's record. Shared repository use is allowed for authenticated dealer packs with distinct `dealers/<slug>` source directories and pinned commits.

The provider's version upload must return a finite startup time from 0 through 1,000 milliseconds before activation. Uploads explicitly retain a validated configured CPU budget, or set the current Paid default of 30,000 milliseconds when no budget was configured. The receipt records the requested budget and whether the accepted value came from the provider version response or the successful explicit request; a conflicting provider value is refused. Recovery applies the same startup and budget checks.

`read-dealer-pack-metrics.mjs` queries observed Workers CPU and V8 isolate-memory quantiles, requests, errors and statuses for an explicit time window. CPU quantiles are converted from microseconds; memory is isolate usage, not process RSS. It compares startup with 1,000 ms, the maximum reported group P99 CPU with the bound CPU budget, and maximum group P99 isolate memory with 128 MiB. `withinLimits: true` requires complete measured inputs, no reported errors and all comparisons passing. This is sampled quantile evidence, not an exact observed peak or a load test. Empty or delayed analytics remain `awaiting-ingestion`, never fabricated zero usage. The deployment workflow does not pass its runtime acceptance step when measurements remain incomplete or exceed limits. Repeat the read-only metrics check after ingestion; that does not redeploy the dealer. Retain the measured interval and sample scope when making a capacity claim.

```sh
node scripts/read-dealer-pack-metrics.mjs \
  --slug SLUG --start START_ISO --end END_ISO \
  --startup-ms OBSERVED_STARTUP_MS \
  --cpu-limit-ms RECEIPT_CPU_LIMIT_MS \
  --cpu-limit-source RECEIPT_CPU_LIMIT_SOURCE \
  --report runtime/metrics/SLUG.json
```

Use the startup time, CPU limit and limit source from that exact deployment receipt. Check the resulting report's `status: "observed-without-errors"` and `withinLimits: true`; a successful read-only command with `withinLimits: null` records unavailable evidence and does not pass runtime acceptance.

