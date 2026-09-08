# ELIQ AUTO Import — Finalization Audit

## Audit status

This audit separates **owner-confirmed issues** from **verification requirements**. An item is not permission to redesign a surface. Only selected task IDs in root `tasks.md` authorize code changes.

## Approved baseline

- Application baseline: `9a40f1a1c56c6855ad0604ac9d4d47e682fab03e`
- The current visual identity, strongest mobile/desktop compositions, imagery, section order, and working flows at that baseline are preservation references.
- Every implementation batch must capture before screenshots before editing.

## Owner-confirmed issues

1. The frontend needs slight final UI/UX polish, especially desktop rhythm and responsive edge cases.
2. Filters, overlays, cards, detail pages, forms, and secondary routes need final consistency checks.
3. The public identity must be ELIQ AUTO; inherited Bohemcars names may remain internally but must not leak publicly.

## Existing strengths

- The current proposal already looks strong and should be refined rather than re-concepted.
- Auxero proportions, vehicle-card structures, image ratios, and responsive hierarchy are valuable assets.
- Existing Svelte components and Bits UI/project primitives provide appropriate ownership for scoped fixes.
- Mobile flows are already working and must not be destabilized by desktop polish.

## Architecture evidence

- `src/routes/+layout.svelte`, `+page.svelte`, and route folders — page composition.
- `src/lib/components/home/`, `common/`, `inventory/`, `detail/`, `contact/` — visual ownership.
- `src/lib/auxero/`, `src/lib/data/`, `src/lib/server/` — source parsing/data/server ownership.
- `src/lib/state/` — focused UI state.
- `src/lib/styles/` and `src/routes/auxero-guards.css` — shared/template compatibility styling.

## Audit classifications

### Confirmed defect

A behavior or visual issue explicitly reported by the owner or reproducible in the running application. It may be scheduled in `tasks.md`.

### Verify before edit

A possible issue that must be reproduced and localized before code changes. If it cannot be reproduced, the task stops with evidence and no speculative change.

### Preservation constraint

A current design/behavior that must remain unchanged unless a selected task explicitly names it.

## Cross-project non-goals

- Do not copy another variant wholesale.
- Do not make all seven proposals visually identical.
- Do not replace strong mobile compositions merely for code reuse.
- Do not make broad token, typography, card, header, or section-order changes because they appear in a generic UI checklist.
- Do not interpret “client-ready” as permission to add new product features.

## Audit-to-task traceability

Every implementation item must have:
- a task ID in `tasks.md`;
- exact routes/viewports;
- allowed files;
- preserve list;
- acceptance criteria;
- evidence requirement;
- a change budget or stop condition.

Anything not represented by a selected task is out of scope for the current agent run.
