# Rencar

Key: `rencar` · version: `2026.09.06-baseline` · family: `rencar`.

Five real homepages and 45 compiled pages. Prefer Home 2 or 5 for a future dealer adaptation; long mobile heroes and stacked booking filters need a single shared template pass. Rental semantics require more than wording.

## Status

dealer-adaptation-needed. Source branding/demo content is retained as a visual baseline. This is a candidate for personalization, not a finished generic config-driven template or a sendable lead demo.

## Provenance

Moved intact from J:/cars/rencar. See audits/2026-09-06/relocations.json.

Existing license/asset notes remain with the source. No new multi-client rights determination was made. Source instructions and old project task ledgers are historical; J:/cars/AGENTS.md governs this copy.

## Run

Existing moved node_modules is retained for the local preview. A new copy uses `npm ci`.

From J:/cars, on a free port:

```powershell
./scripts/start-preview.ps1 -Template rencar -Port 6430
```

Suggested library URL: http://127.0.0.1:6430/. The suggestion is not proof that a listener is running; see the audit runtime record. Original inspected source port: 6430.

`npm run check` and `npm run build`.

## Real homepage choices

- `home01`: `/`
- `home02`: `/index-2.html`
- `home03`: `/index-3.html`
- `home04`: `/index-4.html`
- `home05`: `/index-5.html`

Copy the whole project to retain all variants. Select a primary entry after copying; retain alternate-home choice links when requested.

## Personalization boundaries

- `src/pages`
- `src/template.js`
- `public/assets/css`
- `public/assets`

These are current code/data ownership locations, not a promise that one config edits the whole app. Scan every retained route, metadata, contact value and identity-bearing asset after changes.

Five real homes, 45 compiled page components. Do not rerun scripts/prepare.mjs during a skin: it regenerates page components from captured source. Home 2 and Home 5 are the first dealer-adaptation candidates. Booking dates, driver age, daily prices and checkout need a shared conversion pass. Current mobile pages are tall and put the catalog below large hero/filter sections.

## Representative QA routes

- `/`
- `/index-2.html`
- `/index-3.html`
- `/index-4.html`
- `/index-5.html`
- `/car.html`
- `/car-2.html`
- `/car-single.html`
- `/contact.html`

Use 390 and 1440 px, plus every offered home. Exercise navigation, filters, detail return, overlay dismissal and the main contact path. Existing source data and frontend feedback do not prove real form delivery or a working provider integration.
