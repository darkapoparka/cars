# Carwow-style automotive template

**Working branch: `main`.** Use one writer per checkout. Read [AGENTS.md](AGENTS.md) before starting; temporary branches/worktrees require an explicit request and a completed integration/cleanup handoff.

Canonical standalone master: **`darkapoparka/cars-template-carwow`**. This repository is a reusable dealership design, not a dealer-specific project and not evidence that any sample business data is current.

**AI/agent entry point:** read `AGENTS.md`, then `TEMPLATE.md`, `docs/LEAD-BUILD.md`, and `docs/QA.md` before editing.

## Portfolio role

- Template key: `carwow`
- Role: **core**
- Design position: consumer marketplace / strongest immediate visual impact
- Standard dealer offer: `auto-best + carwow + modern`
- Import is Design 2 in the intentional Import trio; it does not add a fourth design.

## Rule of ownership

Improve this repository only when the task is a **shared template improvement**. For a **lead build**, use canonical Cars clients/<slug>/ through its approved-release clone workflow; never personalize this master.

## Quick start

`npm ci`

Preview command: `npm run dev -- --host 127.0.0.1 --port 6463 --strictPort`

Entry route: `/`

See `TEMPLATE.md` for template-specific boundaries and `docs/LEAD-BUILD.md` for the complete lead workflow. Historical pre-split root docs are preserved under `docs/legacy/from-cars-2026-09-10/` for provenance only; they do not override the current instructions.

## Maintenance

Use Node 24. The runtime is native Svelte 5/SvelteKit; the old raw HTML kit is no longer part of the application. Start with [the documentation index](docs/README.md), [architecture](docs/ARCHITECTURE.md), and [quality gates](docs/QA.md). `npm run check:architecture` checks reachable source boundaries. `npm run audit:mobile` captures the public mobile route matrix. `npm run clean:workspace` previews generated-cache cleanup without deleting anything.

Current cross-repository ownership, approved releases, dealer-copy workflow and standalone/mounted limits: [Cars integration](docs/CARS-INTEGRATION.md).