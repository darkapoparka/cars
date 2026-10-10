# Varna Cloudflare delivery — 11 October 2026

Status checked at **2026-10-10 22:40:51 UTC / 11 October 01:40:51 Sofia**. This supersedes the earlier Vercel-only hosting status in BUILD-STATUS.md; that file remains historical evidence.

## Actual outcome

**Eight public dealer sites, each with all six genuine designs and the shared Admin link. Two dealers remain incomplete.** Cloudflare's authenticated Worker inventory confirmed **59/60 internal application Workers and 8/10 public routers**, or **67/70 intended Workers**. No billing, DNS, existing Vercel alias or external outreach changes were made.

| Dealer | Public proposal | Applications | Public browser evidence |
|---|---|---:|---|
| D&M - Auto Varna | https://cars-dmautovarna.darkapoparka1.workers.dev | 6/6 | 24 entry/FAB cases + 25 supplemental checks passed |
| Kolarov Cars | https://cars-kolarovcars.darkapoparka1.workers.dev | 6/6 | 24 + 25 passed |
| Dynamic Auto Varna | https://cars-dynamicautovarna.darkapoparka1.workers.dev | 6/6 | 24 + 25 passed |
| CAR POINT TRADE LTD | https://cars-carpointtradevarna.darkapoparka1.workers.dev | 6/6 | 24 + 25 passed |
| PM SELECT AUTOMOTIVE | https://cars-pmselectautomotive.darkapoparka1.workers.dev | 6/6 | 24 + 25 passed |
| DREAM DRIVE | https://cars-dreamdrivevarna.darkapoparka1.workers.dev | 6/6 | 24 + 25 passed |
| Аутофест | https://cars-autofestvarna.darkapoparka1.workers.dev | 6/6 | 24 + 25 passed |
| Сити Карс | https://cars-citycarsvarna.darkapoparka1.workers.dev | 6/6 | 24 + 25 passed |
| PRIME AUTO | Not public; router upload held | 6/6 | Not claimed |
| AUTOROAD | Not public; Auto Best and router missing | 5/6 | Not claimed |

The complete compact ledger is [cloudflare-delivery-2026-10-11.json](cloudflare-delivery-2026-10-11.json). Its 67 Worker version IDs, ten canonical source trees, input digests and sixteen successful browser-report hashes were checked against the actual retained execution receipts before publication.

## Build and source chain

The applications remain genuine Auto Best, Modern, Import, App, Mobile and Signature (`karento-best`). Each dealer keeps one fact/asset pack. The Cloudflare provider path uses six internal application Workers and one public routing Worker; Admin is the existing external demo, not a seventh template or copied backend.

The ten personalized sources are on Cars `varna/clients/<slug>`. They retain the six template pins in the ledger, including final App `4e184777567849a2c5b4a9e4a3e652252179c29c`. No marketplace/platform repository was changed.

Successful Cloudflare builds:

