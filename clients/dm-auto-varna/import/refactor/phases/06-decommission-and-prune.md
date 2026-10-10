# 06 — Decommission legacy systems and prune

**Status:** Planned — not implemented by this audit.  
**Findings:** F02, F08–F09, F22–F25.  
**Shared gate:** [Testing and quality](../10-testing-and-quality-gates.md).

**Goal:** remove the old systems after their consumers have actually gone. Depends on migration or explicit retirement of all relevant public/admin/compatibility consumers.

### P06-1 — Prove reachability

Generate a route/import/glob/template/CSS/asset/package consumer report and reconcile it with the cleanup ledger. Include Cars packaging assumptions. Review entire unreachable subgraphs, not just zero-import leaf files. Preserve licensed reference/provenance material outside runtime where required.

### P06-2 — Retire the legacy renderer/runtime

Remove unused `auxero-template.ts` rewriting, obsolete `auxero-*-data.ts` adapters, `AuxeroRuntimeScripts`, body-class lifecycle hacks and no-longer-supported raw routes. Remove `.template-ref` runtime imports only after confirming every retained consumer is native. Keep explicit redirects that remain part of compatibility.

### P06-3 — Remove competing CSS ownership

Delete the corresponding guard sheet, obsolete vendor/reset imports and duplicate Tailwind entry points. Verify public-to-admin-to-public navigation as well as hard reload. Keep legitimate screen-reader, reduced-motion and primitive-global exceptions; do not optimize for a meaningless zero-important count.

### P06-4 — Prune dependencies, primitives and assets

Review Tabler, the one Hugeicons consumer, unused generated UI modules and font scope. Optimize or archive proven-unused image masters and generated artifacts. Keep active logos, truthful placeholders, source licences and the owner’s historical evidence. Update the lockfile only through the package manager and test a clean install/build.

### P06-5 — Compare the result

Report before/after consumers, source CSS/runtime bytes, route payloads and unresolved compatibility exceptions. Re-run critical visual/state/security suites. A smaller repository is not acceptable if features, image quality, accessibility or mounting regress.

### Exit and handoff

Every removal has ledger evidence and a scoped rollback path. Supported storefront routes are free of the imported-template renderer, replay runtime and old guard stylesheet; retained optional capabilities satisfy their own contracts. No old code survives merely because no one knows whether it is used. No needed code is deleted merely because its name contains Auxero or DayNight.
