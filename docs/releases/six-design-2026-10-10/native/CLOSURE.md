# Native source release handoff — 10 October 2026

These three exact-source envelopes are drafts with approved=false. Current master source, mirror, READY deployment, owner build/targeted hosted receipts and declared catalog parity are closed. Full native acceptance and current mounted integration are not declared passed. This prevents automatic adoption of an unqualified source and does not ask for another owner approval.

| Family | Final pushed source | Draft envelope |
| --- | --- | --- |
| auto-best | 696230a404abd9b20b6f907b9cfb139175298c7a | auto-best-696230a-release.json |
| modern | 6f87470c1e3ec8ade7d9ecc07daf9ebe45cb9710 | modern-6f87470-release.json |
| import | b9373e9ed5453bc7d208898ae140eae4d596a232 | import-b9373e9-release.json |

Every closure JSON hashes the original local owner receipts and distinguishes earlier audit/Oct9 evidence from current receipts. The envelope verification timestamp is record assembly time. No old browser run was assigned a new SHA. The fresh immutable source digests match the final publishing receipts.

No master build needs repeating. Minimal remaining work: map sufficient current owner evidence into the twelve native categories; close only missing current native preferences/no-JS/storage denial/races, request isolation and route/resource checks with the existing acceptance harness; qualify affected journeys in one exact six-family mounted candidate at EN/BG320/390/1440 and both Modern/Import slot orders. Keep meaningful current evidence for catalog/copy, standalone/public journeys, security/write blocking and assets; do not just change pending to passed.

Modern retains braces@3.0.3 and the audit records its explicit owner publication exception. The dependency security gate remains unpassed. Source release acceptance and dealer/hosted acceptance are separate.

After those receipts close, complete the relevant envelope and first dry-run approval; use --write only after the dry run succeeds and serialize the existing lock writer. These commands intentionally fail with the current draft envelopes:

~~~powershell
$releaseNode = 'C:/Users/radev/Documents/Codex/2026-10-09/six-design-publisher/.runtime/node22-toolchain/node.exe'
& $releaseNode scripts/template-release.mjs approve --key auto-best --commit 696230a404abd9b20b6f907b9cfb139175298c7a --evidence docs/releases/six-design-2026-10-10/native/auto-best-696230a-release.json
& $releaseNode scripts/template-release.mjs approve --key modern --commit 6f87470c1e3ec8ade7d9ecc07daf9ebe45cb9710 --evidence docs/releases/six-design-2026-10-10/native/modern-6f87470-release.json
& $releaseNode scripts/template-release.mjs approve --key import --commit b9373e9ed5453bc7d208898ae140eae4d596a232 --evidence docs/releases/six-design-2026-10-10/native/import-b9373e9-release.json
# Then repeat each completed, passing approval command with --write; commit only owned lock/evidence with the reviewed publisher revision and verify.
~~~

Preserve the existing preparation scope:19 BG first, five UAE and one USA prepared/deferred. Al Reef stays independent. Promosale retains darkapoparka/cars-promosalevarna, prj_yjXIu0an7sqCiY26hKWgOGUl5hbY, team_RTNXBnClGWDdcYFFUW0BnqvJ and https://cars-promosalevarna.vercel.app/. No dealer deployment occurred.

After all six final sources/receipts are accepted, the existing representative refresh/package commands are:

~~~powershell
& $releaseNode scripts/refresh-client.mjs --client promosale-varna --design-set six --candidate-dir 'I:/cars-runtime/cars-signature-25-20261009-2140/promosale-six-candidate' --candidate-asset-pool 'I:/cars-runtime/cars-signature-25-20261009-2140/asset-pool' --asset-pool 'I:/cars-runtime/cars-signature-25-20261009-2140/asset-pool'
# Review conflicts and run the missing candidate checks. Use the printed runDirectory:
& $releaseNode scripts/refresh-client.mjs --client promosale-varna --reviewed-run '<printed-runDirectory>' --write
# After the scoped dealer commit:
& $releaseNode scripts/package-dealer.mjs --client promosale-varna --out runtime/dealer-packages/promosale-six-vercel --provider vercel --asset-pool 'I:/cars-runtime/cars-signature-25-20261009-2140/asset-pool' --write
& $releaseNode scripts/audit-vercel-output.mjs 'L:/CODEX/cars/runtime/dealer-packages/promosale-six-vercel/.vercel/output'
& $releaseNode scripts/export-dealer.mjs --client promosale-varna --package runtime/dealer-packages/promosale-six-vercel
~~~

The prepared package must have actual final Build Output API service roots for autobest, importer, modern, app, mobile and signature. Build/audit the complete representative provider package once, with its actual existing project link verified. Preserve existing URLs/IDs/repos and use one reviewed existing Git trigger after exact export reconciliation. Qualify Priselci opposite mount order before expanding the BG wave. UAE/USA remain deferred.

Background read-only readiness reference: I:/cars-runtime/cars-signature-25-20261009-2140/vercel-readiness-handoff-20261010.md. Its initial HEAD/source status snapshot predates this closure; use final source envelopes and root final App/Mobile handoffs as the authoritative newer records.
