# Auto Best ownership contract

The application remains native Svelte 5 / SvelteKit. Refine its existing layouts and assets. Do not add a parallel styling system, client DOM composer, state library or backend for a Fast Skin.

## Responsibilities

| Owner | Responsibility |
|---|---|
| `src/lib/config/brand.ts` | Typed business identity, phone and social destinations |
| `src/lib/config/template.ts` | Preview/indexing mode, verification gates and optional sample sections |
| `src/lib/data/company.ts` | Services, contact intent, preparation copy and map coordinates |
| `src/lib/data/inventory.ts` | Numeric vehicle records; derived year, mileage and route; per-item verification |
| `src/lib/data/listing.ts` | Available facets, Bulgarian labels, parsing, serialization, counting, removal and matching |
| `src/lib/data/journeys.ts` | Validated vehicle contact context and confined list-return destinations |
| `src/lib/ui/overlay.ts` | Reversible scroll ownership and dialog Tab boundary |
| `Header.svelte` / `MobileMenu.svelte` | Shell/navigation state / native mobile menu view |
| `ArticleSupport.svelte` | Related reading and contact support for an article |

Keep draft state local to its dialog. Home discovery and inventory filters deliberately have different interfaces; share the domain contract, not their markup. Native dialogs supply background isolation. Release scroll state on close **and** unmount. Query strings remain the applied-state source of truth.

## Styling

`src/app.css` imports global sheets in a fixed order: tokens, base, navigation, composition. Preserve that order; moving a rule between sheets requires a rendered comparison.

- `styles/tokens.css`: semantic colors, focus, type, spacing and geometry variables. Do not introduce an undefined variable without a fallback. `check:domain` checks this contract.
- `styles/base.css`: native defaults, controls and shared utility classes.
- `styles/navigation.css`: baseline shared header/mega navigation.
- `styles/composition.css`: shared hero geometry, responsive shell relationships and existing cross-surface adjustments. It deliberately preserves the prior cascade.
- Component styles own internal presentation. Route CSS owns page composition and the article support component. Do not copy route overrides into a second route or add another global patch file.

The existing responsive composition is not rewritten into a new token/theme system. Existing component/global overlaps should only be consolidated with evidence for the affected family. Navigation and article support were extracted by responsibility; small presentational components should stay small.

## Content and reuse

This master uses a neutral Auto Best name, logo and icon. Day & Night source contact details, social/video content, business copy and eight **sample**, unverified vehicle records remain as personalization inputs. This is not complete genericization. Shared images on records 4/7 and 6/8 are retained source media, not proof of the same physical stock. Do not invent replacement stock facts. A client copy must replace/verify identity, each vehicle, equipment, images, map coordinates, services and editorial promises.

Sample people and partner sections default off. They remain available for template review through `template.sections`; enabling them does not establish real identities or partnerships. No fake social controls remain on sample people.

Preview mode sends noindex metadata and disallows crawling. Published mode requires a public canonical origin, verified identity/inventory, per-record evidence and disabled sample sections. This guard is a content boundary, not deployment authorization. Forms still prepare local drafts; they do not send messages.

## Validation

Use Node 22.12+ on the 22 line. `npm run validate` covers architecture, assets, pure-domain contracts, Svelte and build. `BASE_URL` is mandatory for browser qualification; Chrome is the default installed browser, with executable/channel overrides available.

`npm run smoke` covers route/viewport checks, vehicle/article journeys, menu focus, responsive media, enquiry drafts, mobile filters and desktop discovery. Reports persist incrementally under `artifacts/`. Exceptions are recorded and fail the process; partial reports are not a pass. `npm run quality` combines static/build and browser gates. When rebuilding a local preview, stop the owned dev listener, validate, restart with the Cars helper, then run smoke against the confirmed URL.

The earlier 2,019-line smoke script is preserved in the audit source backup. It mixed historical sample counts, exact pixels and workflows. Its replacement separates route/render checks from journey assertions; dedicated filter/enquiry suites retain the deeper behavior checks. Screenshot review is required in addition to automated checks.
