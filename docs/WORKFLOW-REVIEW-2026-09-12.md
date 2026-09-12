# Cars workflow review — start here

Recorded: 2026-09-12.

## Status and scope

This document and [CARS-WORKFLOW-CODEX-HANDOFF.md](CARS-WORKFLOW-CODEX-HANDOFF.md) publish the preceding workflow audit and implementation proposal for local Codex. The handoff retains the original audit observations and source references.

These are documentation additions, not an implemented migration. This publication does not install skills, change application code, synchronize template snapshots, reconcile branches, move or delete folders, update deployment status, or deploy sites. The existing active instructions have not been rewritten by this publication; reconcile them deliberately during implementation rather than treating this review as evidence that the proposed tooling already exists.

GitHub `cars/main` was checked at `39a19af3ec6e60a707d8427942dbdbb528aea832` immediately before adding the handoff. Local checkout counts and template commit IDs in the handoff are historical audit observations and must be refreshed before editing. No local filesystem or staging-area changes were made to publish these documents; they were added through GitHub.

## Read order for this task

1. Read the current root [AGENTS.md](../AGENTS.md) for preservation and scope boundaries.
2. Read this review and the [full implementation handoff](CARS-WORKFLOW-CODEX-HANDOFF.md).
3. Inspect the current local changes and the actual scripts before changing workflow documentation or code.
4. Consult the existing [workflow](WORKFLOW.md), [publishing guide](LEAD-PUBLISHING.md), [template-promotion guide](TEMPLATE-PROMOTION.md), and [catalog](../catalog.json) where they govern the affected operation.
5. Read each affected standalone template's own instructions before editing that repository.

Do not resume historical lead-build campaign assignments merely because their prompts remain in the repository.

## Audit conclusions to implement

| Area | Observed issue | Recommended resolution |
| --- | --- | --- |
| Template ownership | Cars and standalone template instructions both describe editable masters; committed implementations differ. | Make the four standalone template repos authoritative after reconciling unique work. Treat Cars template folders as managed snapshots of approved commits. |
| New dealer creation | `new-client.mjs` copies local templates, not current standalone upstream versions. | Add a release lock and automatic integrity/preparation checks; do not promote arbitrary development heads. |
| Existing dealer ownership | Publishing checkouts contain fixes that may not be in canonical client source. | Backport those fixes or capture them in reproducible packaging before the next export. |
| Import variants | Local export and deployment-index helpers omit `import`. | Support actual per-dealer variant manifests, including Promosale and OutletCars. |
| Publication | Deployment helpers are outside versioned Cars tooling and depend on an absolute Excellent Cars path. | Version the portable switcher and packaging recipe in Cars; preserve remote history and existing project identities. |
| Instructions | Generated client instructions use absolute Windows paths; old campaign rules remain mixed with current workflow. | Make dealer guidance portable and root instructions concise; keep historical rules clearly superseded. |
| Project status | Local records are historical; source presence and hosted verification are different facts. | Evolve one technical registry and derive the dashboard/readable list from it. |
| Coordination | Local Cars and template checkouts have substantial existing edits and differing histories. | Preserve first, reconcile deliberately, and use one writer per checkout/index/build output. |

The recommended daily split is: open the appropriate standalone template project for reusable frontend improvements; open Cars for dealer builds, dealer corrections, research, dashboard work, and publication. Existing dealers do not automatically receive newer template code.

Keep one private publishing repository and one Vercel project per dealer. Preserve existing names, domains, history, and offered designs. Standard routes remain `/`, `/variant-2/cars`, and `/variant-3/`; Import-based trios retain `/variant-2/` for Design 2. Do not rename the existing Excellent Cars resources.

## Owner clarification: complete documentation and AI-workflow overhaul

The owner clarified that the local task must rework the documentation and operating workflow as a whole so future dealer builds are easy. Do not stop after adding another review, plan, or handoff. Create or update the actual instructions, skills, supporting scripts, tests, and owner-facing usage guide. Creating those deliverables is part of the implementation task; the owner does not need to write separate AI documents first.

This expands documentation coverage, not permission to redesign dealer sites, replace every source file, discard local work, publish the whole portfolio, install unrelated integrations, or contact leads. The original handoff's preservation and bounded-pilot requirements still apply.

### Audit all guidance; rewrite what should govern future work

Inventory the relevant Markdown and instruction/configuration files across Cars and the four standalone template repositories. Include root/nested `AGENTS.md` and `AGENTS.override.md`, `README.md`, `TEMPLATE.md`, reuse/build/QA/deployment docs, existing skill definitions, generated client instructions, catalog/registry documentation, old campaign prompts, and referenced architecture/design/runbook files. Exclude dependency folders, caches, generated build output, and third-party/vendor trees from routine rewriting.

