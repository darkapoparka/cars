# Boxcar

Key: `boxcar` · version: `2026.09.06-baseline` · family: `boxcar`.

Only Home 1 is currently implemented locally; other home menu entries alias it. Strong inventory and detail patterns; mobile needs compaction. Captured content and local behavior adapters.

## Status

reference-content-candidate. Source branding/demo content is retained as a visual baseline. This is a candidate for personalization, not a finished generic config-driven template or a sendable lead demo.

## Provenance

Moved intact from J:/cars/boxcar. See audits/2026-09-06/relocations.json.

Existing license/asset notes remain with the source. No new multi-client rights determination was made. Source instructions and old project task ledgers are historical; J:/cars/AGENTS.md governs this copy.

## Run

Existing moved node_modules is retained for the local preview. A new copy uses `npm ci`.

From J:/cars, on a free port:

```powershell
./scripts/start-preview.ps1 -Template boxcar -Port 6450
```

Suggested library URL: http://127.0.0.1:6450/. The suggestion is not proof that a listener is running; see the audit runtime record. Original inspected source port: 6450.

`npm run check` and `npm run build`. Existing `scripts/flows.mjs` covers deeper interactions.

## Real homepage choices

- `home01`: `/`

Copy the whole project to retain all variants. Select a primary entry after copying; retain alternate-home choice links when requested.

## Personalization boundaries

- `public/pages`
- `public/assets`
- `src/local.css`
- `src/interactions.ts`

These are current code/data ownership locations, not a promise that one config edits the whole app. Scan every retained route, metadata, contact value and identity-bearing asset after changes.

One local home only. Original menu labels Home 2-10 alias Home 1. Data is checked-in captured HTML/JSON with local interaction adapters, not a WordPress backend. Keep all real captured detail routes; verify forms and filter URLs after a skin. Mobile needs a compact filter/intro treatment in a future shared template task.

## Representative QA routes

- `/`
- `/listings/`
- `/listing/ranger-white-2022/`
- `/contact-us/`
- `/about-us/`
- `/compare/`
- `/calculator/`

Use 390 and 1440 px, plus every offered home. Exercise navigation, filters, detail return, overlay dismissal and the main contact path. Existing source data and frontend feedback do not prove real form delivery or a working provider integration.
