# ELIQ AUTO Import — Client-Demo Finalization

**Client:** ELIQ AUTO  
**Variant:** Import / retained Auxero SvelteKit implementation  
**Approved application baseline:** `9a40f1a1c56c6855ad0604ac9d4d47e682fab03e`  
**Execution model:** complete master plan + small selected batches

## Purpose

This repository contains the complete finalization plan required to turn the existing proposal into a polished client presentation without losing the design that already works.

The documentation is deliberately comprehensive. It covers the entire remaining frontend, UI/UX, interaction, responsive, QA, and handoff scope. **It is not meant to be executed in one agent run.**

## Canonical documents

1. `AUDIT.md` — confirmed issues, preservation baseline, and verification-only concerns.
2. `PLAN.md` — the complete ordered roadmap and dependencies.
3. `UI_UX_PLAYBOOK.md` — project-specific visual and interaction rules.
4. `TYPE_SPACING_TOUCH.md` — canonical type roles, spacing scale, touch floors, and font rendering.
5. `QA_AND_EXECUTION.md` — batch workflow, evidence, tests, and stop conditions.
6. Root `tasks.md` — full task ledger and the currently active batch.

## Product goal

Deliver a credible, responsive automotive proposal for **ELIQ AUTO** that helps a visitor recognize the dealer, discover vehicles, understand price/core facts, open details, and contact the dealer without broken controls, hidden content, or inconsistent mobile/desktop behavior.

## Strengths to preserve

- The current proposal already looks strong and should be refined rather than re-concepted.
- Auxero proportions, vehicle-card structures, image ratios, and responsive hierarchy are valuable assets.
- Existing Svelte components and Bits UI/project primitives provide appropriate ownership for scoped fixes.
- Mobile flows are already working and must not be destabilized by desktop polish.

## Owner-confirmed work areas

- The frontend needs slight final UI/UX polish, especially desktop rhythm and responsive edge cases.
- Filters, overlays, cards, detail pages, forms, and secondary routes need final consistency checks.
- The public identity must be ELIQ AUTO; inherited Bohemcars names may remain internally but must not leak publicly.

## Execution principle

- The full roadmap remains in the repository so no future agent needs the project re-explained.
- Each local session executes only the active or explicitly named 1–5 task IDs.
- Every task states allowed files, preserve rules, exact work, acceptance criteria, and change budget.
- The agent stops after the selected batch and waits for owner review.
- No unreviewed automatic progression through the master plan.

## Definition of client-ready

The project is client-ready only after all roadmap batches have been executed and owner-approved, the final QA batch passes, before/after evidence is reviewed, primary routes/actions work, and remaining limitations are documented honestly.
