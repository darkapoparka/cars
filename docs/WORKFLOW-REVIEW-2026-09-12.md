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

> Read `docs/WORKFLOW-REVIEW-2026-09-12.md` and `docs/CARS-WORKFLOW-CODEX-HANDOFF.md` from current `origin/main`; use `git show` if they are not yet in the checkout. Implement the workflow organization from this audited starting point. First refresh repository state and preserve all staged, unstaged, untracked, and unique branch work. Keep the four standalone template repositories authoritative for reusable improvements, make Cars template folders managed snapshots of approved commits, and keep dealer implementations canonical under Cars client folders. Reuse and finish the existing export and deployment-index work, including Import variants. Reconcile publishing-only fixes before exporting anything. Update the active instructions and prove the workflow with a bounded pilot. Preserve existing repository names and public URLs. Do not contact leads or mass-upgrade/deploy the portfolio. Return actual changes, commits, checks, and remaining gaps.

## Implementation acceptance checklist

These boxes describe future work; they are deliberately not marked complete by this documentation commit.

- [ ] Existing local work and unique histories preserved and reconciled.
- [ ] Template authority and approved-version lock established; one pilot snapshot verified.
- [ ] New-client helper consumes the selected lock and records exact source identity.
- [ ] Portable dealer instructions and narrowly scoped workflow skills implemented where useful.
- [ ] Publishing-only fixes preserved; portable packaging supports both standard and Import trios.
- [ ] Export respects the current publishing remote head, secret exclusions, and non-force history preservation.
- [ ] Technical registry, dashboard, and readable deployment list agree on actual offered variants and evidence.
- [ ] One bounded pilot verified; no unrelated production changes or outreach performed.

The full handoff contains the detailed implementation sequence, observed commit IDs, local helper gaps, and source references. This review does not replace those details or a fresh inspection.
