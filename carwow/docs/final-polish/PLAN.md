# D&N 6517 — Day & Night Spartak — Complete Finalization Roadmap

## How to use this roadmap

This is the complete project plan. It preserves all remaining work in one place, but it is **not an execute-all instruction**. Root `tasks.md` controls the active batch. A local agent executes only the active or owner-named task IDs, then stops for review.

## Roadmap principles

- Preserve the approved baseline and strongest existing design.
- Fix confirmed behavior before cosmetic refinement.
- Keep high-risk surfaces in isolated one-task batches.
- Do not merge adjacent batches merely to save time.
- Do not begin release QA until earlier batches are owner-approved.

## Ordered batches

### DNS-B01

- **DNS-101 — Micro-polish mobile header, filter bar, and bottom navigation** (P1, risk LOW)
- **DNS-102 — Micro-polish desktop header, hero, and first inventory transition** (P1, risk LOW)
- **DNS-103 — Verify mobile/desktop behavioral parity before further visual work** (P0, risk LOW)

### DNS-B02

- **DNS-104 — Polish mobile and desktop vehicle cards without homogenizing them** (P1, risk LOW)
- **DNS-105 — Harden favorites, compare, and compare tray behavior** (P0, risk MEDIUM)

### DNS-B03

- **DNS-201 — Polish inventory filters and intermediate breakpoints** (P1, risk MEDIUM)
- **DNS-202 — Refine representative detail/contact journeys** (P1, risk LOW)

### DNS-B04

- **DNS-301 — Touched-state accessibility and visual-regression cleanup** (P2, risk LOW)

### DNS-B05

- **DNS-401 — Final QA and client-demo handoff** (RELEASE, risk LOW)

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
