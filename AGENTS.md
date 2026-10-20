# Cars Studio: templates, leads and dealer delivery

Opus reviews are optional support after a major scope, roughly ten commits, or an architectural decision when useful. They are not a required gate, fixed schedule or prerequisite for ordinary coding.

## Start here — owner direction, 20 October 2026

This is darkapoparka/cars, maintained at L:/CODEX/cars; J:/cars and L:/PLATFORMS/cars-studio are aliases. The separate Cars marketplace is darkapoparka/cars-app-mobile at L:/CODEX/platforms/cars. Read [tasks.md](tasks.md) for the current queue and source-sync snapshot, [README.md](README.md) for orientation and [the docs index](docs/README.md) only for the relevant operation.

Codex normally implements locally on main in this project's working chat. Claude Code reviews a large scope or handles a named task when asked; it does not routinely orchestrate, dispatch new jobs or run a competing implementation. No central orchestrator or skill is required for ordinary work.

Astra ChatGPT web 6 Pro may plan, implement substantial architecture/tooling/backend improvements remotely on GitHub, or review a major result. Astra can implement directly on GitHub main or use an Astra branch when useful. Reuse a suitable current branch while handing off older work; do not create per-task clones/worktrees or delete historical branches to satisfy a number. Current GitHub Actions build/deploy machinery may use its existing state refs; those are infrastructure, not extra competing source lanes.

Keep concurrent local template/UI and remote tooling changes in separate file scopes; agree shared data/schema/configuration changes briefly. A checkout has one HEAD. Coordinate actual overlapping writes and Git/index/dependency operations, integrate the real remote diff without discarding dirty files, run relevant checks and refresh the maintained preview before owner review. A GitHub result does not automatically update local source. Stalled work can be handed off without waiting for every unrelated PR or a perfectly clean tree.

Use exact code/diffs and source revision for review. PRs and review branches are optional transport, not mandatory per-task ceremony. Existing user authorization carries forward; ordinary coding does not need a new planning approval. Apply change-sized verification during iteration and the necessary broader release checks at a coherent integration/release checkpoint.

## Current delivery contract

The [six-design contract](docs/FLEET-ROLLOUT-2026-10-11.md) supersedes old trio/five-design and per-design-Worker procedures. Each dealer offers Auto Best, Modern, Import, App, Mobile and Signature (karento-best) through one Cloudflare Worker, with all six applications/assets, the design FAB and shared public Admin demo. Preserve existing Modern/Import route choices; the other occupies /variant-3, App /variant-4, Mobile /variant-5 and Signature /variant-6.

Preserve the selected template's composition, colors and useful interactions. Use actual business identity, factual dated copy and sourced inventory or disclosed demo listings. Brand/logo proposals remain proposals; do not claim a generated identity was adopted. Remove inherited dealer contacts, staff, reviews and channels. Mock enquiry, purchase or finance actions must not pretend a real successful transaction.

The latest remote [dealer-pack pipeline](https://github.com/darkapoparka/cars/blob/main/docs/PIPELINE.md) describes the compact dealers/<slug> expansion and native build/deploy tooling. The retained clients/<slug> workflows remain available. Read the exact selected revision's technical procedure; a stale local checkout is not proof that current pipeline scripts exist locally. [tasks.md](tasks.md) records the current source gap rather than hiding it with another clone.

## Source and product boundaries

Shared reusable work belongs in templates/<key> and the existing adapters/tools. templates.lock.json binds the selected qualified template release; an unfinished template edit does not automatically update existing dealers. Use the maintained creator/preparation, packaging and publisher tools, not another generator.

Canonical legacy dealer source is clients/<slug>, except registered independent repositories such as Al Reef, whose Git, identity and history remain independent. New compact packs use dealers/<slug> under the pipeline contract. Preserve dealer-specific facts, accepted customization, source/asset provenance, publishing-only fixes and stable remote/provider identities when integrating an update. Private CRM and outreach history belong in Agency OS, not public fleet source.

## Useful references

| Work | Read when needed |
| --- | --- |
| Current queue, source drift and next action | [tasks.md](tasks.md) |
| Dealer implementation | [WORKFLOW](docs/WORKFLOW.md) and the selected revision's dealer-pack pipeline |
| Facts, inventory and imagery | [LEAD-BUILD-GUARDRAILS](docs/LEAD-BUILD-GUARDRAILS.md), [LEAD-BRANDING](docs/LEAD-BRANDING.md) |
| Template release selection | [TEMPLATE-PROMOTION](docs/TEMPLATE-PROMOTION.md), templates.lock.json |
| Packaging/publication | [LEAD-PUBLISHING](docs/LEAD-PUBLISHING.md) and current pipeline |
| Visual/hosted checks | [QA](docs/QA.md) |
| Deployment records | [REGISTRY](docs/REGISTRY.md), docs/DEPLOYMENT-INVENTORY.json |
| Shared writes and source sync | [COORDINATION](docs/COORDINATION.md) |

## Practical verification and completion

Reuse maintained dependencies/previews and one bounded output per owner. A small visual change uses the affected route/interaction and relevant widths, with a useful matched comparison when needed; behavior/types use relevant checks; docs use links/workflow checks. Full production builds, broad journeys and fleet evidence belong at the integration/release checkpoint, not every iteration. The focused doc checker is node scripts/check-workflow.mjs; do not repeat the entire workflow suite unless executable behavior changes or release requires it.

Check actual source/remote drift before integration or publication, using one serialized selected-ref download only when needed. Set GIT_NO_LAZY_FETCH=1 for local Git reads and check physical capacity before a bulky download/build. Do not run a fetching portfolio-wide workspace doctor by default. Preserve local changes, index/locks, active jobs/previews, Git history, sessions, databases and recovery; no blanket stage/reset/clean/force push or duplicate repository/dependency copy.

Source prepared, built, deployed, publicly verified and owner accepted are separate facts. A fleet launch needs the real per-dealer host, correct identity/design journeys and relevant provider/runtime evidence for the selected revision; a purchased slot, passing synthetic test or prepared bundle is not a live site. Preserve failed/uncertain deployment ownership and reconcile the actual outcome before retrying. Publishing does not authorize outreach. Keep secrets/private data out of source and review prompts.
