# Desktop Standardization Audit — 2026-09-11

## Scope

Audit target: `http://127.0.0.1:6517/` at 1440×1000 desktop.

This audit covers the main public storefront routes, their shared chrome, hero composition, controls, spacing, route architecture, and Svelte/SvelteKit structure. The goal is not to redesign the site, but to turn the strongest existing patterns into one enforced storefront system.

The current canonical visual direction is the homepage plus the newer yellow route-hero family used by Inventory, Services, Sell, About, Contact, and Financing.

## Executive summary

The desktop header is already the strongest standardized part of the site. Across normal public routes it is a consistent 94px yellow two-row chrome with the same logo, navigation, contact tools, search, compare, favorites, and sell actions.

The main inconsistency begins immediately below the header. The site currently has multiple hero/page-intro systems, multiple control geometries, and several independent route shells that duplicate chrome/footer/mobile composition.

The right strategy is therefore:

- keep the existing yellow Chroma/Home/Inventory direction;
- make it the mandatory storefront shell;
- centralize public chrome/footer composition in a SvelteKit route-group layout;
- reduce the yellow route hero to a true reusable primitive;
- migrate legacy route intros to that hero contract;
- standardize controls, spacing, radii, typography and containers through semantic tokens;
- remove page-owned copies of shared shell behavior and legacy CSS adapters as ownership moves.

## Live route audit

| Route                                       | Header  | Yellow hero                      | Status                                   |
| ------------------------------------------- | ------- | -------------------------------- | ---------------------------------------- |
| `/`                                         | ✅ 94px | ✅ Home hero, 410px              | Canonical reference                      |
| `/inventory`                                | ✅      | ✅ 325px search/filter variant   | Good specialized variant                 |
| `/services`                                 | ✅      | ✅ 390px                         | Good                                     |
| `/sell-your-car`                            | ✅      | ✅ 390px                         | Good                                     |
| `/sell-your-car/request`                    | ✅      | ✅ 390px                         | Good                                     |
| `/about`                                    | ✅      | ✅ 390px                         | Good                                     |
| `/contact`                                  | ✅      | ✅ 390px, contact artwork        | Good                                     |
| `/financing`                                | ✅      | ✅ 390px                         | Good                                     |
| `/reviews`                                  | ✅      | ❌ legacy white/breadcrumb hero  | Migrate                                  |
| `/calculator`                               | ✅      | ❌ legacy page heading           | Migrate                                  |
| `/compare`                                  | ✅      | ❌ legacy page heading           | Migrate                                  |
| `/team`                                     | ✅      | ❌ legacy page heading           | Migrate                                  |
| `/blog`                                     | ✅      | ❌ separate editorial hero       | Migrate                                  |
| `/faq`                                      | ✅      | ❌ legacy breadcrumb/title       | Migrate                                  |
| `/terms`                                    | ✅      | ❌ different H1 treatment        | Migrate                                  |
| `/favorites`                                | ✅      | ❌ black 288px hero              | Migrate                                  |
| `/about/daynight-auto-plovdiv`              | ✅      | ❌ legacy profile intro          | Migrate                                  |
| `/blog/kak-da-kupim-upotrebyavan-avtomobil` | ✅      | ❌ legacy article intro          | Migrate                                  |
| `/inventory/map`                            | ✅      | ❌ jumps directly into workspace | Needs Chroma-compatible workspace header |
| `/team/prodazhbi-daynight-auto`             | ❌      | ❌                               | Current stale route resolves to 404      |

## Route correctness issue

`src/lib/server/public-routes.ts` still advertises `team/prodazhbi-daynight-auto`, but the current team data uses these slugs:

- `prodazhbi-showroom`
- `barter-i-ocenka`
- `dokumenti-finansirane`
- `klientski-zapitvania`

The stale static route should be removed, redirected, or derived from the current team data rather than maintained independently.

## Visual drift measured in the browser

