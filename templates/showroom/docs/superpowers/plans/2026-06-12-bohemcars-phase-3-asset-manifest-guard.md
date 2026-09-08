# Bohemcars Phase 3 Asset Manifest Guard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a rendered-route asset manifest guard so local Auxero asset references can be verified before pruning heavy or duplicate files.

**Architecture:** Keep all current assets in place. Add a pure server-side helper that extracts local `/assets/...` references from rendered template HTML, normalizes query/hash suffixes, and checks them against `static/`. Use a Vitest spec over the public/demo template routes.

**Tech Stack:** SvelteKit 2, Vitest, Auxero rendered template adapter, Node filesystem APIs.

---

## Audit Decision

- Visual assets are part of the Auxero fidelity contract, so deleting files without a manifest is risky.
- Remote vehicle listing images are handled separately by data fallbacks and browser QA.
- The safe slice is a guard test for local rendered asset references. It proves no current rendered template depends on missing local assets and creates the prerequisite for later duplicate PNG/WebP pruning.

## Files

- Create: `M:/bohemcars-svelte/src/lib/server/asset-manifest.ts`
  - Extract local `/assets/...` references from `src`, `href`, `poster`, `data-src`, `data-bg`, `data-image`, `srcset`, and CSS `url(...)`.
  - Resolve references under `static/`.
  - Return missing references grouped by page label.
- Create: `M:/bohemcars-svelte/src/lib/server/asset-manifest.spec.ts`
  - Render representative public/demo Auxero templates.
  - Assert every extracted local asset reference exists.
  - Assert remote URLs and route links are ignored.

## Steps

- [x] **Step 1: Add failing manifest tests**

Run:

```powershell
npm run test:unit -- --run src/lib/server/asset-manifest.spec.ts
```

Expected before implementation: fail because `asset-manifest.ts` does not exist.

- [x] **Step 2: Implement asset manifest helper**

Use Node path/fs APIs only in the server helper. Do not import this helper from client code.

- [x] **Step 3: Run focused manifest tests**

```powershell
npm run test:unit -- --run src/lib/server/asset-manifest.spec.ts
```

Expected: pass and report no missing rendered local assets.

- [x] **Step 4: Run related template tests**

```powershell
npm run test:unit -- --run src/lib/server/asset-manifest.spec.ts src/lib/server/auxero-template.spec.ts
```

Expected: all pass.