Classify each file as active policy, technical reference, generated output, historical evidence, or duplicate/superseded guidance. Record a compact disposition map in the documentation index or migration summary; do not create another large planning hierarchy. Preserve accurate technical material. Historical audits, license notices, provenance, dated evidence, and old acceptance results must not be rewritten to look current. Archive or clearly label obsolete operational directions, repair links, and remove them from the active read path. Do not blindly move an old `AGENTS.md` into an archive where it can still be discovered as executable guidance; preserve historical copies under clearly non-active names where needed.

After reconciliation, each rule should have one authoritative home. Other documents should link to it rather than maintaining slightly different versions. Audit client/publishing instruction copies for stale master ownership and broken absolute paths, but do not rewrite every dealer's application or republish sites just to normalize documentation.

### Required end-state documentation surfaces

These are implementation targets, not a claim that every path already exists. Reuse correct existing documents and equivalent paths instead of creating unnecessary duplicates.

| Surface | Required responsibility |
| --- | --- |
| Cars `README.md` | Owner quick start: which project to open, common tasks, actual runnable commands, and where progress/evidence is recorded. |
| Cars `AGENTS.md` | Concise repository ownership, task routing, preservation boundaries, completion expectations, and links to the relevant procedure. Do not make every task read every document. |
| Cars `docs/README.md` or existing documentation index | Current entry points, authoritative policy locations, technical references, and clearly separate historical material. |
| Cars `docs/WORKFLOW.md` | End-to-end new-lead and existing-lead procedures: identity/duplicate resolution, approved template selection, real fact/assets/inventory pack, personalization, QA, publication, and records. |
| Cars `docs/TEMPLATE-PROMOTION.md` | Approved upstream release to managed Cars snapshot; exact commit/integrity recording, dirty-state protection, client-to-master improvement reconciliation, and no automatic overwrite of existing clients. |
| Cars `docs/LEAD-PUBLISHING.md` | Actual supported export/package/push/verify procedure; existing remote-history preservation; standard and Import trios; FAB; exact source and deployment evidence. |
| Cars lead/QA/coordination references | Source-backed branding and content, focused framework/browser checks, preview limitations, and one-writer ownership plus resumable cross-agent handoff. Reuse existing guardrail documents where suitable. |
| Each standalone template's `AGENTS.md`, `TEMPLATE.md`, reuse and QA docs | Authoritative reusable-master identity, actual runtime/lockfile/commands, real personalization boundaries, standalone/mounted compatibility, frontend preservation, and routing dealer work back to Cars. |
| Generated dealer guidance | Portable instructions for an independent personalized copy, correct variant commands and source-version references; never inherit instructions declaring the dealer copy a reusable master. |
| Technical registry and generated dashboard/deployment list | Actual per-dealer variants, source/template/export commits, public URLs, and distinct personalization/build/deployment/live-QA/owner-review evidence. Preserve unknowns. |

### Small, functional AI instruction layer

Implement the proposed Cars repository skills in `.agents/skills`: `cars-lead-build`, `cars-publish`, and `cars-template-release`, unless inspection reveals an existing equivalent that should be reused. Give each a narrow description, explicit task boundaries, minimum necessary references, and an honest completion/reporting contract. Do not add a generic `AI.md`, a competing `SKILLS.md`, a duplicate Astra rulebook, or mandatory agents/plugins merely to increase file count.

Keep durable conventions in `AGENTS.md`; put reusable task procedures in skills and deterministic copying, validation, indexing, and publishing in tested scripts. Use nested instructions only for genuinely different subtree requirements. Check whether existing global/nested overrides would conflict; report owner-wide settings rather than silently changing them.

Document a minimal, non-secret local setup for required tools and authorized GitHub/Vercel access. Add or update project `.codex/config.toml` only for settings actually needed and supported by the installed Codex version. Do not weaken approval/sandbox rules, invent a model slug, commit tokens, or overwrite personal configuration. Model selection and general OpenAI product guidance are not dealer business data. Consult current official OpenAI docs or an available official docs skill when working on Codex/OpenAI configuration; do not vendor the whole API manual or require OpenAI model research during each ordinary dealer build.

Official reference entry points checked for this clarification (refresh when implementing product-specific settings):

- https://developers.openai.com/codex/guides/agents-md
- https://developers.openai.com/codex/skills

Opening a repository does not implement this refactor. The implementation task must actually create/update these files, verify the relevant instructions and skills are discoverable in the local Codex environment, and test that the skills invoke working commands. A local skill file is not evidence that this ChatGPT web project has installed the same skill; retain a short GitHub-based read-entry instruction for web collaboration.

### Completion means a working workflow, not just rewritten prose

Verify links and paths in the active docs, command help/examples against the real scripts, instruction ownership, and skill metadata/discovery. Trace each documented operation to implementation or clearly label it unavailable; do not document planned commands as working ones. Keep verification proportional to changes: a documentation edit does not require rebuilding every dealer.