The canonical hero family is already internally consistent: yellow background, centered title, shared car artwork language, approximately 390px standard height, 48px H1 at 1440px, and a white/dark task panel when the route needs actions or controls.

Legacy routes use unrelated title scales and intro geometry:

- Reviews and Team: approximately 46px H1.
- Blog and FAQ: approximately 56px H1.
- Terms: approximately 68px H1.
- Favorites: approximately 66px H1 on a black hero.

These differences do not communicate meaningful hierarchy. They make the site feel like multiple templates joined under one header.

The same drift exists in controls: Home/Inventory already share a strong 54px search shell, 44px search action, 46px filter controls, compact shortcut chips and 8px radii, while other routes introduce 44px contact fields, 56px calculator inputs, 54px blog search, 52px Favorites CTAs, a 44px Compare CTA, and unrelated map controls.

## Architecture finding: route shells are duplicated

Several public routes independently import and compose some combination of:

`SiteChrome` → `StorefrontShell` → mobile header → mobile dock → `DayNightFooter` → `DesktopHomeTrailingChrome` → route-specific behavior.

Examples include Reviews, Calculator, Compare, Team, Blog, FAQ, Terms and Favorites. Inventory and Map also own their chrome inside specialized shells.

At the same time, the root `+layout.svelte` uses `routeManagesOwnChrome()` and pathname exceptions to decide when global chrome should not render. This creates two competing ownership models: global layout ownership and route ownership.

That structure is a major source of visual drift because each route can accidentally become its own application shell.

## Proposed SvelteKit route architecture

Use a storefront route group so public routes inherit exactly one shared shell without changing URLs:

```text
src/routes/
  +layout.svelte                 # global contexts, fonts, app infrastructure only

  (storefront)/
    +layout.svelte               # ONE public chrome/footer/mobile composition

    +page.svelte
    inventory/
    services/
    sell-your-car/
    about/
    contact/
    financing/
    reviews/
    calculator/
    compare/
    team/
    blog/
    faq/
    terms/
    favorites/

  (admin)/
  (presentation)/
```

With that structure, route pages stop knowing how the site header/footer works. `routeManagesOwnChrome()`, the growing pathname exception table, and repeated page-level chrome imports can largely disappear.

Current SvelteKit guidance explicitly supports nested layouts for shared route UI, and Svelte 5 already provides the right primitives for this project: `$props`, `$state`, `$derived`, snippets, `{@render}`, callback props, and `{@attach}`.

## Hero architecture

`DesktopYellowRouteHero.svelte` is the correct visual starting point, but at roughly 495 lines it currently knows too much. It reaches into Inventory with `:global(...)` selectors, while `InventoryDesktopPage.svelte` reaches back into the hero with another layer of route-specific `:global(...)` overrides.

That coupling should be removed.

The target should be a small `RouteHero.svelte` responsible only for shared Chroma geometry:

- yellow brand surface;
- artwork layer;
- title and lead copy;
- optional panel area;
- optional primary/secondary actions;
- optional rail below the panel;
- standard desktop/mobile behavior.

Inventory search/filter styling should belong to Inventory components. Contact-specific artwork should be a hero artwork variant/component. Generic CTA geometry should remain in the shared CTA system.

Example composition:

```svelte
<RouteHero title="Налични автомобили" description="...">
	{#snippet panel()}
		<InventorySearch />
	{/snippet}

	{#snippet rail()}
		<InventoryFilters />
	{/snippet}
</RouteHero>
```

The shared hero must never contain selectors for `.daynight-inventory-*` or another route's internal DOM.

## Desktop geometry to freeze

The site already contains most of the right values. Promote them to explicit semantic desktop tokens and make components consume those tokens rather than reproducing literal values.

