# Day & Night Spartak — Client-Demo Finalization

**Client:** Day & Night Auto Group
**Variant:** Spartak-style full SvelteKit dealer application
**Approved application baseline:** `f245f31155551177104b82ecbf4e23029e697643`
**Execution model:** complete master plan + small selected batches

## Purpose

This repository contains the complete finalization plan required to turn the existing proposal into a polished client presentation without losing the design that already works.

The documentation is deliberately comprehensive. It covers the entire remaining frontend, UI/UX, interaction, responsive, QA, and handoff scope. **It is not meant to be executed in one agent run.**

## Canonical documents

1. `AUDIT.md` — confirmed issues, preservation baseline, and verification-only concerns.
2. `PLAN.md` — the complete ordered roadmap and dependencies.
3. `UI_UX_PLAYBOOK.md` — project-specific visual and interaction rules.
4. `QA_AND_EXECUTION.md` — batch workflow, evidence, tests, and stop conditions.
5. Root `tasks.md` — full task ledger and the currently active batch.

## Product goal

Deliver a credible, responsive automotive proposal for **Day & Night Auto Group** that helps a visitor recognize the dealer, discover vehicles, understand price/core facts, open details, and contact the dealer without broken controls, hidden content, or inconsistent mobile/desktop behavior.

## Strengths to preserve

- The current mobile and desktop implementations are both strong and intentionally distinct.
- Separate `MobileHome.svelte` and `DesktopHome.svelte` compositions preserve a curated hierarchy for each form factor.
- Compare, favorites, inventory, detail, contact, and visual-regression tooling already exist.
- The project has a clear Day & Night identity and should receive controlled polish only.

## Owner-confirmed work areas

- Mobile needs slight final polishing, not a rebuild.
- Desktop needs slight final polishing, not a new layout.
- Intermediate responsive transitions and behavioral parity require verification.
- Compare/favorites/contact must remain consistent between separate mobile and desktop compositions.

## Execution principle

- The full roadmap remains in the repository so no future agent needs the project re-explained.
- Each local session executes only the active or explicitly named 1–5 task IDs.
- Every task states allowed files, preserve rules, exact work, acceptance criteria, and change budget.
- The agent stops after the selected batch and waits for owner review.
- No unreviewed automatic progression through the master plan.

## Definition of client-ready

The project is client-ready only after all roadmap batches have been executed and owner-approved, the final QA batch passes, before/after evidence is reviewed, primary routes/actions work, and remaining limitations are documented honestly.
