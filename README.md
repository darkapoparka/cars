# Cars Studio

Dealer templates, public lead research, dealer source and publishing tools live in this repository, darkapoparka/cars. Work in L:/CODEX/cars; J:/cars and L:/PLATFORMS/cars-studio resolve here. The separate consumer marketplace is darkapoparka/cars-app-mobile.

Start with [AGENTS.md](AGENTS.md), [the current task queue](tasks.md), then [the relevant procedure](docs/README.md). Codex normally works locally in this project chat; Claude reviews large scopes when asked. Optional Astra GitHub implementation can use main directly or an Astra branch alongside coordinated local UI/template work, then integrate into the maintained checkout for local review. No required central orchestrator, per-task PR or extra clone.

## Source map

| Area | Purpose |
| --- | --- |
| templates/<key>/ | Reusable template source; selected releases are pinned in templates.lock.json |
| clients/<slug>/ | Maintained legacy dealer source and registered independent dealers |
| dealers/<slug>/ | Compact expansion packs in the current GitHub pipeline; present after source sync |
| leads/ | Public research, lead identities and dated source evidence |
| scripts/ | Existing creation, qualification, packaging and publishing tools |
| runtime/ | Bounded generated packages/checks; not permanent duplicate source |
| docs/DEPLOYMENT-INVENTORY.json | Technical deployment records, distinct from current live acceptance |

Current delivery is six designs (Auto Best, Modern, Import, App, Mobile, Signature) through one Cloudflare Worker per dealer and one public origin. Old Carwow/trio/five-design workflows are historical. Template edits do not automatically refresh dealer sites; dealer integration preserves each identity, facts, assets and accepted customization.

## Local review and release

Use Cars.code-workspace and the selected template's actual runtime/commands. Existing local commands include:

```powershell
$env:GIT_NO_LAZY_FETCH='1'
node scripts/template-release.mjs status
Get-Help ./scripts/start-preview.ps1 -Detailed
node scripts/new-client.mjs --help
```

Keep the existing preview when it serves the actual source under review. Check a free port before starting another and preserve other owners' runtimes. For source integration, inspect the selected remote diff once, reconcile local work and refresh the preview. Run focused checks while editing and the necessary wider release pass once per coherent checkpoint.

The current expansion implementation and build/deploy recipe are in the selected revision's [dealer-pack pipeline](https://github.com/darkapoparka/cars/blob/main/docs/PIPELINE.md). [tasks.md](tasks.md) records the dated local/remote source gap. Do not run a current remote recipe against missing local scripts or create another whole checkout to avoid source reconciliation.

Production/lead-preview acceptance requires the actual host, correct dealer identity and all selected design journeys plus relevant provider/runtime results. Keep source prepared, deployed and verified separate. No outreach follows automatically from publication.

[WORKFLOW](docs/WORKFLOW.md) covers legacy dealer work, [TEMPLATE-PROMOTION](docs/TEMPLATE-PROMOTION.md) release selection, [LEAD-PUBLISHING](docs/LEAD-PUBLISHING.md) legacy publication, and [COORDINATION](docs/COORDINATION.md) practical local/GitHub collaboration. [PLAN.md](https://github.com/darkapoparka/cars/blob/main/PLAN.md) is the completed September template-organization plan, not the current queue.
