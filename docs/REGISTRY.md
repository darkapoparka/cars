# Technical registry

`docs/DEPLOYMENT-INVENTORY.json` is the technical record. `dealer.json` owns a dealer's actual packaging choices; the registry indexes them and their evidence. Regional lead research and private CRM records keep their existing authority.

Preserve stable slug/IDs, aliases, repository/project/domain names, canonical source path/commit, actual variants and entry routes, per-variant template commits, export commit, packaging version, deployment ID and timestamped checks. Unknown fields remain null or explicitly unknown. A scan never invents live readiness.

`evidence` separates source, personalization, build, deployment, browser and ownerReview. Existing delivery records and old QA flags are retained as historical data until verified. Agent checks never complete owner review. Source-only branch records remain provenance.

```powershell
node scripts/index-deployments.mjs
node scripts/index-deployments.mjs --write
node scripts/index-deployments.mjs --check
```

The default previews the local indexing result; `--write` updates the registry and generated readable/index views, retaining prior fields and evidence. `--check` validates identities, variants and consistency without fetching Vercel or writing. The dashboard reads this same registry. Updating provider evidence is a deliberate exact-deployment observation, not a side effect of indexing.

Do not store tokens, environment values, private notes, contact history, deal values or suppression records here. Dashboard private local notes remain in ignored runtime storage and do not become CRM truth.
## Consolidated source

`canonicalSourceRef: "main"` and `canonicalSourceCommit` identify preserved source. Old branch evidence moves to `sourceHistory` with its immutable commit; it is not an active work location. `localPresent` is a separate machine observation and may be false in a sparse checkout. Generated views link absent local source to GitHub main.
