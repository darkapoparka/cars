# Import template instructions

This is the authoritative reusable master: darkapoparka/cars-template-import. The current user request determines scope. Preserve the existing rendered design unless the requested shared improvement changes it.

## Task routing

- Shared template frontend/code work: work here, keep changes reusable, and read only the relevant architecture/style/QA reference.
- Dealer build or correction: use canonical clients/<slug>/ in [Cars](https://github.com/darkapoparka/cars), through its workflow. Do not personalize this master.
- Template release: follow [Cars integration](docs/CARS-INTEGRATION.md); promotion selects an exact reviewed commit and leaves existing dealers independent.
- Audit/status: inspect without edits or publication unless fixes are requested.

Read [TEMPLATE](TEMPLATE.md) for runtime/content boundaries and [docs/QA.md](docs/QA.md) when verification needs it. [Cars integration](docs/CARS-INTEGRATION.md) owns the cross-repository contract. Do not load every historical task ledger or resume its backlog.

## Implementation and preservation

Confirm physical checkout, remote, current branch/HEAD, relevant dirty paths and listener ownership. One writer owns the checkout/index/build output. Preserve unrelated staged, unstaged, untracked and unique branch work; no blanket staging, clean/reset, deletion of unmerged work or force-push. Keep existing lockfiles, runtime, licenses and provenance. Do not switch a working branch or overwrite a Cars snapshot merely to synchronize it.

Use the release-documented Node runtime and retained npm lockfile. Keep source ownership at `src/lib/data/daynight.ts`, `src/lib/data/daynight-listings.json`, `src/lib/data/vehicles.ts`, `src/lib/styles/`, `static/`. Reuse actual components and data boundaries. Preserve the existing route and interaction contracts.

Check the changed behavior at relevant mobile/desktop widths and run proportionate existing checks. A full source release needs exact-commit evidence; a local success or prior audit does not prove mounted/public behavior. Forms are demos until real delivery is configured and verified. Do not contact leads.

Commit only reviewed task-owned changes when authorized. Template polish does not authorize dealer deployment. Report changed paths/commit, actual checks, preserved work and remaining limits. Workflow command/compatibility changes update their authoritative references and relevant tests together.
## Main is the working branch

The owner chose a main-only workflow on 13 September 2026. Use the saved checkout on `main` for routine work. Do not create another branch or worktree unless the owner explicitly requests one. One task owns writes to a checkout; concurrent tasks may review read-only or work in a different repository. Fetch and inspect status before writing, preserve other tasks' work, and finish authorized implementation with scoped commits and a non-force push to main.

An explicitly requested temporary branch/worktree must be integrated, verified and removed before the task is called complete. If blocked, record its exact repository, ref, commit, paths and next action in the handoff. Do not leave unfinished source discoverable only through a task title or old branch. Source consolidation preserves work; template release, owner visual acceptance and dealer deployment keep their separate checks.
