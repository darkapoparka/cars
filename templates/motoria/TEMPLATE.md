# Motoria (Motors source)

Key: `motoria` · version: `2026.09.06-baseline` · family: `motors`.

The folder name is motoria, but source is Motors by Stylemix. Different from Agency OS's historical Motoria/inventory family. One home, nine pricing styles, one captured vehicle detail. Many cards still leave for the vendor site.

## Status

route-completion-needed. Source branding/demo content is retained as a visual baseline. This is a candidate for personalization, not a finished generic config-driven template or a sendable lead demo.

## Provenance

Moved intact from J:/cars/motoria. See audits/2026-09-06/relocations.json.

Existing license/asset notes remain with the source. No new multi-client rights determination was made. Source instructions and old project task ledgers are historical; J:/cars/AGENTS.md governs this copy.

## Run

Existing moved node_modules is retained for the local preview. A new copy uses `npm ci`.

From J:/cars, on a free port:

```powershell
./scripts/start-preview.ps1 -Template motoria -Port 6440
```

Suggested library URL: http://127.0.0.1:6440/. The suggestion is not proof that a listener is running; see the audit runtime record. Original inspected source port: 6440.

`npm run check` and `npm run build`.

## Real homepage choices

- `classified-one`: `/`

Copy the whole project to retain all variants. Select a primary entry after copying; retain alternate-home choice links when requested.

## Personalization boundaries

- `src/lib/snapshots`
- `static`
- `static/local-runtime.js`

These are current code/data ownership locations, not a promise that one config edits the whole app. Scan every retained route, metadata, contact value and identity-bearing asset after changes.

The local name is Motoria, but the implementation reproduces Motors (Stylemix). One captured home and one vehicle detail; nine pricing styles are not nine home variants. Server-rendered snapshots retain legacy widgets; uncaptured destinations often leave to the source site. Vendor bars, external detail links and mismatched page skins need completion before a client offer.

## Representative QA routes

- `/`
- `/inventory/`
- `/listings/bmw-m5/`
- `/pricing/`
- `/contact-us/`
- `/about-us/`
- `/blog/`

Use 390 and 1440 px, plus every offered home. Exercise navigation, filters, detail return, overlay dismissal and the main contact path. Existing source data and frontend feedback do not prove real form delivery or a working provider integration.
