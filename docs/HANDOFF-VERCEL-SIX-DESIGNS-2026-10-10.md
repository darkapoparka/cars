# Existing Vercel dealer rollout — continuation handoff

The owner requested preparation and a GPT Web handoff on 10 October 2026 to conserve Codex credits. **No dealer was deployed, installed or pushed in this preparation.** Continue from this checkpoint; do not start another generator, architecture migration or frontend redesign.

The owner explicitly selected the existing **Vercel** projects, superseding the older Cloudflare paragraph for this batch. Preserve dealer repositories, project IDs and public aliases. Prepare all 25; publish the **19 Bulgarian dealers first**, leaving five UAE and one USA dealer deferred. Publishing does not authorize outreach, billing changes, DNS changes or sending test enquiries.

## Access and ownership

Canonical checkout: `L:/CODEX/cars`, branch `main`, repository `darkapoparka/cars`. A web agent needs a PC connection that can read these files and execute PowerShell/Node, plus authorized GitHub/Vercel access. GitHub/Vercel plugins alone do not inherit this checkout or its ignored local receipts. If PC command execution is unavailable, report that exact missing capability instead of claiming the local batch has been installed.

Read AGENTS.md, the current owner overrides here, and the existing cars-template-release/cars-publish skills. Preserve concurrent source edits, unrelated staged files, independent Al Reef Git ownership and publishing-only fixes. Never blanket-stage, reset, clean, remove another writer's lock, force-push or silently replace pending evidence with approval. `workspace-doctor --fetch` already ran once during this checkpoint; repeat only when integration state has changed.

Technical bindings are in `docs/DEPLOYMENT-INVENTORY.json` and `clients/README.md`. Team: `team_RTNXBnClGWDdcYFFUW0BnqvJ`. Representative Promosale project: `prj_yjXIu0an7sqCiY26hKWgOGUl5hbY`, repository `darkapoparka/cars-promosalevarna`, public origin `https://cars-promosalevarna.vercel.app/`. Existing projects use Services. One complete dealer release contains six services; this is one production release per dealer project, not six independent dealer projects. Pilot/preview retries and separate master releases are additional deployments. Live allowance was not exposed by the connector; the previously discussed 80 remaining is unverified.

## Prepared source and UI

The planned set is Auto Best, Modern, Import, App, Mobile and **Signature** (source key `karento-best`), plus the existing separate Admin demo. Preserve existing Modern/Import at `/variant-2`; the other family replaces Carwow at `/variant-3`. App stays at `/variant-4`, Mobile at `/variant-5`, Signature at `/variant-6`. Preserve old detail destinations through the existing routing rules.

The version-5 FAB uses bundled WebP template logos, the heading **Изберете дизайн**, four small **Виж** pills, and only the compact **1 / 2** segment for App and Signature. Accessible design names remain. App alternate home is `/variant-4/{locale}/2`; Signature is `/variant-6/2?lang={locale}`. Phone presentation is a bounded modal; desktop remains a popover. Final assembly advertises alternate homes only when the source route exists.

The shared publisher now sets `localePresentation: compact-v1` and styles existing Auto Best/Modern/Import `dialog[data-locale-dialog]` elements as compact centered cards with clean fields, language choices and rounded actions. Original native locale/country/request/focus logic remains. This does not inject a second welcome dialog into App/Mobile/Signature. It applies when a fresh version-5 client package is generated; old hosted dealers and standalone master previews have not received it. See `docs/qa/shared-language-modal-2026-10-10.json` and the retained matched phone comparison.

The final workflow run used 66 test files: **529 passed, zero failed, one optional installed-compiler fixture skipped**, plus the workflow documentation check and scoped diff check. No production build was repeated for the cosmetic language styling. Actual combined dealer production compilation remains a publication checkpoint.

## Final master selection

Use `docs/releases/six-design-2026-10-10/` for the exact source envelopes and closure notes. Signature `cc130e432a41a3a60cc80bc2b3461c6416893b4a` has a ready, read-only-validated general release envelope: genuine Node 26 master / Node 24 Vercel mirror builds, 117 tests, exact source-to-mirror hashes and READY/hosted receipts. EN/BG catalogs each have 2,293 matching keys. Select it through the existing approval CLI; actual mounted dealer acceptance remains necessary.

Auto Best `696230a`, Modern `6f87470`, Import `b9373e9` have exact final standalone mirror/READY and owner receipts. Their new native envelopes deliberately remain `approved: false`; reconcile unchanged tested consumers and close the genuinely missing native/mounted checks identified in `native/CLOSURE.md`. Reuse exact master builds instead of rerunning them merely to change an envelope.

App and Mobile release selections remain pending. A live Vercel read now confirms App Cars source `dbc3ecc95b3fe8bfeae29820f5f6cbaac20e214b` maps to mirror `a376e99b6e3fd65a5429413ee4302ce1a7f41732` and production READY `dpl_2SAavx9gAGZ3ioCsT8tzVgai7Edt`. The App chat was still enlarging the cash artwork by 12% afterward, so recheck its actual final source/receipt before freezing a SHA. Mobile `3f637b0` has dirty/new service-detail consumers. Read `app-mobile-closure.md`; do not deploy a stale selected pin or scoop another owner's unfinished files into a blanket commit. Existing `templates.lock.json` changes are preserved and uncommitted; no six-source approval is implied by this handoff. Capture final tested commits, qualify exact evidence and use `template-release approve/verify` to select the six immutable sources. Commit the reviewed lock and evidence separately.

