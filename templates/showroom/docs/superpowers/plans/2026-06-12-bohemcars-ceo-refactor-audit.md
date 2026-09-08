# Bohemcars CEO Refactor Audit And Presentation Plan

Date: 2026-06-12

## Executive Position

Bohemcars has a strong public showroom prototype: the Home 05 surface, inventory,
mobile browsing, compare, services, sell-your-car, calculator, contact, about,
agents, and content routes are coherent enough for a controlled CEO demo.

The main risk is not the product idea or the visible direction. The risk is
template debt from the Auxero HTML migration: large compatibility bridges,
global CSS patches, remote listing images, duplicated desktop/mobile inventory
logic, and multiple owners for garage/compare state.

The refactor should be framed as a hardening plan:

1. Preserve Auxero visual fidelity.
2. Remove the legacy bridge gradually.
3. Make inventory and vehicle imagery production-grade.
4. Consolidate state and route shells.
5. Keep account/admin clearly marked as prototype surfaces until auth and data
   persistence are productionized.

## Current Verification Snapshot

Fresh checks run locally:

- `npm run check`: passed.
- `npm run test:unit -- --run`: passed, 205 tests.
- `npm run build`: passed.
- `npm run lint`: failed Prettier only.
- `npx playwright test src/routes/project1.e2e.ts --reporter=line`: 15 passed,
  3 failed against preview on port 4197.
- Fresh desktop/mobile screenshots captured under
  `outputs/qa/2026-06-12-refactor-audit/`.

Known non-code artifacts affecting lint:

- `.audit-desktop/compare.mjs`
- `.audit-desktop/inv.html`

Known source formatting offenders:

- `src/lib/components/compare/AuxeroCompareTable.svelte`
- `src/lib/components/home/HomeFiveReviewsSection.svelte`
- `src/lib/components/sell-your-car/SellYourCarMobilePage.svelte`

## Two-Hour CEO Readiness Plan

### Demo Scope

Demo these routes:

- `/`
- `/inventory`
- `/inventory?view=map`
- One known-good `/inventory/[slug]`
- `/compare`
- `/services`
- `/sell-your-car`
- `/calculator`
- `/contact`
- Optional: `/about`, `/agents`

Do not demo unless explicitly asked:

- `/home2`
- `/offer`
- raw `.html` template aliases
- deep `/account/*` surfaces
- `/admin/copilot`, `/admin/analytics`, `/admin/posts`, `/admin/settings`,
  `/admin/imports`

### Immediate Fix Order

1. Make the demo runnable from a stable command. Current preview is available at
   `http://127.0.0.1:4197/`; if preview flakes, use a dev server for the live
   meeting.
2. Replace or locally fallback the blocked BMW image:
   `https://cdn2.focus.bg/mobile/photosorg/481/2/21779118142363481_XR.webp`.
   It is blocked by ORB during client navigation.
3. Resolve stale route-contract assertions:
   - `src/routes/project1.e2e.ts` expects one `.bohemcars-pill-image--spec`,
     while current Home 05 pills render brand images and type icons.
   - `src/app.html` now uses
     `interactive-widget=resizes-content`; the mobile E2E still expects the old
     viewport meta.
4. Fix Prettier failures, and either ignore or remove stale `.audit-desktop`
   artifacts from lint scope.
5. Screenshot-check the demo routes at desktop and mobile sizes. Gate on no true
   broken images, no document-level horizontal overflow, no visible preloaders,
   and no accidental modals.

## Highest-Risk Refactor Areas

### 1. Global CSS Guard Layer

Current risk:

- `src/routes/auxero-guards.css` is imported globally from
  `src/routes/+layout.svelte`.
- It modifies body classes, modals, drawers, buttons, links, transition utility
  classes, and vehicle actions.
- It globally suppresses or alters Auxero button behavior, including
  `.btn`, `.compare-details`, and pseudo-element fills.

Refactor:

- Split global guard CSS into route-scoped Auxero guard files.
- Require broad template selectors to live under known Auxero route/body scopes.
- Remove global `.btn` and `.container` interference.
- Preserve Auxero vehicle card actions:
  `compare-details btn btn-small open-modal` and quiet `view-details`.

### 2. Auxero Runtime Bridge

Current risk:

- `src/lib/server/auxero-template.ts` is over 3,000 lines.
- `src/lib/server/auxero-page.ts` extracts and serializes raw template scripts.
- `src/lib/components/layout/AuxeroRuntimeScripts.svelte` replays scripts in the
  browser.
- `src/lib/state/garage.svelte.ts` also performs DOM badge/card syncing.

Refactor:

- Create one route-aware Auxero runtime manager.
- Replace page behaviors with Svelte components route by route.
- Load Swiper/maps only where needed.
- Remove jQuery-era script replay after each route has a Svelte owner.

### 3. Inventory Money Path

Current risk:

