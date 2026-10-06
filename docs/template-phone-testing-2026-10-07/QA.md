# Five template demos for phone testing

Published 7 October 2026 (Europe/Sofia). All five existing Vercel production aliases resolve to READY deployments with the exact publishing commit shown below.

| Template | Phone link | Publishing commit | Deployment |
| --- | --- | --- | --- |
| Modern | https://cars-template-modern.vercel.app/bg | `a6cadf6ede798179aca84adf7d5f0071c44cbdd0` | `dpl_D2j6D8qrsoe1aosBYm7b8vpVkhTz` |
| Mobile | https://cars-template-mobile.vercel.app/?lang=bg | `5c0e771fba1cef600d9f623bf792e5e134f32b07` | `dpl_HS8GBRABgd5cz9KrAr51Xr6thYUh` |
| App | https://cars-template-app.vercel.app/bg | `bb76cc12de5fb90f7f70d378cca096eed7d22f0a` | `dpl_6ka1wvyAoazUQPLEDpe5fQgkfGXb` |
| Auto Best | https://cars-template-auto-best.vercel.app/bg | `636af93a040f697e8f40a7a014f3fdfb0f823d77` | `dpl_FStsamMUcbygrG8Q79wkWrCRc1eS` |
| Import | https://cars-template-import.vercel.app/bg | `05cba90b7690231cb45b11ec983dd67ad0d51c71` | `dpl_HoYST2y8fzzvjqAZo4owSfvxTNx9` |

## Source and publication

The scoped Cars snapshot is `71ed4db0bc561edc6e34690a953f28fcd9144845`, followed by `c71ec81977b592bde32106282ec1a7a4b3377c9b` for the Import VIN acronym test and manual-only Auto Best deployment workflow. All except Auto Best bind to that source. Auto Best additionally uses `439d104b071a6f066106fa5cbac4549c746c0882`, allowing its required `scripts/public-asset-retention.mjs` through `.vercelignore`. The first hosted Auto Best attempt failed because that helper was excluded; the corrected Git deployment is the READY version above.

The 378 source, asset and test paths were captured through a separate Git index. Generated Next configuration, local screenshots and unrelated dealer/workflow work were preserved. The occupied canonical checkout retains its earlier HEAD `5d82fca2b0f654d7a97efe68ea2748a5590b1be1`; the reviewed commits were pushed without force to Cars main. The shared index was not replaced. Each mirror retains its previous main ancestry, CI files and standalone recovery history. Source fingerprints matched the exported runtime, and all five mirrors had zero independent runtime drift against their previous recorded Cars sources.

These are standalone template test deployments. No dealer source, release lock, fleet package, billing, DNS or outreach was changed.

## Verification

- Auto Best: architecture, CSS policy, tokens, typography, assets, domain, locale/source checks, Svelte check and production build passed. The hosting fix passed 20 focused asset-retention/publishing tests.
- App: ESLint, TypeScript and production build passed on the exported snapshot.
- Mobile: ESLint, TypeScript, 95 domain/localization tests and production build passed on the exported snapshot. ESLint reported two existing warnings about `aria-hidden` on `picture` elements, with no errors.
- Modern: marketplace-ui TypeScript and 101 UI tests passed, plus 188 web unit tests. Its exact Git snapshot completed the hosted production build.
- Import: Svelte check and all 139 unit tests passed. The localization gate now recognizes the two fixed VIN acronym labels. The C:-to-L: dependency junction confused its local bundler; the canonical L: production build passed. Its exact Git snapshot also completed the hosted build.
- 60 anonymous Chromium route/viewport cases passed at 320, 390 and 1440 px: Home, inventory, a real vehicle detail and contact/services, including App Home 2. Every response was 200, with zero horizontal page overflow, broken visible images or captured page errors. Five additional 390 px English Home checks returned 200 and `lang=en`.
- All five phone filters opened and dismissed with focus restored. Modern and Auto Best menu dismissal also restored focus. Import's menu opened and closed but did not restore keyboard focus to its opener; this remains a minor keyboard QA finding. Mobile and App were not certified for a dialog-style menu by this harness.
- Workflow validation and 11 publishing-scope tests passed. The full workflow suite passed 337/339 tests. The two failures are Modern dealer-refresh fixtures with `Missing Modern financing logo anchor`; fleet refresh acceptance remains open.

Browser checks establish rendered smoke behavior, not physical-phone or owner visual acceptance. No enquiry was transmitted during testing.

## Local verification storage

L: ran out of space during temporary exports. A cross-volume PowerShell move followed dependency junctions and moved some installed packages along with the verification copies. Packages were restored from those copies. Full SHA-256 verification passed for all 57,695 files: App 26,418; Auto Best 4,999; Mobile 26,278. The final dependency-restoration receipt and all operational logs are preserved in `runtime/phone-template-publish-20261007/`. No template source or recovery evidence was discarded. The generated verification/recovery copies under `C:/Users/radev/.codex/tmp/cars-phone-template-partial-20261007` are retained as recovery evidence for this resolved incident; they are not editable masters.

Provider metadata and rendered browser receipts are retained beside this file. The runtime directory keeps the operational reproduction and unresolved workflow failure logs.
