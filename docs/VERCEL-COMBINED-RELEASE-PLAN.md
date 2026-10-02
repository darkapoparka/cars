# Cars: combined Vercel release plan

Status: preparation only, 2 October 2026. The owner will choose Mobile or Boxcar Updated as the fifth dealer design. Do not infer that choice, approve a release, publish a mirror, or deploy a dealer from this document alone.

## Repository ownership and delivery

The editable source of truth is `L:/CODEX/cars`, repository `darkapoparka/cars`, on main. The five current release families are `templates/auto-best`, `templates/modern`, `templates/carwow`, `templates/import`, and `templates/app`. They are directories in Cars, not five independent local Git repositories. Mobile and Boxcar Updated are additional candidate directories; Modern and Mobile are different families.

The existing `darkapoparka/cars-template-*` repositories are publishing mirrors for the standalone template previews and historical provenance. Keep their identities and ancestry; do not develop fixes independently in a mirror. Reconcile any remote-only changes before exporting the exact reviewed Cars subtree. App keeps its own source-collection and personalization receipt contract; it is not interchangeable with the native trio.

Each dealer keeps its existing private publishing repository, Vercel project ID, public alias and Git production branch from `DEPLOYMENT-INVENTORY.json`. All offered designs are internal Services in that one project. They are independently built, not separate public Vercel projects or separate customer backends. Al Reef remains independently versioned under `clients/al-reef-used-cars`; never overwrite it through the Cars-owned exporter.

| Slot | Current standard configuration | Current Import configuration |
| --- | --- | --- |
| 1 | Auto Best at `/` | Auto Best at `/` |
| 2 | Modern at `/variant-2` | Import at `/variant-2` |
| 3 | Carwow at `/variant-3` | Carwow at `/variant-3` |
| 4 | App at `/variant-4` | App at `/variant-4` |
| 5 | Unselected candidate; planned `/variant-5` | Same selected candidate; planned `/variant-5` |

The existing exact entry URLs remain governed by each dealer manifest. Outletcars and PromoSale replace Modern with Import, not Carwow. Admin stays a separate shared demo link and is never counted as a design.

## Stage 1: finish and freeze source

The rollout owner coordinates the active Codex writers, reviews staged/unstaged/untracked changes, and runs `node scripts/workspace-doctor.mjs --fetch`. Preserve unfinished UI and independent repositories. Use scoped commits; no blanket staging, clean/reset, force-push, or extra editable master checkout. Audit output is not an approved template release.

Capture an exact Cars commit and per-family subtree digest after UI checks, plus the committed publishing-tool revision. Review current dealer changes against their protected identity/inventory/media baselines. Navara's earlier App source-receipt mismatch is a reconciliation task: preserve the edits, review them, and regenerate the receipt only after verification. Freshness must be checked again; earlier snapshots do not prove the final source.

Keep standalone mirror publication separate from a Cars source push. Audit GitHub workflow triggers before the next source release: `deploy-autobest-release.yml` still has an automatic template-source push trigger, and `fix-autobest-contact-localization.yml` and `reconcile-canonical-fleet-once.yml` still have push triggers on edits to their workflow files. Their trigger changes were not applied during this audit. These paths need explicit review; do not rely on a blanket claim that Cars pushes can never initiate publication. Do not dispatch historical fleet-repair jobs for this rollout.

## Stage 2: integrate the chosen fifth family

UI completion is not publisher integration. Keep the first four routes stable and extend the supported manifest/version explicitly. Required integration points include `package-dealer.mjs`, `publishing/app-variant.mjs`, the pinned-template exporter and three-way update modules, shared-media/public-root/service mappings, generated build helpers, the switcher, dealer guidance and release acceptance. Do not just loosen the existing three/four-design validators.

For Mobile, verify Next base-path routing, client links and direct reloads, EN/BG and region/currency preference behavior, source collection without reference captures, and adaptation from the actual dealer facts/inventory. For Boxcar Updated, verify its Vite/Svelte router and base-path asset handling, deep-link reloads, metadata/initial content and localization; do not pretend it has the same SvelteKit server adapter as Carwow or Import. Exclude internal alternative reference homepages from the customer offering through reviewed publication rules, not unreviewed source deletion.

Both candidates must use retained dealer logos/photos/contacts, honest sample or observed stock, no invented prices/guarantees and no fake successful enquiry. Review asset reuse rights separately. Their publication manifest should bind exact source, configuration and media hashes. The new service must share the existing media pipeline and must not create a dealer database merely to serve pictures.

## Stage 3: media and storage contract

There are two independent sharing levels: common template artwork across the fleet through the existing immutable public media catalog, and each dealer's own photos shared across its designs. A catalog entry must have an uploaded, publicly verified object with matching hash/size/MIME before generated copies are removed. Keep newly changed assets local until that proof exists. Never delete an object referenced by a production or retained rollback deployment.

The publishing workflow already excludes reviewed unused artwork, externalizes verified shared objects and pools remaining identical binaries. Unknown/customized assets and originals are preserved. Responsive images are separate: test that thumbnail/card requests choose appropriately sized images and that full detail galleries remain available. Do not turn necessary interface SVGs into huge raster images to reduce the SVG count.

