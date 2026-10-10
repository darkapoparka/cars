# Integration handoff

The requested hero restoration is implemented and visible at `http://127.0.0.1:6461/bg` and the localized Sell/Import routes. Node 22.20.0 type/Svelte checks and production build passed; all eight hero-composition viewport cases passed. Matched screenshots and the report are in this folder.

Git staging stopped before any index mutation because `L:/CODEX/cars/.git/index.lock` exists. The zero-byte lock was created on 4 October 2026 at 03:08:06 +03. Preserve it and coordinate with its owner; do not delete it or use an alternate index.

Repository: `L:/CODEX/cars`, branch `main`, baseline HEAD `6c92fdc27`. Runtime: `L:/Toolchains/Node/22.20.0/node.exe`. Relevant source changes: `templates/auto-best/src/lib/data/{vehicle-artwork,feature-artwork}.ts`, task-only hunks in `scripts/hero-composition-smoke.mjs` and `docs/STYLING.md`, the previous silver-system README/provenance annotations, and this evidence folder. Existing desktop/content drafts remain untouched.

Once the shared lock is released, from `L:/CODEX/cars/templates/auto-best`, run the guarded helpers:

```powershell
& 'L:/Toolchains/Node/22.20.0/node.exe' 'runtime/restore-front-heroes-20261004/prepare-scoped-staging.mjs'
& 'L:/Toolchains/Node/22.20.0/node.exe' 'runtime/restore-front-heroes-20261004/stage-reviewed.mjs'
& 'L:/Toolchains/Node/22.20.0/node.exe' 'runtime/restore-front-heroes-20261004/commit-reviewed.mjs'
```

The helpers verify source baselines, branch/HEAD, exact owned files and partial hunks. Review the generated partial patch before staging; stop if another task has staged work or touched these sources. After the scoped commit, non-force push its exact SHA to `origin/main` and fetch/verify that SHA is an ancestor of the remote main. No template promotion or dealer deployment is authorized by this fix.
