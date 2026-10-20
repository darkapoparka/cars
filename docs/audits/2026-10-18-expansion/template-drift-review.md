# Template source drift and release readiness

Review completed 19 October 2026 against requested published checkpoint `b49b5cd10b8a3a3bea5c86d89f80a1c88426c96f`. Read-only source review: no template edits, builds, installs, Git downloads, lock promotion, hosting mutation or dealer changes. This report is the only write in this review phase. Subsequent narrowly authorized binder work will have its own evidence.

## Source identities and evidence limits

- `J:/cars` is the junction to physical `L:/CODEX/cars`; local branch is main, HEAD `3bc5a0ea33969f18ccc34d5e4b0e8cab1513e6a2`. No scoped template/lock changes were staged at the observation.
- `GIT_NO_LAZY_FETCH=1` was set for Git reads. The requested published commit object is absent locally; no fetch/retry/download was attempted. Exact pinned files were read through the connected GitHub source API.
- The pinned published [lock](https://github.com/darkapoparka/cars/blob/b49b5cd10b8a3a3bea5c86d89f80a1c88426c96f/templates.lock.json), blob `e5901de2953eca10158ff44dbb18e69bcba30ddf`, selects `bb173c33d7b640502ad2e4bf27546748c12858b8` for all six current families, with 15 October release evidence. Carwow remains a historical entry. The occupied local lock instead selects October10 per-family revisions: Auto Best696230a, Modern6f87470, Importb9373e9, App4e18477, Mobile8a97176 and Signaturecc130e4. Local lock integrity is not evidence that it is the current published selection.
- A broad bb173c33-to-b49 GitHub comparison returned300paths and is non-exhaustive. The bounded23911ca-to-b49 comparison returned70paths across six commits and confirms the recent App, Signature recovery/audit and Modern source publications. No absence claim is based on the truncated broad compare.
- Dirty/untracked status is relative to the old local HEAD. It includes files already published remotely; it must not be interpreted as a list of unpublished changes. No whole-tree canonical/working equivalence is claimed.

## Six-family checkpoint

| Family | Scoped local observation | Published versus local distinction |
| --- | --- | --- |
| Auto Best | 43 tracked non-evidence paths differ from local HEAD. | Sampled Hero and BottomNavIcon blobs exactly match b49. The narrow video-title audit is published. Local AboutHero differs: eyebrow plus two-line H1 using localized intro and brand.name, while b49 has one translated H1. Audit reconciliation explicitly preserved this independent local change; it is not covered by the remote unused-import correction or automatically visually accepted. |
| Modern | 60 tracked non-evidence paths differ from local HEAD. | Sampled public desktop CSS exactly matches b49. The ten-file narrow audit is present by b49; its receipt says nine local files match the exact remote candidate, with separate pre-existing local layout context retained. Metadata, listing identity and pagination corrections do not authorize unrelated visual changes. |
| Import | 27 tracked non-evidence paths differ at this observation. | Separate owner is integrating the recovered11-file audit. Do not reapply or replace those files from this report. Reconcile that owner's final exact baseline/hash receipt before selecting a candidate. |
| App | 41 tracked non-evidence paths differ from local HEAD. | Sampled ShowroomIcon and ShowroomMenu exactly match b49. The six-file audit is published, preserving style/artwork. Local150tests,24component probes, types and focused lint are recorded; no new combined build/hosted acceptance follows from them. |
| Mobile | 16 tracked non-evidence paths differ from local HEAD. | Sampled AppShell and ShowroomTabs exactly match b49, including their existing dock/tab work. The inspected original-audit recovery record still has completed/integrated/published/hostedAcceptance false. A later owner receipt must establish any subsequent progress; task titles are insufficient. |
| Signature | 69 tracked non-evidence paths differ, plus untracked maintained files/assets. | Many differences are already remote. Actual unpublished differences include the Home promotion, matching header/navigation route recognition and refined graphite consumer/assets below. |

Counts exclude docs/provenance/recovery-style evidence paths and include some non-frontend source/instructions/tests. They are bounded status observations, not release inventories. Representative direct Git-blob comparison covered11files: eight matched b49; AboutHero, Signature Header and Signature MobileNavigation differed. Signature mobile.css matched.

## Signature: preserve the recorded Home choice

The occupied [AGENTS](../../../templates/karento-best/AGENTS.md) records the owner's16October direction: promote the marketplace discovery feed from /2 to phone Home /, preserve Home3 on desktop and /index-3, retain List2 and Details3. Local MOBILE-PATTERNS records the same direction. This is evidence to preserve that selected work during reconciliation; it does not by itself prove final owner visual or hosted acceptance. The pinned canonical AGENTS still describes Home3 as the selected root layout.

Actual local implementation:

- New root +page/+page.server and src/lib/pages/marketplace-home.svelte supply the phone SSR hint, choose Discovery below768px and retain OriginalHome above it.
- Discovery components/data moved from src/routes/2 to src/lib/discovery. Old /2 pages are deleted locally; +server.ts redirects307 to resolve("/") plus the complete query. Header changes its special-case route from /2 to /; MobileNavigation recognizes marketplace-home.
- The existing home-promotion/results.json records matched320/390geometry, search/detail return, BG legacy redirects, desktop1024fallback, phone SSR/disclosure and genuine404s. It records13focused tests, zero Svelte errors/warnings and an adapter-node build. This is retained historical local evidence, not a new check run or mounted Cloudflare acceptance. Its notes explicitly say no publication/deployment.
- Original39reference variants and the frozen library remain preserved. No timestamp, filename or agent-written "approved" label is treated as a new release approval.

## Signature: original and refined artwork are separate

Canonical b49 BottomNavigationIcon blob `43a7bfa9afdc6837f257b45d0c3e53509db0fc86` consumes `signature-graphite/`. The18October source recovery publishes those five original PNGs, the14October generation source, provenance and Lucide license. It intentionally did not adopt the later artwork.

Occupied local BottomNavigationIcon consumes `signature-graphite-refined/`. Its raw SHA256 `8c66ab53e7ce5ed26c5a9a4cf65b3a56985c1457df46fd0fdfa19d3c6b7f7835` exactly matches the16October refinement receipt. All five refined PNGs exist and match that receipt's SHA256. The portable refined generation source is present.

The [refinement record](../../../templates/karento-best/provenance/signature-graphite-refinement-2026-10-16.json) explicitly says **local review candidate; owner acceptance and publication pending**. It preserves24pxframes,53pxbar,44pxtargets and labels, with focused320/390loading/focus/overflow evidence. It claims no production build or deployment. Its /2 scope wording predates the subsequent root promotion; preserve both provenance identities and review the final root consumer together. Image Gen's underlying model version was not exposed.

The13-file functional audit is separately published and preserved locally: supplied inventory avoids inherited sample fields, explicit map destinations survive and the demo form uses method=dialog. Its receipt records127local tests and zero Svelte errors/warnings, but notes newer VehicleSearch/MobileCatalog context and leaves full hosted acceptance unresolved. Do not replace occupied files wholesale with the remote-only audit candidate.

## Release-blocking adapter mismatch

The promoted discovery module still exports a literal illustrative EUR catalogue, with sample=true and visible EN/BG sample disclosures. This is honest template demo data; it is not the shared dated dealer stock pack.

The maintained and pinned-b49 `scripts/lib/client-refresh-six.mjs` both have:

```js
const prefix='karento-best/src/routes/2/',file=prefix+'discovery.ts';
if(!files.has(file))return [];
```

Moving the module to src/lib/discovery therefore silently skips the existing factual stock/currency/disclosure binding. Promoting this source into a dealer candidate without adapter compatibility would preserve the illustrative catalogue instead of the dealer pack. Extend the existing binder for both layouts, preserve old releases and fail on ambiguous divergent dual modules. Verify actual generated records, stock notice, currency/mileage and detail/return routes without changing frontend composition. Root has authorized that narrow follow-up after this report.

The existing package selector advertises a second Signature home only when old routes/2/+page.svelte is present. The promoted +server redirect will make that predicate false. Establish the intended homes and validate the resulting FAB; do not force two choices that redirect to the same page. This review does not change selector behavior.

## Minimal reconciliation and pilot plan

1. Root/integrator preserves the occupied checkout and records the current published checkpoint, audit patches and each genuine local delta. Do not reset, blanket-stage or copy old remote files over newer local work. Perform one serialized source checkpoint when required; never let each owner fetch.
2. Reconcile latest Import/Mobile audit receipts and the narrow binder compatibility fix. Preserve published Auto Best/App/Modern/Signature corrections; retain the recorded Signature Home direction. Keep refined artwork a separately identified pending visual candidate and preserve original assets/provenance.
3. Review the actual final AboutHero copy fit, Signature root versus /index-3, refined icons and FAB/home behavior in the existing preview. Accepted source composition and final visual acceptance remain distinct facts; request only any concrete unresolved owner choice after preparing its review.
4. Freeze the exact resulting six-family source/tree/digests. Use the maintained qualification context/candidate lock; neither the stale local lock nor the unchanged published bb173 release can certify new edits. Keep unchanged approved pins only where their immutable content actually matches the selected source.
5. At one integration checkpoint, run relevant checks and exact production/mounted qualification once, using stable dependencies and one bounded output. The combined single-Worker pilot must verify genuine shared facts/stock, all six routes/assets, EN/BG, relevant320/390/1440surfaces, logo consumers, safe actions, legacy /2 links, real runtime limits and hosted owner review. Record publication, build, provider/version and hosted acceptance separately before rollout.

Evidence read: TEMPLATE-PROMOTION, current six-design contract, Signature AGENTS/MOBILE-PATTERNS, home-promotion results, original/refined icon provenance, current audit reconciliation records, local scoped Git status/diffs and pinned GitHub files. No live UI acceptance, test rerun or provider-runtime proof was created by this report.

