# Native storefront architecture

Updated 12 September 2026 for `darkapoparka/cars-template-carwow`. Desktop and mobile remain intentional, independently styled compositions. This is not a generic schema-driven page renderer.

## Request and route boundaries

`src/routes/+layout.server.ts` selects the initial viewport per request. `src/lib/hooks/viewport.svelte.ts` creates one request-local context and one client media-query listener. `src/lib/config/viewport.ts` owns the 991/992px boundary. Route components read this context; they do not install competing width listeners or serialize another device guess into page data.

`src/lib/config/storefront-routes.ts` owns native chrome/body-class policy without an HTML-filename registry. Home's existing body classes remain a CSS contract. `src/lib/server/legacy-redirects.ts` preserves historical staff bookmarks; the catch-all cannot render raw templates or match inherited object properties.

`DesktopStylesheet.svelte` and `src/lib/client/desktop-stylesheet.ts` own pre-hydration and client-navigation loading of desktop-only home/detail CSS. Links are deduplicated, media-gated, and installed when resizing into desktop. Home preserves its before-component-styles cascade; detail preserves append placement. Phones do not request these desktop-only sheets on initial load.

Every page owns exactly one semantic main/skip target. Never repair landmarks after hydration or wrap a component that already provides its own main. Vehicle detail uses one exclusive viewport branch; do not hide that already-selected composition with a second CSS breakpoint. That redundant gate produced a blank page in WebKit at 992px with the reserved scrollbar gutter.

## Catalog and native page data

`repositories/public-inventory.ts` is the inventory source boundary. Only the repository decides whether unconfigured standalone mode uses fixtures. An explicitly empty published catalog must remain empty.

`home-page-data.ts`, `daynight-inventory-page.ts`, and `daynight-detail-page.ts` are synchronous, explicit-catalog presentation adapters. Their types live in `src/lib/types/home.ts` and `src/lib/types/storefront-page.ts`. They do not carry executable scripts, raw HTML, template files or hidden static-inventory fallbacks. The home variants reuse one server loader while retaining distinct native compositions.

Blog publication follows `loadPublishedBlogArticles`; a configured CMS failure is not permission to replace published content with fixture articles. Team, business identity, reviews and editorial data retain their existing shared owners and disclosures.

## Inventory, finance and garage state

`src/lib/utils/inventory-url.ts` owns parsing/serialization and sort aliases for both layouts. Repeated multi-values, legacy query aliases and unrelated query context remain supported. Unsupported/prototype-named sort input falls back safely. `inventory-filters.svelte.ts` owns matching; native desktop/mobile controls may differ but must not fork business rules.

`finance-estimate.ts` owns the illustrative calculation, validation, EUR formatting and legacy/current query parsing. Calculator and vehicle handoffs call the same model. Assumptions remain disclosed; previews are not offered financing terms.

Garage persistence remains a separate, request-isolated context with fresh initial arrays and browser storage only after mount. Storage getter failures leave selections usable in memory. Each instance owns one replaceable feedback timer; the root layout releases it on unmount. Search drafts must not become module-level singletons. The mobile home uses a per-mounted-sheet `HomeSearchState`; search, import and location components own independent tasks. Closing a sheet resets navigation without destroying its draft.

## Lifecycles and styles

`MobileFullSheet.svelte` owns native modal/top-layer behavior, focus containment/return, Escape, content-sheet backdrop gestures, scroll locking and visual viewport sizing. Feature components own labels and apply/cancel semantics. Pending focus callbacks are guarded after disposal. `MobileDrawer.svelte` remains the compact drawer primitive; do not restyle the full-sheet primitive to fix one explainer.

`daynight-image-fallback.ts` owns one reference-counted image listener per element, immediate failure detection and placeholder recovery. It uses image events, not timer polling. `RouteImageBehavior.svelte` uses one capture listener and only visits newly added subtrees; it does not repeatedly scan the complete document or mutate main landmarks. Native accordion components own their state; the legacy DOM accordion adapter is removed.

The inventory family uses one ordered `inventory-desktop.css` module for base, layout, retained card rules and native overrides. Do not split these back into competing imports: development and production chunk order previously produced different search controls and listing gutters.

Component CSS owns local geometry. Shared family CSS may be extracted only with an explicit namespace and preserved specificity. The home sheet extraction keeps the previous one-class Svelte specificity; before/after overlay captures verify its cascade.

## Maintenance guardrails

`npm run check:architecture` resolves route/test roots, CSS imports, TypeScript `.js` aliases, `.svelte.js` runes modules and declared script entry points. It rejects unresolved local imports and unreachable source modules. It is a module-level check, not proof that every export or external/public asset is unused.

`npm run clean:workspace` is a dry run by default. `--apply` deletes only explicit generated directories after validating the complete plan against tracked files. Audit evidence requires an additional `--include-audits` opt-in. Stop dev/preview servers first. Never run a general root-file glob as repository cleanup.

Current verification commands and boundaries are in `QA.md`. No code refactor establishes real lead delivery, authorized admin workflows or deployment readiness.
