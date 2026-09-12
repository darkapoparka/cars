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
