# App — Cars template candidate

Copied from the current `L:/cars-app` working tree on 26 September 2026, including uncommitted UI work. This is the workspace for polishing the design into a reusable single-reseller template. The UI, routes, data, assets and dependency lockfile are preserved. Cars24 reference branding/content is still present; this import does not claim a finished client template or a production backend.

Use Node 22.20+ on the 22 line. Run locally:

```powershell
Set-Location L:/CODEX/cars/templates/app
npm ci
npm run dev -- --hostname 127.0.0.1 --port 6473
```

Preview: http://127.0.0.1:6473/. Original reference preview: http://127.0.0.1:4173/. Stop this template's dev server before a production build. The shared Cars launcher does not support this new Next.js candidate yet; use the command above.

See [template boundaries](TEMPLATE.md), [copy provenance](docs/IMPORT.md) and [original README](docs/SOURCE-README.md). The following inherited stack/route notes are useful context; the production adapter and complete dealer configuration remain future work.

A dealer-first responsive car showroom inspired by the strongest interaction patterns in modern automotive apps, rebuilt with original branding and reusable dealership configuration.

## Stack

- Next.js 16 App Router and React 19
- TypeScript with strict checking
- StyleX 0.19 design system and compiled atomic CSS
- Static generation for inventory and vehicle pages
- PWA manifest for installable web-app behavior
- A domain/data boundary designed for a future Capacitor shell or React Native client

## Routes

- `/` — showroom home and discovery
- `/cars` — searchable inventory and responsive filters
- `/cars/[slug]` — vehicle gallery, pricing, finance, trust and contact
- `/sell` — sell/trade-in lead flow
- `/finance` — finance lead flow
- `/service` — service and test-drive flow
- `/saved` — saved vehicle shortlist
- `/more` — customer activity and dealer services

## Commands

```bash
npm run dev
npm run check
npm run build
npm start
```

Isolated QA outputs selected with `NEXT_DIST_DIR` ending in `next-check`,
`.next-build*` or `.next-qa*` do not retain production Webpack or Turbopack
compiler caches. These checks use a new output directory for each run, so the
cache cannot speed up the next check. Development caches and ordinary `.next`
builds keep their existing behavior. Inactive generated QA output can be
removed after its preview and checks have finished; retain source, lockfiles,
screenshots, reports and recovery evidence.

The current inventory is fixture-backed. Replace `lib/data.ts` with a typed API adapter without changing the page contracts.
