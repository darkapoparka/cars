# Template reference — Carwow-style

## Identity

- Repository: `darkapoparka/cars-template-carwow`
- Key: `carwow`
- Portfolio role: **core**
- Design position: consumer marketplace / strongest immediate visual impact
- Stack: SvelteKit + Vite
- Primary entry: `/`
- Suggested standalone review port: `6463`

This is a **template master**, not a sendable dealer demo. The baseline intentionally preserves source/sample material for design fidelity; every lead copy requires a complete identity and content sweep.

## Install and run

```text
npm ci
npm run dev -- --host 127.0.0.1 --port 6463 --strictPort
```

## Primary personalization surface

- `src/lib/data/daynight-site.ts`
- `src/lib/data/daynight-current-inventory.ts`
- `src/lib/data/daynight-vehicles.ts`
- `src/lib/data/daynight-reviews.ts`
- `src/lib/styles/`
- `static/brand/`
- `static/`

Do not assume these are the only identity consumers. Search every retained route, data module, metadata definition and static asset before declaring a skin complete.

## Representative QA routes

- `/`
- `/inventory`
- `/inventory/mercedes-benz-gla-45-amg-405323`
- `/contact`
- `/sell-your-car`
- `/financing`
- `/compare`

## Required checks

- `npm run check`
- `npm run build`
- `npm run test:unit -- --run`

## Current constraints

Desktop and mobile have intentional separate native compositions. The shared viewport context uses 991/992px; the dev command supports standard Vite flags and defaults to port 6463.

Provider services remain unproven unless explicitly configured and tested. Source/demo inventory is not a verified dealer catalog. See `docs/QA.md` for the complete quality gates and `docs/ARCHITECTURE.md` for current ownership.

## Source lineage

Split on 2026-09-10 from the live working tree at `J:/cars/templates/carwow`. The split deliberately captured local working-tree changes, including changes newer than the `cars` repository HEAD. Historical root instructions were archived under `docs/legacy/from-cars-2026-09-10/`; use them only for provenance, never as current operating instructions.

## Portfolio policy

Cars owns portfolio choices: standard Auto Best / Modern / Carwow, or Auto Best / Import / Carwow. See [Cars integration](docs/CARS-INTEGRATION.md).

Current cross-repository ownership, approved releases, dealer-copy workflow and standalone/mounted limits: [Cars integration](docs/CARS-INTEGRATION.md).
