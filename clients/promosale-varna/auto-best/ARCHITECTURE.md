# Application architecture

Auto Best is one native SvelteKit application. Svelte owns the rendered interface; TypeScript modules provide its content and domain operations. There is no CMS, database, server-side enquiry delivery, or separate client page-building runtime.

## Rendering and application shell

```text
app.html
  routes/+layout.svelte
    SiteShell
      Header + MobileMenu
      main: selected route
      Footer
```

`src/app.html` supplies the document language, viewport and icon. `src/routes/+layout.svelte` imports the self-hosted Onest font and `src/app.css`, computes canonical/noindex metadata, and renders the shared shell. `SiteShell.svelte` supplies the skip link, header, main landmark and footer. The layout chooses footer variants by route.

Each route owns its page composition and `<svelte:head>` metadata. Its `+page.ts`, where present, resolves URL state into typed page data. The first response contains server-rendered content; SvelteKit navigation updates the route without rebuilding a separate application shell. See [SvelteKit loading](https://svelte.dev/docs/kit/load) for framework behavior.

## Code ownership

| Location | Responsibility |
| --- | --- |
| `src/lib/config/brand.ts` | Business identity, contacts, logo and social destinations |
| `src/lib/config/template.ts` | Preview/indexing mode, canonical origin and optional sample sections |
| `src/lib/data/inventory.ts` | Vehicle records, display formatting and detail destinations |
| `src/lib/data/listing.ts` | Filter options, parsing, serialization, matching and sorting |
| `src/lib/data/journeys.ts` | Vehicle contact links and list-return context |
| `src/lib/data/company.ts` | Services, contact topics, preparation text and map coordinates |
| `src/lib/data/editorial.ts` | Article summaries, bodies, categories, search and related reading |
| `src/lib/data/home.ts`, `navigation.ts`, `videos.ts` | Discovery, menu and curated video content |
| Artwork data modules | Source dimensions, visible bounds and crop regions |
| `src/lib/components/` | Reusable markup, interaction state and component presentation |
| `src/lib/ui/` | Browser-specific focus, scroll and element-lifecycle helpers |
| `src/routes/` | Page assembly, URL loading, metadata and route-level CSS |

Aliases are configured in `svelte.config.js`: `$components` maps to components, `$config` to configuration and `$data` to data. SvelteKit supplies `$lib`. Types for route props and loaders come from the generated local `./$types` module.

## State flow

Inventory follows this path:

```text
GET /listing-grid?...
  +page.ts
    parseListingFilters(url.searchParams)
    filterListingVehicles(records, filters)
  +page.svelte
    ListingFilters / VehicleDiscoveryForm
    ListingResults -> VehicleCard
```

The applied filter state lives in the URL. A dialog owns a temporary draft, calculates matching vehicles from that draft, and applies it through the same parameter contract. Cancel closes the dialog without applying the draft. Hidden form fields preserve filters not edited by a particular control. Changing make resets dependent model state.

Home discovery and full inventory search share domain functions but have different presentations: the compact home picker does not need to reproduce every inventory control. Keep their common logic in data modules rather than forcing both interfaces into one large component.

Menus, expanded discovery groups, tabs, video selection, calculator inputs and enquiry steps are local component state. They are not global user/session stores. A shareable filter or return destination is URL state; an open drawer is interface state.

## Vehicle and article journeys

Vehicle and article loaders accept existing canonical numeric IDs and return a native 404 for unsupported records. Cards carry a `return` parameter containing the original list URL and an item anchor. `listReturn` confines that value to the appropriate listing or blog path. This keeps filters and the return position together.

Vehicle contact links carry `topic` and `vehicle`. The contact loader resolves them to a known topic and record; arbitrary query text is not treated as a vehicle. Import links are validated as HTTP(S) URLs, then displayed as enquiry context. The application does not fetch the listing website. The complete URL contract is in [Routes](docs/ROUTES.md).

## Components and browser interactions

Use Svelte 5 typed `$props()`, `$state` for editable state, `$derived` for computed state, and snippets for composition. A component accepts the data it renders; it should not read a sibling component through a document-wide selector. Native dialog elements implement modal presentation, while the owning component handles opening, closing, focus and scroll behavior.

DOM references and attachments are appropriate for focus, measurements and browser-resource lifetimes. Effects are for synchronizing with browser APIs, not for copying a value that can be derived. Event listeners, observers and object URLs need corresponding cleanup. Framework references: [props](https://svelte.dev/docs/svelte/$props) and [attachments](https://svelte.dev/docs/svelte/@attach).

The finance calculator divides remaining principal by a selected term; it is not a lending integration. Enquiry flows keep details and photo previews on the device until the visitor uses the browser share sheet. Clipboard/share completion is different from confirmed delivery to a business.

## CSS and media

Global imports are ordered `tokens.css`, `base.css`, `navigation.css`, `composition.css`. Component `<style>` blocks own internals; route CSS owns layout and route-scoped adaptations. The cascade is part of the existing implementation, not a new theme framework. [Styling](docs/STYLING.md) explains its actual values and responsive patterns.

Static media is referenced by public paths. Artwork helpers render existing crop/bounds data; they do not generate images. Decorative cutouts, stock photographs and text-bearing campaign banners have different roles. [Assets](ASSET_PROVENANCE.md) explains their origin and treatment.

## Server and build boundary

`src/hooks.server.ts` handles the explicit legacy redirect set and response headers. `robots.txt` and `sitemap.xml` are route handlers. `template.ts` determines indexability. Build output is produced by the Vercel adapter selected in `svelte.config.js`; configuration details belong in [Deployment](docs/DEPLOYMENT.md).

## Extending the template

For a new article or vehicle, extend its typed records. For a new page, add a route and compose existing components. For a new reusable interaction, extract the shared behavior where a second real consumer exists. Add a backend boundary only when a client needs an actual integration. This keeps ordinary dealership customization focused on content rather than framework work.

[Components](docs/COMPONENTS.md) maps concrete implementations; [Data](docs/DATA.md) covers record shapes; [Testing](docs/TESTING.md) documents the scripts that exercise them.
