# Working across projects

## Current fleet ownership — 11 October 2026

The owner assigned the current rollout chat (`01a12a02-c755-77c3-b78c-c95e7a55f22d`) the existing Vercel dealer migration and Varna intake under the [six-design single-Worker contract](FLEET-ROLLOUT-2026-10-11.md). “Investigate UK template issues” (`01a129cc-4669-7e43-9a95-c59285328e32`) retains active shared template/local-preview and overlapping generator fixes. Finish and hand off exact source/checks before serializing template promotion and fleet writes. This supersedes the historical per-design-Worker counts below; current capacity must be read live. Provider inventory/source readiness and workflow/intake work may proceed independently. No billing/DNS/deletion operation is implied.

Use the saved Cars main checkout for dealer/tooling work and shared template work in templates/<key>. Cars Admin and registered independent dealers retain their own repositories.

## Main is the working branch

The owner chose a main-only workflow on 13 September 2026. Use the saved checkout on `main` for routine work. Do not create another branch or worktree unless the owner explicitly requests one. Independent tasks may edit disjoint files in the same checkout. Coordinate overlapping files and serialize shared Git/index, configuration and build-output writes; continue unrelated work without waiting for acknowledgements. Inspect the relevant dirty state before editing and preserve other tasks' work. Fetch and review ancestry before integration/publication; commit and push when included in the authorized task.

An explicitly requested temporary branch/worktree must be integrated, verified and removed before the task is called complete. If blocked, record its exact repository, ref, commit, paths and next action in the handoff. Do not leave unfinished source discoverable only through a task title or old branch. Source consolidation preserves work; template release, owner visual acceptance and dealer deployment keep their separate checks.

## Start and finish

At task start confirm the checkout, branch and relevant dirty/staged paths. Inspect remotes, worktrees and fetched ancestry when integration or publication requires them; do not repeat the full preflight for every edit. Re-read shared files before patching. Pause only a concrete conflicting write. An audit is read-only unless fixes are requested.

Complete the requested change and proportionate checks. Commit and push scoped work when included in the authorized task; a local fix does not need a separate publication ceremony. Report actual results and material remaining acceptance work briefly. Preserve unrelated work and resolve overlapping edits deliberately. Do not use blanket reset, clean, stash or checkout to hide a dirty state.

Before removing any authorized temporary branch, verify `git merge-base --is-ancestor <branch> main`; check its worktree for staged, unstaged and untracked work. Delete remote branches only after main is pushed and verified. Never infer source loss from a missing local folder in a sparse checkout.

Historical campaign branches and prompts are provenance, not active instructions. Their source is now on main. See [consolidation](MAIN-CONSOLIDATION-2026-09-13.md) and [local setup](LOCAL-SETUP.md).


## Active Cloudflare UK release — 11 October 2026

The owner explicitly requested refreshing and deploying the ten UK leads to the latest six approved designs. Scope is exactly the ten `cars-uk-*` identities in `leads/uk-2026-10-10-build-manifest.json`. Latest qualification run: `38084379432`; preservation-aware source refresh run: `38086503433`. Each dealer currently needs six internal Workers and one public router (70 new Workers total); this is a coordination notice, not provider-side quota reservation. A live account read at 2026-10-10 21:22 UTC found 13 existing Workers including the separate DM Auto Varna pilot and no UK Workers. Recheck shared account capacity before any overlapping bulk rollout. Do not delete other releases or upgrade billing implicitly. UK delivery uses the existing authenticated Wrangler profile and exact artifact/source/export receipts; it does not modify Varna or existing Vercel releases. Current request/build progress is retained in `runtime/uk-latest-build-pipeline-20261011.jsonl`.

UK resume 2026-10-11 06:20 UTC: completing exactly Broadbent, Motors Castle, Trade Car Sales, Square One and AS Motor Group with single-Worker packaging from retained corrected builds 3809657*. Scope is UK only. Account observed 98 scripts. Retire only AS Motor Group superseded private internals after six-route browser verification and current public Worker bindings readback; no Bulgarian deletes/billing changes. Evidence: runtime/uk-resume-20261011.
