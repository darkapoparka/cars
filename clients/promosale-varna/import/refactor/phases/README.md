# Execution phases

All phases below are **planned**, not implemented by the audit task. The audit supplies evidence for Phase 00 but does not constitute completion of its new tests, CI or runtime containment work.

| Phase                                                           | Scope                                                              | Depends on                                                    | Primary findings      |
| --------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------- | --------------------- |
| [00 — Baseline and safety](00-baseline-and-safety.md)           | Reproducibility, regression contract, mode containment             | Current owner authorization to implement                      | F16–F21, F28          |
| [01 — Design foundations](01-design-foundations.md)             | One token/cascade/control contract                                 | 00 baseline                                                   | F01–F06, F12, F27     |
| [02 — Shell and inventory](02-shell-and-inventory.md)           | First complete native public slice                                 | 01 reviewed reference                                         | F03, F07–F15          |
| [03 — Detail and conversion flows](03-detail-and-conversion.md) | PDP, import, sell, financing                                       | 02 shared shell/data                                          | F07, F11–F14, F18     |
| [04 — Remaining public surface](04-remaining-public.md)         | Home, compare, content, SEO/locale                                 | 02; shared contracts from 03                                  | F08–F15, F22–F27      |
| [05 — Server and admin boundaries](05-server-and-admin.md)      | Complete durable/gated capability design and native retained admin | 00 containment; relevant data/form contracts                  | F16–F21               |
| [06 — Decommission and prune](06-decommission-and-prune.md)     | Remove proven-obsolete runtime/CSS/assets/dependencies             | All retained consumer families migrated or explicitly retired | F02, F08–F09, F22–F25 |
| [07 — Reuse and release](07-reuse-and-release.md)               | Two-brand test, standalone/mounted qualification                   | Relevant previous gates complete                              | F23, F26–F28          |

Safety fixes from 00 do not wait until Phase 05. Read-only research may proceed in parallel; application/build writes remain single-owner. Do not combine all phases into one rewrite commit. At each phase boundary, show the owner the visible result and exact verification status before broadening scope.

Each packet ends with a rollback condition and a handoff. Check off tasks only when the named output and acceptance evidence exist. Finding IDs refer to [the audit](../01-audit.md); quality expectations refer to [the common gates](../10-testing-and-quality-gates.md).
