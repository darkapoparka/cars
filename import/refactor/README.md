# Import template: audit and refactor programme

Current implementation progress and remaining gates: [Execution](EXECUTION.md). The documents below are the original audit/plan, not an automatic completion ledger.

**Repository:** `darkapoparka/cars-template-import`  
**Audited:** 19 September 2026  
**Baseline:** `main`, `5ff9805ebe0211343e7a025465d8d71e306180fa`, plus the existing 18-path working-tree changes.  
**Status:** Audit and implementation plan. Application changes are not implemented by this documentation task.

## Decision

Refactor the existing application incrementally. Do **not** replace the framework, restart the design, introduce a monorepo, or build a generic website-builder engine.

The central problem is not a missing Tailwind installation or a total absence of tokens. The repository already has Svelte 5, Tailwind v4, a substantial `--bc-*` token set, `@theme inline` mappings, shared mobile controls and accessible primitive libraries. However, legacy template CSS, route-dependent stylesheet loading, page-level overrides and multiple rendering systems still decide much of the desktop presentation. Adding another token file without removing these competing owners would preserve the problem.

The desired end state is a coherent desktop and mobile product, not identical layouts at every width. Preserve the useful mobile patterns and give desktop equally explicit composition, density and component contracts.

## What this audit establishes

| Baseline                                          | Measured result                                                   |
| ------------------------------------------------- | ----------------------------------------------------------------- |
| Tracked repository files                          | 1,487                                                             |
| Files under `src`                                 | 564, including 321 Svelte and 234 TypeScript files                |
| SvelteKit route files                             | 169; this is not a count of distinct URLs                         |
| `!important` occurrences in source CSS/Svelte     | 2,130                                                             |
| `:global(` occurrences in source CSS/Svelte       | 1,323                                                             |
| Hex-colour / pixel-value occurrences in that scan | 1,545 / 6,545                                                     |
| Largest desktop inventory component               | 2,958 lines                                                       |
| Largest comparison component                      | 3,186 lines                                                       |
| Legacy CSS guard file                             | 2,072 lines, including 527 `!important` occurrences               |
| Static directory                                  | 828 files, 176,890,853 bytes; not the network payload of one page |
| Tracked automated test files                      | Three unit-test files; no tracked end-to-end tests                |

These are lexical measurements used to locate ownership problems, **not** 2,130 independently confirmed bugs. Accessibility utilities, dynamic geometry, brand artwork and intentional one-off measurements need different treatment from duplicated design decisions.

See [verification evidence](evidence/verification.md) for commands actually run, their results and the limits of the browser/build checks. See [the audit](01-audit.md) for findings and their confidence levels.

## Reading order

| Document                                                          | Purpose                                                                              |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [AGENTS](AGENTS.md)                                               | Execution rules and handoff requirements for subsequent work                         |
| [01 — Audit](01-audit.md)                                         | Evidence-backed findings, priorities, strengths and coverage limits                  |
| [02 — Stack and current documentation](02-stack-and-docs.md)      | Installed versus available versions, official references and compatibility decisions |
| [03 — Target architecture](03-target-architecture.md)             | Minimal target structure, ownership boundaries and migration map                     |
| [04 — Design system](04-design-system.md)                         | Tokens, Tailwind v4, cascade, typography, controls and theme contracts               |
| [05 — Desktop and responsive UX](05-desktop-and-responsive.md)    | Page-family specifications and mobile invariants                                     |
| [06 — State, data and forms](06-state-data-and-forms.md)          | URL state, domain models, form schemas and server/client responsibilities            |
| [07 — Runtime and security](07-runtime-and-security.md)           | Preview/live isolation, sessions, uploads, providers and dependency triage           |
| [08 — Assets, performance and SEO](08-assets-performance-seo.md)  | Asset ownership, loading, metadata and measurable budgets                            |
| [09 — Reuse and release](09-reuse-and-release.md)                 | Dealer configuration, two-brand qualification and Cars integration                   |
| [10 — Testing and quality gates](10-testing-and-quality-gates.md) | Test matrix, CI, accessibility, visual review and regression ratchets                |
| [11 — Cleanup ledger](11-cleanup-ledger.md)                       | Keep, consolidate, investigate and retire decisions with proof requirements          |
| [12 — Decisions and risks](12-decisions-and-risks.md)             | Recommended defaults, unresolved product choices and rollback strategy               |
| [Execution phases](phases/README.md)                              | Ordered work packets with dependencies and acceptance criteria                       |

## Implementation order

1. Establish reproducible tests and contain preview/live risks. Record the existing mobile appearance and behaviours before modifying shared foundations.
2. Establish one token/cascade contract and one tested reference set of controls. Do not roll a global visual change through every route before review.
3. Migrate the public shell and desktop inventory as the first complete vertical slice; remove its obsolete styles with the migration.
4. Migrate vehicle detail, import, sell and financing, then the remaining public pages. Keep each page family separately reviewable.
5. Complete the server/admin boundary work, retire proven-obsolete template infrastructure and qualify two fictional dealer configurations.
6. Approve a template release only after standalone and separately mounted Cars QA. A clean `main` commit is not dealer-release approval.

The phase documents break this into smaller tasks. Each task has an exit condition; none is permission to silently begin the next phase or publish changes.

## Definition of done

A successful refactor has one authoritative owner for each design role; no migrated storefront route needs Auxero HTML extraction, script replay or descendant CSS patches; mobile back/close/focus/keyboard behaviour remains correct; desktop layouts work from compact laptop through wide desktop; URL and form contracts survive navigation; optional live features fail closed; and a second dealer can be configured without editing shared components.

Type checking alone, a screenshot at one width, fewer lines of code, or a dependency update is not sufficient evidence of that outcome. Visual acceptance remains an explicit owner decision.
