# 02 — Native shell and inventory

**Status:** Planned — not implemented by this audit.  
**Findings:** F03, F07–F15.  
**Shared gate:** [Testing and quality](../10-testing-and-quality-gates.md).

**Goal:** finish one real end-to-end storefront migration and use it as the reference. Depends on the reviewed Phase 01 contract.

### P02-1 — Native public shell

Extract one header/footer/main owner from `AuxeroPublicShell.svelte`, `HomeFiveHeader.svelte`, root layout and `InventoryTemplatePage.svelte`. Preserve shared mobile menu/appbar/bottom-navigation patterns. Use declarative head data and explicit public config, not body-class scripts or a template document. Keep transitional routes behind a clear compatibility boundary.

### P02-2 — Canonical inventory query and model

Characterize `server/inventory-state.ts` aliases before extraction. Reuse the existing canonical vehicle types and publication rules. Share parsing, normalized selection, options and formatting across desktop/mobile; preserve supported legacy URLs. Define facet dependency/reset and asynchronous stale-response handling.

### P02-3 — Split desktop responsibilities

Break `AuxeroInventoryDesktopSurface.svelte` into clear toolbar/facet/grid/card ownership. Review actual card width and retained density modes at 1,024/1,280/1,440/1,920. Make equivalent header controls consistent across route families. Remove page-parent styling of card internals and retire corresponding guard rules in the same packet.

### P02-4 — Fix primary-content SSR and navigation

Remove the client-only viewport gate from essential inventory content. Share state and permit distinct responsive affordances without two active controller trees. Preserve filters, sort/view, revealed-card count, focus and scroll on detail return. Keep load-more controls on the shared action contract.

**Paths:** inventory route/load files; `InventoryTemplatePage`, desktop/mobile surfaces, card/facet components; `server/inventory-state.ts`; `auxero/inventory-desktop.ts` and `inventory-mobile.ts` as temporary adapters.

### Exit and handoff

Inventory passes the state/visual matrix, including no-JavaScript mobile content, zero results, long labels and back/forward. The migrated inventory route no longer requires legacy document/runtime data or its old guard selectors. Reference desktop and mobile screenshots are owner-reviewed. Roll back the route slice, not unrelated mobile source, if query semantics or detail return change unexpectedly.
