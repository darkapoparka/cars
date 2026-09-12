# Cars

Open **Cars** for a new dealer, dealer fixes, research, the project registry or publication. Open the appropriate **cars-template-…** project to improve reusable frontend UI or code.

Keep the five projects. A reviewed template commit is promoted into Cars; new leads use that pinned release. Existing dealers stay independent until you request an update. You do not need to remember a manual copy step: the lead workflow checks releases and refuses unapproved or changed snapshots.

## Everyday requests

- In `cars-template-carwow`: “Polish the mobile inventory in this template. Preserve unrelated work and show the result.”
- In Cars: “Review the latest Carwow release and promote it when the checks pass.”
- In Cars: “Build [dealer] with the standard three designs using verified facts.”
- In Cars: “Continue Promosale Varna; keep its Auto Best, Import and Carwow designs.”
- In Cars: “Audit [dealer] only.” This does not publish or contact anyone.

Each dealer has **one source folder, three applications, one publishing repository, one Vercel project and one public origin**. The design button switches applications. New names use `cars-<dealerkey>`; recorded exceptions such as `excellent-cars` keep their identity.

## Start here

[Workflow](docs/WORKFLOW.md) · [Template releases](docs/TEMPLATE-PROMOTION.md) · [Publishing](docs/LEAD-PUBLISHING.md) · [Projects and evidence](docs/DEPLOYMENTS.md) · [Documentation index](docs/README.md)

Use Node 22.22+ or Node 24 for Cars tooling. Each app retains its own documented Node version and lockfile. Git, GitHub CLI (or a connected GitHub plugin), PowerShell for local launchers, and authorized Vercel access are needed for their respective operations. See [local setup](docs/LOCAL-SETUP.md).

```powershell
node scripts/template-release.mjs status
node scripts/template-release.mjs discover
node scripts/index-deployments.mjs --check
node scripts/check-workflow.mjs
node --test scripts/*.test.mjs
```

Before creating a new approved dealer, substitute its verified identity:

```powershell
node scripts/new-client.mjs --client example-dealer --repository darkapoparka/cars-exampledealer --preset standard --dry-run
```

The dry run checks identity, destinations and release integrity. Remove `--dry-run` only for the requested new dealer. Use `--preset import` for the intentional Import trio. A refusal for an unreconciled template is a release hold, not a request to overwrite local work.

For existing local source:

```powershell
./scripts/start-client.ps1 -List
./scripts/start-client.ps1 -Client promosale-varna -Plan
```

Progress belongs in the dealer's `dealer.json`, per-variant `.client/project.json`, client brief and technical registry. QA records exact commits, routes and dates. Owner review remains in [MANUAL-REVIEW](docs/MANUAL-REVIEW.md).

The three repository skills live in [.agents/skills](.agents/skills/): `cars-lead-build`, `cars-template-release`, `cars-publish`. [Web collaboration](docs/LOCAL-SETUP.md#web-collaboration) has the short GitHub read-entry instruction. See [migration evidence](docs/WORKFLOW-MIGRATION-2026-09-12.md) for the preservation record and remaining release holds.
