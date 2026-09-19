# Cars organization and architecture completion

Date: 19 September 2026. This supplements the earlier dated audit and [local reconciliation](RECONCILIATION.md); it does not overwrite their history.

## Local source is synchronized

The earlier reconciliation advanced the existing J:/cars checkout from cd526d21 to df22295b while preserving local work. This pass fetched GitHub again and found two subsequent logo commits. The same main checkout was fast-forwarded from df22295b9649fdd6aaf6ad453113e99b7c93acdf to dac319e17f4c76f787d9d7c0b59dd31ff25ecbc9. No new branch or worktree was created.

The two incoming commits changed 284 paths. None overlapped the 524 modified or 3,995 untracked paths identified before the fast-forward. All those 4,519 unrelated path snapshots were checked again afterward: no bytes changed. The original index and SHA-256 inventory are retained under ignored runtime/organization-final-2026-09-19T15-17-34-320Z. Maintenance changes described below are committed separately from unrelated dealer/research drafts.

A local branch being behind means it lacks commits already on GitHub. It does not mean every uncommitted local draft is older or should be discarded. Current deployment, committed source and unpublished working files remain distinct facts.

## Physical organization completed in this pass

The six editable repositories remain at their existing canonical locations in [WORKSPACE](../../WORKSPACE.md). The four template masters already share J:/template-repos. Cars/templates remains release snapshots, not additional editable masters. Cars.code-workspace opens the six repositories together.

Nine inspected image-only evidence folders were consolidated from the Windows user root into J:/cars/runtime/archive/2026-09-19. This moved 121 files totaling 27,089,318 bytes. Every destination and original was compared by SHA-256 before the move completed. The old paths are compatibility junctions to the single archived copy, so existing reports and references still resolve. No duplicate image tree remains at the old location.

[FOLDERS.json](FOLDERS.json) records each old path and canonical archive destination. The complete per-file relocation journal remains under ignored runtime/organization-final-2026-09-19T15-17-34-320Z/image-archive-receipt.json. These images are historical evidence and candidates, not a replacement for the approved dealer assets committed by the logo agent.

Other C: folders contain actual Git repositories, application copies, scripts or deployment state and were not treated as disposable screenshot folders. They remain a separate reconciliation queue. No source repository was moved, no existing development server was stopped, and no application settings or credentials were changed. No storage saving on Vercel is claimed.

## Workflow repairs and verification

The refresh integration fixtures now include the required template consumers and approved logo assets. Their assertions follow the committed contextual logo contract, including versioned URLs, and verify output asset hashes. Existing hero, identity and inventory assertions remain. No application implementation or logo artwork was changed to make the tests pass.

The standard workflow check now validates that workspace.json and Cars.code-workspace describe the same six canonical repositories on main, preventing release snapshots or competing copies from being presented as template masters. It also checks the new architecture document.

The final full Node workflow suite passed **52/52 tests**, including the previously data-dependent refresh integration tests. No test file was excluded. The documentation/skill/command check passed for 12 active documents, three skills and the six-repository workspace map. Logs are in runtime/organization-workflow-final-test.log. These are source/workflow checks, not a new visual review of every deployed page.

## Logo and deployment boundary

The logo agent's [six-logo delivery report](../../logo-refresh/2026-09-19/six-generated/DELIVERY.md) records all six generated masters and all 18 variant implementations committed. It reports the new logos live for Autolife, Avangard Auto, ELIQ Auto and Navara, with Priselci and IS Auto pending deployment after the deployment/day limit.

A fresh provider lookup in this pass still resolved Priselci to dpl_6hEcRNo9nmtQUCGEG7Y3H3icJ3aV / 4efc240e43d807cdecbc5b5cf2de0cdb93f0011d, and IS Auto to dpl_Dsn693jzxTqzZtTfRhqzHwjHebw4 / a99428c8b9d57bee48e904256c27177be4e0ed0f. The organization work did not attempt another deployment or overwrite that agent's logo files. Do not describe the two pending redesigned logos as live.

## Architecture decision

Use [shared source with hybrid delivery](../../PREVIEW-ARCHITECTURE.md). Keep today's 24 dealer projects, public URLs and three-design FAB routes; keep one shared client-facing Admin demo. Configuration-only future prospects are candidates for shared renderers after a measured pilot. Dedicated projects remain appropriate for custom code or independent releases and rollback.

A shared codebase does not require exactly one Vercel project. A combined Services deployment and separately deployed template renderers have different release boundaries. Copying every existing application into a single deployment is not multi-tenancy and does not establish a storage saving. The pilot must prove tenant-specific data, asset and cache handling, unchanged design behavior and a real rollback path before any current prospect is migrated.

No shared multi-tenant application, new domain, billing upgrade, retention-policy change or database connection was deployed here. Agency OS remains private. The architecture decision is not a claim that current templates are request-scoped multi-tenant applications.
