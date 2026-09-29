# Template reference — Import

## Identity

- Repository: `darkapoparka/cars-template-import`
- Key: `import`
- Role: Design 2 option in an Import trio
- Design position: import/sourcing specialist for dealers that actively sell the import journey
- Stack: Svelte 5 + SvelteKit + Vite 8 + Tailwind CSS v4; explicit Vercel adapter
- Runtime: Node 24 (see .node-version), npm lockfile
- Primary entry: `/`
- Suggested standalone review port: `6790`

This is a **template master**, not a sendable dealer demo. The baseline intentionally preserves source/sample material for design fidelity; every lead copy requires a complete identity and content sweep.

## Install and run

```text
npm ci
npm run dev -- --host 127.0.0.1 --port 6790 --strictPort
```

## Primary personalization surface

Shared customer typography follows [Typography](docs/TYPOGRAPHY.md).

- `src/lib/config/dealer.ts` and validated `src/lib/config/site.ts`
- `src/lib/content/`
- `src/lib/data/daynight.ts` (compatibility/content facade)
- `src/lib/data/daynight-listings.json`
- `src/lib/data/vehicles.ts`
- `src/lib/styles/`
- `static/assets/daynight/`
- `static/`

Do not assume these are the only identity consumers. Search every retained route, data module, metadata definition and static asset before declaring a skin complete.

## Representative QA routes

- `/`
- `/inventory`
- `/contact`
- `/sell-your-car`
- `/financing`
- `/import`

## Required checks

- `npm run verify`
- `npm run build`
- `npm run test:e2e`

## Inquiry persistence

Optional Neon-backed inquiry storage and private template admin access are documented in [Inquiry database](docs/INQUIRY-DATABASE.md). Preview mode stays synthetic even when credentials are present. Live persistence must be explicitly enabled. Saving is separate from notification delivery.

## Current constraints

Use Import as Design 2 in the intentional Auto Best / Import / Carwow trio when it fits the dealer’s real offer.

## Source lineage

Split on 2026-09-10 from the live working tree at `J:/cars/templates/import`. The split deliberately captured local working-tree changes, including changes newer than the `cars` repository HEAD. Historical root instructions were archived under `docs/legacy/from-cars-2026-09-10/`; use them only for provenance, never as current operating instructions.

## Portfolio policy

Cars owns portfolio choices: standard Auto Best / Modern / Carwow, or Auto Best / Import / Carwow. See [Cars integration](docs/CARS-INTEGRATION.md).

Current cross-repository ownership, approved releases, dealer-copy workflow and standalone/mounted limits: [Cars integration](docs/CARS-INTEGRATION.md).

Current source boundaries and retained legacy limits: [Architecture](docs/ARCHITECTURE.md).
