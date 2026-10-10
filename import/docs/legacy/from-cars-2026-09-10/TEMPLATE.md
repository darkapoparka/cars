# Import

Key: `import` · version: `2026.09.06-baseline` · family: `auxero`.

Dark Day & Night source baseline with buy/import/sell journeys. Related to showroom; not an entirely independent template family.

## Status

source-branded-candidate. Source branding/demo content is retained as a visual baseline. This is a candidate for personalization, not a finished generic config-driven template or a sendable lead demo.

## Provenance

M:\codex\agency-os-projects\leads\automotive\day-night-auto-group\bohemcars-style; 48facd336a99647988bc55419eef2f4bbdfa362e plus current uncommitted files

Existing license/asset notes remain with the source. No new multi-client rights determination was made. Source instructions and old project task ledgers are historical; J:/cars/AGENTS.md governs this copy.

## Run

Run `npm ci` using the retained lockfile.

From J:/cars, on a free port:

```powershell
./scripts/start-preview.ps1 -Template import -Port 6464
```

Suggested library URL: http://127.0.0.1:6464/. The suggestion is not proof that a listener is running; see the audit runtime record. Original inspected source port: 6518.

`npm run check` and `npm run build` for application changes.

## Real homepage choices

- `main`: `/`

Copy the whole project to retain all variants. Select a primary entry after copying; retain alternate-home choice links when requested.

## Personalization boundaries

- `src/lib/data/daynight.ts`
- `src/lib/data/daynight-listings.json`
- `src/lib/data/vehicles.ts`
- `src/lib/styles`
- `static`

These are current code/data ownership locations, not a promise that one config edits the whole app. Scan every retained route, metadata, contact value and identity-bearing asset after changes.

Preserve the Auxero-derived route structure, the compact mobile shell and existing search/filter contracts. Central source data is in daynight.ts/daynight-listings.json, with additional template identity in routes and assets. This is related to showroom, not an independent design family.

## Representative QA routes

- `/`
- `/inventory`
- `/inventory/21764342419542174`
- `/contact`
- `/sell-your-car`
- `/financing`

Use 390 and 1440 px, plus every offered home. Exercise navigation, filters, detail return, overlay dismissal and the main contact path. Existing source data and frontend feedback do not prove real form delivery or a working provider integration.
