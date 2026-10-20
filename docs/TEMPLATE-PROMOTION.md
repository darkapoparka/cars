# Template releases from Cars

The selected editable masters are `templates/{auto-best,modern,import,app,mobile,karento-best}` in `darkapoparka/cars`, with Signature named `karento-best` in source. Work on Cars main. `templates.lock.json` selects immutable commits and subtrees for dealer creation and explicit updates. Editing a template changes neither that selection nor existing dealers.

Follow the owner's [six-design fleet contract](FLEET-ROLLOUT-2026-10-11.md): Auto Best, Modern, Import, App, Mobile and Signature share exactly one Cloudflare Worker per dealer, including all applications and assets. Preserve the existing Modern/Import choice at `/variant-2`, mount the other at `/variant-3`, App at `/variant-4`, Mobile at `/variant-5` and Signature at `/variant-6`. Both existing dealers and new leads must use the final polished source after qualification and release selection; an older approved lock is the acceptance baseline, not proof that it includes the finished changes.

Keep `templates/carwow`, older lock entries and the dedicated `cars-template-*` publishing mirrors as source/history and preview provenance. They are not additional offered designs or independently editable masters. Historical five-design/Vercel release plans do not define the current rollout.

## Freeze, qualify and select

1. Finish and coordinate the actual template work in Cars, preserving its runtime, lockfile, technical structure and composition. Preview directly from `templates/<key>` using `scripts/start-preview.ps1` and perform proportionate checks under [QA](QA.md). Publish the finished, reviewed source to Cars main and freeze its exact commit, subtree trees and normalized digests. A previous handoff does not cover later frontend edits.
2. Inspect those immutable sources and review the source evidence before preparing the authorized pilot:

```powershell
node scripts/template-release.mjs status
node scripts/template-release.mjs discover
node scripts/template-release.mjs approve --key modern --commit <40-character-Cars-SHA>
```

`approve` without evidence reports the exact repository, revision, subtree, Git tree and normalized digest. It creates no template copy, selects no release and updates no dealer. `discover` and `approve` fetch Cars main; use them at the integration checkpoint, not as an automatic response to every wording edit.

