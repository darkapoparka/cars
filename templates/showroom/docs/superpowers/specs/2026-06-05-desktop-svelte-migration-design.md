# Desktop Svelte Migration Design

**Date:** 2026-06-05
**Status:** Approved direction; implementation plan follows after review.
**Goal:** Refactor Bohemcars desktop routes from raw Auxero HTML islands into proper SvelteKit/Svelte 5 components while preserving Auxero visual fidelity.

## Decision

Migrate desktop in waves, not as a big-bang rewrite.

1. Wave 1: proposal-critical public desktop routes: `/`, `/inventory`, `/inventory/[slug]`, `/compare`, `/agents`, `/services`, `/sell-your-car`, `/contact`.
2. Wave 2: support and content routes: `/about`, `/reviews`, `/calculator`, `/faqs`, `/blog`, `/blog/[slug]`, `/terms`, `/import`.
3. Wave 3: account and admin routes: `/account/*`, `/admin/*`.

This keeps visible product quality stable while moving the whole desktop architecture toward typed Svelte components.

## Non-Negotiable Fidelity Rules

- Auxero remains the visual source of truth until a separate product decision says otherwise.
- Preserve typography, spacing, section order, card structures, image ratios, colors, button classes, forms, headers, footers, dashboard shells, and responsive behavior.
- Preserve vehicle-card actions: `compare-details btn btn-small open-modal` keeps the Auxero fill animation, and `view-details` remains the quiet text/icon link until a route-specific Svelte replacement is verified.
- Do not introduce global `.btn` or `.container` overrides.
- Keep hover effects calm: fill, subtle icon color changes, and existing Auxero button fills. No lift, glow, scale, zoom, or large-shadow motion.
- Mobile routes and mobile-only Svelte surfaces must not regress while desktop is migrated.

## Architecture

The raw template renderer remains as a reference and temporary fallback, but each migrated desktop route should render its core page body with Svelte components instead of `{@html}` sections.

Data ownership:

- `src/lib/auxero/*` shapes route-ready view data.
- `src/lib/server/*` owns server-only state, auth, session, inventory, inquiries, messages, and template reference extraction.
- `src/lib/components/*` renders visual components only.

Component ownership:

- Shared Auxero shell pieces move into reusable layout/header/footer/modal components only when they can preserve DOM classes and behavior.
- Public page sections move into feature folders: `home`, `inventory`, `detail`, `compare`, `agents`, `services`, `sell-your-car`, `contact`.
- Repeated card and form behavior should converge through typed Svelte components once characterization tests pin the existing output.

Svelte 5 standards:

- Use `$props` for props and treat props as changeable.
- Use `$derived` for computed values.
- Use `$state` only for UI state that changes rendering.
- Use direct event handlers for user actions.
- Prefer keyed `{#each}` blocks with stable ids or slugs.
- Avoid `$effect` unless syncing external browser APIs or document state.
- Run `npx @sveltejs/mcp svelte-autofixer <file>` after editing each Svelte file.

## Wave 1 Route Design

### Home `/`

Current state: many core sections are already Svelte, but `HomeFiveTemplatePage.svelte` still injects raw template body, between-section HTML, footer tail, and modal tail.

Migration target:

- Keep `HomeFiveHeader`, `HomeFiveHero`, action band, featured vehicles, browse sections, reviews, news, footer, and modals as Svelte-owned sections.
- Replace residual between-section raw HTML with explicit Svelte components where the content is visible or interactive.
- Keep hidden/template shell remnants only when they are required for verified Auxero behavior, then remove them once replaced.

### Inventory `/inventory`

Current state: mobile is native Svelte; desktop still renders an Auxero shell and uses DOMParser replacement for desktop filter/list updates.

Migration target:

- Build a desktop Svelte inventory surface from `getInventoryState`.
- Render banner, search, filter dropdowns, active filters, toolbar, view toggles, pagination, map fallback, and cards through Svelte.
- Use Svelte state for filter drawer/dropdown openness and URL navigation.
- Replace DOMParser partial refresh with route data navigation or explicit fetch data, preserving current URL semantics.

### Vehicle Detail `/inventory/[slug]`

Current state: desktop PDP is raw detail HTML with deferred scripts; mobile PDP is a Svelte island.

Migration target:

- Render desktop gallery, title block, overview, tabs/static content, sidebar, contact form, and related vehicles through Svelte components.
- Use existing `AuxeroVehicleDetail*` components where possible.
- Replace script-tail gallery behavior with Svelte event handlers and progressive enhancement.
- Keep the form submission behavior currently verified by Playwright.

### Compare `/compare`

Current state: table content is partly Svelte, shell is Auxero raw HTML.

Migration target:

- Render compare table and empty state through Svelte.
- Keep the Auxero table/card classes.
- Replace compare remove behavior with explicit Svelte handlers tied to garage state.

### Agents `/agents`

Current state: agent grid is Svelte inside Auxero shell.

Migration target:

- Render page banner/header, consultant grid, pagination shell, and footer through Svelte.
- Preserve sale-agent card classes and social/contact affordances.

### Services `/services` and Sell `/sell-your-car`

Current state: forms are Svelte inside Auxero shell; sell has a separate mobile Svelte page.

Migration target:

- Render service/sell content bands and forms through Svelte.
- Preserve form field classes, CTA placement, FAQ/service-card rhythm, and submit status behavior.

### Contact `/contact`

Current state: contact form is Svelte inside Auxero shell.

Migration target:

- Render map/contact info/form/footer handoff through Svelte.
- Preserve Bulgarian copy, form field names, and inquiry API behavior.

## Verification Gates

Before each wave:

- Capture baseline screenshots for touched routes at desktop and mobile widths.
- Run `npm run check`.
- Run `npm run test:unit -- --run`.
- Run `npm run build`.

For every migrated Svelte file:

- Run `npx @sveltejs/mcp svelte-autofixer <file>`.

For each route after migration:

- Run the relevant Playwright coverage from `src/routes/project1.e2e.ts`.
- Verify no visible desktop/mobile shell leaks.
- Verify body classes, headers, active nav, forms, favorite/compare, and route navigation still work.
- Save screenshots for routes with material visual changes.

Before any push:

- Run `npm run lint`, `npm run check`, `npm run test:unit -- --run`, `npm run build`, and relevant Playwright tests.

## Risks

- Replacing raw shell HTML too early can break Auxero modals, header behavior, body classes, and third-party script assumptions.
- Inventory desktop is the highest-risk public page because filters, view toggles, URL state, cards, favorites, and compare all interact.
- PDP gallery behavior currently depends on template scripts; it must be replaced with Svelte before script removal.
- Account/admin dashboards have dense table/form shell behavior and should wait until public routes prove the migration pattern.

## Success Criteria

- Wave 1 public desktop routes render core visible content through Svelte components rather than raw `{@html}` bodies.
- Auxero fidelity remains visually stable against the current proposal-ready baseline.
- Mobile routes are unchanged except where shared data fixes are intentional and verified.
- Raw template rendering is retained only for unmigrated routes, reference extraction, or temporary fallback.
- Tests and screenshots prove no regression for the touched routes.
