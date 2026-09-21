# Cars localization adoption — 21 September 2026

## Committed implementation and one verified dealer release

Cars workflow release **033ed99caea4f7a5c318853f75e42f3f2f533dd0** implements native version-2 packaging, Modern's real native base path, independent generation and guarded Cars-canonical refresh. Both synthetic standard and Import trios are exercised through success and failure cases. All **174 workflow tests** and **125 shared-policy tests** pass. Legacy protection remains; no new template pins were promoted. These fixture results are not real-template trio browser acceptance.

Al Reef was reconciled in its permanent independent checkout without recreating Phase 2. Security release **9495be2ade60032ec4272cb991dd4731b460a887** was pushed once through its existing Git connection and serves the existing public alias on READY deployment **dpl_72koBuKSnobyVC6cYM7LNQCtvuys**. GitHub main and the public alias were rechecked after production QA. Its source checkout was clean and its tested application hash was unchanged.

`ALREEF-PUBLIC-ACCEPTANCE.json` separates source, local checks, exact deployment and public verification. Public results: HTTP 12/12; preferences 4/4; storage/no-JS 18/18; races 24/24; normalized-return/valid preferences 16/16; journeys 762 passes with zero failures and four intentional mobile-only calculator skips; branding 128/128; exact public asset hashes 27/27. All 1,032 public/static source files were preserved. The failing-before and passing-after public security receipts are both retained. The four skips are not passes: Carwow's desktop calculator is absent on mobile, where its financing-information fallback is tested.

## Upstream releases are not all accepted

| Template | Actual audited main/READY source | Current result |
| --- | --- | --- |
| Auto Best | `989ec3a1d80a8f19150d18eb81282ac7cd216d83` | Native work remains unpublished; required handoff absent; six public localized routes return 404. Returned as repository issue #1. |
| Modern | `8fcb7f30960673ad8f20c5866671d410bdaf248a` | Six locale routes pass, but all twelve normalized-return security negatives fail. Returned as repository issue #2; mounted acceptance is also incomplete. |
| Import | `521fab0be30501c888a3617db9987d36c918e8a1` | Six locale routes pass, but all twelve normalized-return security negatives fail. Returned as repository issue #1. |
| Carwow | `17422cd3a31a9251da35f72d30c3111a6641e9ec` | Audited last; six locale routes and all sixteen preference checks pass. Application content matches its reviewed application commit; not promoted as a complete native trio. |

No template checkout, index, build output or owner UI work was edited. Passing source-copy/catalog tests are scoped evidence, not a claim of independent linguistic approval or zero hardcoding across every state. No Codex implementation prompt was sent.

## Named rollout and preservation

`../ROLLOUT-MATRIX.json` and `.md` record all **25 named dealers / 75 design slots**. Al Reef is publicly verified for this security reconciliation, not regenerated from the new templates. Navara remains the next canary and has not been refreshed or redeployed. `NAVARA-PRESERVATION.json` records 3,117 canonical source files, 1,086 asset entries and all nine matching published logo variants while preserving the existing working changes. Full mirror-only source-fix reconciliation remains unfinished.

ISAUTO's physical Cars manifest and Git source confirm `publish/isauto-varna`; Vercel reports the existing project as CLI-deployed. No repository, Git connection or replacement project was invented. Outlet Cars and Promosale retain Import as Design 2 in the rollout contract.

## Explicit incomplete items

The registry was **not updated**: its fresh selected-row inspection was blocked by a tool safety-status error, and it was not reread or rewritten through another route. The named matrix records that limitation rather than asserting unverified registry data. A separate untested promotion-rollback prototype was also excluded after its new test-file write was blocked; it was moved out of active scripts and never integrated.

There is no approved new template release set, no real standard/Import trio acceptance, no Navara localization release and no subsequent dealer batch. The portfolio is **not complete**. Release acceptance must not be inferred from this implementation commit, a popup, a catalog count or READY alone.