3. Qualify a pilot candidate through the maintained [dealer updater](../scripts/dealer-updates/update-dealer-template.mjs), using `--design-set six`, `--template-palette`, a separate `--lock-file <candidate-lock.json>` and explicit `--qualification <reviewed-context.json>`. The existing [bounded source preparation](../scripts/prepare-existing-fleet-source.mjs) binds that context, the candidate lock, reviewed source delta and selected branding inputs to exact hashes. Changed entries have `status: qualification`; their accepted baseline evidence keeps its original identity. The context and provisional native receipt keep native, hosted and global release approval false. Ordinary publication refuses this provisional receipt. The explicitly scoped qualification build/pilot path is how the current source can be tested before global lock selection.
4. Build and host that exact candidate as one combined Cloudflare Worker. Verify all six mounted designs, routes/assets, locale journeys, design FAB, Admin link, compatibility routes and safe demo actions on the accepted public version. Check the actual personalized pages and logo consumers on mobile and desktop, including 320px where required. Recheck the effective account plan and [current runtime limits](https://developers.cloudflare.com/workers/platform/limits/); retain bundle/startup evidence and cold/warm server-rendered invocation CPU outcomes before fleet propagation. Worker count alone does not prove runtime headroom. Record source, package/export digest, Worker/version identity, unauthenticated hosted checks and owner visual acceptance separately. A successful build or isolated logo sheet does not establish hosted acceptance.
5. After hosted acceptance, supply exact-source release evidence accepted by the maintained validator and select the evidenced immutable lock. Repeat for each changed family; retain unchanged approved pins only when their immutable content matches the final selected source. Then use that lock for the remaining existing-dealer refreshes and new creations:

```powershell
node scripts/template-release.mjs approve --key modern --commit <same-SHA> --evidence docs/releases/<review>.json
node scripts/template-release.mjs approve --key modern --commit <same-SHA> --evidence docs/releases/<review>.json --write
node scripts/template-release.mjs verify --key modern
```

Evidence must bind `repository`, `commit`, `sourcePath`, `sourceTree` and `sourceDigest`; record `approved: true`, `verifiedAt`, `runtime`, passed `checks`, and `standalone.mobile` / `standalone.desktop`. Record mounted support separately in `modes`. A pilot receipt or source-delta review is not this full release evidence. Source approval does not by itself establish deployment or owner visual acceptance for every dealer.

Where the release validator requires `nativeLocalization`, include exact-source acceptance for the required catalog, routing, preference, isolation, security, mounted and public checks plus the matching public deployment. App retains its collector, dealer adapter and `.cars-app.json` source receipt; follow [APP-VARIANT](APP-VARIANT.md). Mobile and Signature retain their maintained extended-family source/collector contracts. Prior standalone QA cannot be relabeled as proof for a new Cars commit. Missing evidence is a release hold to resolve through verification, not an extra owner permission step.

Native deployment evidence identifies its provider. Existing Vercel evidence keeps its original `READY`, deployment/project IDs and exact deployed template commit. Cloudflare evidence uses `nativeLocalization.deployment.provider: "cloudflare"` and the real account, Worker, public origin, deployment/version IDs, active traffic, bindings and artifact identity. The selected template revision remains distinct from the later compiled dealer commit.

For Cloudflare, retain four distinct JSON proofs under `docs/releases/`, each referenced by `{ reference, sha256 }`: `artifactManifest`, `singleWorkerReceipt`, `deploymentReceipt` and `hostedReceipt`. Preserve the original artifact inventory, composer and deployment receipts; their `hostedVerified: false` fields remain unchanged. The separately collected hosted acceptance binds the active version and exact native checks to the same six source locators, artifact/output digests and compiled dealer source publication. All proofs must match one Worker, six applications, 100% traffic on one version, only the `ASSETS` binding and no per-design service dependencies. Proof references remain committed and available during subsequent dealer adoption checks.

The hosted receipt records passed, hashed mounted journeys, public journeys and asset checks for all six `applications`. Auto Best, Modern and Import additionally retain all twelve `nativeLocalization` checks, exact catalogs, EN/BG and 320/390/1440 acceptance. App, Mobile and Signature retain their maintained family contracts; do not label their distinct evidence as invented native-v1 checks.

The qualification context and provisional receipt remain unapproved until real source and hosted evidence pass the maintained validator. Missing or failed proof is a verification task; do not fabricate provider IDs, relabel the compiled dealer commit as the template revision or reuse an earlier deployment under new source.

The write changes only the release lock. Commit the lock and its review evidence together. The copier exports that exact Git subtree even if the working template has newer development edits. A malformed source locator is rejected; it cannot fall back to loose working files. Neither approval nor copying publishes a dealer.

## Existing dealers

A requested update compares old template source, current dealer source and the selected final source. Preserve the dealer's factual content, sourced or disclosed demo inventory, original identity/assets as provenance, contacts, mounted paths, paid customization and unique code. Review conflicts and preview the candidate before installation. Use the existing updater and [publishing](LEAD-PUBLISHING.md) reconciliation for the existing private repository and the six-design Cloudflare target; preserve existing Vercel project IDs and aliases during qualification. Al Reef retains its independent repository and `.git`, with a separate existing-dealer refresh rather than a Cars-owned export or regeneration. Keep old adopted pins until the reviewed candidate passes and is explicitly adopted.

The template owns its hero, banner, button and accent palettes and composition. Personalization changes concise factual copy, contacts, location, identity and inventory through existing boundaries; native headlines/descriptions remain unless they require factual correction. Final selected transparent logo packs are versioned inputs under `/dealer-brand/v2-<packId>/`, with hashed generation/source provenance and explicit on-light, on-dark and on-accent bindings under [LEAD-BRANDING](LEAD-BRANDING.md). A technically checked pack or completed production revision does not establish final visual selection. A changed source or selected logo pack requires renewed relevant checks and source seals; it cannot inherit an earlier pilot's acceptance.

New dealers use the same evidenced final lock through `scripts/new-client.mjs` with explicit `--design-set six --locale-config <JSON>`. The helper creates source only; do not use its legacy default or create another generator. Pilot acceptance permits bounded rollout through the maintained tools, with actual per-dealer receipts and hosted checks.

## Migration and historical sources

Former `cars-template-*` repositories and older lock entries remain readable so an existing dealer's original base can be recovered. They are not active masters. The legacy `promote --source-repo ...` command remains for reviewed recovery of old snapshots and refuses to overwrite a Cars-owned source entry. Routine new releases use `approve` above.

Retain previous release evidence and exact legacy revisions during migration. Snapshot drift on an old lock means the working template and old approved selection differ; do not copy files over the current master to make the warning disappear. Local build results, source identity, production deployment and full native acceptance are separate evidence.

Normalization preserves binary bytes and compares text with LF line endings. The `cars-source-v1` policy excludes credentials, dependency/build caches and inherited agent instructions while retaining source, lockfiles, licenses and provenance. Agents handle source IDs and evidence; the owner's everyday request remains “use the updated templates for this lead.”
