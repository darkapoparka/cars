# Template reference

| Property | Value |
| --- | --- |
| Name / key | Auto Best / `auto-best` |
| Project repository | `darkapoparka/cars-template-auto-best` |
| Application | One Svelte 5 / SvelteKit application |
| Main entry | `/` |
| Homepage variants | One retained homepage; legacy home URLs redirect to it |
| Default presentation | Bulgarian, euro prices, kilometres |
| Default identity | Auto Best wordmark with source/sample contact and content data |
| Runtime content | Typed local modules; no database required |
| Build target | Vercel adapter |
| Suggested development URL | `http://127.0.0.1:6461/` |

## Main configuration

`src/lib/config/brand.ts` contains names, logo, phone, address and social destinations. `src/lib/config/template.ts` contains preview/published mode, canonical origin, identity/inventory verification flags and optional team/partner sections. Design tokens live in `src/lib/styles/tokens.css`.

These are code-level configuration modules. There is no admin panel, universal theme JSON or one-switch localization system. Headlines, service artwork and some campaign copy live with their components or feature data; [Reuse](REUSE_GUIDE.md) and [Components](docs/COMPONENTS.md) identify them.

## Defaults that matter when copying

The template starts in preview/noindex mode. Sample team and partner sections are disabled. Vehicle records are sample data unless explicitly verified by the implementation. The brand name does not make the existing phone, map, social accounts, video selection or inventory generic.

A client copy retains the application structure and changes its content and relevant imagery. A template version should be identified by its actual source commit, not an old date embedded in an inherited manifest. Historical `.template` records describe acquisition/copy operations rather than an application release service.

## Source and current working preview

The standalone repository was established on 10 September 2026 from the Cars workspace. The owner currently reviews a development copy at `J:/cars/templates/auto-best` on port 6461. That physical directory and the standalone GitHub repository are distinct; local application changes are not automatically present in a fresh GitHub clone.

This local reference describes the working source behind port 6461, including dedicated import/trade-in components, shared enquiry helpers and finance URL context. It does not imply that these local application changes have been published to the standalone repository.

## Reference

[Setup](README.md) · [Product](PRODUCT.md) · [Architecture](ARCHITECTURE.md) · [Styling](docs/STYLING.md) · [Reuse](REUSE_GUIDE.md) · [Source lineage](SOURCE_LICENSE.md)
