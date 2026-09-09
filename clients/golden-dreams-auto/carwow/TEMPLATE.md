# Carwow

Key: `carwow` · version: `2026.09.08-repair-1` · family: `showroom-carwow`.

Internal inspiration nickname, not Carwow affiliation. Yellow desktop and compact mobile compositions are intentional. Use the Cars launcher to avoid the inherited dev script's fixed port 6517.

## Status

source-branded-candidate. Source branding/demo content is retained as a visual baseline. This is a candidate for personalization, not a finished generic config-driven template or a sendable lead demo.

## Provenance

M:\codex\agency-os-projects\leads\automotive\day-night-auto-group\spartak-style; 9f05da01000d9177226b19f6d5dd8e5531964948 plus current uncommitted files

Existing license/asset notes remain with the source. No new multi-client rights determination was made. Source instructions and old project task ledgers are historical; J:/cars/AGENTS.md governs this copy.

## Run

Use a Node version supported by the retained package, and run `npm ci`.

From J:/cars, on a free port:

```powershell
./scripts/start-preview.ps1 -Template carwow -Port 6463
```

Suggested library URL: http://127.0.0.1:6463/. The suggestion is not proof that a listener is running; see the audit runtime record. Original inspected source port: 6517.

`npm run check` and `npm run build` for actual application changes.

## Real homepage choices

- `main`: `/`

Copy the whole project to retain all variants. Select a primary entry after copying; retain alternate-home choice links when requested.

## Personalization boundaries

- `src/lib/data/daynight-site.ts`
- `src/lib/data/daynight-current-inventory.ts`
- `src/lib/data/daynight-vehicles.ts`
- `src/lib/styles`
- `static`

These are current code/data ownership locations, not a promise that one config edits the whole app. Scan every retained route, metadata, contact value and identity-bearing asset after changes.

Use the Cars startup helper. The historical `scripts/dev-local.mjs` intentionally hardcodes source port 6517. Do not use that wrapper from a new client. Desktop and mobile have separate compositions. Budget tiles, contact facts, chat identity and sample status must be reviewed in a skin.

## Representative QA routes

- `/`
- `/inventory`
- `/inventory/mercedes-benz-gla-45-amg-405323`
- `/contact`
- `/sell-your-car`
- `/financing`

Use 390 and 1440 px, plus every offered home. Exercise navigation, filters, detail return, overlay dismissal and the main contact path. Existing source data and frontend feedback do not prove real form delivery or a working provider integration.

## Source refresh 2026.09.06-refresh-1

Refreshed from the owner-approved current source including uncommitted polish. See J:/cars/audits/2026-09-06/asko96-build/refresh-plan.json and baseline backups. Existing J: README and local runtime configuration are preserved.

## Shared repair 2026.09.08-repair-1

Repaired calculator/Sell outcomes, inventory URL and modal contracts, comparison actions, chat layers, supporting component patterns and sample-content consistency. Source branding remains; this is still a candidate requiring personalization and business/provider verification. Existing client copies were not updated.

- [Before/after review](../../audits/2026-09-08/carwow-finalization/before-after.html)
- [Findings, checks and limits](../../audits/2026-09-08/carwow-finalization/REPORT.md)
- [Architecture](docs/ARCHITECTURE.md), [component patterns](docs/COMPONENT-PATTERNS.md), [content contracts](docs/CONTENT-CONTRACT.md)

Checks/build and 19 unit tests pass. Matched route/state review completed at mobile/desktop widths. The six inherited visual snapshots differ and were preserved for explicit baseline review; this is not an all-green legacy visual gate or a public-release approval.
