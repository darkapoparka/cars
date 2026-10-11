# 03 — Minimal target architecture

## Principles

Keep one SvelteKit application and one retained npm lockfile. Organize by the application’s actual responsibilities. A folder is useful when it clarifies ownership, not merely because another template uses that name.

The public site, preview data and optional administrative capabilities have different responsibilities. Their code can live in the same repository without sharing mutable user state, CSS globals or live-provider assumptions. Desktop and mobile share domain behaviour and visual roles; they may use different compositions.

## Target structure

This is a direction, not a bulk rename assignment. Move a file only while migrating its actual consumers. Existing paths may remain where their ownership is already clear.

```text
src/
  routes/
    +layout.svelte                  # app-wide providers and stylesheet entry only
    (site)/
      +layout.svelte                # native public shell
      +layout.server.ts             # safe site-level data, only when needed
      +page.svelte
      inventory/+page.server.ts
      inventory/+page.svelte
      inventory/[slug]/...
      import/...
      sell-your-car/...
      ...                          # supported public route families
    admin/...                      # explicitly gated administrative surface
    api/...                        # actual API consumers, not duplicate page logic
    [...templatePath]/+server.ts    # temporary allowlisted compatibility boundary
  lib/
    config/
      site.ts                      # typed, serializable public configuration
      site.schema.ts               # only if runtime/imported config needs validation
    styles/
      app.css                      # sole Tailwind/base import owner
      tokens.css                   # semantic values, density and role scales
      theme.css                    # Tailwind mappings, not a second value source
      legacy.css                   # temporary, explicitly scoped compatibility
    components/
      ui/                          # existing primitive family, curated and themed
      layout/                      # public shell/header/footer/container
      common/                      # genuinely shared product patterns
      home/
      inventory/
      detail/
      services/
      sell-your-car/
      ...                          # retain useful feature ownership
    domain/
      inventory-query.ts           # pure URL/filter behaviour shared across views
      finance.ts                   # one approved estimate calculation contract
      ...                          # only behaviour that earns a shared boundary
    types/
      vehicle.ts                   # canonical domain types; avoid parallel copies
    data/
      fixtures/...                 # explicit synthetic/demo content
      ...                          # typed content and translation sources
    state/
      garage.svelte.ts             # context-owned client state, preserve strengths
    server/
      config.ts                    # private mode/provider validation
      auth/...                     # sessions and authorization, extracted as needed
      inventory/...                # reads/mapping, no presentational HTML
      inquiries/...                # durable/demo boundary and submission service
      legacy/...                   # isolated adapter while consumers remain
      ...
```

Do not create empty directories to match this diagram. Do not build a generic `Repository<T>` hierarchy or a configuration-driven renderer. A small set of functions and explicit imports is preferable to factories with one implementation.

## Dependency direction

Routes call server services and present typed results. Server services may use domain functions, schemas, server-only configuration and adapters. Client components may use public config/types/domain helpers, but never private environment variables, database modules or provider credentials. Primitives know nothing about vehicle listings, route names or dealers. Feature components know their domain but do not mutate global body state owned by another feature.

A temporary legacy adapter may depend on the new domain to preserve compatibility. New components must not depend on legacy HTML selectors, template filenames or script replay. This creates a one-way exit instead of a permanent hybrid.

Do not create a universal component barrel that makes every feature depend on every other feature. Conversely, do not ban all index files: a small primitive’s existing public exports are reasonable.

## Shell ownership

Root layout owns app-wide providers, safe global foundations and the garage context. The site layout owns one public header/footer/main relationship. Admin owns a deliberately scoped dense theme and layout. A page owns its title/content composition, not `document.body.className` or another page’s modal cleanup.

Route groups are useful when they remove the current `auxeroFullPage` branching and duplicated chrome. They must preserve URL paths. Do not move all routes first and repair the imports later. Migrate a tested family into the native shell, keep unmigrated families behind the compatibility path and test transitions in both directions.

The final public shell should not accept `pageDocument`, `headHtml`, `runtimeHtml`, legacy modals or a full template document. Use typed site config and explicit page metadata. Do not put a 50-property global view model in root layout merely to avoid several clear props.

## Feature ownership map

| Current cluster                                  | Target owner                                                             | Keep versus change                                                                           |
| ------------------------------------------------ | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| `HomeFiveHeader`, mobile appbar/menu/bottom nav  | Layout + shared navigation data                                          | Keep mobile patterns; remove per-route appearance overrides and duplicated state             |
| `AuxeroPublicShell`, root route switching        | Native site layout                                                       | Remove body/script/template prop contracts as consumers migrate                              |
| `InventoryTemplatePage`, desktop/mobile surfaces | Inventory composition                                                    | Share query/data, allow responsive affordances; SSR essential content                        |
| Desktop/mobile facet implementations             | Inventory facet controls + pure query module                             | Share options/selection/clear semantics, not one huge responsive supercomponent              |
| Home/inventory/mobile/favorite cards             | Shared vehicle-card contract with a small number of intentional variants | Share facts, formatting, action semantics and style roles; review grid/list differences      |
| Detail desktop/mobile components                 | Detail view model and section-level components                           | Share gallery data, facts, price/contact actions; compose by viewport                        |
| Import/sell wizards and desktop service cards    | Form schemas/controllers + feature step content                          | One field/error/submission contract; distinct mobile/desktop shells                          |
| `auxero-*.ts` server rewriting                   | Temporary legacy adapter                                                 | Stop new consumers; retire only after route and packaging proof                              |
| `db.ts`, CMS JSON persistence                    | Explicit demo adapters and live server services                          | Preserve fixtures; do not imply that durable inquiries make all features durable             |
| `i18n/messages.ts` and label comparisons         | Explicit locale and typed messages                                       | Expand structured messages where needed; no replacement i18n package without a concrete need |

## Component extraction criteria

Extract when code has its own interaction contract, repeated design role, independent lifecycle, or substantial testable business behaviour. A facet popover and a vehicle gallery qualify. A two-line heading used once does not automatically need a component. A shared formatter should not become a formatter service class.

Prefer Svelte snippets for repeated composition within one component and ordinary props for explicit variations. Use a small discriminated variant when there are genuinely different modes. Avoid boolean combinations such as `compactDesktop + showX + legacyMode + mobileOnly + specialHome` that permit invalid combinations.

Large components may temporarily remain large while ownership is clarified. Do not split a 3,000-line component into ten files that still share hidden DOM selectors and global styles; that moves the problem instead of fixing it.

## Migration and compatibility

Define the supported route manifest first. Keep canonical query aliases and redirects at boundaries. For each migrated route, compare the old and new data semantics, head output, navigation, forms and browser-history behaviour. Remove obsolete imports/style rules in the same packet where safe, and record any remainder in the cleanup ledger.

Continue to support standalone `/` in this repository. Do not hardcode `/variant-2/` into the template. Source-shape changes must be assessed against the Cars packaging contract in the release phase; this audit did not verify that separate repository.

## Architecture checks

Add targeted import restrictions for server-only code and legacy dependencies in migrated folders. Prefer the TypeScript/SvelteKit boundaries already available over a new dependency-analysis framework. A small report of unresolved/legacy imports is enough initially. Ratchet it down as routes migrate; do not exempt the whole repository to make a rule pass.

The architecture is complete when useful changes have obvious owners, the public path no longer depends on HTML rewriting, and a dealer configuration change does not require editing those owners.
