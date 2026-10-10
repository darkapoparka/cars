# Typography and CSS ownership tasks

Date: 15 September 2026. Status: **Phase 3 complete; Phase 4 visual preservation verified**.

This file was created during Phase 3 because no `TYPOGRAPHY-TASKS.md` existed in the checkout or repository history. It records the implemented ownership, selector, typography and dealer-theme cleanup. The visual design and successful Phase 1/2 mobile work were preserved.

## Repository and framework confirmation

- Branch: `main`; implementation started from `977d59e5dbb4fc6c1f32f304342a36d6903c155b`, which matched `origin/main` after fetch.
- During qualification, `main` advanced through `6ea812e` and `158b553`; those already-tested Phase 2 mobile search refinements were preserved. The Phase 3 commit is based on `158b553`.
- Stack: Svelte 5.57, SvelteKit 2.70, TypeScript 5.9, Vite 8.2 and the Vercel adapter on Node 22.
- Styling: native CSS, Svelte component-scoped styles and shared CSS custom-property tokens. Tailwind CSS is not installed.
- Official Svelte guidance was checked before the ownership changes: component styles are scoped and gain specificity, `:global(...)` is for intentionally global descendants inside component style blocks, and CSS custom properties are the supported parent-to-child styling mechanism.

## Phase 3 implementation checklist

- [x] Retired the separate `navigation.css` ownership layer and moved desktop/mobile header, top-bar, navigation and mega-menu geometry into `Header.svelte`.
- [x] Kept `composition.css` limited to shared shell, hero and cross-component layout relationships.
- [x] Moved discovery geometry and responsive presentation into `VehicleDiscoveryForm.svelte`.
- [x] Moved filter controls, filter-sheet geometry and responsive filter behavior into `ListingFilters.svelte`.
- [x] Moved listing result-grid and empty-state geometry into `ListingResults.svelte`.
- [x] Moved vehicle-card sizing and responsive variants into `VehicleCard.svelte`.
- [x] Reduced `listing.css` to listing-route stage and hero composition.
- [x] Replaced semantic uses of positional selectors with named classes, data slots and data variants.
- [x] Removed class-substring selectors from live source.
- [x] Removed unsupported `550` and `650` typography weights from source and guarded against their return.
- [x] Removed typography-related `!important`; the remaining `!important` declarations are non-typographic visibility/layout overrides.
- [x] Kept all live typography on the shared token roles and supported weights `400`, `450`, `500` and `600`.
- [x] Added typed `leadSite` theme/artwork configuration and changed generic components/data modules to consume it.
- [x] Mapped the active dealer theme to semantic CSS custom properties at `SiteShell.svelte` while retaining generic fallback values in `tokens.css`.
- [x] Centralized every `/assets/images/lead/` source path in `src/lib/config/lead-site.ts`.
- [x] Added `check:css-policy` to reject fragile selectors, dealer artwork/palette leakage and Svelte `:global(...)` syntax in standalone CSS.
- [x] Updated the standalone domain harness to compile the real typed lead-site configuration used by inventory fixtures.

## Ownership contract

| Concern | Owner after Phase 3 |
| --- | --- |
| Dealer palette and lead artwork | `src/lib/config/lead-site.ts` |
| Global fallbacks, typography roles and shared tokens | `src/lib/styles/tokens.css` |
| Native element/control foundations | `src/lib/styles/base.css` |
| Shared shell and hero composition | `src/lib/styles/composition.css` |
| Header/topbar/nav/mega menu | `src/lib/components/layout/Header.svelte` |
| Home/listing discovery | `src/lib/components/listing/VehicleDiscoveryForm.svelte` |
| Listing filters and filter sheet | `src/lib/components/listing/ListingFilters.svelte` |
| Listing results grid | `src/lib/components/listing/ListingResults.svelte` |
| Vehicle-card geometry | `src/lib/components/vehicles/VehicleCard.svelte` |
| Route-specific stage/hero composition | Corresponding route stylesheet |

## Validation evidence

- `npm run validate` — passed: architecture, CSS policy, token graph, typography, assets, domain, Svelte/TypeScript and production build. `svelte-check` reported 0 errors and 0 warnings; the final build completed without CSS warnings.
- `npm run smoke` — passed: route/status/error matrix, responsive layouts, navigation, return state, vehicle context/finance, Sell/Import flows, mobile filters and desktop discovery through 1920 px.
- `npm run smoke:typography` — passed at 390 and 1440 px, with workflow dock checks at 385×667 and 385×844.
- Final capture matrix — 48 clean states: eight representative routes at 375, 390, 430, 768, 1366 and 1440 px; no overflow, missing images, page errors, console errors or unexpected open dialogs.
- Critical computed-style comparison — zero differences for audited header, discovery, filter, results-grid and vehicle-card geometry at 375, 1024 and 1440 px.
- Source scans — zero unsupported `550`/`650` weights, typography `!important`, class-substring selectors, positional selectors, standalone-CSS `:global(...)`, or lead artwork paths outside `lead-site.ts`.
- `git diff --check` is part of the final review. The repository has no separate formatter, lint, public-test or marketplace-test package script; no substitute result is claimed for absent commands.

## Visual routes reviewed

Home, `/listing-grid`, `/listing-detail-v1/1`, Import, Sell/Barter, About, Contact and Blog were captured and inspected at 375, 390, 430, 768, 1366 and 1440 px. The browser suites additionally exercised 320, 385, 700 landscape, 844 landscape, 992, 1024 and 1920 px. Mobile navigation, drawers/dialogs, filter sheets, finance, desktop discovery and return navigation remained functional.

## Phase 4 preservation note

Phase 4 changed state and presentation ownership only. It added no typography values, visual tokens, selector overrides or redesign work. The exact production-preview comparison between parent `8e08d79` and implementation `bacbb41` produced 28/28 pixel-identical screenshots and 28/28 identical geometry records across the eight representative routes at 390 and 1440 plus the changed shell/discovery boundaries at 767/768 and 991/992. `npm run validate` continued to report 1,074 typography declarations using shared tokens or inheritance, with no unsupported weights or typography `!important` rules.

The final Phase 4 browser and typography-smoke results are recorded in `docs/ARCHITECTURE-REFACTOR-PLAN.md`. This note does not reopen or restyle the completed Phase 3 typography/CSS ownership work.
