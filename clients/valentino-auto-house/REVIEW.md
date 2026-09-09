# Valentino — local review

State: implemented-unverified. These are actual independent copies of the published masters, not screenshots or replacement screens. No public deployment exists.

## Auto Best
From `clients/valentino-auto-house/auto-best`, use Node 22 and the retained lockfile:
`npm ci`
`npm run validate`
`npm run dev -- --host 127.0.0.1 --port 5173`
Entry: http://127.0.0.1:5173/ ; inventory: /listing-grid ; example detail: /listing-detail-v1/11785220779595617. Confirm the actual route against data before browser review.

## Modern
Retained FULL workspace at `clients/valentino-auto-house/modern`. Use Node >=22.22 <23 and pnpm 11.4.0:
`pnpm install --frozen-lockfile`
`pnpm --filter @repo/database build`
`pnpm --filter web typecheck`
`pnpm --filter web build`
Use the existing static demo configuration, SKIP_ENV_VALIDATION=true and AUTOMARKET_PUBLIC_DATA_MODE=demo, and local web/API/app URLs only. Do not connect a live database or run migrations. Start with the coordinator launcher or the retained web dev script on a free port such as 3000.
Entry: http://127.0.0.1:3000/cars ; example detail: /listing/audi-a6-3-0-bitdi-quattro-2016.

## Carwow
From `clients/valentino-auto-house/carwow`, use Node 24:
`npm ci`
`npm run check`
`npm run build`
`npm run dev -- --host 127.0.0.1 --port 5174`
Entry: http://127.0.0.1:5174/ ; inventory: /inventory ; example detail: /inventory/audi-a6-3-0-bitdi-quattro-2016.

These are proposed free ports, NOT running or verified servers. The existing scripts/start-client.ps1 coordinator launcher can start one dealer trio after fetching this branch. No competing server or local checkout was created by this session.

## Executed evidence
87 in-memory Node 24 source-adapter assertions passed at 5e8a3851463bf967dc4adf48bcd9d642286ff806. Verified the pack has eight unique records, all matched prices/slugs/mileages, three images per gallery, unknown doors, unverified sellers, no monthly estimate and empty pre-saved inventory. Modern categorizes six passenger cars and two vans; no false all-car count. This is NOT Svelte or Next typechecking or a build.

Public-source literal sweeps read 75 Auto Best, 235 Modern and 243 Carwow files. Exact remaining framework/browser/visual checks: install retained dependencies, actual check/build commands above, all three entries and real detail/gallery/contact, navigation/focus/filter/reset/back state at 390 and 1440 px, and logo/header at 320 px. All QA flags remain false. No generated collage is evidence.

## Provenance and limits
Source pack is duplicated into each app and drives its rendered inventory and identity. The 24 gallery photographs and dealer crest are committed source-media bytes; provenance/URLs are retained. Public visibility was NOT represented as a reuse license. Media authorization and dealer approval are unconfirmed; do not publish until reviewed. No real customer/staff transactions or ratings are claimed; no source stock total is represented as available inventory. Demo mutations report not delivered. No shared-origin design switcher/FAB integration has been performed or tested.
