# 12 — Decisions, risks and rollback

## Recommended decisions

| Decision                 | Recommended default                                                                                                     | When to revisit                                                              |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Stack                    | Keep Svelte 5 / SvelteKit / Tailwind v4 / existing primitives                                                           | A demonstrated unsupported requirement, not dissatisfaction with current CSS |
| Repository shape         | One app, existing feature folders, small shared domain/config boundaries                                                | Real independent consumers justify packaging later                           |
| Desktop layout           | Retain a coherent 1,320px ordinary content container as the starting reference, with deliberate narrow/full-bleed roles | Owner reference review at compact/wide desktop                               |
| Mobile                   | Preserve current pattern and interaction contracts                                                                      | An explicit reviewed improvement with regression evidence                    |
| Public versus admin      | Separate layout/theme/authorization ownership                                                                           | Do not create a second app merely to separate density                        |
| Optional live capability | Explicitly disabled until configuration and tests qualify it                                                            | Dealer implementation deliberately enables it                                |
| Theme selection          | One small configured theme per dealer copy                                                                              | Proven runtime multi-tenant requirement                                      |
| Experimental pages       | Not automatically part of the supported release contract                                                                | Owner decides which demonstrations remain intentional                        |
| Framework/tooling majors | Separate from visual refactor; compatible security fixes first                                                          | Dedicated compatibility evidence                                             |
| Release                  | Immutable approved template revision plus standalone and Cars-mounted QA                                                | Never automatic from `main`                                                  |

These defaults make the plan executable without an immediate questionnaire. The visual baseline and retained-product surface still require owner approval during the relevant phase. Record a changed decision with its reason, not a new parallel architecture document.

## Main risks and controls

**Global CSS regression:** introducing Tailwind reset/layers or deleting vendor CSS can affect unrelated routes. Control it with a reference slice, computed-style checks, transition tests and per-route retirement.

**Mobile regression:** the strongest existing patterns are in dirty/untracked source. Record the baseline, preserve those files and compare browser back/focus/keyboard behaviour before simplifying their internals.

**False cleanup:** template globs, raw routes and packaging make naive unused-file analysis unreliable. Require the cleanup ledger and integration checkpoint.

**Security mode regression:** a missing variable can currently switch to demo behaviour while another provider remains enabled. Contain this in Phase 00, independently of later UI work.

**Provider/data side effects:** QA must not submit real leads, migrate an unknown database, publish content or incur AI costs. Use isolated synthetic adapters and explicit authorization for operational work.

**Toolchain drift:** current registry majors differ from the lockfile, and browser/runtime installation can be incomplete. Pin the supported environment and separate updates from visual changes.

**Architecture without improvement:** file moves alone can leave the specificity and UX unchanged. Acceptance includes visible results, fewer competing owners and second-brand configuration evidence.

## Rollback protocol

Keep every implementation packet independently reviewable. Record the prior approved revision, affected route family and any schema/storage implications. Roll back the packet’s code/configuration without resetting unrelated working-tree edits. For live data changes, use a pre-approved migration/backup recovery plan; a Git revert alone does not reverse a database mutation.

A temporary adapter can remain behind a scoped boundary while a route is being qualified, but it needs a named owner/removal condition. Do not leave two public implementations indefinitely behind unrelated flags. Stop the rollout when mobile behaviour, authorization, data semantics or mounted compatibility regress.

## Questions resolved during implementation, not blockers to writing this plan

Which experimental routes belong in the release? Which account/admin capabilities should a storefront-only dealer receive? Which exact desktop reference values does the owner approve? Which deployment/storage/authentication capabilities are intended for a real dealer? These decisions control the relevant packet; they do not justify speculative new infrastructure now.
