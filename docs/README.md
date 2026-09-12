# Documentation index

Start with [Cars quick start](../README.md). Read the procedure for the current task, not every file.

| Responsibility | Authoritative home |
| --- | --- |
| Ownership, task scope, preservation and completion | [AGENTS](../AGENTS.md) |
| Dealer implementation and correction | [WORKFLOW](WORKFLOW.md) |
| Branding, sourced facts, inventory and assets | [LEAD-BUILD-GUARDRAILS](LEAD-BUILD-GUARDRAILS.md) |
| Approved upstream commits and snapshot integrity | [TEMPLATE-PROMOTION](TEMPLATE-PROMOTION.md), [release lock](../templates.lock.json) |
| Template keys, aliases and local ports | [catalog](../catalog.json) |
| Packaging, remote reconciliation and publication | [LEAD-PUBLISHING](LEAD-PUBLISHING.md) |
| Framework, rendered and hosted verification | [QA](QA.md) |
| Technical evidence and generated views | [REGISTRY](REGISTRY.md), [DEPLOYMENTS](DEPLOYMENTS.md) |
| One writer, Git preservation and handoffs | [COORDINATION](COORDINATION.md) |
| Local tools, skill discovery and web entry | [LOCAL-SETUP](LOCAL-SETUP.md) |
| Public research and qualification | [Lead index](../leads/README.md), [coverage](../leads/COVERAGE.md) |
| Owner decisions | [MANUAL-REVIEW](MANUAL-REVIEW.md) |

Repository skills under `.agents/skills/` route to these procedures. Each standalone template's AGENTS/TEMPLATE/reuse/QA documents own its technical details. A dealer copy receives portable dealer instructions instead of inherited master ownership.

## Disposition map

| Surface | Classification / treatment |
| --- | --- |
| Root AGENTS, workflow/release/publish, QA/setup/registry, three Cars skills | Active policy/procedure, consolidated here |
| Standalone AGENTS, TEMPLATE, README and lead-build/reuse/QA references | Active template ownership plus technical reference; dealer operations route to Cars |
| Cars snapshot TEMPLATE/architecture/style/reuse docs | Version-bound technical reference; managed snapshot AGENTS owns editing scope |
| `clients/*/AGENTS.md`, per-variant instructions and `.client/project.json` | Generated dealer guidance/evidence; normalize when that dealer is touched, not by mass redeployment |
| `docs/DEPLOYMENTS.md`, `docs/PROJECTS.md`, `clients/index.json` | Generated from the technical registry |
| `docs/lead-build/*`, old campaign branches/prompts/reports | Closed historical campaign; retained with a superseded notice, excluded from active task routing |
| `audits/`, dated refactor/polish evidence, licenses and provenance | Historical/reference evidence; do not rewrite past results as current |
| Old Cars root/workflow/publish/promotion documents | Preserved under `history/` or `reference/` with non-active filenames |
| Original workflow review/handoff | Migration specification; see [migration result](WORKFLOW-MIGRATION-2026-09-12.md) for actual completion and remaining gaps |

The full file inventory and original index snapshots for this migration are local evidence under `runtime/workflow-overhaul-20260912/`. No owner-wide configuration, private CRM, application API model or dependency upgrade is part of the instruction cleanup.

Workflow changes update their authoritative document and relevant tests in the same commit. Run `node scripts/check-workflow.mjs` and the focused Node workflow tests.
Current source/branch disposition: [main consolidation, 13 September 2026](MAIN-CONSOLIDATION-2026-09-13.md). All active source branches have been consolidated into main; older migration descriptions are dated evidence.
