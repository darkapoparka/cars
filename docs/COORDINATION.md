# Local and GitHub collaboration

## Current working agreement — 20 October 2026

Use this project's maintained checkout and working chat. Codex normally implements locally on main; Claude Code reviews a major scope or handles a named assignment when asked, with no routine competing implementation or portfolio dispatch. A central coordinator and extra skills are optional.

Astra ChatGPT web 6 Pro may plan, implement substantial architecture/tooling/backend work remotely on GitHub or review a major result. Astra may use GitHub main directly or an Astra branch while Codex owns coordinated local template/UI files. Reuse a suitable existing branch during transition and preserve old work; do not create a new clone/worktree or branch per task. Infrastructure/state refs used by the actual pipeline are not extra active source owners.

Agree the observable result, base revision, file scopes and relevant API/schema/configuration boundary briefly. A physical checkout has one HEAD; two different branch writers cannot share it concurrently. Coordinate only overlapping files and shared Git/index, dependency and build-output writes. Re-read shared files before patching and keep independent tasks moving.

At handoff, identify dirty files and unfinished commits, then release or transfer that specific scope. A perfectly clean tree, completion of all unrelated PRs or a sole-merger acknowledgement is not a prerequisite for every edit. Preserve other work; do not blanket reset, clean, stash, force-push or switch a checkout under an active writer.

Inspect the actual remote diff against current local source, obtain the selected ref once when needed and integrate without discarding changes. Refresh the maintained preview after integration so owner review sees the actual code. Reviews can use an exact supplied diff/revision before a main push when publishing would trigger deployment. PRs are optional review/transport, not a universal workflow requirement.

Set GIT_NO_LAZY_FETCH=1 before local Git reads when needed. A missing object is a source gap: arrange one serialized, capacity-checked checkpoint rather than repeated lazy downloads or a new clone. Keep broad Git status/index scans out of ordinary fleet checks; inspect the relevant files and selected refs. [The task queue](../tasks.md) records the actual local/remote gap for this transition.

## Finish the authorized task

Apply focused checks during iteration and the necessary broader release validation at a coherent checkpoint. Keep the existing dependencies, preview and one bounded output. Update the current task with actual implementation, integration, verification and next action. Source publication, provider activation, hosted proof and owner acceptance remain distinct.

A current rollout owner can provide concrete retained source, run and receipt evidence; old task titles and archived ownership are not perpetual locks. Current user scope determines the work. Historical September/October rollout assignments preserve provenance and are superseded as operating instructions by this agreement. No branch/worktree deletion, job cancellation, provider cleanup or outreach follows automatically from coordination.
