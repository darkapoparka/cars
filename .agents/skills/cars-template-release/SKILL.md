---
name: cars-template-release
description: "Review and select an immutable Cars template subtree release for dealer reuse. Use for release discovery, reconciliation or approval; not dealer publication."
---

# Template release

Read [TEMPLATE-PROMOTION](../../../docs/TEMPLATE-PROMOTION.md). The editable masters are Cars templates/<key> on main. Former standalone repositories are recovery/history sources. Cars owns the single templates.lock.json release selection.

Use `node scripts/template-release.mjs discover` and `status` to distinguish current development, approved source and incomplete evidence. A newer main is a review candidate, not automatic dealer adoption.

For an authorized release, preserve dirty work, verify the actual template, and finish its scoped Cars main commit/push. Use `approve --key <key> --commit <sha>` to inspect its immutable subtree without creating another copy. Supply exact-source evidence and `--write` only when the required checks pass. Native localization requires its complete acceptance and matching hosted evidence; never reuse old proof under a new SHA. Commit the lock and QA together and run `verify --key <key>`.

Existing dealers remain unchanged until explicitly updated. Template approval does not deploy them or contact leads. Report actual source/QA/deployment facts and any missing evidence. Do not make the owner track SHAs or manually synchronize folders.
