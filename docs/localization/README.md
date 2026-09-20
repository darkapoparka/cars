# Cars localization: repository handoff

Start with [the executable rollout request](../prompts/LOCALIZATION-ROLLOUT.md).

All handoff inputs are stored in this repository. No chat attachment, download,
previous session sandbox, or new application copy is required.

- `rollout-kit/`: extracted TypeScript policy candidate, configuration, tools,
  tests, compiled fixtures, unapplied patch, and original execution evidence.
- `rollout-kit/candidate/change-manifest.json`: exact original source and patch hashes.
- `rollout-kit/evidence/fleet-audit.json`: dated 25-dealer entry audit, not current deployment proof.
- `IMPORT-MANIFEST.json`: provenance and imported-file hashes.
- `STORAGE-VERIFICATION.json`: verification of this repository handoff.

This handoff stores implementation inputs; it does not install the candidate,
localize the standalone templates, or deploy a dealer. The existing accepted
Al Reef EN/BG implementation is the integration reference. The kit's historical
receipts must not be represented as framework or production acceptance.

Current source instructions are in root `AGENTS.md`. The rollout prompt names
all permitted dealers, canonical checkouts, test requirements and release limits.
