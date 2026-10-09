# Six-design release and outreach handoff — 9 October 2026

The owner requested a refresh of the existing 25 Vercel dealer proposals with the current Auto Best, Modern, Import, App and Mobile templates, plus **Signature** as the sixth FAB choice. Signature is the client-facing name for the Karento Best master. Prepare the integration while the final source work and mobile polish finish. Ship a fixed, tested release rather than copying moving working directories into clients.

Naming follow-up on 9 October: the shared selector displays **Signature** in EN/BG. The internal key `karento-best`, maintained source folder and `/variant-6/` entry stay stable. Each personalized website still uses the actual dealer's name and branding. Main now contains the newer App polish and Mobile PRO integration commits; final source/release checks remain separate from that integration.

This records the owner's latest requested Vercel target and sixth-family scope. The [4 October hosting decision](../HOSTING-AND-RELEASE-DECISION-2026-10-04.md) remains historical capacity/provider evidence. Provider qualification is still required; no billing change, DNS change, migration or resource deletion is part of this preparation.

## Start outreach using the existing proposals

Live connector reads matched all 25 project IDs/names and repository bindings against the current technical registry. All 25 latest listed deployments were READY production deployments. An anonymous HTTP check at 00:20 Sofia on 9 October returned public HTML for all 100 currently offered entries, four per dealer. No protection change or authenticated bypass was used.

This proves entry-route reachability, not fresh visual acceptance, truthful inventory freshness, working backend enquiries or completion of today's template work. The existing deployments still offer the older four designs. Send them as proposals/concepts. The six-design upgrade can follow while conversations begin.