Measure separately: generated source/upload payload; local published static assets including compiled client JS/CSS; actual distinct final Function bundles; shared object-store usage; retained deployment history; and local build/dependency caches. Next trace unions are not deployed Function-storage totals. Provider GB-month meters are not a directory-size measurement. Do not relabel shared external storage as deleted bytes or old externalization as new savings.

Existing source-asset dry runs were approximately 30.3–84.7 MB for 24 four-design dealers, excluding compiled code and Functions. They are not a forecast or ceiling for the new five-design release. Its actual outputs must be measured again.

## Stage 4: local acceptance before publishing

Build the exact generated five-design Modern and Import configurations sequentially on this workstation, not on top of active development outputs. Check free disk and memory first. Keep fresh derived packages immutable, use bounded temporary outputs, and retain compact evidence. Never sweep source folders, running previews, dependency junctions, Codex history or Git recovery data to make space.

Run `node scripts/check-workflow.mjs` and `node --test --test-concurrency=1 scripts/*.test.mjs`, then each family's documented checks and production build against the selected source. Resolve the Modern Windows adapter diagnostic with a supported platform build; do not count local Next/browser checks as proof of Vercel adapter success.

Audit the complete final artifact, not five individually passing service allowances. `audit-vercel-output.mjs` reads an assembled Vercel output; `audit-vercel-services.mjs` aggregates separately materialized final outputs and requires every declared design exactly once. Its default combined ceiling is 512 MiB and distinct-function ceiling is 200 MiB; these are internal reject thresholds, not desirable target sizes or Vercel plan limits. Any large increase from the accepted baseline requires diagnosis, not simply a higher ceiling.

```powershell
node scripts/audit-vercel-output.mjs <combined-final-output> <new-report.json>
# Or, when final service outputs are materialized separately:
node scripts/audit-vercel-services.mjs <dealer.json> <output-paths.json> <new-report.json>
```

The output-path map is keyed by the dealer's exact variant keys and contains absolute paths to actual `.vercel/output` directories. Missing Next adapter output is a hold, not permission to substitute `.next` traces. Overlapping roots, omitted fifth outputs and reports inside public output are rejected. The auditor does not build or deploy anything and is not automatically a platform post-build hook; the release owner must run it on the real final artifacts and retain the result.

At 320, 390 and 1440px, in EN/BG, verify all five home/catalogue/detail journeys, actual car clicks, direct reloads, filtering/sort/pagination with URL and Back/Forward behavior, saved state, language/currency/region isolation, gallery/media, logo/contact correctness, no overflow, and keyboard/focus behavior. Inspect initial content and metadata as well as hydrated UI. No external test enquiries or private data. Verify all five selector choices plus a distinct working Admin link. Hash-check protected dealer inputs against the recorded source, and explicitly review any intentional changes.

## Stage 5: one combined release on the existing Vercels

After the owner chooses the fifth design and the complete candidate passes, publish the same intended UI + architecture + fifth-design release first to controlled Modern and Import pilots using their existing project identities. Keep current public production and a verified rollback version available until the candidates pass. A preview/staged deployment is evidence, not completion of a lead's public delivery. No public-domain, project, team or billing migration is part of this release.

Use the existing template release, preservation-aware dealer refresh, `package-dealer.mjs` and reviewed `export-dealer.mjs` workflow. Preserve the remote ancestry and independent dealer handling. Push each reviewed dealer commit once through its Git binding; do not also fire a CLI deploy for the same change. Match deployment to exported commit and compare the actual served switcher/configuration. Verify anonymous access at the existing public alias and all five designs before marking that dealer complete.

Advance in bounded waves after pilot acceptance. Keep a per-dealer ledger with source/template/package hashes, expected and actual repository/project/team, deployment ID and state, public alias verification, before/after byte categories, browser evidence and rollback identity. Do not stop at 24/25 or at READY; record an actual exception and remedy rather than claiming the fleet complete. Refresh `DEPLOYMENT-INVENTORY.json` with reviewed evidence, then regenerate its human-readable views.

## Stage 6: retained storage and aftercare

Only after the replacement release is accepted, inventory old deployments and shared-object references. Preserve current production, deliberate rollback deployments and any still-used shared media. Review obsolete previews, canceled/error outputs and history retention against actual provider records. Prepare deletion/retention changes separately; no automated deletion is authorized by this plan. Confirm meter name, team, period and per-project breakdown before attributing the reported approximately 60 GB.

Smaller new outputs reduce future accumulation but do not themselves erase retained deployments. Local cache relocation is not a Vercel saving. Verify the provider's actual storage meter after any later retention action; do not promise an instant billing change. Shared data backends or a multi-tenant application are possible later work, not prerequisites for contacting leads with these read-only demos.

## Definition of complete

The owner-selected fifth family is integrated and source-approved; all 25 exact personalized packages preserve existing identities, offer all five designs and pass combined output/browser checks; all 25 existing public Vercel aliases serve the matching new release; any remaining storage/retention work is explicitly measured and recorded. This document and local tooling tests alone do not establish that outcome.

References: [template promotion](TEMPLATE-PROMOTION.md), [publishing](LEAD-PUBLISHING.md), [App integration](APP-VARIANT.md), [media pipeline](PUBLIC-ASSET-PIPELINE.md), [shared media](SHARED-MEDIA.md), [technical registry](DEPLOYMENT-INVENTORY.json). Provider behavior was checked against Vercel's Services guide and Deployment Storage documentation; use live project evidence for this fleet.
