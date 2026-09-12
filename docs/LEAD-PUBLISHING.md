# Publishing one dealer

[Root instructions](../AGENTS.md) own authorization and [WORKFLOW](WORKFLOW.md) owns lead completion. This procedure packages canonical source, preserves the dedicated remote's history/fixes and uses one Git-to-Vercel deployment trigger.

## Identity and routes

Read the dealer's `dealer.json`, variant metadata, brief and [registry](DEPLOYMENT-INVENTORY.json). Keep existing repository/project/domain identities. New resources use `cars-<dealerkey>` (lowercase compact ASCII business name, `and` for `&`). Excellent Cars retains `darkapoparka/excellent-cars` and its existing origin.

| Design | Standard trio | Import trio |
| --- | --- | --- |
| 1 | Auto Best at `/` | Auto Best at `/` |
| 2 | Modern at `/variant-2/cars` | Import at `/variant-2/` |
| 3 | Carwow at `/variant-3/` | Carwow at `/variant-3/` |

One dealer owns one private publishing repository and one Vercel project. All designs share one origin and a visible accessible right-side design button. Navigation loads only the selected app. Keep the complete Modern workspace.

## Prepare a repeatable payload

1. Complete relevant source QA. Resolve unique publishing-only fixes into canonical source or versioned packaging before replacing any payload.
2. Commit the selected canonical dealer source and manifest with a scoped commit. Record its exact SHA; do not call dirty working files an exact committed release.
3. Run a proposal, then write to a new derived output directory:

```powershell
node scripts/package-dealer.mjs --client promosale-varna --out runtime/dealer-packages/promosale-varna
node scripts/package-dealer.mjs --client promosale-varna --out runtime/dealer-packages/promosale-varna --write
```

The package helper owns supported mount transformations, Services configuration, Svelte output correction and the shared switcher. It never transforms canonical source in place. An existing output or unknown/hybrid mount requires review; create another explicitly named derived output instead of overwriting it. Explicit `extraAssets` in the manifest retain required shared assets; unknown folders are not silently included.

Use the app runtimes/lockfiles. Modern static-demo mode may generate Prisma for the build but must not add a live database dependency or weaken unrelated production modes. Verify mounted links, locale rewrites, asset/CSS URLs, API/fetch paths, redirects and deep links. [Excellent reference](reference/EXCELLENT-CARS-MOUNTING.md) retains the original integration evidence.

## Compare and preserve the remote

```powershell
node scripts/export-dealer.mjs --client promosale-varna --package runtime/dealer-packages/promosale-varna
```

The proposal fetches the actual remote head, uses a temporary index and compares every payload path. It does not stage the Cars index. For the first migration, review every changed path and write JSON containing the exact `remoteCommit`, `candidateDigest`, and `changes` with `path`, `resolution` and a concrete `reason`. Resolutions identify canonical-source changes, packaging-layer changes, or obsolete-generated-metadata. Backport real fixes before approving the comparison; this file is evidence, not a blanket overwrite switch.

```powershell
node scripts/export-dealer.mjs --client promosale-varna --package runtime/dealer-packages/promosale-varna --review runtime/<review>.json --write
node scripts/export-dealer.mjs --push-receipt runtime/dealer-exports/promosale-varna/<proposal>/export.json
```

The write creates a dealer-root commit parented to the reviewed remote commit. The push refuses if that remote advanced, and never uses force. Subsequent exports detect changes outside the previous publishing receipt and require reconciliation. A new publishing repository needs a reviewed initial commit; create/reuse its private identity with authorized GitHub access, then retry.

Use `--branch codex/<pilot-name>` for an authorized preview pilot. This creates a branch deployment without moving the production branch. Keep existing remote commits and histories.

## Vercel and hosted evidence

Verify the current account/team, existing project and Git binding. Configure one project for the combined Services deployment when creating a new dealer. Push once through the linked repository; do not also launch a duplicate CLI deployment.

Inspect the deployment whose Git commit equals the exported commit. READY is build/provider evidence. Confirm its actual URL, public access without login, every offered entry/journey, and the deployed switcher at mobile and desktop according to [QA](QA.md). Never send external test enquiries. Only then record public browser verification; agent QA does not mark owner review complete.

Update the technical registry with canonical source SHA, template SHAs, export SHA, packaging version, project/team, deployment ID, exact URL, timestamp and evidence. Regenerate the readable list/dashboard views using `node scripts/index-deployments.mjs --write`. Keep old verification as dated history.
