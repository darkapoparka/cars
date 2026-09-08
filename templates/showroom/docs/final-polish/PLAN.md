# ELIQ 6404 — ELIQ AUTO Import — Complete Finalization Roadmap

## How to use this roadmap

This is the complete project plan. It preserves all remaining work in one place, but it is **not an execute-all instruction**. Root `tasks.md` controls the active batch. A local agent executes only the active or owner-named task IDs, then stops for review.

## Roadmap principles

- Preserve the approved baseline and strongest existing design.
- Fix confirmed behavior before cosmetic refinement.
- Keep high-risk surfaces in isolated one-task batches.
- Do not merge adjacent batches merely to save time.
- Do not begin release QA until earlier batches are owner-approved.

## Ordered batches

### EAI-B01

- **EAI-101 — Remove public-facing inherited dealer identity leakage** (P0, risk LOW)
- **EAI-102 — Refine desktop header, hero, and section rhythm** (P1, risk LOW)
- **EAI-103 — Polish inventory filters and active-filter clarity** (P1, risk MEDIUM)

### EAI-B02

- **EAI-104 — Harden menus, dialogs, sheets, and forms** (P1, risk MEDIUM)

### EAI-B03

- **EAI-201 — Polish inventory cards and image behavior** (P1, risk LOW)
- **EAI-202 — Refine representative listing-detail page** (P1, risk LOW)

### EAI-B04

- **EAI-203 — Bring secondary public routes to the same finish level** (P1, risk LOW)

### EAI-B05

- **EAI-301 — Touched-state accessibility and degraded-state pass** (P2, risk LOW)

### EAI-B06

- **EAI-401 — Final QA and ELIQ client handoff** (RELEASE, risk LOW)

## Dependency rules

- A task may depend on earlier batch behavior even when the files differ. Preserve approved results from previous batches.
- A task marked not applicable after evidence should be recorded as `N/A — VERIFIED`, not silently skipped.
- When a task uncovers a missing product requirement or backend dependency, stop and record a blocker; do not fabricate a UI flow.
- Release tasks may fix only verified regressions. They are not another design pass.

## Completion model

1. Agent executes selected batch.
2. Agent captures evidence and marks tasks `READY FOR OWNER REVIEW`.
3. Owner reviews visual/behavioral result.
4. Owner accepts, requests corrections, or reverts.
5. Only after approval is the next batch activated.

The full project is complete only when every applicable task is owner-approved and the release batch passes.
