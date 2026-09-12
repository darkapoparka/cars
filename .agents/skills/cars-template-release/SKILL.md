---
name: cars-template-release
description: "Review and promote an immutable standalone automotive template release into Cars, with snapshot integrity and preserved client copies. Use for release discovery, reconciliation or promotion; not dealer publication."
---

# Template release

Read [TEMPLATE-PROMOTION](../../../docs/TEMPLATE-PROMOTION.md). The standalone repository owns shared polish. Cars owns reviewed snapshots and the single `templates.lock.json`.

Run `node scripts/template-release.mjs discover` for remote development heads and `status` for local approval/integrity. A status request stops at a read-only report. A newer main is a review candidate, not approval.

For an authorized promotion, confirm upstream repository, exact SHA and relevant QA; preserve uncommitted upstream and Cars-only changes. Dry-run `node scripts/template-release.mjs promote --key <key> --source-repo <path> --commit <sha>`. Read the complete diff and reconcile unique improvements upstream. Never bypass unexpected snapshot drift.

Verify that exact candidate using its retained runtime/lockfile and mobile/desktop evidence. Record commit-bound evidence; then apply the reviewed release with `--evidence <file> --write`. Run `verify --key <key>` and commit snapshot, lock, portable managed instructions and evidence together.

Existing dealers remain independent. This task does not redeploy them or contact leads. Report immutable pin/digest, checks, preserved work and any release hold. Keep model settings out of template/business metadata.
