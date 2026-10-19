# Dealer-pack pipeline

New previews commit only `dealers/<slug>/`: the existing dealer manifest, sourced business facts, stock, fact index, locale, original/reviewed logos, retained vehicle photos, and source/identity reviews. Existing `clients/` commands continue unchanged. `node scripts/index-deployments.mjs --packs` lists packs without claiming deployments; identity resolution reserves their slugs and research IDs.

## Prepare and build

```sh
npm install --prefix runtime/dealer-pack-tools --save-exact --no-audit --no-fund sharp@0.35.5 prettier@3.8.1 typescript@6.0.3 playwright@1.62.1
node runtime/dealer-pack-tools/node_modules/playwright/cli.js install chromium
node scripts/dealer-pack.mjs draft --lead EXPANSION_ID --slug SLUG
# Retain sourced stock/photos; research and review the actual logo artwork.
node scripts/dealer-pack.mjs logo --slug SLUG
node scripts/dealer-pack.mjs build --slug SLUG --node-paths runtimes.json --plan paid
```

Drafting whitelists public business fields and reports missing facts. Optional address, phone, email and hours stay empty. `--stock FILE --media-root DIRECTORY` imports a reviewed public listing snapshot; without it, the draft records that live listings were not checked and uses disclosed template examples. Prices, personal contacts and CRM/outreach fields are excluded. In `branding/source.json`, `reviewedInputs` accepts original transparent rasters with `{path,sha256,retainedSource:{kind:'retained-original-raster',url,observedAt,sha256}}`; `generatedInputs` retains actual image-generation provenance for refinements/proposals. Research and agent visual review precede CI. `logo` crops transparent padding and exports PNG/WebP, compact marks and favicon deterministically.

Run the top-level build with Node `26.10.0`; `runtimes.json` maps Node `22.23.2`, `24.21.0`, `26.10.0` to installed absolute executable paths. Assembly uses Sharp `0.35.5` and Prettier `3.8.1` in `runtime/dealer-pack-tools`; CI installs these automatically. Ignored `runtime/` contains generated source, the six-app single-Worker bundle, JSON reports, and 320/390/1280 screenshots. Auto Best owns `/`; Modern, Import, App, Mobile and Signature occupy `/variant-2` through `/variant-6`, with the shared design selector and Admin link.

## CI and release boundaries

Run **Dealer pack pipeline** with 1–25 comma-separated slugs. PRs build the three proof packs. CI binds each pack to its retained expansion lead, reproduces reviewed logos byte for byte, assembles once, compiles seven native targets, composes one Worker, and runs local browser/logo/identity/size QA. Bundles and separate reports/screenshots are retained, including failures. Dependencies are cached per release/runtime. Exact compiled reuse binds dealer, source, release, tools and capacity plan; original build receipts stay unchanged. Each composition records those original executions and runs fresh QA.

`dealers/templates.lock.json` selects published commit `5d052ea`, including the October 18 fixes, as a qualification candidate reviewed on October 19. Existing `templates.lock.json` and live dealers retain their pins. Native, hosted and global release approval remain false. The workflow contains no provider credentials or deployment step.

Inspect a JSON list of slugs without deploying:

```sh
node scripts/deploy-dealer-single-worker.mjs --batch batch.json --bundle-root runtime/dealer-packs
```

Paid is a capacity target, not evidence of an active subscription. M2 verifies the plan, hosted pilot, capacity and approved deployment inputs before a write.
