# Cars workflow migration — 12 September 2026

Cars owns canonical dealer source, integration, technical records and release snapshots. The four standalone template repositories own reusable frontend work. A dealer receives three applications in one publishing repository and one Vercel project: Auto Best / Modern / Carwow, or the intentional Auto Best / Import / Carwow setup.

## Implemented surfaces

- Short root instructions, task-specific workflow/release/publish/QA/setup/coordination/registry references, and the owner quick start in the root README.
- Three repository-scoped skills in `.agents/skills`. The local Codex app-server `skills/list` returned all three as enabled repository skills; no model or personal settings were changed.
- Immutable release locks, normalized snapshot integrity, discovery separated from promotion, preflight duplicate/alias checks, and portable dealer guidance.
- Deterministic publishing packages with both trios, retained shared assets, mounted-path helpers, Services output correction and the actual design switcher. The exporter compares the actual remote and refuses unexplained publishing-only changes and remote races.
- One technical registry generates the readable deployment list, project index and dashboard state. Source, personalization, builds, deployments, browser checks and owner review remain separate. Eleven prior lead IDs and nineteen historical candidate records were retained.
- All four standalone instruction/reuse/QA sets route dealer work to Cars. Historical imported AGENTS filenames were renamed so they cannot be loaded as active nested instructions. Technical, license and provenance references remain available.

## Preservation and audit scope

The initial inventory covered 3,114 Markdown files in Cars, 34 in Auto Best, 134 in Modern, 54 in Carwow and 15 in Import. The [documentation disposition map](README.md#disposition-map) distinguishes active guidance, generated views, technical references and history. Original indexes, refs, document bytes and hashes are retained locally in `runtime/workflow-overhaul-20260912/`.

Cars began on local main `adc16cc3e3ae430c1f53e64dd7086ce632e29e38`, behind fetched main `a2f2975a0aa362dce2c66472f202dd0548dc8b1b`, with 9,393 staged paths and extensive unstaged/untracked work. Commits are constructed with a separate index and reviewed paths. No blanket staging, reset, clean, force push, branch deletion or additional Cars worktree is part of this migration. Modern's existing `astra` branch and unfinished template refactors remain owner work.

The GitHub plugin returned `USER_NOT_LOGGED_IN`. Authenticated local Git/gh provided repository access; the Vercel connector provided live deployment records. No credentials were written to source.

## Bounded validation

The workflow tests exercise source integrity, duplicate identities, both trios, excluded files, repeatable packaging, mounted URL behavior, Services output, remote ancestry and remote-advance rejection. Command-help/link checks and actual local skill discovery are separate evidence.

The Import release pilot uses a reviewed immutable upstream commit. A failed external Audi sample photograph returned 404; the release uses the existing illustrative A7 cutout. This is template fixture media, not verified dealer stock. The candidate passed Svelte checking with zero errors/warnings, production build, and mobile/desktop route checks. Exact release/digest/evidence lives in [templates.lock.json](../templates.lock.json).

Promosale Varna is the existing dealer pilot. Its canonical retained source was compared with fetched Cars main across 3,267 tracked paths before adding portable instructions and the manifest. Its existing publishing history includes the Carwow static-asset mount fix and Svelte Services output correction; these must survive the reproducible package. The pilot uses the existing project's preview branch. Exact export/deployment/browser results are recorded in the technical registry when verified.

## Remaining release work

Auto Best, Modern and Carwow retain explicit release holds while existing Cars-only changes, unfinished standalone work and owner visual review are reconciled. The workflow refuses to call these arbitrary development heads approved. Existing dealers remain independent and are not synchronized or redeployed by template promotion. Template polish and individual release approval can proceed in their standalone projects.

Historical application QA is not upgraded to current hosted proof. Dealer approval, external form delivery, private CRM synchronization and outreach are not implied. No portfolio deployment or lead contact is part of this migration.

Original specifications: [workflow review](WORKFLOW-REVIEW-2026-09-12.md) and [Codex handoff](CARS-WORKFLOW-CODEX-HANDOFF.md). Current instructions are linked from [the documentation index](README.md).