Add focused checks for duplicate/alias protection, approved-template integrity and unexpected drift, idempotent packaging, secrets/generated-file exclusions, preservation of target remote history, both supported trio types, and registry consistency. Verify normal dealer prompts choose the correct workflow, while a read-only status request and a template-only polish request do not trigger dealer publication. Use mocked/fixture checks for negative cases rather than changing live dealer resources.

Prove the workflow with the bounded template/dealer pilot in the full handoff. Keep cloud writes within the agreed pilot authorization; no mass deployment or external test enquiries. For any hosted claim, verify the exact intended commit/deployment, actual public routes/assets, and deployed FAB, not only a successful build or an older READY version.

The owner should then be able to request a new dealer, a dealer correction, a template polish, or an approved template release without restating the architecture. Unknown business facts, unavailable access, ambiguous identity, and conflicting edits must still be surfaced honestly. New builds use approved templates; a new development head must not silently become approved.

Once implementation is complete, mark these review/handoff documents historical and point to the active workflow. Routine tasks should not need to reread the migration review. Include a short maintenance rule: changes to workflow commands, template compatibility, or publication behavior must update their authoritative docs and relevant tests in the same change.

## Retrieve safely in the current local checkout

The preceding audit found divergent local/remote Cars commits and a large existing staging area. Do not start by resetting, cleaning, switching branches, or blindly pulling/rebasing.

These commands retrieve and read the new documents without merging them into the checkout or staging them:

```powershell
git -C J:/cars fetch origin main
git -C J:/cars show origin/main:docs/WORKFLOW-REVIEW-2026-09-12.md
git -C J:/cars show origin/main:docs/CARS-WORKFLOW-CODEX-HANDOFF.md
```

Then inspect branch identities, remotes, staged/unstaged/untracked changes, and unique commits. Integrate the documentation and other remote history using a reviewed plan that preserves local work. If files at these new paths already exist locally, compare them rather than overwriting them. No blanket commit of the existing index is part of this task.

## Suggested local Codex task

> Fetch `origin/main` and read `docs/WORKFLOW-REVIEW-2026-09-12.md` and `docs/CARS-WORKFLOW-CODEX-HANDOFF.md`; use `git show` if they are not yet in the checkout. Implement the complete workflow and documentation overhaul, not another plan. First refresh repository state and preserve all staged, unstaged, untracked, and unique branch work. Audit the relevant guidance across Cars and all four standalone template repositories; consolidate active instructions, retain accurate technical references, and archive or mark obsolete guidance without destroying evidence. Keep the standalone templates authoritative after reconciliation, Cars templates as approved managed snapshots, and dealer implementations canonical under Cars client folders. Create or update the scoped skills, portable generated dealer guidance, runnable clone/release/publish helpers, tests, registry, and owner quick start. Reuse existing tools and reconcile publishing-only fixes; support both standard and Import trios. Verify instruction/skill discovery, documentation links, command examples, and a bounded pilot. Preserve existing repository names, public URLs, and remote history. Do not contact leads or mass-upgrade/deploy the portfolio. Commit only reviewed task-owned changes to their proper repositories and report exact commits, verified commands, checks, and remaining gaps.

## Implementation acceptance checklist

These boxes describe future work; they are deliberately not marked complete by this documentation commit.

- [ ] Existing local work and unique histories preserved and reconciled.
- [ ] Relevant documentation/instruction inventory completed across Cars and the four template repositories; active, reference, generated, and historical surfaces distinguished.
- [ ] Conflicting active guidance consolidated; links repaired; accurate technical references, licenses, provenance, and historical evidence retained.
- [ ] Template authority and approved-version lock established; one pilot snapshot verified.
- [ ] New-client helper consumes the selected lock and records exact source identity.
- [ ] Portable dealer guidance and scoped workflow skills implemented; local instruction/skill discovery and task routing checked.
- [ ] Publishing-only fixes preserved; portable packaging supports both standard and Import trios.
- [ ] Export respects the current publishing remote head, secret exclusions, and non-force history preservation.
- [ ] Technical registry, dashboard, and readable deployment list agree on actual offered variants and evidence.
- [ ] Owner quick start contains real tested commands and common task examples; no invented capabilities or planned commands presented as complete.
- [ ] Focused workflow tests and documentation/link checks pass; one bounded pilot verified without unrelated production changes or outreach.
- [ ] Reviewed task-owned changes committed to the appropriate repositories; final handoff includes exact commits, actual checks, and unresolved gaps. Migration documents become historical only after implementation.

The full handoff contains the detailed implementation sequence, observed commit IDs, local helper gaps, and source references. This review does not replace those details or a fresh inspection.
