# Bounded immutable-source reads and migration review output

The existing 25-dealer six-design rollout uses the preservation-aware updater. On this Windows workspace, its repeated short-lived Git reads and per-file review diffs dominated candidate preparation.

The pinned reader now checks object sizes once, reads at most 512 files or 32 MiB per ordinary batch, and computes the unchanged canonical normalized source digest from those same verified bytes. It still validates exact commits, source paths, binary bytes, fingerprints and historical App evidence. A 530-file regression checks equality with the previous canonical fingerprint function.

Human-readable diffs now emit an exact nonminimal context hunk in-process for ordinary UTF-8 files. Binary and oversized display notices retain their existing exact-hash behavior. Real three-way merges still use Git; conflict decisions, complete candidate bytes, preservation checks, reviewed-run hashes and installation gates are unchanged. Tests cover insertions, deletions, separated changes, final newlines, conflicts and a full merge beyond 16 MiB.

The targeted pinned-reader and three-way updater suites pass 32 tests, zero failed. Log: runtime/vercel-six-rollout-20261010-execute/fast-reader-review-tests.log. The earlier broader workflow result remains documented separately; this change does not claim the unrelated UK frozen-source tests pass or that any dealer has been deployed.