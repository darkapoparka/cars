# Working across projects

Use Cars for dealer/integration work and the relevant standalone repository for shared template work. One agent owns a checkout's writes, index and build output at a time. Other work can review read-only or use a different standalone repository. The historical ten-session campaign is closed; do not resume its allocations.

Before edits record physical path, remote, current branch/HEAD, relevant staged/unstaged/untracked paths and active listeners. Preserve unique branch history. Fetch is safe to inspect; a pull/merge is a separate integration decision when local work overlaps. Read remote handoff files using `git show origin/main:<path>` before integrating.

Do not solve an occupied index with blanket staging or a new Cars worktree. Use exact owned paths and a temporary index for an object-only scoped commit when necessary. Keep remote ancestry current and use non-force updates. Never delete branches merely because their names are old; first establish containment, unique commits and owner disposition.

A resumable handoff records repository/path, branch, base/head SHA, owned paths, actual checks, dirty/unique work preserved, exact deployment identity when relevant and the next concrete action. Conversation memory is context, not source authority. [Migration record](WORKFLOW-MIGRATION-2026-09-12.md) captures the starting histories.