| Role                            |                           Target |
| ------------------------------- | -------------------------------: |
| Normal desktop header           |                             94px |
| Sticky desktop header           |                             62px |
| Standard route hero             |                            390px |
| Route H1 at 1440px              |                             48px |
| Main content/container width    |                           1320px |
| Desktop page edge gutter        |                             32px |
| Max hero heading/readable width |                            920px |
| Standard CTA / action           |                             48px |
| Search outer shell              |                             54px |
| Search trailing action          |                             44px |
| Filter trigger                  |                             46px |
| Compact actionable control      |                      44px target |
| Visual shortcut chip            | 36px, 44px coarse-pointer target |
| Standard control radius         |                              8px |
| Standard panel/card radius      |                             12px |

Use the existing spacing scale as the base: 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 52 / 76.

Semantic spacing roles should be preferred over raw route-specific numbers: 8px small internal gap, 12px sibling controls, 16px control/form groups, 20–24px card/grid gaps, 24–32px heading-to-content, and approximately 76px standard desktop section rhythm.

Avoid arbitrary route spacing such as 18px, 22px, 28px, 30px, 34px, 56px, 80px, 84px, 96px or 100px unless the value is intentionally documented. Most of those currently come from legacy-template reproduction rather than the new storefront system.

## Shared control contract

Do not invent another control family. Finish migrating every public route onto the control grammar already documented in `DESKTOP_STYLE_GUIDE.md`.

- Primary desktop action: black/charcoal, 48px standard height, 8px radius.
- Secondary action: white/light neutral with neutral border; yellow hover.
- Search: white 54px shell with 44px black trailing action.
- Filter trigger: 46px, 8px radius, light neutral default, yellow hover, black selected.
- Shortcut chip: compact text-only control; white default, yellow hover, black active.
- Inputs/selects: shared field height, border, radius and typography roles rather than route-local values.
- Header utilities: 48px transparent icon targets with consistent 24px outline icons.
- Media overlay actions: circular; discovery/form controls: rounded rectangles.

Hero CTAs should consume this contract instead of redefining 9px radius, weight 800, or per-route heights inside the hero component.

Map is allowed to remain a specialized workspace layout, but its buttons, sort control, filter trigger, view toggles, cards and typography should use the same primitive/control roles as Inventory.

## Component/code findings

The codebase already uses modern Svelte 5 patterns in many places: `$state`, `$derived`, `$props`, snippets, `{@render}` and `{@attach}`. Keep that direction.

The problem is component ownership and size. Several migrated components still recreate an entire legacy page locally:

- `DesktopTeamPage.svelte`: roughly 548 lines.
- `DesktopTeamMemberPage.svelte`: roughly 586 lines.
- `DesktopYellowRouteHero.svelte`: roughly 495 lines.
- `InventoryDesktopPage.svelte`: roughly 379 lines plus legacy CSS adapters.

Those files contain local utility systems such as `.gap-30`, `.pb-100`, `.container`, `.h5`, local breadcrumbs, local heading scales and local CTA geometry. These should be replaced with shared primitives or smaller components as each route migrates.

Recommended decomposition examples:

- Team: `RouteHero` + `TeamGrid` + `TeamCard` + shared section heading.
- Team detail: `RouteHero` + `TeamProfile` + `VehicleRecommendations` + `ReviewsSection` + `ContactSection`.
- Blog index: `RouteHero` + `ArticleGrid` + `BlogFilters` + shared search field.
- Blog detail: article-specific hero/content layout but still under the same Chroma header and route-intro grammar.
- Favorites: `RouteHero` + shared inventory card grid + empty state.
- Calculator: `RouteHero` + shared form field primitives + finance calculator content.

Use typed `$props` and `$derived` for reactive derived values. Use snippets for structural composition and callback props for child-to-parent actions. Avoid `$effect` for values that can be expressed as derived state.

## CSS ownership problem

`storefront.css` currently defines the CTA contract twice: once as Tailwind `@utility` rules and again as unlayered `.sa-cta` selectors so it can win against existing unlayered legacy CSS.

`storefront-chrome.css` also has to re-emit Tailwind utilities under `@media important` for the header/footer because legacy unlayered CSS can outrank normal utility layers.

The comments correctly explain why this exists, but it must be treated as migration debt rather than the desired final architecture.

