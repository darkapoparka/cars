# Template releases from Cars

The editable masters are `templates/{auto-best,modern,carwow,import}` in `darkapoparka/cars`. Work on Cars main. `templates.lock.json` selects an immutable commit and subtree for dealer creation and explicit updates. Editing a template changes neither that selection nor existing dealers.

## Develop and select a release

1. Edit the actual template under Cars; retain its runtime, lockfile, technical structure and relevant QA.
2. Preview directly from `templates/<key>` using `scripts/start-preview.ps1`. Check mobile and desktop, then commit and push the reviewed source to Cars main.
3. Inspect the source candidate and review its evidence:

```powershell
node scripts/template-release.mjs status
node scripts/template-release.mjs discover
node scripts/template-release.mjs approve --key carwow --commit <40-character-Cars-SHA>
```

`approve` without evidence reports the exact repository, revision, subtree, Git tree and normalized digest. It creates no template copy and updates no dealer. With exact-source QA it can select the release:

```powershell
node scripts/template-release.mjs approve --key carwow --commit <same-SHA> --evidence docs/releases/<review>.json
node scripts/template-release.mjs approve --key carwow --commit <same-SHA> --evidence docs/releases/<review>.json --write
node scripts/template-release.mjs verify --key carwow
```

The CLI fetches Cars main first. Evidence must bind `repository`, `commit`, `sourcePath`, `sourceTree` and `sourceDigest`; record `approved: true`, `verifiedAt`, `runtime`, passed `checks`, and `standalone.mobile` / `standalone.desktop`. Record mounted support separately in `modes`. Source approval does not by itself establish dealer deployment or owner visual acceptance.

All current templates contain native EN/BG localization. Their release evidence must also include exact-source `nativeLocalization` acceptance, including the required catalog, routing, preference, isolation, security, mounted and public checks plus the matching public deployment. Prior standalone QA cannot be relabeled as proof for a new Cars commit. Missing evidence is a release hold to resolve through verification, not an extra owner permission step.

The write changes only the release lock. Commit the lock and its review evidence together. The copier exports that exact Git subtree even if the working template has newer development edits. A malformed source locator is rejected; it cannot fall back to loose working files. Neither approval nor copying publishes a dealer.

## Existing dealers

A requested update compares old template source, current dealer source and the selected new source. Preserve the dealer's facts, inventory, logos, assets, contacts, mounted paths and unique code. Review conflicts and preview the candidate before installation; follow [publishing](LEAD-PUBLISHING.md) for its existing private repository and Vercel project. Keep old pins until the candidate actually passes and is adopted.

## Migration and historical sources

Former `cars-template-*` repositories and older lock entries remain readable so an existing dealer's original base can be recovered. They are not active masters. The legacy `promote --source-repo ...` command remains for reviewed recovery of old snapshots and refuses to overwrite a Cars-owned source entry. Routine new releases use `approve` above.

Retain previous release evidence and exact legacy revisions during migration. Snapshot drift on an old lock means the working template and old approved selection differ; do not copy files over the current master to make the warning disappear. Local build results, source identity, production deployment and full native acceptance are separate evidence.

Normalization preserves binary bytes and compares text with LF line endings. The `cars-source-v1` policy excludes credentials, dependency/build caches and inherited agent instructions while retaining source, lockfiles, licenses and provenance. Agents handle source IDs and evidence; the owner's everyday request remains “use the updated templates for this lead.”
