# Nusavo

Key: `nusavo` · version: `2026.09.06-baseline` · family: `nusavo`.

Rental storefront with local cart/checkout flows. Remote CSS mask fails CORS in the live audit. Useful for rental leads; lower priority for stock-selling showrooms.

## Status

dealer-adaptation-needed. Source branding/demo content is retained as a visual baseline. This is a candidate for personalization, not a finished generic config-driven template or a sendable lead demo.

## Provenance

Moved intact from J:/cars/nusavo. See audits/2026-09-06/relocations.json.

Existing license/asset notes remain with the source. No new multi-client rights determination was made. Source instructions and old project task ledgers are historical; J:/cars/AGENTS.md governs this copy.

## Run

Existing moved node_modules is retained for the local preview. A new copy uses `npm ci`.

From J:/cars, on a free port:

```powershell
./scripts/start-preview.ps1 -Template nusavo -Port 6420
```

Suggested library URL: http://127.0.0.1:6420/. The suggestion is not proof that a listener is running; see the audit runtime record. Original inspected source port: 6420.

`npm run check` and `npm run build`.

## Real homepage choices

- `main`: `/`

Copy the whole project to retain all variants. Select a primary entry after copying; retain alternate-home choice links when requested.

## Personalization boundaries

- `src/pages`
- `src/pages.json`
- `src/interactions.css`
- `public/styles`
- `public/assets`

These are current code/data ownership locations, not a promise that one config edits the whole app. Scan every retained route, metadata, contact value and identity-bearing asset after changes.

One home and 36 page components, including rental cart/account/checkout demo screens. Do not rerun scripts/generate.mjs during a skin. A remote CSS mask failed CORS in the initial audit and again while filtering the fleet. A quiet post-relocation homepage sample did not resolve this state-dependent issue. Prioritize for rental leads, or do one dealer adaptation before expecting branding-only sales demos.

## Representative QA routes

- `/`
- `/car-listing/`
- `/car-listing/urbango-hatchback/`
- `/contact-us/`
- `/about-us/`
- `/cart/`
- `/checkout/`

Use 390 and 1440 px, plus every offered home. Exercise navigation, filters, detail return, overlay dismissal and the main contact path. Existing source data and frontend feedback do not prove real form delivery or a working provider integration.
