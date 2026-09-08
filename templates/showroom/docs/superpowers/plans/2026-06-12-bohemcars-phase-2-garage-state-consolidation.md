# Bohemcars Phase 2 Garage State Consolidation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move compare/favorites local storage keys and normalization into one state utility so Svelte components stop duplicating garage ownership.

**Architecture:** Keep the current localStorage-backed prototype behavior, API sync, Auxero badge DOM sync, and compare UI unchanged. Extract only pure storage/key/normalization helpers into `src/lib/state/garage-storage.ts`; then make `garage.svelte.ts` and `AuxeroCompareTable.svelte` consume that shared contract.

**Tech Stack:** SvelteKit 2, Svelte 5 runes, Vitest, Playwright, Auxero template markup.

---

## Audit Decision

- `src/lib/state/garage.svelte.ts` owns `bohemcars:favorites`, `bohemcars:compare`, compare limit, API sync, DOM badge sync, and Svelte context state.
- `src/lib/components/compare/AuxeroCompareTable.svelte` separately owns `bohemcars:compare`, `bohemcars:compare:mobile-slots`, compare limit, slug dedupe, slot compaction, and stale-slot recovery.
- A full removal of DOM badge sync is risky because legacy Auxero cards and Svelte cards still coexist.
- The safe slice is to centralize storage keys and pure normalization first, without changing rendered markup, CSS, event labels, API endpoints, or visual behavior.

## Files

- Create: `M:/bohemcars-svelte/src/lib/state/garage-storage.ts`
  - Export garage storage keys, `compareLimit`, `CompareSlotSlugs`, list read/write helpers, compare/favorite list transforms, and mobile compare slot helpers.
- Create: `M:/bohemcars-svelte/src/lib/state/garage-storage.spec.ts`
  - Verify invalid JSON is ignored, duplicate slugs are deduped, compare limit is enforced, favorite toggles are stable, and mobile slots are rejected when stale.
- Modify: `M:/bohemcars-svelte/src/lib/state/garage.svelte.ts`
  - Import keys and helpers from `garage-storage.ts`.
  - Keep API sync and DOM sync in this file.
- Modify: `M:/bohemcars-svelte/src/lib/components/compare/AuxeroCompareTable.svelte`
  - Import compare limit and slot helpers from `garage-storage.ts`.
  - Keep UI state, drawer behavior, and markup unchanged.
- Modify: `M:/bohemcars-svelte/src/routes/project1.e2e.ts`
  - Add or extend compare regression only if the existing compare coverage does not prove persisted selection and mobile slot behavior.

## Steps

- [x] **Step 1: Add the garage storage contract and unit tests**

Run:

```powershell
npm run test:unit -- --run src/lib/state/garage-storage.spec.ts
```

Expected before implementation: fail because the files do not exist.

- [x] **Step 2: Implement `garage-storage.ts`**

Create pure helpers. Do not import Svelte, browser globals, or component code.

- [x] **Step 3: Rewire `garage.svelte.ts`**

Replace local key constants and duplicate list transforms with shared helpers. Preserve public `GarageState` methods.

- [x] **Step 4: Rewire `AuxeroCompareTable.svelte`**

Replace local compare key, slot key, compare limit, slug-list comparison, slot compaction, and slot storage read/write helpers with imports from `garage-storage.ts`.

- [x] **Step 5: Run Svelte autofixer**

```powershell
npx @sveltejs/mcp svelte-autofixer src/lib/state/garage.svelte.ts
npx @sveltejs/mcp svelte-autofixer src/lib/components/compare/AuxeroCompareTable.svelte
```

Expected: no hard issues.

- [x] **Step 6: Run focused tests**

```powershell
npm run test:unit -- --run src/lib/state/garage-storage.spec.ts src/lib/server/compare-state.spec.ts
npx playwright test src/routes/project1.e2e.ts --grep "compare and consultants|header, garage, and inquiry flows" --reporter=line
```

Expected: all focused checks pass.

- [x] **Step 7: Browser screenshot QA**

Capture `/compare` desktop at 1440x1000 and mobile at 390x844 after selecting/removing at least one vehicle. Verify no visual drift, no stuck drawer, no preloader, and badges remain coherent.