The first handoff push stalled in the portable Git credential-helper selector. A scoped command using the existing manager succeeded without changing global settings: `git -c credential.helper= -c credential.helper=manager push origin main`, with `GCM_INTERACTIVE=never` and `GIT_TERMINAL_PROMPT=0`. Use the existing authenticated credential manager for continuation; do not expose credentials or create an unnecessary login flow.

## Local batch and minimal continuation

The existing batch is `I:/cars-runtime/cars-signature-25-20261009-2140`. It contains 25 personalized Signature drafts, 325 retained vehicles, preview manifests/FABs, a shared immutable asset pool and 150 sharing-overlay assets. These drafts still bind older Signature `03b70f6`; preserve them as preparation evidence and assemble fresh candidates through the existing tools. They are **not 25 fully refreshed six-design dealer checkouts**. All canonical dealers still need Mobile and Signature installed. Independent Al Reef must remain independently owned.

Use the stable Node 22 release runtime below. Template runtimes differ; keep Modern/App/Mobile/Auto Best on their declared Node 22, Import on Node 24, Signature master on Node 26 and its frozen Vercel adapter on Node 24. Avoid full asset/dependency copies per dealer; reuse the asset pool, one representative candidate and one provider payload. Check free space before a new build. The retained local readiness handoff gives additional bindings and exact evidence locations.

```powershell
Set-Location -LiteralPath 'L:/CODEX/cars'
$releaseNode = 'C:/Users/radev/Documents/Codex/2026-10-09/six-design-publisher/.runtime/node22-toolchain/node.exe'
# After final source acceptance; pending envelopes must be completed first.
& $releaseNode scripts/template-release.mjs approve --key karento-best --commit cc130e432a41a3a60cc80bc2b3461c6416893b4a --evidence docs/releases/six-design-2026-10-10/signature-release.json --write
& $releaseNode scripts/template-release.mjs verify --key karento-best
# After all six pins and publisher revision are selected/committed:
& $releaseNode scripts/refresh-client.mjs --client promosale-varna --design-set six --candidate-dir 'I:/cars-runtime/cars-signature-25-20261009-2140/promosale-six-candidate' --candidate-asset-pool 'I:/cars-runtime/cars-signature-25-20261009-2140/asset-pool' --asset-pool 'I:/cars-runtime/cars-signature-25-20261009-2140/asset-pool'
# Review actual conflicts and candidate QA, then use the printed runDirectory.
& $releaseNode scripts/refresh-client.mjs --client promosale-varna --reviewed-run '<printed-runDirectory>' --write
# Scoped-commit the accepted canonical dealer source before packaging.
& $releaseNode scripts/package-dealer.mjs --client promosale-varna --out runtime/dealer-packages/promosale-six-vercel --provider vercel --asset-pool 'I:/cars-runtime/cars-signature-25-20261009-2140/asset-pool' --write
# Run the existing linked Vercel build at the generated package root first.
& $releaseNode scripts/audit-vercel-output.mjs 'L:/CODEX/cars/runtime/dealer-packages/promosale-six-vercel/.vercel/output'
# Proposal only; reconcile actual remote publishing changes before --write/push.
& $releaseNode scripts/export-dealer.mjs --client promosale-varna --package runtime/dealer-packages/promosale-six-vercel
```

Qualify the actual six emitted Services roots and actual mounted dealer routes, details/reloads, EN/BG, both alternate homes, FAB/Admin, real inventory and primary actions. Dealer logos must serve correctly as favicons and framed social previews; canonical/OG links must use the real public origin and route. Check 320/390 and desktop at the integration/release checkpoint, retaining 2–4 useful captures. Verify exact exported SHA, READY deployment and alias after the single approved Git-to-Vercel push. Qualify Priselci's opposite Modern/Import order before the BG wave. Do not invoke the legacy manual fleet reconciliation workflow: it hardcodes packaging version 2 and an old source revision.

A future Signature-only update uses the existing selective-family refresh path. Updating shared templates does not automatically update installed or hosted dealer code; every affected project still needs a fresh complete release. Personalization stays in dealer boundaries so template updates do not erase identities/customizations.

## Retained local evidence

`selector-home-preview/language-{before,after}-390.png` is a matched actual-native 390×844 pair; `language-after-320.png` records the native 320×700 frame with no text or horizontal overflow. English selection/save and menu reopen/cancel were exercised through the native UI. Desktop geometry was checked at the actual 1280×720 viewport, not mislabeled as 1440. The review proxy intentionally omitted Set-Cookie forwarding to preserve other owners' localhost preferences; it is presentation proof, not complete dealer/cookie qualification.

The owner subsequently explicitly authorized clearing generated QA/log/cache bloat. Both owned language preview processes are now stopped. Automatic approval review nevertheless rejected a separate verified inactive-cache deletion with only “blocked by policy”: the 187,468,316-byte Modern `.next-public-e2e-cars-language-20261010-demo` cache and intermediate desktop capture remain preserved. No new ban on QA cleanup was added to AGENTS.md; generated inactive outputs may be retired after exact-path and consumer checks through normally permitted tools. Do not bypass an automatic tool rejection or delete sessions, databases, recovery backups, current builds or needed release evidence. Free space at the last live read was C: 7.40 GiB, I: 5.44 GiB, L: 4.68 GiB. This does not block source preparation or the future deployment task.