As routes become native storefront components, legacy CSS should be isolated or removed so shared primitives can have one owner without an `!important` arms race. Do not append another late global override layer to solve individual route drift.

## Quality-gate status at audit time

`npm run check` passes successfully:

```text
svelte-check found 0 errors and 0 warnings
```

The repository is not yet clean under its own full lint command. `npm run lint` stops at Prettier because 114 files currently differ from configured formatting.

Because the lint script is `prettier --check . && eslint .`, ESLint does not execute after that Prettier failure. Before calling the refactor complete, normalize formatting and then run ESLint independently or rerun the full lint command until both stages pass.

## Implementation order

1. **Fix route correctness.** Repair/remove the stale `/team/prodazhbi-daynight-auto` entry and reduce duplicated route registries where practical.
2. **Normalize code formatting.** Make Prettier clean so ESLint becomes an actual active gate.
3. **Centralize storefront layout.** Move public chrome/footer/mobile composition into `(storefront)/+layout.svelte` and remove repeated page-level shell imports.
4. **Refactor the hero.** Convert `DesktopYellowRouteHero` into a smaller route-agnostic `RouteHero` with snippet-based panel/rail composition.
5. **Migrate legacy intros.** Reviews, Calculator, Compare, Team, Blog, FAQ, Terms, Favorites, dealer profile and article detail should use the Chroma hero/page-intro contract.
6. **Freeze primitives/tokens.** One container, one heading scale, one CTA geometry, one field/filter geometry, one radius family and one spacing vocabulary.
7. **Break up monoliths.** Split legacy-page reproductions into semantic components with narrow responsibilities.
8. **Delete adapters as ownership moves.** Remove cross-component `:global()` hero/inventory overrides, duplicate local utility systems, duplicate CTA geometry and obsolete CSS workarounds.
9. **Finish specialized routes.** Bring Map and vehicle detail controls/spacing into the same visual grammar while preserving their task-specific layouts.
10. **Add automated geometry QA.** Prevent the site from drifting again.

## Automated geometry QA to add

Use a public route registry and run deterministic browser assertions at 1280, 1440 and 1920px desktop, with the separate 390px mobile suite preserved.

For standard public routes, assert:

- Chroma header background and 94px normal height;
- correct sticky-header height;
- required route hero presence except explicitly specialized workspaces/details;
- standard hero height/variant contract;
- route H1 typography role rather than arbitrary local font sizes;
- consistent container alignment and desktop gutters;
- expected control heights, radii and typography roles;
- no horizontal overflow;
- keyboard focus visibility and return after dialogs;
- route-specific interactions still work after structural migration.

Use DOM-ready plus deterministic waits rather than global `networkidle` as the default route-audit gate. The homepage embeds YouTube iframes, and third-party iframe network activity makes `networkidle` unsuitable for a stable site-wide geometry test.

Do not regenerate visual baselines merely to accept unexplained drift. Geometry assertions should catch system-level regressions before pixel screenshots are reviewed.

## Evidence captured

Desktop screenshots and route measurements from this audit are stored under:

```text
J:\template-repos\cars-template-carwow\.audit\desktop-standardization\
```

Captured examples include Home, Inventory, Services, Sell, About, Contact, Financing, Reviews, Favorites, Blog, FAQ and Inventory Map.

## Audit boundary

The live sweep covered the main public route families and identified the stale team-detail URL as a 404. A final rendered pass on a valid current `/team/[slug]` such as `/team/prodazhbi-showroom` and a real `/inventory/[slug]` detail should be included during implementation verification.

Admin, presentation routes and home experiment aliases are separate products/experiments and are not part of this storefront standardization target.

## Final direction

Keep the current Chroma/Home/Inventory direction. Do not redesign it. Make it the mandatory storefront shell, remove route-owned chrome, reduce the hero to a true primitive, migrate every legacy top section onto the same contract, and make the desktop control/spacing specification executable through shared tokens, components and browser tests rather than documentation alone.