- Pilot: [38086278620](https://github.com/darkapoparka/cars/actions/runs/38086278620), source `b38a714c4ac0735e9dc238843422837d578c39dc`.
- Remaining nine: [38086528857](https://github.com/darkapoparka/cars/actions/runs/38086528857), source `b90e69f6091626c1ee149b0c66c4f645b0f6fea7`.
- Two-family repair across all ten: [38088468539](https://github.com/darkapoparka/cars/actions/runs/38088468539), source `47087bc460be6ed8e32add4fed10ebd9751b10f0`.

Auto Best and Import were replaced with the repaired outputs; unaffected Workers were not rebuilt or redeployed unnecessarily. These are composite releases from the documented runs, not all outputs from one invented commit. The source tree/input digest for each dealer remains unchanged across the provider fixes.

Compiled artifact size, archive SHA-256, safe paths, emitted configuration, exact dealer/Worker identity and output hashes were verified before upload. Wrangler used `--no-bundle`; it did not regenerate applications during deployment. Routers were exposed only after all six matching internal services had upload receipts. Disposable download/extraction folders created for successful transfers were released; source trees, credentials, histories, other projects and unrelated caches were not cleaned.

## Bugs fixed before rollout

The pilot exposed real errors in generated dealer content:

1. Auto Best vehicle detail returned 500 because `addressShort` was absent from strict dealer-owned BG/EN labels. The repair derives it from each already sourced `addressLine`, preserving the factual address.
2. Import English entry returned 500 because its dated-listing disclosure lacked an English editorial entry. The exact disclosure now has an explicit English translation; strict unknown-copy errors remain enabled.

The committed repair is `scripts/publishing/varna-copy-contracts.mjs`, applied through the existing template-contract adapter. Atomicity, source-fact preservation and repeated-application rejection were checked against all ten dealer inputs. Template masters were not rewritten.

## Hosted verification actually performed

**192/192 baseline cases passed**: eight public dealers × six designs × BG/EN × 390/1440px. Checks covered entry HTTP status, language, visible images, overflow, runtime errors, noindex, the six-design FAB, Admin link attributes and Escape/focus return. Four families' retained native vehicle detail paths were also visited.

**200/200 supplemental checks passed**: 25 per public dealer. These covered native contact/showroom surfaces and actual sourced phone identities in both languages across all six families; Import and Signature stock detail plus reload in both languages; the FAB at 320px; actual Admin new-tab opening; Escape/focus; and the two real alternative home-2 routes in Bulgarian.

App's native contact surface is Stores/Showroom. Mobile and Signature use the `?lang=` contract, not invented `/en` mount paths. Contact tests start from the selected locale entry. Previous failed checks are retained, including the initial pilot errors, a fresh-router propagation observation and corrected test assumptions about offscreen lazy images and native routes.

No real enquiry, call, payment, finance submission or dealer message was sent. These bounded technical checks are not owner visual approval, exhaustive functional acceptance, load testing or approval to contact prospects.

## Precisely what is still held

Two upload calls were blocked by **OpenAI tool safety checks**, not Cloudflare quota or failed framework builds. They were not retried through a different executor:

- PRIME AUTO: router only. All six internal applications are uploaded. Router artifact `11681659002`, run `38086528857`.
- AUTOROAD: Auto Best upload. Five internal applications are uploaded. Auto Best artifact `11683455697`, repaired run `38088468539`. Its router was deliberately not submitted without the sixth application.

Fresh explicit user approval is required before retrying those blocked upload actions. Reconfirm source/build/account identities, complete remaining uploads, then run the same public checks; do not call either dealer public beforehand.

## Remaining original-task work

The requested high-quality logo refresh is not complete; original sourced logos remain, and Autofest's original is only 100 × 26 pixels. Dedicated private per-dealer publishing repositories/Git bindings are not yet created. Owner review, final branding and outreach approval remain pending even for the eight technically verified public proposals.

Research remains on `main/leads/varna`; source/build helpers remain on `varna`, exactly located above. The task is not reported complete while the two dealers and original branding/repository work remain open. Preserve the occupied main working tree.

## Resume evidence

Full local receipts, compiled inventories, uploader logs, QA JSON and screenshots:
`C:/Users/radev/AppData/Local/Temp/cars-varna-delivery-20261011`.

Original D&M pilot receipts:
`C:/Users/radev/AppData/Local/Temp/cars-varna-cloudflare-artifacts/38086278620/dm-auto-varna`.

The current tools are `tools/stage-and-deploy.mjs`, `tools/compiled-validator.mjs`, `tools/hosted-qa.mjs`, `tools/journey-qa.mjs` and `tools/collect-delivery.mjs` under the first directory. The first uploader validates exact completed build artifacts, preserves source/identity gates, and supports explicit revalidation of an ordinary interrupted transfer. That resume mode does not authorize retrying safety-blocked actions.
