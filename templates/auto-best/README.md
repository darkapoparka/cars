# Auto Best

A reusable automotive website template built with **Svelte 5, SvelteKit, TypeScript and Vite**. Clone it for a dealership, replace the business content and imagery, and build on the existing interface instead of rebuilding the site.

Project repository: **`darkapoparka/cars-template-auto-best`**.

## What is included

An image-led homepage, vehicle inventory with URL-based filtering and sorting, vehicle detail pages, sell/trade-in and import enquiry journeys, a principal-only finance calculator, About and Contact pages, and an editorial index with article pages. Desktop mega navigation and mobile navigation share the same site shell.

The default interface is Bulgarian, with euro prices and kilometre-based mileage. Business content and inventory are editable TypeScript data, not a database or live feed. Forms prepare browser-local drafts for copying or sharing; no email or CRM delivery is configured.

## Run locally

Use **Node 22.12 or newer within the 22.x line**. The package records npm 10.9.8; dependency versions are resolved by `package-lock.json`. Run these commands from the directory containing `package.json`:

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 6461 --strictPort
```

Open `http://127.0.0.1:6461/`. The explicit port overrides the Vite defaults. An existing server does not need to be restarted for Markdown changes.

```sh
npm run check
npm run build
npm run preview -- --host 127.0.0.1 --port 6462 --strictPort
```

Choose a free port for the production preview. Browser setup, Windows commands and troubleshooting are in [Development](docs/DEVELOPMENT.md) and [Testing](docs/TESTING.md).

## Project structure

```text
src/
  app.html                 HTML document shell and favicon
  app.css                  Global stylesheet entry point
  hooks.server.ts          Legacy redirects and response headers
  lib/
    config/                Brand identity and presentation settings
    data/                  Inventory, content and URL/domain logic
    components/            Svelte components grouped by feature
    styles/                Tokens and shared CSS
    ui/                    Browser interaction helpers
  routes/                  Pages, page loaders and HTTP endpoints
static/                    Public images and icons
scripts/                   Checks and browser tests
docs/                      Developer reference
provenance/                Asset origins and third-party notices
```

## Start with the right document

| Question | Document |
| --- | --- |
| How does the application fit together? | [Architecture](ARCHITECTURE.md) |
| How do its colors, spacing and responsive patterns work? | [Styling](docs/STYLING.md) |
| Which component should I edit? | [Component guide](docs/COMPONENTS.md) |
| How do inventory, filters and content work? | [Data reference](docs/DATA.md) |
| Which URLs and query parameters are supported? | [Routes and journeys](docs/ROUTES.md) |
| How do I adapt it for a dealer? | [Reuse guide](REUSE_GUIDE.md) |
| How do I run tests or deploy it? | [Testing](docs/TESTING.md) · [Deployment](docs/DEPLOYMENT.md) |

[Product overview](PRODUCT.md), [template reference](TEMPLATE.md), [agent notes](AGENTS.md), [asset provenance](ASSET_PROVENANCE.md) and [source notices](SOURCE_LICENSE.md) complete the reference.

The template intentionally retains source/sample content for its design. Replace it when creating a real dealer site. Technical setup does not depend on an Agency OS account, CRM, database, or another automotive template.