| Dealer | Existing public origin | Source ownership |
| --- | --- | --- |
| Promosale Varna | [Open proposal](https://cars-promosalevarna.vercel.app/) | Cars source |
| OUTLETCARS.BG — Варна | [Open proposal](https://cars-outletcarsvarna.vercel.app/) | Cars source |
| Автокъща Приселци | [Open proposal](https://cars-priselci.vercel.app/) | Cars source |
| Перфект Ауто | [Open proposal](https://cars-perfectauto.vercel.app/) | Cars source |
| Навара кар | [Open proposal](https://cars-navaracar.vercel.app/) | Cars source |
| LEGEND AUTO | [Open proposal](https://cars-legendauto.vercel.app/) | Cars source |
| K-G Team Auto | [Open proposal](https://cars-kgteamauto.vercel.app/) | Cars source |
| Иво Ауто | [Open proposal](https://cars-ivoauto.vercel.app/) | Cars source |
| Excellent Cars | [Open proposal](https://excellent-cars.vercel.app/) | Cars source |
| ELIT AUTO IMPORT EXPORT | [Open proposal](https://cars-elitautoimport.vercel.app/) | Cars source |
| Champion Auto Pro | [Open proposal](https://cars-championautopro.vercel.app/) | Cars source |
| AVANGARD AUTO | [Open proposal](https://cars-avangardauto.vercel.app/) | Cars source |
| Аутомаркет Варна | [Open proposal](https://cars-automarketvarna.vercel.app/) | Cars source |
| Аутолайф | [Open proposal](https://cars-autolife.vercel.app/) | Cars source |
| Астракар | [Open proposal](https://cars-astracar.vercel.app/) | Cars source |
| IS Auto Varna | [Open proposal](https://cars-isautovarna.vercel.app/) | Cars source |
| eliqauto | [Open proposal](https://cars-eliqauto.vercel.app/) | Cars source |
| F1rst Motors | [Open proposal](https://cars-f1rstmotors.vercel.app/) | Cars source |
| Day and Night Auto Group | [Open proposal](https://day-and-night-a.vercel.app/) | Cars source |
| Al Hamoor Al Thahabi Used Cars | [Open proposal](https://cars-alhamooralthahabi.vercel.app/) | Cars source |
| Al Basma Motors | [Open proposal](https://cars-albasmamotors.vercel.app/) | Cars source |
| Al Reef Used Cars | [Open proposal](https://cars-alreefusedcars.vercel.app/) | Independent source |
| The Dealers Point | [Open proposal](https://cars-thedealerspoint.vercel.app/) | Cars source |
| Texas Drive Auto | [Open proposal](https://cars-texasdriveauto.vercel.app/) | Cars source |
| АСКО 96 | [Open proposal](https://cars-asko96.vercel.app/) | Cars source |

The saved HTTP findings, provider identities and proposed six-family cohort are in [the preparation receipt](../../runtime/six-design-prep-20261009/). Publishing does not authorize sending outreach; this pass did not contact any dealer.

## One release per client

Editing a master does not update the copied clients or their live sites. Use the existing immutable template release, preservation-aware refresh, package and export tools. Preserve facts, inventory, contacts, reviewed logos/media and unique client changes. Treat dedicated publishing repositories as outputs, with remote-only fixes reconciled before export.

Bundle the new master releases, the Mobile adaptation and Karento addition in one final export per dealer. All six services can share one Vercel deployment. This targets **25 successful dealer production deployments for the full cohort**, rather than a deployment per design. Standalone template previews, retries and additional preview pilots are separate deployments. Vercel builds the services individually within that deployment; one deployment is not one application compilation. [Services documentation](https://vercel.com/docs/services)

Use one verified trigger: push the final exported commit through the existing Git integration once. Avoid pushing intermediate client snapshots or uploading the same commit again through the CLI. Preserve the current public origins and their rollback deployments. If a staged production deployment is used, test and promote that artifact; do not assume promoting an ordinary preview avoids a second build. [Deployment promotion](https://vercel.com/docs/deployments/promoting-a-deployment)

| Mount | Modern-first clients | Import-first clients |
| --- | --- | --- |
| / | Auto Best | Auto Best |
| /variant-2 | Modern, retained | Import, retained |
| /variant-3 | Import, replaces Carwow | Modern, replaces Carwow |
| /variant-4 | App | App |
| /variant-5 | Mobile | Mobile |
| /variant-6 | Signature | Signature |

Keep the full original Karento reference and Carwow source/history. Review old Carwow vehicle IDs and routes before replacing variant 3. Keep the shared Admin demo separate from the six counted designs. Al Reef remains independently versioned and uses its own publishing workflow.

## Integration status before the dealer pilot

- Added six actual, provenance-recorded WebP template logos to the release-bundled FAB, with **Signature** as the public name. Dealer pages retain their own identity. Signature's rendered BG/EN copy is a separate dealer qualification gate; the selector does not fabricate unsupported locale paths.
- Added six-family planning to the existing source preflight with `--include-karento`. The new planning helper preserves both legacy layouts and rejects altered/unknown sixth entries. It does not install manifests or generate clients.
- Implemented packaging version 5 and all six service build plans in the existing publisher, including either Modern/Import slot order, App's mounted entry redirect, Mobile's base path, and an exact derived Node 24/Vercel adapter overlay for Signature's Node 26 master. Source, personalization, mount, metadata and artifact receipts remain separately verifiable.
- Fixed the Modern refresh logo adapter to recognize the extracted financing artwork card while preserving the older inline accent-logo composition and rejecting unknown/mismatched consumers. The two full-suite failures encountered before this fix now pass focused verification.
- Browser comparison at 320/390/1440 px in EN/BG showed six choices plus the separate Admin link without horizontal overflow. Desktop Escape dismissal restored focus. Screenshots are fixtures of the actual shared selector, not mounted dealer acceptance.
- Added preservation-aware six-design and selective-family refresh, reviewed dealer profiles, legacy mounted-media resolution, a SHA-verified binary asset pool, and dealer-wide social previews, favicons and canonical URLs. Rendered business claims and coherent BG/EN remain dealer gates.
- Saved preimages and recovery evidence. No canonical dealer has been refreshed or deployed at this checkpoint. One completed Auto Best master mirror was published and reached READY; that is separate from dealer rollout.

Validation at this checkpoint: all **431 workflow tests passed**, strict release-lock checks and the logo reproducibility check passed, and later focused media/refresh checks passed. Exact immutable source checks and mounted production builds are recorded separately under `docs/releases/six-design-2026-10-09/`. Frozen Signature passed type, format, 47 unit tests, production build and 39 canonical layouts at both 320/390px. Its historical reference-parity SSR assertion deliberately differs after rebranding, and a missing desktop filter ARIA target remains an explicit unresolved smoke gate. Neither is silently marked passed. These results do not claim dealer rollout or owner visual acceptance.

The read-only diagnostic is:

```powershell
node scripts/check-five-design-release.mjs --include-karento
node scripts/check-five-design-release.mjs --include-karento --json
```

It exits nonzero while release prerequisites remain unmet. Packaging version 5 is implemented; release approval and actual dealer qualification still determine whether a particular candidate may be published.

## Remaining work before the six-design release

1. Finish the current handoffs, review source differences and compare before/after at affected widths/routes. Integrate completed work into the canonical Cars masters on main. The initial branch observations recorded in the preparation receipt predate the newer App polish and Mobile PRO integration now on main; assess the final source from that current state.
2. Finish actual derived dealer acceptance: truthful Home/About/Contact and stock details, coherent BG/EN consumers, legacy media/detail migration, mounted actions, metadata and service outputs. The adapter and publisher are implemented, but Mobile/Signature folders have not yet been installed into the 25 canonical dealers.
3. Qualify Karento's deployment runtime/adapter. It declares Node 26.10.0 and uses adapter-node in vite.config.ts. Vercel's current documented Node runtimes are 20/22/24, so its current source is not an accepted Vercel payload. Test a supported Vercel adapter/runtime or supported prebuilt approach without changing the occupied master under its active writer. [Runtime documentation](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
4. Select all six exact master releases with fresh source and hosted evidence through template-release. The September 30 lock still selects the older four families; Mobile and Karento Best have no approved entries. The [release skill](../../.agents/skills/cars-template-release/SKILL.md) requires: "Supply exact-source evidence and `--write` only when the required checks pass." The current moving sources and missing mounted builds cannot satisfy that release step yet. Do not relabel old evidence or reseal edited dealer source without real personalization/QA.
5. Build and verify Priselci and Outletcars, which cover both family orders. Cover six entries, representative details and reloads, language state, all logo surfaces, mobile overlays, honest enquiry behavior and the FAB/Admin link at 320/390/1440. Test actual final Vercel outputs and public hosted behavior before the remaining wave.
6. Refresh/export the remaining cohort from the same pins, build with bounded concurrency, push one final release per repository and verify the exact deployment/alias/routes. Record failures independently and retry only failed clients. Include Al Reef's separate result.

Current Vercel plan reads as Hobby. One combined six-service project is one deployment; standalone masters and retries count separately. Recheck the rolling provider count before the fleet wave. Monthly compute/storage usage was not available from connector reads, so old near-quota figures are not represented as today's usage. The asset projection measured about 4.36 GiB free on L: and about 0.80 GiB of unique new-family objects versus 10.94 GiB copied independently. This excludes Git/history, other assets, build output and recovery. Actual build proofs run in bounded derived C: directories. Preserve source, active Git operations and recovery data.

## Template maintenance after release

Keep UI/architecture improvements in one maintained master per family. Approve deliberate release versions; update client copies explicitly when an improvement merits rollout. For a signed client, use its approved baseline and scope branding, real stock/media, business copy, contact/enquiry integration and paid custom behavior. Carry shared bug fixes back into the master so the next client benefits.

A shared multi-tenant renderer can reduce future fleet rebuilds, but it is a separate migration. Today's shortest delivery path keeps the existing 25 repositories/origins and completes this one coordinated release.
