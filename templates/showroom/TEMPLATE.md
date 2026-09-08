# Showroom

Key: `showroom` · version: `2026.09.06-baseline` · family: `auxero`.

ELIQ source retained as a distinct red/white showroom baseline. This local key does not replace Agency OS's different historical showroom template.

## Status

source-branded-candidate. Source branding/demo content is retained as a visual baseline. This is a candidate for personalization, not a finished generic config-driven template or a sendable lead demo.

## Provenance

M:\codex\agency-os-projects\leads\automotive\eliq-auto\bohemcars; f5f9d924171c347345b39781f8fb034e15ed6aa9 plus current uncommitted files

Existing license/asset notes remain with the source. No new multi-client rights determination was made. Source instructions and old project task ledgers are historical; J:/cars/AGENTS.md governs this copy.

## Run

Run `npm ci` using the retained lockfile.

From J:/cars, on a free port:

```powershell
./scripts/start-preview.ps1 -Template showroom -Port 6465
```

Suggested library URL: http://127.0.0.1:6465/inventory. The suggestion is not proof that a listener is running; see the audit runtime record. Original inspected source port: 6404.

`npm run check` and `npm run build` for application changes.

## Real homepage choices

- `main`: `/`

Copy the whole project to retain all variants. Select a primary entry after copying; retain alternate-home choice links when requested.

## Personalization boundaries

- `src/lib/data/eliqauto.ts`
- `src/lib/data/eliqauto-media.ts`
- `src/lib/data/eliqauto-listings.json`
- `src/lib/data/eliqauto-about.ts`
- `src/lib/styles`
- `static`

These are current code/data ownership locations, not a promise that one config edits the whole app. Scan every retained route, metadata, contact value and identity-bearing asset after changes.

The snapshot came from ELIQ 6404 and was initially copied under the audit key import-eliq, then renamed to the generic local key showroom. Historical screenshots use import-eliq. Keep the red/white stock-led desktop and mobile listing baseline; old ELIQ task ledgers do not govern new clients.

## Representative QA routes

- `/`
- `/inventory`
- `/inventory/11779989521200947`
- `/contact`
- `/sell-your-car`
- `/financing`

Use 390 and 1440 px, plus every offered home. Exercise navigation, filters, detail return, overlay dismissal and the main contact path. Existing source data and frontend feedback do not prove real form delivery or a working provider integration.
