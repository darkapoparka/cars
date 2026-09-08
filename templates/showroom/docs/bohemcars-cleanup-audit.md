# Bohemcars Cleanup Audit

## Executive Summary

Bohemcars can be made Svelte-native without changing the current look, but the cleanup has to be
route-by-route. Auxero remains the visual source of truth while the project moves from template HTML
bridges to focused Svelte 5 components.

Completed in this pass:

- Added the Bohemcars token layer in `src/lib/styles/bohemcars.css`.
- Added Tailwind v4 theme mappings in `src/lib/styles/bohemcars.tailwind.css`.
- Added a formatter Tailwind entry file in `src/lib/styles/bohemcars.tailwind-entry.css`.
- Removed the unreferenced legacy `src/routes/layout.css` file.
- Ported `/offer` off `src/routes/layout.css` with scoped base styles and Bohemcars tokens.

## Biggest Offenders

| Priority | File                                                                | Why It Matters                                                                                                                      | Risk   |
| -------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 1        | `src/lib/server/auxero-template.ts`                                 | Main legacy renderer that imports Auxero HTML, rewrites links/forms/nav, injects body classes, and keeps raw template routes alive. | High   |
| 2        | `src/lib/server/auxero-account-data.ts`                             | Generates HTML for account/dashboard pages that should become native Svelte.                                                        | High   |
| 3        | `src/routes/auxero-guards.css`                                      | Large route guard stylesheet with broad `.btn`, `.container`, body-class, and `!important` rules.                                   | High   |
| 4        | `src/lib/components/home/HomeFiveHero.svelte`                       | Biggest Svelte monolith: hero, mobile hero, search sheet, location sheet, quick links, filter state, and large CSS block.           | High   |
| 5        | `src/lib/components/inventory/InventoryMobilePage.svelte`           | Mobile inventory mixes URL/filter data shaping, drawer state, cards, and rendering.                                                 | High   |
| 6        | `src/lib/components/detail/AuxeroVehicleMobilePdp.svelte`           | Mobile PDP bundles gallery, tabs, inquiry modal, share flow, viewer, and large CSS.                                                 | High   |
| 7        | `src/lib/components/home/HomeFiveHeader.svelte`                     | Header, topbar, mega menu, search, and mobile actions are tightly coupled.                                                          | Medium |
| 8        | `src/lib/components/home/HomeFiveFeaturedVehicles.svelte`           | Featured section, filter pills, mobile CTA, grid, and CSS can be split safely.                                                      | Medium |
| 9        | `src/lib/components/inventory/AuxeroInventoryDesktopSurface.svelte` | Desktop inventory combines form/query shaping with banner, toolbar, sidebar, results, and map shell.                                | Medium |

## What Can Be Deleted Now

- `src/routes/layout.css` was unreferenced by code after `/offer` was isolated, so it was deleted.

Do not delete the Auxero bridge yet. The raw renderer is still needed by account pages, public
slot-shell routes, runtime scripts, body classes, and the raw template catch-all route.

## What To Refactor Next

1. Account pages first:
   `src/routes/account/+page.server.ts`,
   `src/routes/account/listings/+page.server.ts`,
   `src/routes/account/listings/new/+page.server.ts`,
   `src/routes/account/listings/edit/[id]/+page.server.ts`,
   `src/routes/account/messages/+page.server.ts`,
   `src/routes/account/profile/+page.server.ts`,
   `src/routes/account/password/+page.server.ts`.

   Goal: remove `...Html` props and generated-content branches, then render native Svelte content
   inside a faithful dashboard shell.

2. Inventory mobile:
   split `InventoryMobilePage.svelte` into data helpers, search drawer, filter drawer, filter
   groups, and vehicle card pieces. Keep class names and image behavior unchanged.

3. Home hero:
   split `HomeFiveHero.svelte` into desktop hero, mobile hero, quick links, search sheet, and
   location sheet. Replace the `$effect` state assignment with `$derived` or event-driven state.

4. Mobile PDP:
   split `AuxeroVehicleMobilePdp.svelte` into gallery, drawer tabs, inquiry drawer, share action,
   and image viewer.

5. Desktop inventory:
   move filter/query helpers from `AuxeroInventoryDesktopSurface.svelte` into `src/lib/auxero` or
   `src/lib/server`, then keep the visual component focused on markup.

## Token Cleanup Sequence

1. Low-risk direct swaps:
   `src/lib/components/layout/SiteHeader.svelte`,
   `src/lib/components/layout/ScrollTop.svelte`,
   `src/lib/components/layout/MobileBottomNav.svelte`,
   `src/lib/components/home2/*`.

2. Medium-risk route/component swaps:
   `src/lib/components/common/PageBanner.svelte`,
   `src/lib/components/detail/VehicleDetailTemplatePage.svelte`,
   `src/lib/components/inventory/InventoryMobilePage.svelte`.

3. High-risk generated CSS:
   update `src/lib/server/auxero-template.ts` to emit `var(--bc-*)` values with fallbacks.

4. Vendor/template CSS:
   leave `static/assets/app.css` alone until the route ports have screenshot baselines. It is still
   the Auxero visual source of truth.

## Deletion Gate

The Auxero renderer can only be deleted after these are true:

- Account pages no longer consume generated `sectionHtml`.
- Public routes no longer depend on `AuxeroPublicShell` slot extraction.
- `src/routes/[...templatePath]/+server.ts` is removed or intentionally retired.
- `AuxeroRuntimeScripts.svelte` behavior is either unnecessary or replaced natively.
- Screenshot baselines pass for home, inventory, PDP, account, and support routes.

Then delete:

- `src/lib/server/auxero-template.ts`
- `src/lib/server/auxero-page.ts`
- `src/lib/server/auxero-account-data.ts`
- related bridge specs
- unused `.template-ref/*.html`
- unused sections of `src/routes/auxero-guards.css`

## Verification Contract

For every cleanup slice:

- Run `npx @sveltejs/mcp svelte-autofixer <file> --svelte-version 5` for edited Svelte files.
- Run `npm run lint`.
- Run `npm run check`.
- Run `npm run test:unit -- --run`.
- Run `npm run build`.
- Capture desktop and mobile screenshots for touched pages.

This keeps the project fast, cleaner, and more Svelte-native without breaking the CEO-facing visual
presentation.
