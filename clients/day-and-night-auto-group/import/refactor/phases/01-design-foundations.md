# 01 — Design foundations

**Status:** Planned — not implemented by this audit.  
**Findings:** F01–F06, F12, F27.  
**Shared gate:** [Testing and quality](../10-testing-and-quality-gates.md).

**Goal:** prove one role/token/cascade contract before applying it broadly. Depends on Phase 00 regression references.

### P01-1 — Map and simplify token ownership

Inventory declarations/consumers in `daynight.css`, `daynight.tailwind.css`, admin/shadcn and account CSS. Fix undefined `--bc-brand` references, identify meaningful aliases and document brand/semantic/component boundaries. Do not mass-rename working tokens or introduce a token for every literal.

### P01-2 — Establish a reference control set

Use existing primitives to demonstrate button/link, icon action, text field, select/combobox, badge, mode tab, popover and dialog/sheet roles. Include long Bulgarian labels, focus/errors, loading and inverse-header cases. Define actual typography/height/radius/padding roles in one place. Test external/tel/internal link behaviour rather than forcing all hrefs through a route cast.

**Paths:** `components/ui/button`, relevant existing UI primitives, `common/MobileIconAction.svelte`, `MobileModeTabs.svelte`, `MobileSheet.svelte`, `layout/MobileAppbar.svelte`.

### P01-3 — Create a controlled cascade migration

Define one target app stylesheet entry and a scoped compatibility strategy. Audit legacy `.container`, grid, button and form selectors before changing reset ownership. Keep unmigrated routes functional. Check computed styles after hard reload and client navigation into and out of an admin/legacy route.

### P01-4 — Preserve overlay mechanics

Test current Vaul/Bits ownership before removing manual focus/scroll code. Introduce shared stack roles and a router-compatible history contract without adding a new overlay manager. Verify that portals inherit the correct theme and that missing descriptions do not reserve empty header space.

### Exit and handoff

Owner-reviewed controls and typography exist in mobile/desktop contexts; semantic values have one owner; no new broad descendant override is needed; the protected mobile fixtures pass. Include before/after reference screenshots and a migration map for remaining stylesheet consumers. Do not apply a global reset to every route as an unreviewed final step. Roll back foundation changes that alter unrelated routes until scope is corrected.
