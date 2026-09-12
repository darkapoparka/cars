# Template releases and Cars snapshots

The authoritative reusable sources are the four `darkapoparka/cars-template-*` repositories. Their `main` branches are development heads. [templates.lock.json](../templates.lock.json) is the sole approval/version lock for Cars snapshots; [catalog.json](../catalog.json) owns keys, aliases, preview ports and discovery information, not a second approval list.

## Release flow

Polish in the standalone template project. Read its technical instructions, preserve concurrent work, review the changed UI, run suitable checks and commit only the approved change. Cars-only refinements must be compared and ported upstream selectively before replacement. Never promote an arbitrary newest commit or commit unfinished local UI to satisfy a release command.

```powershell
node scripts/template-release.mjs discover
node scripts/template-release.mjs status
node scripts/template-release.mjs promote --key import --source-repo J:/template-repos/cars-template-import --commit <40-character-sha>
```

The proposal fetches upstream refs, confirms repository/commit identity, exports immutable Git blobs using `cars-source-v1`, computes SHA-256 content digests and lists changes under `runtime/template-releases/`. It reports uncommitted upstream work separately and does not include it. A changed Cars snapshot is refused. Initial reconciliation requires a recorded baseline digest, not a bypass for unexplained drift.

Verify the exact candidate with its retained runtime/lockfile, relevant checks, and standalone browser evidence at mobile and desktop. QA JSON records `repository`, `commit`, `approved: true`, `verifiedAt`, `runtime`, passed `checks`, `standalone.mobile` and `standalone.desktop`. Record mounted support separately in `modes`; template checks do not prove a dealer mount.

```powershell
node scripts/template-release.mjs promote --key import --source-repo J:/template-repos/cars-template-import --commit <same-sha> --evidence docs/releases/<evidence>.json --write
node scripts/template-release.mjs verify --key import
```

The write rechecks drift and replaces only reviewed retained source paths, preserves excluded dependency/runtime/local metadata and keeps a recoverable previous copy in runtime. It updates snapshot and lock as one operation with rollback on errors. Review and commit the snapshot, evidence and lock together. Existing `clients/` copies are unchanged.

## Lock contract

Each entry has repository, immutable commit, optional release label, snapshot path, normalized content digest, export policy, runtime, supported modes and commit-bound QA evidence. Unreconciled holdings use `status: reconciliation-required` and `commit: null`; observed upstream heads are evidence, not approved releases. New-client refuses such entries.

Normalization preserves binary bytes and changes text CRLF to LF for consistent Windows/Git comparison. The export excludes credentials, dependencies, caches, deployment/CRM bindings and executable inherited agent instructions, retaining source, lockfiles, licenses and provenance. Snapshot AGENTS identifies managed ownership. See `scripts/lib/workflow.mjs` for the versioned policy.

The lead workflow discovers available updates automatically and verifies the selected lock before copying. Discovery can prompt release review; it never silently changes the selected version. No owner reminder to manually copy files is required.

## Client trial improvements

Extract the reusable change into the authoritative standalone template while preserving the dealer copy. Remove dealer identity from the reusable change, verify it, then follow this release flow. Do not copy an entire dealer over a template or sync templates over existing dealers. The [Rencar reference](reference/RENCAR-PROMOTION.md) preserves its older, separate trial procedure.
