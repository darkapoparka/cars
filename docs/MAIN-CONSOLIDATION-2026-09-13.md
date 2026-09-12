# Main consolidation — 13 September 2026

The owner requested one main branch in Cars and the four standalone template repositories. This consolidates source and instructions; existing dealer/template acceptance limits remain.

## Source decisions

- The ten historical Bulgarian campaign tips are included as merge parents. Personalized dealer source replaces generic seed copies; the later `tesi-car-varna` project remains canonical and the `tesi-car` alias is retained in history.
- Complete local Keen Auto Mall, Midlands Trade Centre and Al Hamoor implementations are retained. Later committed Al Basma, F1rst Motors and The Dealers Point corrections remain active. Local Perfect Auto mounted-path corrections remain unfinished source, with hosted acceptance still pending.
- All original staged trees and nonignored working source are preserved as ancestor commits. Generated audit captures and scratch tools remain local and are excluded from version control.
- The four standalone templates retain their existing local implementation exactly after line-ending normalization, alongside the published workflow documentation. Modern includes its eight astra commits; Carwow includes the mobile finalization branch and the subsequent local refactor.
- Template promotion locks and provider/dealer deployment bindings are unchanged. Main is the source branch, not an assertion that every recovered application has passed release QA.

## Recovery and workspace

Original refs and indexes were inventoried before changes. Verified Git bundles and index copies are stored at `C:/Users/radev/AppData/Local/Temp/cars-main-consolidation-20260912-01a0974e/`. Detailed merge, path and artifact manifests are in ignored `runtime/main-consolidation-20260912/`. These are recovery archives, not additional working copies.

J: had about 1.3 GB free; expanding missing dealer applications required about 13 GB. The canonical Cars checkout uses sparse checkout to retain its existing local dealer folders. Every recovered source folder is committed to main. See [local setup](LOCAL-SETUP.md) to materialize another dealer; never recreate it because it is absent locally.

## Preserved checkpoints

| Repository | Original HEAD | Staged checkpoint | Working source checkpoint | Consolidated source |
| --- | --- | --- | --- | --- |
| cars | `adc16cc3e3ae430c1f53e64dd7086ce632e29e38` | `e90daa1e66e5080bc593e2ff11041f54dcefe67f` | `a770d0c1a9b328c60cb6efbd966fe6ef87220efa` | `fea0b554f3938fa91bcaf90d447f0062ee184735` |
| cars-template-auto-best | `1a32dc2b994d78c794e2d19bfd2d24c7adc48807` | `21c3c5e88dd31b1af906d10df128c290c8ee4825` | `8d68d13b6045a9b8c6c394077565f754c9eb5d12` | `25f4740290c88a83d5d20273f047cab304ed0d98` |
| cars-template-modern | `ecaf6324c21805df0054011063473f9fce978788` | `8284cf323534bc7c4b37139f458fc1cd3c51a3d2` | `2fa4efaa9fcd94c916ee412838cbd725329b12bf` | `7016302092d7bd22defad3b5c6da18d8474ea982` |
| cars-template-carwow | `d769bb0558ad0228b92440fc3fd9ff81548bc890` | `883917502962f10335be708be73b5b1063cf5c7a` | `64fb5a18462544fdab93d878f76d456d7eb8ddbc` | `077eabb570f69ab136285347afed9fb5faf37eeb` |
| cars-template-import | `3c24db073b0b1a3bf26c64ed5336921117658e29` | `35d5a592bb3e08d790da98901fe9029bcfb3e270` | `b01a165ec52c0eb575ce041ae2adf6ba65371143` | `2e08979c432a435934ff6159c86a5c0556196180` |

The final handoff records the published main heads, deletion results and actual checks. No source checkpoint or old branch tip may be deleted from reachability before verifying it is an ancestor of the new main.
