# Signature audit reconciliation

The recovered audit patch SHA-256 is `83ebd5b30a95d5eeeb3b8e939204a7d62ca1909fc5e1a1cb9cbf4f3465f6eca4`. All 13 paths were reconciled locally. Twelve clean paths used the exact narrow patch; `VehicleSearch.svelte` needed the equivalent import/inventory-expression changes because newer local search-value logic had changed its hunk context. No old whole-file replacement was used.

The changes prevent complete supplied vehicle records from inheriting optional sample facts in eight consumers, retain explicit dealer map destinations in two existing links, and add `method="dialog"` to the existing demo form. A focused inventory regression covers EN/BG. Default reference records retain their original objects; provided inventory retains the stable template slot ID only.

Newer local context exists in two of the owned paths: `VehicleSearch.svelte` and `MobileCatalog.svelte`. It remains present. `pre-existing-local-context.patch` records that context separately from `local-audit-delta.patch`. The selected Home/route/discovery implementation, original and refined graphite artwork, BottomNavigationIcon, provenance/license files, all other source, capacity candidate and resume helper were outside this write scope. Styles are byte-identical within every edited component; markup changes are limited to the form method and two href expressions.

The independent remote-only candidate under `remote/templates/karento-best` contains exactly 13 files (85,510 bytes), based on connected-GitHub commit `23911ca0e6731033a12a129eb0dcfefd5a410191`. Every original/audited candidate Git-blob prefix in the patch was independently verified. It intentionally excludes unpublished local context and the separately owned asset recovery. Both the local scoped delta and original remote patch pass reverse `git apply --check` against their respective resulting files.

Checks used exact Node 26.10.0 and the existing dependency installation:

- Occupied local Signature `npm test`: **127 passed**, zero failures/skips.
- Occupied local Signature `npm run check`: **zero Svelte errors and warnings**, typography 367 files/27 roles and geometry 37 tokens passed.
- Cached `@sveltejs/mcp@0.1.26` autofixer: **12 distinct component versions**, no failures/issues, covering all ten local components and the two differing remote versions. One generic advisory suggests replacing the existing `bind:this` in DealershipVehicleSearch with an attachment/action; that unrelated binding was preserved.
- Focused Prettier check on all 13 local paths passed.

`RESULTS.json` records every local before/after hash, exact remote candidate hashes, check scopes and results. `remote-candidate-manifest.json` is the exact 13-file publication candidate inventory. No production build, package/dependency installation, source publication, lock promotion, client change, provider deployment or outreach occurred. The check results apply to the occupied local context; they do not claim a standalone full-project type/build run for the 13-file remote-only bundle.

Remaining audit findings stay scoped follow-ups: the existing display-title collision path, inherited identity/video/promotional defaults, mobile baseline/test-assumption gaps and full hosted six-design acceptance are not cleared by this patch. This task did not repeat browser/native-form/custom-map fixture checks or the author's prior visual comparisons. Asset recovery and any later refined-artwork publication are separate root-owned work.
