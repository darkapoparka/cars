# Крис Кар — Plovdiv

Status: **implemented-unverified**. Three independent applications copied from the published masters, with one coherent eight-car data set and 32 matching local photographs in each app. No application runtime or browser acceptance is claimed. Owner review is pending.

## Public facts and assets

Source catalogue: https://kris_car.mobile.bg/ ; contacts: https://kris_car.mobile.bg/contacts . Address: Цариградско шосе, до бензиностанция Алпи, Индустриална зона - Изток, Пловдив. Phone: 0885 232 858; second published phone +359884541828. Hours: Пон–Пет 09:00–19:00 · Съб 09:30–19:00 · Нед 10:00–16:00.

The original red-and-white Cyrillic dealer logo was found in the contact page, inspected and preserved. Both surface treatments retain its intentional white panel. Six brand/icon PNGs and 32 source vehicle photographs are local in each application. No image-generation claim or dealership approval is made. See sources.json, stock-source.json, brand/PROVENANCE.md and checks/source-verification.json.

Stock observation: 2026-09-09. Published/updated source dates are distinguished in stock-source.json. Prices are source EUR cash prices with the published VAT qualification. Mileage remains kilometres. Warranty assertions and battery condition are not independently verified. The RAV4 with conflicting 222/122 hp was excluded. Eight sample ads are not a claim of eight currently available cars or a live feed. No fake staff, reviews or finance-approval promises were added.

## Lineage

Source commit: faf76e81c96a4e6dbe18e8ffcaf0a249df47b7ca.
- auto-best 2026.09.08-polish-1; tree 97833980ab127f6de8f675ac1a188e4b7f717976
- modern 2026.09.06-refresh-1; tree 66bfb8196bbce18832ada6b34b02dda97baba25b
- carwow 2026.09.08-repair-1; tree d4a08817e87cf84d08c4db1c08a515937245f2dd

Retained master blobs are materialized as independent files, with exclusions and exact source hashes recorded in each .template/source-manifest.json. Modern retains the full monorepo. No client depends on a master filesystem path. No template, shared index, Windows client source checkout, credential file or private CRM was changed.

## Implemented consumers

Auto Best: brand/company/inventory/navigation/editorial data, source-linked four-photo detail gallery, filter facets, contact/mobile links and metadata. Modern: lead-site configuration, domain mock inventory, one dealer-directory entry, public static data, uncut original logo, preview contact short-circuit and availability metadata. Carwow: main and compatibility inventory, native mega-menu cards, dealer/contact/topics/review states, gallery media section, metadata, canonical /about/kris-car-plovdiv with the previous URL redirect, and retained legacy presentation data.

Primary composition, layout, responsive styles, routes and controls are retained. The old media sections use real vehicle gallery cards rather than another dealer YouTube channel. Internal daynight filenames, CSS classes, source comments and licensed generic illustrations are retained as implementation lineage, not new dealer facts. No shared public-origin mount or design FAB was added. Historical /presentation/home2 and /presentation/home3 remain unoffered legacy references; their data/brand claims were corrected, but English presentation labels and their own unverified controls remain outside the offered one-home review.

## Actual checks

Node v24.18.0, Svelte compiler 5.57.0, TypeScript 5.9.3. In-memory compilation: Auto Best 53 Svelte / 22 TypeScript sources; Modern 869 TypeScript sources; Carwow 321 Svelte / 189 TypeScript sources. Zero syntax/compiler errors. Unused-CSS warnings: 6 Auto Best and 5 Carwow, retained in the evidence. Targeted strict semantic checking of seven identity/inventory/filter roots and their dependencies returned zero diagnostics. This is not a full workspace typecheck.

Executed 46 data assertions: all eight prices, kilometre values and galleries agree across the three actual data modules; detail lookups, unconfirmed availability, Toyota plus price_max filtering, reset, ascending price sort, empty saved records and 32 image hashes passed. The new directory entry also passed the retained Zod 4.3.6 schema. An initial harness used the wrong priceMax query key; it was corrected to the existing price_max contract and rerun.

Not executed: dependency/lockfile installation, Prisma generation, full framework typechecks/builds, app startup, browser interactions, mobile/desktop screenshots, console/overflow or 320/390/1440-pixel acceptance. Those QA flags remain false. An asset contact sheet is not a page screenshot or visual-fidelity test.

## Install and review after coordinator integration

Preserve dirty J:/cars work. Fetch the branch, inspect its scoped changes, and let the coordinator integrate the intended client files before running the launcher. Do not switch or reset the shared checkout automatically.

```powershell
# From J:/cars after safe integration:
./scripts/start-client.ps1 -Client kris-car-plovdiv -Prepare
./scripts/start-client.ps1 -Client kris-car-plovdiv
```

Auto Best: J:/cars/clients/kris-car-plovdiv/auto-best — Node 22.12+ in the Node 22 line; npm ci; npm run validate.
Modern: J:/cars/clients/kris-car-plovdiv/modern — Node >=22.22 <23 and pnpm 11.4.0; pnpm install --frozen-lockfile; pnpm --filter @repo/database build; pnpm --filter web typecheck; pnpm --filter web build. Keep the full workspace; start the web app from apps/web. Existing static demo configuration uses AUTOMARKET_PUBLIC_DATA_MODE=demo and local-only SKIP_ENV_VALIDATION=true with distinct web/API/app origins; the Cars launcher supplies these. Do not run migrations or provision a database.
Carwow: J:/cars/clients/kris-car-plovdiv/carwow — Node 24; npm ci; npm run check; npm run build. Use the Cars launcher rather than inherited fixed-port wrappers.

Suggested entries, not running or verified-free ports: Auto Best http://127.0.0.1:6631/ ; Modern http://127.0.0.1:6632/cars ; Carwow http://127.0.0.1:6633/ . Launch one dealer trio at a time; the coordinator must verify listener ownership.

Review /listing-grid, /listing-detail-v1/1 and /contact for Auto Best; /bg/cars, /bg/listing/toyota-camry-2-5-hybrid-comfort-361582 and /bg/contact for Modern; /inventory, /inventory/toyota-camry-2-5-hybrid-comfort-361582, /about/kris-car-plovdiv, /contact, /team, /reviews and /terms for Carwow. Exercise gallery selection, filters/reset, list-back state, navigation/Escape/focus and selected-car enquiry context without sending external messages. Compare master/client at 390 and 1440 px and headers at 320 px.

Source checkpoint: 3bfcb40707c20e5dcf3cad42aca94a9202e3886a. The follow-up source-verification commit completes the in-memory content corrections and this handoff. No deployment or outreach was performed.
