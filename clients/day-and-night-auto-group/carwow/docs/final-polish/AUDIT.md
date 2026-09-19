# Day & Night Spartak — Finalization Audit

## Audit status

This audit separates **owner-confirmed issues** from **verification requirements**. An item is not permission to redesign a surface. Only selected task IDs in root `tasks.md` authorize code changes.

## Approved baseline

- Application baseline: `f245f31155551177104b82ecbf4e23029e697643`
- The current visual identity, strongest mobile/desktop compositions, imagery, section order, and working flows at that baseline are preservation references.
- Every implementation batch must capture before screenshots before editing.

## Owner-confirmed issues

1. Mobile needs slight final polishing, not a rebuild.
2. Desktop needs slight final polishing, not a new layout.
3. Intermediate responsive transitions and behavioral parity require verification.
4. Compare/favorites/contact must remain consistent between separate mobile and desktop compositions.

## Existing strengths

- The current mobile and desktop implementations are both strong and intentionally distinct.
- Separate `MobileHome.svelte` and `DesktopHome.svelte` compositions preserve a curated hierarchy for each form factor.
- Compare, favorites, inventory, detail, contact, and visual-regression tooling already exist.
- The project has a clear Day & Night identity and should receive controlled polish only.

## Architecture evidence

- `src/lib/components/home/MobileHome.svelte`, `DesktopHome.svelte` — first-class separate compositions; do not merge.
- `src/lib/components/home/mobile/` — mobile header, filters, grid/cards, bottom nav, compare tray, browse/sections/footer.
- `src/lib/components/home/desktop/` — desktop header, hero, tabs, categories, cards, sections/footer.
- Shared inventory/detail/compare/favorites/contact/state modules — behavioral source of truth.
- Existing Playwright visual configs and `visual:*` scripts — regression gate.

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
