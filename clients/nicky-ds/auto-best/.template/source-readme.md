# Day & Night Auto Group — native SvelteKit demo

This repository contains the lead-specific Day & Night Auto Group automotive demo. The application is implemented directly in SvelteKit and TypeScript: routes own their markup, typed data supplies their content, and Svelte owns genuine interaction state.

The approved rendered Day & Night experience is the product contract. The red/black identity, responsive hierarchy, spacing, radii, media geometry, conversion-first desktop homepage, and restrained motion must remain intact unless the owner approves a redesign.

## Runtime

- Svelte 5 and SvelteKit
- TypeScript and Vite
- Node.js 22.12 or newer within the Node 22 line, with npm 10.9.8
- `@sveltejs/adapter-vercel`
- Playwright browser smoke coverage
- self-hosted Onest from `@fontsource-variable/onest`; no remote font stylesheet

Use the physical checkout for Node, SvelteKit, Git, and browser commands on Windows:

`M:\codex\agency-os-projects\leads\automotive\day-night-auto-group\autodeal-best-day-night`

Do not run the project through the `M:\codex\agency\projects` junction.

## Install and run

```bash
npm ci
npm run dev
```

The supported commands are:

- `npm run check:architecture` — rejects retired template composition and runtime dependencies.
- `npm run check:assets` — verifies the complete static asset/reference boundary.
- `npm run check` — synchronizes SvelteKit metadata and runs Svelte diagnostics.
- `npm run build` — creates the Vercel-targeted production build.
- `npm run validate` — runs architecture, assets, Svelte diagnostics, and build in that order.
- `npm run quality` — alias for the full validation chain.
- `npm run smoke` — exercises the route, interaction, redirect, and 404 browser matrix against an already-running preview.

For local production-path browser proof, run `npm run validate`, start `npm run preview -- --host 127.0.0.1 --port 5173`, then run `npm run smoke` in another terminal.

## Public route contract

Canonical pages:

- `/`
- `/listing-grid`
- `/listing-detail-v1/1` through `/listing-detail-v1/8`
- `/about-us`
- `/contact`
- `/blog`
- `/blog-detail/1` through `/blog-detail/9`
- `/robots.txt`
- `/sitemap.xml`

Permanent 308 redirects preserve the complete query string:

- `/home02` through `/home10` → `/`
- `/blog-grid` → `/blog`
- `/listing-grid2`, `/listing-list`, `/listing-grid-map`, and `/listing-list-map` → `/listing-grid`
- `/listing-detail-v2/[id]` through `/listing-detail-v5/[id]` → `/listing-detail-v1/[id]` for IDs 1–8
- `/faq` → `/contact`

All other retired template URLs return the native 404 page. Invalid vehicle or article IDs also return 404. Historical HTML paths and retired CSS/JavaScript asset URLs are not public fallbacks.

## Source ownership

- `src/routes` owns pages, route loading, metadata, robots, sitemap, and URL behavior.
- `src/lib/components` owns shared layout and UI primitives.
- `src/lib/data` owns typed inventory, listing, company, editorial, navigation, and homepage content.
- `src/lib/config` owns verified lead identity.
- `src/app.css` plus component and route styles own the visual system.
- `static` contains exactly 59 guarded runtime media files.

Listing search/filter/sort, blog search/category, contact intent, and reusable search links use URL state so journeys remain server-renderable, bookmarkable, and shareable. Client state is reserved for real interactions such as menus, dialogs, tabs, and the principal-only calculator.

No page may fabricate staff, reviews, dates, finance promises, vehicle facts, partnerships, or backend behavior. Contact uses truthful phone, route, and topic actions; a lead form must not be presented as functional until a real destination exists.

## Assets and provenance

`npm run check:assets` guards all 59 public media files: every source reference must resolve, unreferenced static media fails the check, and retired runtime assets are forbidden.

Historical source/license evidence is retained outside the runtime:

- `ASSET_PROVENANCE.md`
- `SOURCE_LICENSE.md`
- `provenance/README.md`
- `provenance/mirror-manifest.json`
- `scripts/provenance/`

Git history and the provenance archive are evidence only; they are not application inputs.

## Reuse and release truth

This is a Day & Night lead demo, not automatically the reusable Agency OS master template. Another lead should be created through the registered demo factory and reskinned through configuration, typed data, and lead-owned assets. Promoting this architecture to a master requires a separate identity-neutral template task, license review, reuse preflight, and registry update.

A clean local validation or browser run proves only the checked-out source. A commit and push prove Git publication. A Vercel deployment is proven only after the exact project, team, commit SHA, deployment URL, domains, redirects, assets, and production browser behavior are verified. See `SVELTE_TASKS.md` for the current pending release gates.