- `src/lib/components/inventory/InventoryTemplatePage.svelte` renders desktop
  and mobile inventory surfaces together, then chooses by media query/CSS.
- `src/lib/components/inventory/AuxeroInventoryDesktopSurface.svelte` and
  `src/lib/components/inventory/InventoryMobilePage.svelte` duplicate filter,
  card, and URL behavior.
- Filtering mixes `goto(... invalidateAll: true)`, form state, and
  `window.location.assign`.

Refactor:

- Move inventory view-model shaping to `src/lib/auxero` or `src/lib/server`.
- Share one filter/query model across desktop and mobile.
- Lazy-load mobile drawers and map-only code.
- Make vehicle cards use a shared image/action contract while keeping Auxero
  markup and hover behavior.

### 4. Garage, Favorites, Compare State

Current risk:

- Defaults are created server-side in `src/lib/server/compare-state.ts`.
- `/compare` loads selected/all vehicles from `src/routes/compare/+page.server.ts`.
- `src/lib/components/compare/AuxeroCompareTable.svelte` rereads localStorage.
- `src/lib/state/garage.svelte.ts` mutates DOM badges and cards.

Refactor:

- Create one cookie/session-backed garage state.
- Use it from server load functions and Svelte context.
- Remove direct DOM query syncing.
- Make favorite/compare badges derive from state, not scattered DOM effects.

### 5. Monolith Components

Large files to split carefully:

- `src/lib/components/home/HomeFiveHero.svelte`
- `src/lib/components/home/HomeFiveHeader.svelte`
- `src/lib/components/home/HomeFiveFeaturedVehicles.svelte`
- `src/lib/components/inventory/AuxeroInventoryDesktopSurface.svelte`
- `src/lib/components/inventory/InventoryMobilePage.svelte`
- `src/lib/components/detail/AuxeroVehicleMobilePdp.svelte`
- `src/lib/components/compare/AuxeroCompareTable.svelte`

Refactor:

- Keep visual components small and Auxero-faithful.
- Move data shaping to `src/lib/auxero` or `src/lib/server`.
- Prefer `$derived` over `$effect` for computed state.
- Keep effects for actual browser integration only.
- Run `npx @sveltejs/mcp svelte-autofixer <file>` after every Svelte edit.

### 6. Assets And Dead Template Files

Current risk:

- Remote `focus.bg` vehicle images are unreliable and can be ORB-blocked.
- Static assets include large PNG/WebP duplicates.
- `.template-ref` contains many unimported raw HTML pages.
- Dead JS candidates include `jquery.fancybox.js`, `shop.js`, `plugin.js`,
  `count-down.js`, and `countto.js`.

Refactor:

- Self-host curated, optimized vehicle images.
- Add an asset manifest test before deleting any static file.
- Prune unimported template HTML only after route aliases are typed and tested.
- Delete legacy JS/CSS only after proving no rendered route references it.

## Refactor Phases

### Phase 0: Presentation Stabilization

Goal: controlled CEO demo.

- Fix/triage the three current E2E failures.
- Format lint offenders.
- Capture final desktop/mobile screenshots for demo routes.
- Prepare a short talk track:
  "Prototype is working; refactor is to harden performance, maintainability, and
  production confidence without redesigning away from Auxero."

### Phase 1: Guardrails And Runtime Containment

Goal: stop global debt from spreading.

- Scope `auxero-guards.css`.
- Centralize body/title ownership.
- Add a route runtime manifest.
- Stop global button/container overrides.

### Phase 2: Inventory And Image Reliability

Goal: harden the revenue path.

- Self-host vehicle imagery.
- Create a shared `VehicleImage` contract.
- Consolidate inventory filter/query state.
- Lazy-load mobile-only drawers and map behavior.

### Phase 3: State Consolidation

Goal: make favorites, compare, and account surfaces reliable.

- Single garage source of truth.
- Server/client state hydration contract.
- Remove DOM-sync badge mutations.
- Stabilize account favorites defaults.

### Phase 4: Component Decomposition

Goal: make feature work safe.

- Split Home 05 hero/header/featured sections.
- Split inventory desktop/mobile controllers from views.
- Split compare table model from table rendering.
- Move helper functions out of visual components.

### Phase 5: Template And Asset Pruning

Goal: reduce bloat after behavior is owned by Svelte.

- Add rendered-route asset manifest tests.
- Delete unused template pages and blocked aliases.
- Delete unused JS/CSS.
- Rewrite safe PNG references to WebP.

## CEO Message

Recommended wording:

"We rebuilt Bohemcars on SvelteKit while preserving the Auxero visual language.
The public showroom is already demoable across desktop and mobile. The next
engineering step is a hardening refactor: remove leftover template runtime,
self-host optimized vehicle images, consolidate inventory and compare state, and
lock down performance. This is not a redesign. It is the production-readiness
phase that makes the platform faster, safer to maintain, and easier to scale."
