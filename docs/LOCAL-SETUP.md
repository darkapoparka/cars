# Local setup and web collaboration

Use the existing Cars project at `J:/cars` and standalone template projects at `J:/template-repos/cars-template-*`. Do not create nested Git repositories inside Cars snapshots. Use the saved project directly for Cars work.

Cars scripts require Node 22.22+ or Node 24, Git and PowerShell for Windows launchers. Templates retain their own runtimes/lockfiles: Auto Best uses Node 22, Modern Node 22.22+ below 23 and pnpm 11.4.0; check each locked Carwow/Import release. The installed global pnpm is not automatically the app's pinned version. Use the app's Corepack/packageManager entry.

Check authenticated GitHub and Vercel access using the connected plugins or `gh auth status` and the documented Vercel CLI. Never put credentials in repository files. A disconnected plugin can be reported while authenticated Git/CLI continues the requested work. Existing Git-to-Vercel links remain the sole deployment trigger for a pushed commit.

## Codex instructions and skills

The root AGENTS routes tasks; each standalone repository has its own template instructions. Cars skills are checked in under `.agents/skills/`. Run `node scripts/check-workflow.mjs` to validate metadata, paths, command help and discovery location. In the app/CLI, confirm the three skills appear; reopen/restart if the list has not refreshed. File validation alone does not prove a different web session installed them.

No project model override or approval/sandbox change is needed. Keep model choice in user Codex preferences. Do not add business-manifest model strings or change application API models for an instruction cleanup.

Official references: [local skills](https://developers.openai.com/codex/skills/), [AGENTS discovery](https://developers.openai.com/codex/guides/agents-md/), [Astra guidance](https://developers.openai.com/api/docs/guides/latest-model). The current guidance favors precise task boundaries and resolving conflicting instructions; this repository records its own concrete workflow rather than copying a model manual.

## Web collaboration

Use this short project instruction in a GitHub-connected web conversation:

> For Cars work, read current darkapoparka/cars AGENTS.md and docs/README.md through GitHub, then the relevant workflow or template reference. Preserve exact repository, branch and commit identity. Local uncommitted files and local Codex skills are not automatically available here. Pass completed work back through committed repository state with owned paths, checks, deployment identity and remaining gaps.

No plugin installation is required to establish repository-scoped local skills. A shared distributable plugin can be added later if actually needed.
## Dealer folders in the single main checkout

Cars uses a sparse checkout on this space-constrained machine. Every canonical dealer is on GitHub main even when its application folder is not expanded locally. The registry links to main; archived branch names are never required to find source.

Before working on a dealer that is absent locally, verify free disk space and run from Cars:

```powershell
git fetch origin
git status --short --branch
git sparse-checkout list
git sparse-checkout add /clients/<existing-slug>/
```

Use the existing slug from the registry; do not clone or create a replacement. Then run the documented start-client preparation and refresh local presence with `node scripts/index-deployments.mjs --write`. When sufficient space is available, `git sparse-checkout disable` materializes the complete main tree. It required about 13 GB of additional file content at consolidation, plus working space for dependencies/builds.

Current default: routine Cars/template tasks use main in their saved checkout. See [coordination](COORDINATION.md) for one-writer and completion rules.
