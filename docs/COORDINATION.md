# Working across projects

Use Cars for dealer/integration work and the relevant standalone repository for shared template work.

## Main is the working branch

The owner chose a main-only workflow on 13 September 2026. Use the saved checkout on `main` for routine work. Do not create another branch or worktree unless the owner explicitly requests one. One task owns writes to a checkout; concurrent tasks may review read-only or work in a different repository. Fetch and inspect status before writing, preserve other tasks' work, and finish authorized implementation with scoped commits and a non-force push to main.

An explicitly requested temporary branch/worktree must be integrated, verified and removed before the task is called complete. If blocked, record its exact repository, ref, commit, paths and next action in the handoff. Do not leave unfinished source discoverable only through a task title or old branch. Source consolidation preserves work; template release, owner visual acceptance and dealer deployment keep their separate checks.

## Start and finish

Before edits confirm the physical checkout, `git remote -v`, `git branch --show-current`, `git status --short --branch`, `git worktree list`, and current fetched main. Do not start another writer in the same checkout. When a task only audits, keep it read-only.

Implementation ends with the scoped change on main, appropriate checks, a non-force push and a handoff stating any unfinished acceptance work. Preserve unrelated work and resolve overlapping edits deliberately. Do not use blanket reset, clean, stash or checkout to hide a dirty state.

Before removing any authorized temporary branch, verify `git merge-base --is-ancestor <branch> main`; check its worktree for staged, unstaged and untracked work. Delete remote branches only after main is pushed and verified. Never infer source loss from a missing local folder in a sparse checkout.

Historical campaign branches and prompts are provenance, not active instructions. Their source is now on main. See [consolidation](MAIN-CONSOLIDATION-2026-09-13.md) and [local setup](LOCAL-SETUP.md).
