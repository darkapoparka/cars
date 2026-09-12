# Native application architecture

## Product boundary

The repository is one native SvelteKit application. Svelte routes and components own the rendered document; typed modules own content and domain behavior; static files contain only media referenced by the application.

The approved Day & Night rendering is the visual contract. Architecture work may improve semantics, accessibility, loading, and ownership, but it must not silently redesign the red/black identity, Onest typography, responsive hierarchy, spacing, radii, media geometry, or conversion flow.

## Route ownership

| Surface | Canonical URL | Source |
| --- | --- | --- |
| Homepage | `/` | `src/routes/+page.svelte` |
| Inventory | `/listing-grid` | `src/routes/listing-grid` |
| Vehicle detail | `/listing-detail-v1/[id]`, IDs 1–8 | `src/routes/listing-detail-v1/[id]` |
| About | `/about-us` | `src/routes/about-us` |
| Contact | `/contact` | `src/routes/contact` |
| Editorial index | `/blog` | `src/routes/blog` |
| Editorial detail | `/blog-detail/[id]`, IDs 1–9 | `src/routes/blog-detail/[id]` |
| Search-engine endpoints | `/robots.txt`, `/sitemap.xml` | route handlers under `src/routes` |

`src/hooks.server.ts` owns the complete alias policy. It issues permanent 308 redirects and appends the original query string:

- `/home02`–`/home10` → `/`
- `/blog-grid` → `/blog`
- `/listing-grid2`, `/listing-list`, `/listing-grid-map`, `/listing-list-map` → `/listing-grid`
- `/listing-detail-v2/[id]`–`/listing-detail-v5/[id]` → `/listing-detail-v1/[id]` for IDs 1–8
- `/faq` → `/contact`

Anything outside the canonical or redirect sets resolves through the native error boundary. Invalid typed IDs, retired account/dealer pages, historical HTML paths, and retired template CSS/JavaScript URLs return 404. Do not add a catch-all renderer or silent fallback.

## Data and rendering

- `src/lib/config/brand.ts` is the verified business-identity source.
- `src/lib/data/inventory.ts` is shared by homepage inventory, quick search, listing results, recommendations, and vehicle detail.
- `src/lib/data/listing.ts` parses URL filters and applies deterministic filtering/sorting.
- `src/lib/data/company.ts` owns services, contact topics, showroom data, and explicitly disclosed demo-only content.
- `src/lib/data/editorial.ts` owns editorial summaries, detail copy, categories, and tags.
- `src/lib/data/home.ts` and `navigation.ts` own reusable homepage/navigation presentation data.

Pages should emit useful server-rendered HTML on the first response. Above-the-fold media belongs in initial markup with explicit dimensions and appropriate loading priority.

Search, filters, sort order, editorial query/category, contact topic, and reusable journey links belong in URL/search parameters. Keep transformations pure and deterministic. Client state is appropriate for menus, dialogs, tabs, and calculator controls; it is not a page-construction mechanism.

Shared UI belongs under `src/lib/components`. Do not copy vehicle cards, editorial cards, header/footer structures, map markup, or route controls between pages. Svelte 5 components should use typed `$props`, snippets, derived state, and scoped effects only where interaction requires them.

Application code must not compose pages from fetched templates, parse HTML with `DOMParser`, clone/create document structures, run retry observers, inject raw template HTML, or load retired template CSS/JavaScript. `scripts/check-architecture.mjs` enforces this boundary and must not be weakened to make a check pass.

## Content integrity

The available data is presentation data, not permission to invent business facts.

- Vehicle detail resolves only fields present in typed inventory.
- The calculator communicates principal division only; it must not invent interest, approval, repayment, or credit-offer claims.
- Editorial detail may use concise, truthful guidance but must not fabricate authors, dates, expertise, testimonials, or source facts.
- Team/partner demo content must retain its visible disclosure until replaced with verified records.
- Contact intent is URL-driven and its phone/map actions are real. Do not add a submit control until a real lead destination and failure/success behavior exist.
- Do not add unverified email, opening hours, social URLs, reviews, finance claims, or inventory facts.

## Visual and interaction system

The visual contract includes:

- Day & Night crimson/black identity and self-hosted Onest;
- floating shared header and established desktop/mobile hierarchy;
- shared route-hero geometry and approved overlays;
- static card/media geometry without image zoom or lift;
- URL-driven inventory and editorial discovery;
- visible keyboard focus and honest hover feedback;
- red Call and black Route/Inspection actions where those semantics apply;
- no separator scaffolding or nested-card inflation in the Contact composition.

Remote font requests are forbidden. Onest is supplied by `@fontsource-variable/onest`; fallbacks exist only for load resilience.

## Static assets and historical evidence

`static` contains 59 runtime media files. `scripts/check-assets.mjs` scans source references and static media so that:

- every referenced `/assets/...` or `/favicon.ico` file exists;
- every static media file is referenced, except the explicit favicon case;
- retired runtime files cannot return to `static`.

Source/license history lives in `ASSET_PROVENANCE.md`, `SOURCE_LICENSE.md`, `provenance/`, `scripts/provenance/`, and Git history. These files are not imported, served, or required by the application build.

## Toolchain and release gates

The project requires Node 22.x and records npm 10.9.8 as its package manager. `svelte.config.js` uses `@sveltejs/adapter-vercel`.

`npm run validate` executes:

1. architecture boundaries;
2. the 59-file asset/reference boundary;
3. SvelteKit synchronization and Svelte diagnostics;
4. the production build.

`npm run quality` aliases that chain. `npm run smoke` expects the production preview and covers canonical routes, responsive geometry, interactions, query-preserving redirects, and representative route/asset 404s.

The GitHub workflow uses Node 22, `npm ci`, validation, a production preview, pinned Playwright, smoke coverage, and uploaded transient evidence. It runs for pull requests targeting `main` or `refactor/sveltekit-architecture` and pushes to `main`.

Source checks, remote Git state, and hosted Vercel state are separate evidence layers. Never describe a local pass as a deployment, or a deployment as production-ready until the exact SHA, project/team, domain, redirects, assets, and browser journeys are checked.

## Reusable reskin boundary

This checkout is lead-specific. A reskin changes verified identity, navigation copy, inventory, company/editorial/home data, metadata, and lead assets through their owned modules. It must not fork route markup or introduce lead-name conditionals.

The project is not a master template merely because it is cleanly structured. Master-template promotion requires a separate generic candidate, complete identity removal, asset/license review, reuse validation, and Agency OS registry approval.
